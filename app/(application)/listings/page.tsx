import CreatorListingCard from "@/app/_components/CreatorListingCard";
import { ListingWithLocation, db } from "@/app/_utils/db";
import { authOptions } from "@/app/_utils/auth";
import { getServerSession } from "next-auth";

/**
 * Pushes the Oh La La listing as the first one
 * Oh La La business ID = 64d2881c71b8a946dc59e453
 */
function pushOhLaLaFirst(
  listings: ListingWithLocation[]
): ListingWithLocation[] {
  const ohLaLaID = "64d2881c71b8a946dc59e453";
  const ohLaLaListing = listings.find(
    (listing) => listing.businessId === ohLaLaID
  );

  if (!ohLaLaListing) {
    return listings;
  }

  // Remove the testListing from the original array
  const filteredListings = listings.filter(
    (listing) => listing.businessId !== ohLaLaID
  );

  // Add the testListing back to the beginning of the array
  filteredListings.unshift(ohLaLaListing);

  return filteredListings;
}

async function getListings() {
  const listings: ListingWithLocation[] = await db.listing.findMany({
    where: {
      active: true,
    },
    include: {
      location: true,
      business: true,
      bookings: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return pushOhLaLaFirst(listings);
}

// To force the page to opt out of full page cache https://nextjs.org/docs/app/building-your-application/caching#opting-out-2
export const dynamic = "force-dynamic";

export default async function Page() {
  const listings = await getListings();

  
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error('No session found.');

  return (
    <>
      {listings.length > 0 ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
        >
          {listings.map((listing: ListingWithLocation) => (
            <li key={listing.id} className="col-span-1 flex flex-col">
              <CreatorListingCard listing={listing} userId={session.user?.id}/>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center sm:text-start">
          There are no listings available at the moment.
        </p>
      )}
    </>
  );
}
