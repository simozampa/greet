import { ApprovalStatus } from "@prisma/client";
import { BusinessWithRelations, db } from "@/app/_utils/db";
import StatusFilter from "@/app/_components/StatusFilter";
import AdminBusinessCard from "@/app/_components/admin/AdminBusinessCard";
import Link from "next/link";
import PrimaryButton from "@/app/_components/PrimaryButton";

async function getBusinesses(status: string | undefined) {
  const filters = [];

  if (status !== null && status !== undefined) {
    filters.push({
      approvalStatus: status as ApprovalStatus,
    });
  }

  const businesses = await db.business.findMany({
    where: {
      AND: filters,
    },
    include: {
      locations: true,
      listings: true,
      bookings: true,
      users: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!businesses) throw new Error("Could not fetch creators");

  return businesses as BusinessWithRelations[];
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const status = searchParams.status ? String(searchParams.status) : undefined;

  const businesses = await getBusinesses(status);

  return (
    <div>
      {/* Title */}
      <div className="sm:flex sm:items-start mb-4 md:mb-8 ">
        <div className="sm:flex sm:items-start sm:justify-between w-full">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Businesses
            </h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              A list of all the businesses that applied on Greet, including the
              applications and bookings received. hi there
            </p>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0 ">
            <Link
              href="/dashboard/businesses/create"
            >
              <PrimaryButton className="px-3 py-2 text-sm">Create new Business</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Business Filter by Status */}
      <StatusFilter
        selected={status}
        path="dashboard/businesses"
        tabs={[
          { name: "All", status: undefined },
          { name: "Approved", status: ApprovalStatus.APPROVED },
          { name: "Pending", status: ApprovalStatus.PENDING },
          { name: "Unsuccessful", status: ApprovalStatus.UNSUCCESSFUL },
        ]}
      />

      {/* User List */}
      <div className="mt-6">
        {businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {businesses.map((business: BusinessWithRelations) => (
              <AdminBusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-10 text-gray-600">
            No data.
          </div>
        )}
      </div>
    </div>
  );
}
