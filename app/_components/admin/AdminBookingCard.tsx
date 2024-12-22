import { BookingWithRelations } from "@/app/_utils/db"
import { BookingStatus } from "@prisma/client"
import Link from "next/link"
import ProfilePicture from "../ProfilePicture"
import PrimaryButton from "../PrimaryButton"
import { formatInstagramMetric } from "@/app/_utils/helpers"
import { bookingStatusBadges } from "@/app/_utils/constants"


interface AdminBookingCardProps {
    booking: BookingWithRelations
}

export default function AdminBookingCard({ booking }: AdminBookingCardProps) {

    return (
        <div className="rounded-lg bg-white shadow-md ring-1 ring-gray-200 p-4">
            <div className="flex w-full items-start justify-between">
                <div className="flex items-start space-x-2">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-gray-100">
                        <ProfilePicture
                            size="6rem"
                            pictureUrl={booking.user.instagramAccount?.profilePictureUrl}
                            name={booking.user?.firstName + ' ' + booking.user.lastName}
                        />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">{booking.user.instagramAccount?.name ? booking.user.instagramAccount?.name : booking.user.firstName + " " + booking.user.lastName}</p>
                        <p className="text-gray-500 text-sm font-medium">@{booking.user.instagramAccount?.username}</p>
                    </div>
                </div>
                <div className="">
                    <Link href={`/dashboard/businesses/profile/${booking.business.id}/bookings/${booking.id}`} >
                        <PrimaryButton className="py-1 px-2 text-sm">
                            Manage
                        </PrimaryButton>
                    </Link>
                </div>
            </div>
            <div className="mt-4 flex items-center space-x-4">
                <div>
                    <p className="font-semibold text-sm text-gray-900">{formatInstagramMetric(booking.user.instagramAccount?.followersCount)}</p>
                    <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-900">{formatInstagramMetric(booking.user.instagramAccount?.totalReach)}</p>
                    <p className="text-sm text-gray-500">Reach <span className="text-xs text-gray-400">(last 30 days)</span></p>
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-900">{formatInstagramMetric(booking.user.instagramAccount?.totalImpressions)}</p>
                    <p className="text-sm text-gray-500">Engagement <span className="text-xs text-gray-400">(last 30 days)</span></p>
                </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
                <span className={`inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-sm font-medium ring-1 ring-inset ${bookingStatusBadges.find(x => x.status === booking.status)?.class}`}>
                    {bookingStatusBadges.find(x => x.status === booking.status)?.name}
                </span>
                {booking.confirmedSlot && booking.status === BookingStatus.APPROVED ?
                    <p className="mt-1 text-xs text-gray-500 text-right">{booking.confirmedSlot}</p>
                    :
                    <p className="mt-1 text-xs text-gray-500 text-right">Applied on {new Date(booking.createdAt).toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "numeric" })}</p>
                }
            </div>
        </div>
    )
}