import ImageSlider from "@/app/_components/ImageSlider";
import ListingCalendar from "./ListingCalendar";
import { Availability } from "@/app/_utils";
import { authOptions } from "@/app/_utils/auth";
import { ListingWithLocation, db } from "@/app/_utils/db";
import { getServerSession } from "next-auth";
import ListingActions from "./ListingActions";

async function getListing(listingId: string) {

    const listing = await db.listing.findUnique({
        where: {
            id: listingId
        },
        include: {
            location: true,
            business: true,
            bookings: true,
        }
    });
    if (!listing) throw new Error('Error when fetching listing');

    return listing as ListingWithLocation;
};

export default async function Page({
    params,
}: {
    params: { [key: string]: string | string[] | undefined },
}) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error('Unexpected Error');

    const listingId = params.listing_id ? String(params.listing_id) : null;
    if (!listingId) return new Error('listing id not found');

    const listing = await getListing(listingId);

    return (
        <div className="mx-auto max-w-2xl lg:max-w-none lg:mx-0">
            <div className="grid grid-cols-1 items-start gap-x-8 gap-y-8 sm:gap-y-16 lg:grid-cols-2">

                {/* Listing Details */}
                <div>
                    <p className="flex text-creator-500 text-sm border-gray-200">{listing.business.cuisineType}</p>
                    <div className="flex items-end space-x-2">
                        <span className="font-semibold text-2xl text-gray-900">{listing.business.name}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{listing.location.street + ", " + listing.location.city + ", " + listing.location.region + " " + listing.location.postalCode}</p>
                    <h1 className="mt-4 font-semibold text-gray-900">
                        {listing.title}
                    </h1>
                    <div className="mt-4 max-w-xl">
                        <span className="font-semibold text-gray-900">Offer:</span>
                        <p className=" text-sm">
                            {listing.offer}
                        </p>
                    </div>
                    <div className="mt-4 max-w-xl">
                        <span className="font-semibold text-gray-900">Deal:</span>
                        <p className="text-sm">{listing.deal}</p>
                    </div>
                </div>

                {/* Image Slider */}
                <div className="lg:order-first lg:pr-4">
                    <ImageSlider images={listing.images} />
                </div>
            </div>

            {/* Separator */}
            <div className="my-8 w-full border-b border-gray-200" />

            {/* Listing Calendar */}
            <div className="mb-8">
                <h2 className="font-bold text-2xl">
                    Availability
                </h2>
                {listing.redeemAnytime ?
                    <>
                        <span className='my-2 inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-creator-600/20 bg-creator-50 text-creator-700'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Redeem Anytime
                        </span>
                        <p className="mb-8 text-sm">You don&#39;t need to schedule an appointment for this listing. If approved, you will be able to redeem this offer anytime.</p>
                        <ListingActions
                            creatorId={session.user.id}
                            businessId={listing.businessId}
                            listingId={listing.id}
                        />
                    </>
                    :
                    <>
                        <p className="mb-8 text-sm">Select up to 5 time slots when you can visit and the restaurant will confirm one.</p>
                        <ListingCalendar
                            creatorId={session.user.id}
                            businessId={listing.businessId}
                            listingId={listing.id}
                            availability={listing.availability as Availability}
                        />
                    </>
                }
            </div>
        </div>
    )
}