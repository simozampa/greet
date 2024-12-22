import { BookingWithRelations } from "../_utils/db"
import Link from "next/link"
import { bookingStatusBadges } from "../_utils/constants"
import { BookingStatus } from "@prisma/client"
import Image from "next/image"

interface CreatorBookingCardProps {
    booking: BookingWithRelations
}

export default function CreatorBookingCard({ booking }: CreatorBookingCardProps) {

    return (
        <Link href={`/bookings/${booking.id}`}>
            <div className="rounded-lg bg-white shadow-md ring-1 ring-gray-200 cursor-pointer p-4 h-full flex flex-col">
                <div className="flex w-full items-start justify-between">
                    <div className="flex items-start space-x-2">
                        <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gray-300">
                            <Image
                                src={booking.business.logo || ''}
                                fill
                                sizes="3rem"
                                alt={`${booking.business.name} Business Profile Picture`}
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{booking.business.name}</p>
                            <p className="text-gray-500 text-sm font-medium">{booking.business.cuisineType}</p>
                        </div>
                    </div>
                </div>
                <p className="flex-1 mt-4 text-sm text-gray-900 font-semibold">{booking.listing.title}</p>
                <p className="text-sm text-gray-500">{booking.listing.location.street + ", " + booking.listing.location.city + ", " + booking.listing.location.region + " " + booking.listing.location.postalCode}</p>
                <div className="mt-4 flex items-center space-x-2">
                    {booking.status === BookingStatus.APPROVED && booking.listing.redeemAnytime && !booking.redeemed ?
                        <span className={`mt-1 inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-sm font-medium ring-1 ring-inset text-indigo-700 ring-indigo-600/20 bg-indigo-50`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            Redeem
                        </span>
                        :
                        <span className={`mt-1 inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-sm font-medium ring-1 ring-inset ${bookingStatusBadges.find(x => x.status === booking.status)?.class}`}>
                            {bookingStatusBadges.find(x => x.status === booking.status)?.name}
                        </span>
                    }
                    {booking.confirmedSlot ?
                        <p className="mt-1 text-xs text-gray-500">{booking.confirmedSlot}</p>
                        :
                        <p className="mt-1 text-xs text-gray-500">Applied on {new Date(booking.createdAt).toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "numeric" })}</p>
                    }
                </div>
            </div>
        </Link>

    )
}