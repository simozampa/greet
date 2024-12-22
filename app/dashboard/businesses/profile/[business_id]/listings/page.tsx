import SecondaryButton from "@/app/_components/SecondaryButton";
import AdminListingCard from "@/app/_components/admin/AdminListingCard";
import { ListingWithLocation, db } from "@/app/_utils/db";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

async function getListings(businessId: string) {
  const listings: ListingWithLocation[] = await db.listing.findMany({
    where: {
      businessId: businessId,
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

  return listings;
}

async function getBusiness(businessId: string) {
  const business = await db.business.findUnique({
    where: {
      id: businessId,
    },
  });

  return business;
}

export default async function Page({
  params,
}: {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const businessId = params.business_id ? String(params.business_id) : null;
  if (!businessId) throw new Error("Business Id is invalid");

  const business = await getBusiness(businessId);
  const listings = await getListings(businessId);

  return (
    <div className="">
      <Link href={`/dashboard/businesses/profile/${business?.id}`}>
        <SecondaryButton className="px-3 py-2 text-sm">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </SecondaryButton>
      </Link>
      <div className="mt-4 border-b border-gray-200 pb-5">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Listings - {business?.name}
            </h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Manage listings and create new ones for {business?.name}.
            </p>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0">
            <Link
              href={`/dashboard/businesses/profile/${business?.id}/listings/create`}
              className="inline-flex items-center rounded-md bg-business-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-business-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-business-500"
            >
              Create new Listing
            </Link>
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="divide-y divide-gray-100 py-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
      >
        {listings.map((listing: ListingWithLocation) => (
          <li key={listing.id}>
            <AdminListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </div>
  );
}
