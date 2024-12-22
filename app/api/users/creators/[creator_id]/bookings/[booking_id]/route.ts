import { authOptions } from "@/app/_utils/auth";
import { db } from "@/app/_utils/db";
import { inngest } from "@/app/_utils/inngest/client";
import { BookingStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface LooseData {
    [key: string]: any
}

export async function PUT(req: Request, { params }: { params: { creator_id: string, booking_id: string }; }) {

    const isAuthorized = await verifyUserIsCreator(params.creator_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const { slot, status, redeemed } = await req.json();

    const bookingBeforeUpdate = await db.booking.findUnique({
        where: { id: params.booking_id }
    });
    if (!bookingBeforeUpdate) return NextResponse.json([], { status: 400 });

    const data: LooseData = {};

    if (slot) data.slot = slot;
    if (status) data.status = status;
    if (redeemed) data.redeemed = redeemed;

    try {
        const booking = await db.booking.update({
            where: {
                id: params.booking_id,
            },
            data: data,
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
        });

        // Get the user in charge of the business
        const businessUser = await db.user.findFirst({
            where: { businessId: booking.businessId }
        });
        if (!businessUser) return NextResponse.json([], { status: 400 });

        if (redeemed) {
            if (process.env.RUN_JOBS === "true") {
                await inngest.send({
                    name: "greet/booking.redeemed",
                    data: {
                        booking: booking,
                        businessUser: businessUser
                    },
                });
            }
        }

        if (status === BookingStatus.UNSUCCESSFUL && bookingBeforeUpdate.status === BookingStatus.APPROVED) {
            if (process.env.RUN_JOBS === "true") {
                await inngest.send({
                    name: "greet/booking.canceled",
                    data: {
                        booking: booking,
                        businessUser: businessUser
                    },
                });
            }
        }

        return NextResponse.json(booking);
    }
    catch (error) {
        console.error(error)
        return NextResponse.json([], { status: 400 });
    }
}

async function verifyUserIsCreator(creator_id: string) {

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('session is null');
    const user = session.user;
    if (!user) throw new Error('user is null');

    // Check user is authorized
    return user.id === creator_id;
}