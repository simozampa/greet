import { authOptions } from "@/app/_utils/auth";
import { BookingWithRelations, db } from "@/app/_utils/db";
import { getServerSession } from "next-auth";
import { BookingStatus } from "@prisma/client";
import BusinessBookingActions from "./BusinessBookingActions";
import { cn, formatInstagramMetric, getBookingStatusBadge } from "@/app/_utils/helpers";
import ProfilePicture from "@/app/_components/ProfilePicture";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { CheckCircleIcon, ExclamationTriangleIcon, GlobeAsiaAustraliaIcon, InformationCircleIcon, LanguageIcon, MapPinIcon, PaperClipIcon, UserGroupIcon, XCircleIcon } from "@heroicons/react/24/outline";
import SecondaryButton from "@/app/_components/SecondaryButton";
import Link from "next/link";
import { Alert } from "@/app/_components/Alert";
import { getFlagEmoji } from "@/app/_utils/constants";

async function getBooking(bookingId: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.businessId) throw new Error('Unexpected Error');

    const booking = await db.booking.findUnique({
        where: {
            id: bookingId
        },
        include: {
            listing: {
                include: {
                    location: true,
                }
            },
            user: {
                include: {
                    instagramAccount: true
                }
            },
            business: true
        },
    });
    if (!booking) throw new Error('Error when fetching booking');

    return booking as BookingWithRelations;
}

export default async function Page({
    params,
}: {
    params: { [key: string]: string | string[] | undefined },
}) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.businessId) throw new Error('Unexpected Error');

    const bookingId = params.booking_id ? String(params.booking_id) : null;
    if (!bookingId) throw new Error('Id is invalid');

    const booking = await getBooking(bookingId) as BookingWithRelations;

    // Check if booking belongs to the business
    if (booking.business.id !== session.user.businessId) throw new Error('Not authorized!')

    return (
        <>
            <div className="max-w-7xl">

                {booking.status === BookingStatus.APPROVED && (
                    <Alert.Success
                        title={<>Booking confirmed!</>}
                        description={booking.confirmedSlot ? (
                            <p>{booking.user.firstName} will be at your location ({booking.listing.location.street + ", " + booking.listing.location.city + ", " + booking.listing?.location.region + " " + booking.listing.location.postalCode}) on {booking.confirmedSlot}</p>
                        ) : (
                            <p>{booking.user.firstName} will be at your location ({booking.listing.location.street + ", " + booking.listing.location.city + ", " + booking.listing?.location.region + " " + booking.listing.location.postalCode})!</p>
                        )}
                    />
                )}

                {booking.status === BookingStatus.PENDING && (
                    <Alert.Warning
                        title={<>New application received!</>}
                        description={<p>{booking.user.firstName} sent you an application! Review the details below and use the menu at the bottom of the page to schedule or decline the booking.</p>}
                    />
                )}

                {booking.status === BookingStatus.COMPLETED && (
                    <Alert.Info
                        title={<>Booking completed!</>}
                        description={<p>The booking with {booking.user.firstName} is done! No further actions are required for this booking. You can share any feedback regarding this booking at info@greet.club!</p>}
                    />
                )}

                {booking.status === BookingStatus.UNSUCCESSFUL && (
                    <Alert.Error
                        title={<>Unsuccessful Application</>}
                        description={<p>Your application with {booking.user.firstName} was unsuccessful. No further actions are required for this booking. If you think this is a mistake, please contact us at info@greet.club.</p>}
                    />
                )}

                {/* Header */}
                <div className="pb-5">
                    <div className="sm:flex sm:items-start sm:justify-between">
                        <div>
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                {booking.status === BookingStatus.APPROVED ? 'Booking' : 'Application'} Information
                            </h3>
                            <div className="mt-2 max-w-4xl text-sm ">
                                <p className="text-gray-500">
                                    {booking.status === BookingStatus.APPROVED && (
                                        <>
                                            Your confirmed booking for <Link className="font-semibold underline hover:text-gray-700" href={`/dashboard/listings/edit/${booking.listing.id}`}>{booking.listing.title}</Link> with <span className="font-semibold">{booking.user.firstName + " " + booking.user.lastName}</span>
                                        </>
                                    )}
                                    {booking.status === BookingStatus.COMPLETED && (
                                        <>
                                            Your completed booking for <Link className="font-semibold underline hover:text-gray-700" href={`/dashboard/listings/edit/${booking.listing.id}`}>{booking.listing.title}</Link> with <span className="font-semibold">{booking.user.firstName + " " + booking.user.lastName}</span>.
                                        </>
                                    )}
                                    {booking.status === BookingStatus.PENDING && (
                                        <>
                                            You received an application for your listing <Link className="font-semibold underline hover:text-gray-700" href={`/dashboard/listings/edit/${booking.listing.id}`}>{booking.listing.title}</Link>
                                        </>
                                    )}
                                    {booking.status === BookingStatus.UNSUCCESSFUL && (
                                        <>
                                            The application for your listing <Link className="font-semibold underline hover:text-gray-700" href={`/dashboard/listings/edit/${booking.listing.id}`}>{booking.listing.title}</Link> with <span className="font-semibold">{booking.user.firstName + " " + booking.user.lastName}</span> was <span className="text-red-500">unsuccessful</span>.
                                        </>
                                    )}
                                </p>
                                <div className="flex items-center space-x-2 mt-2 font-medium text-gray-900">
                                    <MapPinIcon className="h-4 w-4" />
                                    {booking.listing.location.street + ", " + booking.listing.location.city + ", " + booking.listing?.location.region + " " + booking.listing.location.postalCode}
                                </div>

                            </div>
                        </div>
                        <div className="mt-3 sm:ml-4 sm:mt-0">
                            <div className="mt-4 flex flex-wrap justify-end sm:ml-6 sm:mt-0 sm:flex-shrink-0">
                                {getBookingStatusBadge(booking.status)}
                                {booking.confirmedSlot && booking.status === BookingStatus.APPROVED ?
                                    <p className="mt-1 text-xs text-gray-500 text-right w-full">{booking.confirmedSlot}</p>
                                    :
                                    <p className="mt-1 text-xs text-gray-500 text-right w-full">Applied on {new Date(booking.createdAt).toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "numeric" })}</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>


                {/* Instagram Profile */}
                <div className="overflow-hidden bg-white sm:rounded-lg shadow-sm ring-1 ring-gray-900/5">
                    <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-base font-semibold leading-7 text-gray-900">
                                    About {booking.user.firstName}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                                    Review information about {booking.user.firstName} and their social profile below
                                </p>
                            </div>
                            <div className="">
                                <a className="hidden sm:block" target="_blank" href={`https://www.instagram.com/${booking.user.instagramAccount?.username}/`}>
                                    <SecondaryButton className="py-1 px-2 text-sm">
                                        <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                                            <path
                                                fillRule="evenodd"
                                                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        View on Instagram
                                    </SecondaryButton>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">Full name</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
                                    <div className="relative h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 mr-2">
                                        <ProfilePicture
                                            size="4rem"
                                            pictureUrl={booking.user.instagramAccount?.profilePictureUrl}
                                            name={booking.user?.firstName + ' ' + booking.user.lastName}
                                        />
                                    </div>
                                    {booking.user.firstName + " " + booking.user.lastName}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">Area</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {booking.user.city + ", " + booking.user.postalCode}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">Instagram Handle</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <a target="_blank" href={`https://www.instagram.com/${booking.user.instagramAccount?.username}`} className="underline text-sm font-medium leading-6 text-gray-900 hover:text-gray-700">
                                        @{booking.user.instagramAccount?.username}
                                    </a>
                                </dd>
                            </div>

                            {booking.user.instagramAccount?.biography && (
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-900">Bio</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{booking.user.instagramAccount?.biography}</dd>
                                </div>
                            )}

                            <div className="col-span-full sm:py-10 flex">

                                <dl className="col-span-full grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-5 w-full">

                                    <div
                                        className="flex flex-wrap flex-col items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 sm:px-6 xl:px-8 py-4 sm:py-0"
                                    >
                                        <dt className="text-sm font-medium leading-6 text-gray-900 flex-1">Total Followers</dt>
                                        <dd className="flex flex-nowrap sm:flex-wrap items-baseline text-3xl font-semibold text-gray-900 w-full flex-none leading-10 tracking-tight">
                                            {formatInstagramMetric(booking.user.instagramAccount?.followersCount)}
                                            <span className="w-full ml-2 sm:ml-0 text-xs font-medium text-gray-500">Lifetime</span>
                                        </dd>
                                    </div>

                                    <div
                                        className="flex flex-wrap flex-col items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 sm:px-6 xl:px-8 py-4 sm:py-0"
                                    >
                                        <dt className="text-sm font-medium leading-6 text-gray-900 flex-1">Impressions</dt>
                                        <dd className="flex flex-nowrap sm:flex-wrap items-baseline text-3xl font-semibold text-gray-900 w-full flex-none leading-10 tracking-tight">
                                            {formatInstagramMetric(booking.user.instagramAccount?.totalImpressions)}
                                            <span className="w-full ml-2 sm:ml-0 text-xs font-medium text-gray-500">Last 30 days</span>
                                        </dd>
                                    </div>

                                    <div
                                        className="flex flex-wrap flex-col items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 sm:px-6 xl:px-8 py-4 sm:py-0"
                                    >
                                        <dt className="text-sm font-medium leading-6 text-gray-900 flex-1">Reach</dt>
                                        <dd className="flex flex-nowrap sm:flex-wrap items-baseline text-3xl font-semibold text-gray-900 w-full flex-none leading-10 tracking-tight">
                                            {formatInstagramMetric(booking.user.instagramAccount?.totalReach)}
                                            <span className="w-full ml-2 sm:ml-0 text-xs font-medium text-gray-500">Last 30 days</span>
                                        </dd>
                                    </div>

                                    <div
                                        className="flex flex-wrap flex-col items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 sm:px-6 xl:px-8 py-4 sm:py-0"
                                    >
                                        <dt className="text-sm font-medium leading-6 text-gray-900 flex-1">Profile Views</dt>
                                        <dd className="flex flex-nowrap sm:flex-wrap items-baseline text-3xl font-semibold text-gray-900 w-full flex-none leading-10 tracking-tight">
                                            {formatInstagramMetric(booking.user.instagramAccount?.totalProfileViews)}
                                            <span className="w-full ml-2 sm:ml-0 text-xs font-medium text-gray-500">Last 30 days</span>
                                        </dd>
                                    </div>
                                    <div
                                        className="flex flex-wrap flex-col items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 sm:px-6 xl:px-8 py-4 sm:py-0"
                                    >
                                        <dt className="text-sm font-medium leading-6 text-gray-900 flex-1">Followers Gained</dt>
                                        <dd className="flex flex-nowrap sm:flex-wrap items-baseline text-3xl font-semibold text-gray-900 w-full flex-none leading-10 tracking-tight">
                                            {formatInstagramMetric(booking.user.instagramAccount?.totalFollowerCount)}
                                            <span className="w-full ml-2 sm:ml-0 text-xs font-medium text-gray-500">Last 30 days</span>
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium leading-6 text-gray-900">Audience</dt>
                                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <GlobeAsiaAustraliaIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span className="font-medium">Countries</span>
                                                    <span className="text-gray-400 truncate">Top 3 countries</span>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0 text-sm leading-6 text-gray-700">
                                                {booking.user.instagramAccount?.topCountries.map((entry: any, index: number) => (
                                                    <span key={entry.key}>
                                                        {getFlagEmoji(entry.key)}
                                                        {index !== (booking.user.instagramAccount?.topCountries.length as number) - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        </li>
                                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <LanguageIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span className="font-medium">Locale</span>
                                                    <span className="text-gray-400 truncate">Top 3 regional languages</span>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0 text-sm leading-6 text-gray-700">
                                                {booking.user.instagramAccount?.topLocale.map((country: any, index: number) => (
                                                    <span key={country.key}>
                                                        {getFlagEmoji(country.key.split('_')[1])}
                                                        {index !== (booking.user.instagramAccount?.topLocale.length as number) - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        </li>
                                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <UserGroupIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span className="font-medium">Gender/Age</span>
                                                    <span className="text-gray-400 truncate">Top 3 gender/age segments</span>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0 text-sm leading-6 text-gray-700">
                                                {booking.user.instagramAccount?.topGenderAge.map((entry: any, index: number) => (
                                                    <span key={entry.key}>
                                                        {entry.key}
                                                        {index !== (booking.user.instagramAccount?.topGenderAge.length as number) - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        </li>
                                    </ul>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8">
                    <BusinessBookingActions
                        booking={booking}
                        businessId={session.user.businessId}
                        onUpdateRedirectUrl="/dashboard/bookings"
                    />
                </div>
            </div>
        </>
    )
}