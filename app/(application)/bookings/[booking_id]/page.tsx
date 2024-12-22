import { authOptions } from "@/app/_utils/auth";
import { BookingWithRelations, db } from "@/app/_utils/db";
import { getServerSession } from "next-auth";
import CreatorBookingActions from "./CreatorBookingActions";
import { bookingStatusBadges } from "@/app/_utils/constants";
import { BookingStatus } from "@prisma/client";
import { getBookingStatusBadge } from "@/app/_utils/helpers";
import { Alert } from "@/app/_components/Alert";

async function getBooking(bookingId: string) {
    const booking = await db.booking.findUnique({
        where: {
            id: bookingId
        },
        include: {
            listing: {
                include: {
                    location: true,
                }
            },
            user: true,
            business: true,
        },
    });
    if (!booking) throw new Error('Booking not found');

    return booking as BookingWithRelations;
}

export default async function Page({
    params,
}: {
    params: { [key: string]: string | string[] | undefined },
}) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error('Unexpected Error');

    const bookingId = params.booking_id ? String(params.booking_id) : null;
    if (!bookingId) throw new Error('Id is invalid');

    const booking = await getBooking(bookingId);

    // Check if booking belongs to the user
    if (booking.user.id !== session.user.id) throw new Error('Not authorized!');

    return (
        <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
            <div>

                {/* Header */}
                <div className="px-4 sm:px-0">
                    <div className="flex items-center space-x-2">
                        <h2 className="font-semibold text-2xl">
                            Booking
                        </h2>
                        {getBookingStatusBadge(booking.status)}
                    </div>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Details and application.</p>

                    {/* Add more alerts based on the status */}
                    {booking.status === BookingStatus.APPROVED && booking.listing.redeemAnytime && (
                        <div className="mt-2">
                            <Alert.Warning
                                title={<>Redeem booking!</>}
                                description={
                                    <>
                                        {booking.redeemed ?
                                            <p className='text-sm font-medium underline text-red-500'>
                                                You have redeemed this offer. You must use it within the next 24 hours.
                                            </p>
                                            :
                                            <p className="text-sm">
                                                You have not redeemed this offer yet. Once you redeem this offer, you must use it within 24 hours.
                                            </p>
                                        }
                                    </>}
                            />
                        </div>
                    )}

                </div>

                {/* Details */}
                <div className="mt-6">
                    <dl className="grid grid-cols-1 sm:grid-cols-2">

                        {/* Name */}
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Restaurant name</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{booking.business.name}</dd>
                        </div>

                        {/* Location */}
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Location</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{booking.listing.location.street + ", " + booking.listing.location.city + ", " + booking.listing.location.region + " " + booking.listing.location.postalCode}</dd>
                        </div>

                        {/* Title + Offer */}
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Listing</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{booking.listing.title}</dd>
                            <dd className="mt-2 text-sm leading-6 text-gray-700 sm:w-3/4">
                                {booking.listing.offer}
                            </dd>
                        </div>

                        {/* Deal */}
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Deal</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 sm:w-3/4">{booking.listing.deal}</dd>
                        </div>

                        {/* Availiably/Date */}
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">

                            {/* If pending, we display the provided availablity */}
                            {booking.status === BookingStatus.PENDING && (
                                <>
                                    {/* Display the creator's provided availablity during the application */}
                                    {!booking.confirmedSlot && booking.timeSlots && Object.keys(booking.timeSlots).length > 0 && (
                                        <>
                                            <dt className="text-sm font-medium leading-6 text-gray-900">Your availability</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                                {Object.entries(booking.timeSlots).map(([date, timeSlots]) => (
                                                    <div key={date}>
                                                        <span className="text-sm font-medium">{date} - </span>
                                                        {timeSlots.map((time: string, index: number) => (
                                                            <span key={index} className='text-sm font-medium'>
                                                                {time}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ))}
                                            </dd>
                                        </>
                                    )}
                                </>
                            )}


                            {/* If approved, we display the approved date or a reminder to redeem anytime */}
                            {booking.status === BookingStatus.APPROVED &&
                                <>
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Date</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                        {booking.confirmedSlot &&
                                            <>
                                                <p className="text-sm">The business confirmed the following date and time for your booking:</p>
                                                <div className='w-full sm:w-1/2 mt-4 text-center text-sm py-2 px-2 rounded-lg ring-1 bg-creator-50 ring-creator-600/20 text-creator-700'>
                                                    {booking.confirmedSlot}
                                                </div>
                                            </>
                                        }

                                        {booking.listing.redeemAnytime &&
                                            <>
                                                {booking.redeemed ?
                                                    <p className='text-sm font-medium underline text-red-500'>
                                                        You have redeemed this offer. You must use it within the next 24 hours.
                                                    </p>
                                                    :
                                                    <p className="text-sm">
                                                        You have not redeemed this offer yet. Once you redeem this offer, you must use it within 24 hours.
                                                    </p>
                                                }
                                            </>
                                        }
                                    </dd>
                                </>
                            }
                        </div>

                        {/* Status */}
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">

                                {/* If the booking is pending */}
                                {booking.status === BookingStatus.PENDING && (
                                    <>
                                        {!booking.confirmedSlot && booking.timeSlots && Object.keys(booking.timeSlots).length > 0 ? (
                                            <p className="mt-1 text-sm">
                                                {booking.business.name} is currently reviewing your application.
                                            </p>
                                        ) : (
                                            <p className="mb-8 text-sm">
                                                You don&#39;t need to schedule an appointment for this booking. If approved, you will be able to redeem this offer anytime.
                                            </p>
                                        )}
                                    </>
                                )}

                                {booking.status === BookingStatus.APPROVED &&
                                    <>
                                        <p className="mt-1 text-sm">
                                            {booking.business.name} approved your application.
                                        </p>

                                        {/* This check needs to be done in 2 steps!! Otherwise it will break bc redeemed is false for a non redeem anytime booking */}
                                        {booking.listing.redeemAnytime && (
                                            <>
                                                {booking.redeemed ?
                                                    <p className='text-sm'>
                                                        You have redeemed this offer. You must use it within the next 24 hours.
                                                    </p> :
                                                    <p className="text-sm">
                                                        You have not redeemed this offer yet. Once you redeem this offer, you must use it within 24 hours.
                                                    </p>
                                                }
                                            </>
                                        )}
                                    </>
                                }

                                {/* Case booking is UNSUCESSFUL */}
                                {
                                    booking.status === BookingStatus.UNSUCCESSFUL &&
                                    <>
                                        <p className="mt-1 text-sm">
                                            Unfortunately, your application was unsuccesful this time.
                                        </p>
                                    </>
                                }


                            </dd>
                        </div>

                    </dl>
                </div>
            </div >

            {/* We display any actins ONLY if the booking is not already unsuccesful */}
            {booking.status !== BookingStatus.UNSUCCESSFUL &&
                <div className="mt-4">
                    <CreatorBookingActions
                        booking={booking}
                        userId={session.user.id}
                    />
                </div>
            }
        </div>
    )
}