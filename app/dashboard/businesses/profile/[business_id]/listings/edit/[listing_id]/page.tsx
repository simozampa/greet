import ListingForm from "@/app/_components/ListingForm";
import SecondaryButton from "@/app/_components/SecondaryButton";
import { Availability } from "@/app/_utils";
import { authOptions } from "@/app/_utils/auth";
import {
  BusinessWithRelations,
  ListingWithLocation,
  db,
} from "@/app/_utils/db";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import Link from "next/link";

async function getListing(listingId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) throw new Error("Unexpected Error");

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
      <Link href={`/dashboard/businesses/profile/${listing.business?.id}/listings`}>
        <SecondaryButton className="px-3 py-2 text-sm">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </SecondaryButton>
      </Link>
      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
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
            onUpdateRedirectUrl={`/dashboard/businesses/profile/${listing.business?.id}/listings`}
          />
        </div>
      </div>
    </div>
  );
}
