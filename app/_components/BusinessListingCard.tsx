import Link from "next/link"
import { ListingWithLocation, db } from "../_utils/db"
import { BookingStatus } from "@prisma/client"
import SecondaryButton from "./SecondaryButton"
import InputSwitch from "./InputSwitch"
import { verifyUserOwnsBusiness } from "../_utils/serverHelpers"
import { revalidatePath } from "next/cache"

interface BusinessListingCard {
    listing: ListingWithLocation
}

export default function BusinessListingCard({ listing }: BusinessListingCard) {

    /*
    * Server action to change the "enable" status of the listing.
    */
    async function onListingEnableChange(val: boolean) {
        'use server'

        try {
            const isAuthorized = await verifyUserOwnsBusiness(listing.business.id);
            if (!isAuthorized) { return false; }

            await db.listing.update({
                where: {
                    id: listing.id,
                },
                data: {
                    active: val
                }
            });

            revalidatePath('/dashboard/listings')

            return true;
        }
        catch (error) {
            revalidatePath('/dashboard/listings')
            return false;
        }
    }

    return (
        <div className="ring-1 ring-gray-200 shadow-md rounded-md p-4 h-full flex flex-col">

            {/* Listing Title and location */}
            <div className="w-full flex justify-between items-center">
                <p className="text-sm font-semibold leading-6 text-gray-900 truncate">
                    {listing.title}
                </p>
                <Link href={`/dashboard/listings/edit/${listing.id}`}>
                    <SecondaryButton>
                        Edit
                    </SecondaryButton>
                </Link>
            </div>

            <div className="text-xs text-gray-500 flex-1">
                {listing.location.name ?
                    <p>{listing.location.name}</p>
                    :
                    <>
                        <p>{listing.business.name}</p>
                        <p>{listing.location.street}, {listing.location.city}</p>
                    </>
                }
            </div>

            {listing.redeemAnytime &&
                <div className="mt-1">
                    <span className='inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-business-600/20 bg-business-50 text-business-700'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Redeem Anytime
                    </span>
                </div>
            }

            {/* Applications and bookings */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div>
                        <p className="font-semibold text-sm text-gray-900">{listing.bookings.length}</p>
                        <p className="text-sm text-gray-500">Applications</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-gray-900">{listing.bookings.filter(x => x.status === BookingStatus.APPROVED).length}</p>
                        <p className="text-sm text-gray-500">Bookings</p>
                    </div>

                </div>
                {/* Active/Inactive Switch */}
                <div className="flex flex-wrap items-center justify-end">
                    <div className="">
                        <InputSwitch defaultValue={listing.active} onChange={onListingEnableChange} />
                        <div className="text-xs leading-5 text-gray-500 w-full text-center mt-1">Active</div>
                    </div>
                </div>
            </div>

        </div>
    )
}