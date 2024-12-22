'use client'

import ConfirmationModal from "@/app/_components/ConfirmationModal"
import LoadingIcon from "@/app/_components/LoadingIcon"
import PrimaryButton from "@/app/_components/PrimaryButton"
import { BookingWithRelations } from "@/app/_utils/db"
import { BookingStatus } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CreatorBookingActionsProps {
    booking: BookingWithRelations
    userId: string
}

export default function BookingActions({ booking, userId }: CreatorBookingActionsProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [showModalCancel, setShowModalCancel] = useState<boolean>(false);
    const [showModalRedeem, setShowModalRedeem] = useState<boolean>(false);

    const router = useRouter();

    async function redeemBooking() {
        if (loading) return;
        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/creators/${userId}/bookings/${booking.id}`, {
            method: 'PUT',
            body: JSON.stringify({ redeemed: true, slot: null, status: null })
        })

        if (!response.ok) return new Error('Error when redeeming booking');

        router.push('/bookings');
        router.refresh();
    }

    async function cancelBooking() {
        if (loading) return;
        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/creators/${userId}/bookings/${booking.id}`, {
            method: 'PUT',
            body: JSON.stringify({ slot: null, status: BookingStatus.UNSUCCESSFUL, redeemed: null })
        })

        if (!response.ok) return new Error('Error when declining booking');

        router.push('/bookings');
        router.refresh();
    }

    return (
        <>

            {/* Confirmation Cancel Modal */}
            <ConfirmationModal
                show={showModalCancel}
                loading={loading}
                onConfirm={cancelBooking}
                onCancel={() => setShowModalCancel(false)}
                iconClass="bg-yellow-100 text-yellow-600"
                title="Cancel Booking"
                description="Are you sure you want to cancel this booking?"
                buttonText="Cancel"
                cssButton="bg-creator-500 hover:bg-creator-600"
            />

            {/* Confirmation Redeem Modal */}
            <ConfirmationModal
                show={showModalRedeem}
                loading={loading}
                onConfirm={redeemBooking}
                onCancel={() => setShowModalRedeem(false)}
                iconClass="bg-yellow-100 text-yellow-600"
                title="Redeem Offer"
                description="Are you sure you want to reedem this booking? You will have 24 hours to use this offer once you redeem it."
                buttonText="Redeem"
                cssButton="bg-creator-500 hover:bg-creator-600"
            />

            {booking.listing.redeemAnytime && !booking.redeemed && booking.status === BookingStatus.APPROVED &&
                <PrimaryButton
                    onClick={() => setShowModalRedeem(true)}
                    className="mb-2 w-full sm:w-max bg-creator-500 hover:bg-creator-400">
                    Redeem Now
                    {loading && <LoadingIcon iconSize="h-4 w-4" textColor="text-white" />}

                </PrimaryButton>
            }

            <PrimaryButton
                onClick={() => setShowModalCancel(true)}
                className="w-full sm:w-max text-creator-700 border border-creator-600/20 bg-white-500 hover:bg-creator-50">
                Cancel Booking
                {loading && <LoadingIcon iconSize="h-4 w-4" textColor="text-white" />}
            </PrimaryButton>
        </>
    )
}