import PrimaryButton from "@/app/_components/PrimaryButton";
import ProfilePicture from "@/app/_components/ProfilePicture";
import SecondaryButton from "@/app/_components/SecondaryButton";
import BusinessApprovalStatusSelect from "@/app/_components/admin/BusinessApprovalStatusSelect";
import AnalyticsTimeTable from "@/app/_components/analytics/AnalyticsTimeTable";
import { countries } from "@/app/_utils/constants";
import { BusinessWithRelations, db } from "@/app/_utils/db";
import { cn, getApprovalStatusBadge } from "@/app/_utils/helpers";
import {
  ChatBubbleBottomCenterIcon,
  ChevronLeftIcon,
  EnvelopeIcon,
  GlobeAmericasIcon,
  LinkIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { BookingStatus, Prisma } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";

async function getBusiness(businessId: string) {
  const business = await db.business.findUnique({
    where: {
      id: businessId,
    },
    include: {
      locations: true,
      listings: true,
      bookings: {
        include: {
          listing: true,
        },
      },
      users: true,
    },
  });

  if (!business) throw new Error("Business not found");

  const businessType = Prisma.validator<Prisma.BusinessArgs>()({
    include: {
      locations: true,
      listings: true,
      bookings: {
        include: {
          listing: true,
        },
      },
      users: true,
    },
  });

  return business as Prisma.BusinessGetPayload<typeof businessType>;
}

async function getAnalyticsEvents(business: BusinessWithRelations) {
  return await db.analyticsEvent.findMany({
    where: {
      distinctId: {
        in: business.users.map((user) => user.id),
      },
    },
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function Page({
  params,
}: {
  params: { [key: string]: string | string[] | undefined };
}) {
  const businessId = params.business_id ? String(params.business_id) : null;
  if (!businessId) throw new Error("Id is invalid");

  const business = await getBusiness(businessId);

  if (!business) throw new Error("Invalid Business");

  const analyticsEvents = await getAnalyticsEvents(business);

  return (
    <div>
      <Link href={`/dashboard/businesses/`}>
        <SecondaryButton className="px-3 py-2 text-sm">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </SecondaryButton>
      </Link>

      {/* Header */}
      <div className="mt-4 flex w-full items-start justify-between">
        <div className="flex flex-wrap items-start space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-gray-100">
            <ProfilePicture
              size="10rem"
              pictureUrl={business.logo || undefined}
              name={`${business.name} Business Profile Picture`}
            />
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {business.name}
              </p>
              <div className="flex items-center space-x-1">
                <BusinessApprovalStatusSelect
                  status={business.approvalStatus}
                  businessId={business.id}
                />
                <p className="text-xs text-gray-500">
                  Applied on{" "}
                  {new Date(business.createdAt).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Managing Buttons */}
        <div className="flex items-center space-x-3">
          <Link href={`/dashboard/businesses/profile/${business.id}/bookings`}>
            <SecondaryButton className="px-3 py-2 text-sm">
              Bookings
            </SecondaryButton>
          </Link>
          <Link href={`/dashboard/businesses/profile/${business.id}/listings`}>
            <SecondaryButton className="px-3 py-2 text-sm">
              Listings
            </SecondaryButton>
          </Link>
          <Link href={`/dashboard/businesses/profile/${business.id}/edit`}>
            <PrimaryButton className="px-3 py-2 text-sm">Edit</PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 my-8 gap-y-6 lg:gap-6">
        {/* Greet Account */}
        <div className="rounded-lg shadow-sm ring-1 ring-gray-900/5 flex flex-col">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6 ">
              <dt className="text-base font-semibold leading-6 text-gray-900">
                Greet Account
              </dt>
            </div>
            <div className="flex-none self-end px-6 pt-4">
              {getApprovalStatusBadge(business.approvalStatus)}
            </div>
          </dl>
          <dl className="flex flex-1 flex-col">
            {/* Email */}
            <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
              <dt className="flex-none">
                <EnvelopeIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <a
                href={`mailto:${business.email}`}
                className="underline text-sm font-medium leading-6 text-gray-900 hover:text-gray-700"
              >
                {business.email}
              </a>
            </div>

            {/* Website */}
            {business.website && (
              <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                <dt className="flex-none">
                  <LinkIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <a
                  href={business.website}
                  target="_blank"
                  className="underline text-sm font-medium leading-6 text-gray-900 hover:text-gray-700"
                >
                  {business.website}
                </a>
              </div>
            )}

            {/* Phone */}
            {business.phoneNumber && (
              <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                <dt className="flex-none">
                  <PhoneIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  {business.phoneNumber}
                </dd>
              </div>
            )}

            {/* Description */}
            <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <ChatBubbleBottomCenterIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {business.description}
              </dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-gray-900/5 px-6 py-6 flex justify-between">
            <dl className="divide-y divide-gray-100 text-sm leading-6 w-full">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Total Listings</dt>
                <dd className="flex items-start gap-x-2">
                  <div
                    className={cn(
                      business.listings.length > 0
                        ? "text-gray-900"
                        : "text-red-500",
                      "font-semibold"
                    )}
                  >
                    {business.listings.length}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Total Applications Received</dt>
                <dd className="text-gray-900 font-semibold">
                  {business.bookings.length}
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Total Active Bookings</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900 font-semibold">
                    {
                      business.bookings.filter(
                        (x) =>
                          x.status === BookingStatus.APPROVED ||
                          x.status === BookingStatus.PENDING
                      ).length
                    }
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Total Completed Bookings</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900 font-semibold">
                    {
                      business.bookings.filter(
                        (x) => x.status === BookingStatus.COMPLETED
                      ).length
                    }
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Locations */}
        {business.locations.map((location, index) => (
          <div
            key={location.id}
            className="rounded-lg shadow-sm ring-1 ring-gray-900/5 flex flex-col"
          >
            <dl className="flex items-center justify-between space-x-4 px-6 pt-6">
              <dt className="text-base font-semibold leading-6 text-gray-900 truncate">
                Location
              </dt>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 ring-blue-600/20 text-blue-700`}
              >
                {index + 1}
              </span>
            </dl>

            <dl className="flex flex-1 flex-col">
              {/* Address */}
              <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                <dt className="flex-none">
                  <GlobeAmericasIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  {location.street} <br /> {location.city},{" "}
                  {location.region?.toUpperCase()},{" "}
                  {countries.find((x) => x.value === location.country)?.label}{" "}
                  {location.postalCode}
                </dd>
              </div>

              {/* Phone */}
              {location.phoneNumber && (
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <PhoneIcon
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm leading-6 text-gray-500">
                    {location.phoneNumber}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 border-t border-gray-900/5 px-6 py-6 flex justify-between">
              <dl className="divide-y divide-gray-100 text-sm leading-6 w-full">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Total Listings</dt>
                  <dd className="flex items-start gap-x-2">
                    <div
                      className={cn(
                        business.listings.filter(
                          (x) => x.locationId === location.id
                        ).length > 0
                          ? "text-gray-900"
                          : "text-red-500",
                        "font-semibold"
                      )}
                    >
                      {
                        business.listings.filter(
                          (x) => x.locationId === location.id
                        ).length
                      }
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Applications Received</dt>
                  <dd className="text-gray-900 font-semibold">
                    {
                      business.bookings.filter(
                        (x) => x.listing.locationId === location.id
                      ).length
                    }
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Active Bookings</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="text-gray-900 font-semibold">
                      {
                        business.bookings
                          .filter((x) => x.listing.locationId === location.id)
                          .filter(
                            (x) =>
                              x.status === BookingStatus.APPROVED ||
                              x.status === BookingStatus.PENDING
                          ).length
                      }
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Completed Bookings</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="text-gray-900 font-semibold">
                      {
                        business.bookings
                          .filter((x) => x.listing.locationId === location.id)
                          .filter((x) => x.status === BookingStatus.COMPLETED)
                          .length
                      }
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-6" />

      {/* Business Users */}
      <div className="text-sm">
        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-6">
          Business Users
        </h3>

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {business.users.map((user) => (
            <li
              key={user.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg shadow-sm ring-1 ring-gray-900/5"
            >
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {user.firstName + " " + user.lastName}
                    </h3>
                    {getApprovalStatusBadge(user.approvalStatus)}
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">Owner</p>
                </div>
                <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gray-100">
                  <ProfilePicture
                    size="2.5rem"
                    pictureUrl={undefined}
                    name={user.firstName + " " + user.lastName}
                  />
                </div>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <a
                      href={`mailto:${user.email}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    >
                      <EnvelopeIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      Email
                    </a>
                  </div>
                  <div className="-ml-px flex w-0 flex-1">
                    <a
                      href={`tel:${user.phoneNumber}`}
                      className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    >
                      <PhoneIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      Call
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <hr className="my-6" />

      {/* Analytics Events */}
      <div className="text-sm">
        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-6">
          Analytics Events
        </h3>
        <Suspense>
          <AnalyticsTimeTable data={analyticsEvents} />
        </Suspense>
      </div>
    </div>
  );
}
