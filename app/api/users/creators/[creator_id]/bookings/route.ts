import { authOptions } from "@/app/_utils/auth";
import { db } from "@/app/_utils/db";
import { getStrParam } from "@/app/_utils/helpers";
import { inngest } from "@/app/_utils/inngest/client";
import { BookingStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { creator_id: string }; }) {

    const isAuthorized = await verifyUserIsCreator(params.creator_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const {
        businessId,
        listingId,
        timeSlots,
    } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Could not find session');
    const user = session.user;
    if (!user) throw new Error('Could not find user');

    const booking = await db.booking.create({
        data: {
            userId: user.id,
            listingId: listingId,
            businessId: businessId,
            timeSlots: timeSlots,
            status: BookingStatus.PENDING,
            redeemed: false,
        },
        include: {
            listing: {
                include: {
                    location: true,
                }
            },
            business: true,
            user: {
                include: {
                    instagramAccount: true
                }
            }
        }
    })

    const businessUser = await db.user.findFirst({
        where: { businessId: businessId }
    });
    if (!businessUser) throw new Error('Could not find business user');

    // Send your event payload to Inngest
    if (process.env.RUN_JOBS === "true") {

        await inngest.send({
            name: "greet/booking.created",
            data: {
                booking: booking,
                businessUser: businessUser
            },
        });
    }

    return NextResponse.json(booking);
}

export async function GET(req: Request, { params }: { params: { creator_id: string }; }) {

    const isAuthorized = await verifyUserIsCreator(params.creator_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const url = new URL(req.url);
    const status = getStrParam(url, 'status') as BookingStatus;

    const filters = []

    if (status !== null && status !== undefined) {
        filters.push({
            status: status
        });
    }

    const bookings = await db.booking.findMany({
        where: {
            AND: filters
        },
        include: {
            listing: {
                include: {
                    location: true,
                }
            },
            business: true
        }
    });

    return NextResponse.json(bookings);
}


async function verifyUserIsCreator(creator_id: string) {

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('session is null');
    const user = session.user;
    if (!user) throw new Error('user is null');

    // Check user is authorized
    return user.id === creator_id;
}