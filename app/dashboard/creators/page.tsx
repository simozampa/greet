import StatusFilter from "@/app/_components/StatusFilter";
import AdminCreatorCard from "@/app/_components/admin/AdminCreatorCard";
import { UserWithRelations, db } from "@/app/_utils/db";
import { ApprovalStatus } from "@prisma/client";

async function getCreators(status: string | undefined) {

    const filters = []
    filters.push({
        role: {
            slug: 'creator'
        }
    });

    if (status !== null && status !== undefined) {
        filters.push({
            approvalStatus: status as ApprovalStatus
        });
    }

    const users = await db.user.findMany({
        where: {
            AND: filters
        },
        include: {
            instagramAccount: true,
            bookings: true,
        },
        orderBy: {
            createdAt: 'desc' // Order by createdAt timestamp in descending order
        }
    });
    if (!users) throw new Error('Could not fetch creators');

    return users as UserWithRelations[];

}

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined },
}) {

    const status = searchParams.status ? String(searchParams.status) : undefined;

    const creators = await getCreators(status);

    return (
        <div>

            {/* Title and Add User Button */}
            <div className="sm:flex sm:items-start mb-4 md:mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Creators</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.
                    </p>
                </div>
            </div>

            {/* User Filter by Status */}
            <StatusFilter
                selected={status}
                path='dashboard/creators'
                tabs={
                    [
                        { name: 'All', status: undefined },
                        { name: 'Approved', status: ApprovalStatus.APPROVED },
                        { name: 'Pending', status: ApprovalStatus.PENDING },
                        { name: 'Unsuccessful', status: ApprovalStatus.UNSUCCESSFUL },
                    ]
                }
            />

            {/* User List */}
            <div className="mt-6">

                {creators && creators.length > 0 ?
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {creators.map((creator: UserWithRelations) => (
                            <AdminCreatorCard
                                key={creator.id}
                                creator={creator}
                            />
                        ))}
                    </div>
                    :
                    <div className="flex items-center justify-center py-10 text-gray-600">
                        No data.
                    </div>
                }

            </div>
        </div>
    )
}
