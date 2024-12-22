import BusinessBookingCard from '@/app/_components/BusinessBookingCard'
import StatusFilter from '@/app/_components/StatusFilter'
import { authOptions } from '@/app/_utils/auth';
import { BookingWithRelations, db } from '@/app/_utils/db';
import { BookingStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';

async function getBookings(selectedStatus: string | undefined) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.businessId) throw new Error('Unexpected Error');

    const filters: any = [
        { businessId: session.user.businessId },
    ]

    if (selectedStatus !== undefined) filters.push({ status: selectedStatus });

    const bookings: BookingWithRelations[] = await db.booking.findMany({
        where: {
            AND: filters
        },
        include: {
            listing: {
                include: {
                    location: true
                }
            },
            user: {
                include: {
                    instagramAccount: true
                }
            },
            business: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return bookings;
}

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined },
}) {

    const selectedStatus = searchParams.status ? String(searchParams.status) : undefined;

    const bookings = await getBookings(selectedStatus);

    return (
        <>
            <div className="pb-5">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Bookings</h3>
                </div>
                <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    Manage your incoming bookings. Click on &quot;Pending&quot; bookings to review them.
                </p>
            </div>

            <StatusFilter
                selected={selectedStatus}
                path='dashboard/bookings'
                tabs={[
                    { name: 'All', status: undefined },
                    { name: 'Approved', status: BookingStatus.APPROVED },
                    { name: 'Pending', status: BookingStatus.PENDING },
                    { name: 'Unsuccessful', status: BookingStatus.UNSUCCESSFUL },
                    { name: 'Completed', status: BookingStatus.COMPLETED },
                ]}
            />

            {bookings.length > 0 ?
                <ul role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="col-span-1">
                            <BusinessBookingCard booking={booking} />
                        </li>
                    ))}
                </ul>
                :
                <p className='text-center sm:text-start'>
                    No {selectedStatus?.toLowerCase()} bookings.
                </p>
            }
        </>
    )
}
