import { db } from "@/app/_utils/db";
import { inngest } from "@/app/_utils/inngest/client";
import { verifyUserOwnsBusiness } from "@/app/_utils/serverHelpers";
import { BookingStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { business_id: string, booking_id: string }; }) {

    const isAuthorized = await verifyUserOwnsBusiness(params.business_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    try {
        const booking = await db.booking.findUnique({
            where: {
                id: params.booking_id,
            },
            include: {
                listing: {
                    include: {
                        location: true
                    }
                },
                user: true,
            }
        });
        return NextResponse.json(booking);
    }
    catch (error) {
        console.error(error)
        return NextResponse.json([], { status: 400 });
    }
}

export async function PUT(req: Request, { params }: { params: { business_id: string, booking_id: string }; }) {

    const isAuthorized = await verifyUserOwnsBusiness(params.business_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const { slot, status } = await req.json();

    const bookingBeforeUpdate = await db.booking.findUnique({
        where: { id: params.booking_id }
    });
    if (!bookingBeforeUpdate) return NextResponse.json([], { status: 400 });

    try {
        const booking = await db.booking.update({
            where: {
                id: params.booking_id,
            },
            data: {
                status: status,
                confirmedSlot: slot
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
        });

        // Get the user in charge of the business
        const businessUser = await db.user.findFirst({
            where: { businessId: params.business_id }
        });
        if (!businessUser) return NextResponse.json([], { status: 400 });


        // If approving the booking then start a booking created running function in inngest
        if (status === BookingStatus.APPROVED) {

            if (process.env.RUN_JOBS === "true") {
                await inngest.send({
                    name: "greet/booking.approved",
                    data: {
                        booking: booking,
                        businessUser: businessUser
                    },
                });
            }

            // If cancelling then start a booking canceled running function
        } else if (status === BookingStatus.UNSUCCESSFUL && bookingBeforeUpdate.status === BookingStatus.APPROVED) {

            if (process.env.RUN_JOBS === "true") {
                await inngest.send({
                    name: "greet/booking.canceled",
                    data: {
                        booking: booking,
                        businessUser: businessUser
                    },
                });
            }

            // If declining then start a booking declined running function
        } else if (status === BookingStatus.UNSUCCESSFUL && bookingBeforeUpdate.status === BookingStatus.PENDING) {

            if (process.env.RUN_JOBS === "true") {
                await inngest.send({
                    name: "greet/booking.declined",
                    data: {
                        booking: booking,
                        businessUser: businessUser
                    },
                })
            }
        }

        return NextResponse.json(booking);
    }
    catch (error) {
        console.error(error)
        return NextResponse.json([], { status: 400 });
    }
}