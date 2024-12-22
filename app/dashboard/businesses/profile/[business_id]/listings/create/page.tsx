import ListingForm from "@/app/_components/ListingForm";
import SecondaryButton from "@/app/_components/SecondaryButton";
import { BusinessWithRelations, db } from "@/app/_utils/db";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

async function getBusiness(businessId: string) {
  const business = await db.business.findFirst({
    where: {
      id: businessId,
    },
    include: {
      locations: true,
      bookings: true,
    },
  });
  if (!business) throw new Error("Could not fetch business");

  return business as BusinessWithRelations;
}

export default async function Page({
  params,
}: {
  params: { [key: string]: string | string[] | undefined };
}) {
  const businessId = params.business_id ? String(params.business_id) : null;
  if (!businessId) throw new Error("Id is invalid");
  const business = await getBusiness(businessId);

  return (
    <div>
      <Link href={`/dashboard/businesses/profile/${business?.id}/listings`}>
        <SecondaryButton className="px-3 py-2 text-sm">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </SecondaryButton>
      </Link>
      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create new Listing
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Setup a new listing to get bookings from influencers.
          </p>
        </div>

        <div className="max-w-2xl md:col-span-2">
          <ListingForm
            submitButtonText="Create"
            defaultValues={{
              active: true,
              title: "",
              offer: "",
              deal: `Minimum 3 stories OR 1 Reel\nTag @${business.instagram} and @greet.club (you can hide this tag)`,
              images: [],
              redeemAnytime: false,
              availability: {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
              },
            }}
            business={business}
            onUpdateRedirectUrl={`/dashboard/businesses/profile/${business?.id}/listings`}
          />
        </div>
      </div>
    </div>
  );
}
