import Link from "next/link";
import { ListingWithLocation, db } from "@/app/_utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/auth";
import BusinessListingCard from "@/app/_components/BusinessListingCard";

async function getListings() {

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.businessId) throw new Error('Unexpected Error');

    const listings: ListingWithLocation[] = await db.listing.findMany({
        where: {
            businessId: session.user.businessId
        },
        include: {
            location: true,
            business: true,
            bookings: {
                include: {
                    user: true
                }
            },
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return listings;
};

// To force the page to opt out of full page cache https://nextjs.org/docs/app/building-your-application/caching#opting-out-2
export const dynamic = 'force-dynamic'

export default async function Page() {

    const listings = await getListings();

    return (
        <div>
            <div className="border-b border-gray-200 pb-5">
                <div className="sm:flex sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Listings</h3>
                        <p className="mt-2 max-w-4xl text-sm text-gray-500">
                            Manage your listings and create new ones.
                        </p>
                    </div>
                    <div className="mt-3 sm:ml-4 sm:mt-0">
                        <Link
                            href="/dashboard/listings/create"
                            className="inline-flex items-center rounded-md bg-business-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-business-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-business-500"
                        >
                            Create new Listing
                        </Link>
                    </div>
                </div>
            </div>
            <ul role="list" className="divide-y divide-gray-100 py-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {listings.map((listing: ListingWithLocation) => (
                    <li key={listing.id}>
                        <BusinessListingCard listing={listing} />
                    </li>
                ))}
            </ul>

        </div >
    )
}