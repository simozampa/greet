'use client'

import { useState } from "react"
import PrimaryButton from "../../../_components/PrimaryButton"
import { cn } from "../../../_utils/helpers"
import InputError from "../../../_components/InputError"
import { useRouter } from "next/navigation"
import { BookingWithRelations } from "../../../_utils/db"
import { BookingStatus } from "@prisma/client"
import LoadingIcon from "@/app/_components/LoadingIcon"
import ConfirmationModal from "@/app/_components/ConfirmationModal"

interface BusinessBookingActionsProps {
    booking: BookingWithRelations
    businessId: string
    onUpdateRedirectUrl: string
}

export default function BookingActions({ booking, businessId, onUpdateRedirectUrl }: BusinessBookingActionsProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [displayError, setDisplayError] = useState<string>('');
    const [showModalDecline, setShowModalDecline] = useState<boolean>(false);
    const [showModalCancel, setShowModalCancel] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()

    async function handleSubmit() {
        if (loading) return;
        setLoading(true);

        // If booking is set 
        if (!selected && !booking.listing.redeemAnytime) {
            setDisplayError('Please select a date and time for the appointment');
            return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/businesses/${businessId}/bookings/${booking.id}`, {
            method: 'PUT',
            body: JSON.stringify({ slot: selected, status: BookingStatus.APPROVED })
        })

        if (!response.ok) return new Error('Error when confirming booking');

        router.push(onUpdateRedirectUrl);
        router.refresh();
    }

    async function handleDecline() {
        if (loading) return;
        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/businesses/${businessId}/bookings/${booking.id}`, {
            method: 'PUT',
            body: JSON.stringify({ slot: null, status: BookingStatus.UNSUCCESSFUL })
        })

        if (!response.ok) return new Error('Error when declining booking');

        router.push(onUpdateRedirectUrl);
        router.refresh();
    }

    return (
        <>
            {/* Confirmation Decline Modal */}
            <ConfirmationModal
                show={showModalDecline}
                loading={loading}
                onConfirm={handleDecline}
                onCancel={() => setShowModalDecline(false)}
                iconClass="bg-yellow-100 text-yellow-600"
                title="Decline Application"
                description="Are you sure you want to decline di application?"
                buttonText="Decline"
                cssButton="bg-business-500 hover:bg-business-600"
            />

            {/* Confirmation Decline Modal */}
            <ConfirmationModal
                show={showModalCancel}
                loading={loading}
                onConfirm={handleDecline}
                onCancel={() => setShowModalCancel(false)}
                iconClass="bg-yellow-100 text-yellow-600"
                title="Cancel Booking"
                description="Are you sure you want to cancel this booking?"
                buttonText="Cancel"
                cssButton="bg-business-500 hover:bg-business-600"
            />

            {/* Case booking is APPROVED */}
            {booking.status === BookingStatus.APPROVED &&
                <>
                    {booking.confirmedSlot ?
                        <>
                            <h2 className="font-semibold text-gray-900">
                                Confirmed Date
                            </h2>
                            <p className="text-sm text-gray-900">You confirmed the following date and time for your booking</p>
                            <div className='mt-2 w-full sm:w-1/2 text-center text-sm py-2 px-2 rounded-lg ring-1 bg-business-50 ring-business-600/20 text-business-700'>
                                {booking.confirmedSlot}
                            </div>
                        </>
                        :
                        <>
                            <h2 className="font-semibold text-gray-900">
                                Booking Confirmation
                            </h2>
                            <p className="text-sm text-gray-900">
                                The creator can redeem this booking anytime and they will have 24 hours to use your offer.
                                You will be notified once the creator has redeem the offer.
                            </p>
                        </>
                    }

                    <div className="my-8 sm:mt-8 w-full border-b border-gray-200" />

                    <div className="flex items-center space-x-2">
                        <PrimaryButton
                            onClick={() => setShowModalCancel(true)}
                            className="w-full sm:w-max bg-white text-business-700 hover:bg-business-50 ring-1 ring-business-600/20">
                            Cancel Booking
                            {loading && <LoadingIcon iconSize="w-4 h-4" textColor="text-white" />}
                        </PrimaryButton>
                    </div>
                </>
            }

            {/* Case booking is PENDING */}
            {booking.status === BookingStatus.PENDING &&
                <>
                    <h1 className="font-semibold text-gray-900">
                        Availability
                    </h1>
                    {!booking.listing.redeemAnytime && booking.timeSlots && Object.keys(booking.timeSlots).length > 0 ?
                        <>
                            <p className="text-sm text-gray-900">These were the time slots selected by the creator. Pick one to schedule</p>
                            <div className={cn(Object.keys(booking.timeSlots).length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
                                'mt-4 grid grid-cols-1 gap-4')}>
                                {Object.entries(booking.timeSlots).map(([date, timeSlots]) => (
                                    <div key={date}>
                                        <span className="text-sm font-medium">{date}:</span>
                                        <div className=''>
                                            {timeSlots.map((time: string, index: number) => (
                                                <div key={index}>
                                                    <button
                                                        onClick={() => {
                                                            setSelected(date + ' - ' + time);
                                                            setDisplayError('');
                                                        }}
                                                        className={
                                                            cn('w-full mr-2 mt-2 text-center text-sm py-2 rounded-lg ring-1 bg-white hover:bg-business-50 ring-business-600/20 text-business-700',
                                                                selected?.split(' - ')[0] === date && selected?.split(' - ')[1] === time && 'bg-business-100'
                                                            )}>
                                                        {time}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <InputError errorMessage={displayError} />
                        </>
                        :
                        <p className="text-sm text-gray-900">
                            You set this listing to be redeemed anytime.
                        </p>
                    }

                    <div className="my-8 sm:mt-8 w-full border-b border-gray-200" />

                    <div className="flex items-center justify-end space-x-2">
                        {/* Decline Button */}
                        <PrimaryButton
                            onClick={() => setShowModalDecline(true)}
                            className="w-full sm:w-max border bg-white text-business-700 border-business-600/20 hover:bg-business-500/10"
                        >
                            Decline
                            {loading && <LoadingIcon iconSize="w-4 h-4" textColor="text-white" />}
                        </PrimaryButton>
                        {/* Submit Button */}
                        <PrimaryButton
                            onClick={handleSubmit}
                            className="w-full sm:w-max bg-business-500 hover:bg-business-400"
                        >
                            {booking.listing.redeemAnytime ? 'Approve' : 'Schedule'}
                            {loading && <LoadingIcon iconSize="w-4 h-4" textColor="text-white" />}
                        </PrimaryButton>
                    </div>
                </>
            }
        </>
    )
}