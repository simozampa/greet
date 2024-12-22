'use client'

import LoadingIcon from "@/app/_components/LoadingIcon";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ListingActions {
    creatorId: string
    listingId: string
    businessId: string
}

export default function ListingActions({ creatorId, listingId, businessId }: ListingActions) {
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    async function submitApplication() {
        if(loading) return;
        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/creators/${creatorId}/bookings`, {
            method: 'POST',
            body: JSON.stringify({
                timeSlots: null,
                listingId: listingId,
                businessId: businessId,
            })
        });

        if (!response.ok) throw new Error('could not submit')

        const booking = await response.json();

        router.push('/bookings');
        router.refresh();
    }

    return (
        <>
            <PrimaryButton
                onClick={submitApplication}
                className='w-full sm:w-min mt-4 bg-creator-500 hover:bg-creator-400' >
                Submit
                {loading &&
                    <LoadingIcon
                        iconSize="h-4 w-4"
                        textColor="text-white"
                    />
                }

            </PrimaryButton>
        </>
    )
}