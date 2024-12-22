import ListingForm from "@/app/_components/ListingForm";
import { Availability } from "@/app/_utils";
import { authOptions } from "@/app/_utils/auth";
import {
  BusinessWithRelations,
  ListingWithLocation,
  db,
} from "@/app/_utils/db";
import { getServerSession } from "next-auth";

async function getListing(listingId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.businessId) throw new Error("Unexpected Error");

  const listing = await db.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      location: true,
      business: true,
      bookings: true,
    },
  });
  if (!listing) throw new Error("Error when fetching listing");
  return listing as ListingWithLocation;
}

export default async function Page({
  params,
}: {
  params: { listing_id: string };
}) {
  const listingId = params.listing_id ? String(params.listing_id) : null;
  if (!listingId) throw new Error("Id is invalid");
  const listing = await getListing(listingId);

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Edit Listing
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Edit a listing. Press Save at the bottom when you are done.
          </p>
        </div>

        <div className="max-w-2xl md:col-span-2">
          <ListingForm
            submitButtonText="Save"
            listingId={listing.id}
            defaultValues={{
              active: listing.active,
              title: listing.title,
              offer: listing.offer,
              deal: listing.deal,
              images: listing.images,
              redeemAnytime: listing.redeemAnytime,
              availability: listing.availability as Availability,
            }}
            business={listing.business as BusinessWithRelations}
            onUpdateRedirectUrl="/dashboard/listings"
          />
        </div>
      </div>
    </div>
  );
}
