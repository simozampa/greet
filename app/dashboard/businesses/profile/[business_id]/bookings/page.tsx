import BusinessBookingCard from "@/app/_components/BusinessBookingCard";
import SecondaryButton from "@/app/_components/SecondaryButton";
import StatusFilter from "@/app/_components/StatusFilter";
import AdminBookingCard from "@/app/_components/admin/AdminBookingCard";
import { BookingWithRelations, db } from "@/app/_utils/db";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { BookingStatus } from "@prisma/client";
import Link from "next/link";

async function getBusiness(businessId: string) {
  const business = await db.business.findUnique({
    where: {
      id: businessId,
    },
  });

  return business;
}

async function getBookings(
  businessId: string,
  selectedStatus: string | undefined
) {
  const filters: any = [{ businessId: businessId }];

  if (selectedStatus !== undefined) filters.push({ status: selectedStatus });

  const bookings: BookingWithRelations[] = await db.booking.findMany({
    where: {
      AND: filters,
    },
    include: {
      listing: {
        include: {
          location: true,
        },
      },
      user: {
        include: {
          instagramAccount: true,
        },
      },
      business: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const businessId = params.business_id ? String(params.business_id) : null;
  if (!businessId) throw new Error("Error");

  const business = await getBusiness(businessId);

  if (!business) throw new Error("Error");

  const selectedStatus = searchParams.status
    ? String(searchParams.status)
    : undefined;

  const bookings = await getBookings(business.id, selectedStatus);

  return (
    <>
      <Link href={`/dashboard/businesses/profile/${businessId}`}>
        <SecondaryButton className="px-3 py-2 text-sm">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back
        </SecondaryButton>
      </Link>
      <div className="mt-4 pb-5">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Bookings - {business.name}
          </h3>
        </div>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage incoming bookings for {business.name}.
        </p>
      </div>

      <StatusFilter
        selected={selectedStatus}
        path={`dashboard/businesses/profile/${businessId}/bookings`}
        tabs={[
          { name: "All", status: undefined },
          { name: "Approved", status: BookingStatus.APPROVED },
          { name: "Pending", status: BookingStatus.PENDING },
          { name: "Unsuccessful", status: BookingStatus.UNSUCCESSFUL },
          { name: "Completed", status: BookingStatus.COMPLETED },
        ]}
      />

      {bookings.length > 0 ? (
        <ul role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {bookings.map((booking) => (
            <li key={booking.id} className="col-span-1">
              <AdminBookingCard booking={booking} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center sm:text-start">
          No {selectedStatus?.toLowerCase()} bookings.
        </p>
      )}
    </>
  );
}
