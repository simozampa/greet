import CreatorBookingCard from '@/app/_components/CreatorBookingCard'
import StatusFilter from '@/app/_components/StatusFilter'
import { authOptions } from '@/app/_utils/auth';
import { BookingWithRelations, db } from '@/app/_utils/db';
import { BookingStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import CreatorBookingsSkeleton from '@/app/_components/skeleton/CreatorBookingsSkeleton';
import { Suspense } from 'react';
import Loading from './loading';

async function getBookings(selectedStatus: string | undefined) {

  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error('Unexpected Error');

  const filters: any = [
    { userId: session.user.id }
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
    <Suspense fallback={<Loading />}>
      <StatusFilter
        selected={selectedStatus}
        path='/bookings'
        tabs={[
          { name: 'All', status: undefined },
          { name: 'Approved', status: BookingStatus.APPROVED },
          { name: 'Pending', status: BookingStatus.PENDING },
          { name: 'Unsuccessful', status: BookingStatus.UNSUCCESSFUL },
          { name: 'Completed', status: BookingStatus.COMPLETED },
        ]}
      />

      {bookings.length > 0 ?
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {bookings.map((booking: BookingWithRelations) => (
            <li key={booking.id} className="col-span-1">
              <CreatorBookingCard booking={booking} />
            </li>
          ))}
        </ul>
        :
        <p className='text-center sm:text-start'>
          No {selectedStatus?.toLowerCase()} bookings.
        </p>
      }
    </Suspense>
  )
}
