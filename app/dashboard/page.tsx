import { getServerSession } from "next-auth";
import { BusinessWithRelations, ListingWithLocation, db } from "../_utils/db";
import { authOptions } from "../_utils/auth";
import { BookOpenIcon, DocumentPlusIcon, EnvelopeIcon, MapPinIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SecondaryButton from "../_components/SecondaryButton";
import { cn } from "../_utils/helpers";
import ProfilePicture from "../_components/ProfilePicture";

const actions = [
    {
        title: 'Create a listing',
        description: 'Create a new listing to attract more creators.',
        href: 'dashboard/listings/create',
        icon: DocumentPlusIcon,
        iconForeground: 'text-teal-700',
        iconBackground: 'bg-teal-50',
    },
    {
        title: 'Manage Bookings',
        description: 'Manage your bookings to approve or reject creators.',
        href: 'dashboard/bookings',
        icon: BookOpenIcon,
        iconForeground: 'text-purple-700',
        iconBackground: 'bg-purple-50',
    },
    {
        title: 'Add a Location',
        description: 'Multiple locations? No problem, add a new location to your business in the profile settings.',
        href: 'dashboard/business-profile',
        icon: MapPinIcon,
        iconForeground: 'text-sky-700',
        iconBackground: 'bg-sky-50',
    },
    {
        title: 'Support',
        description: 'We are here for you! Contact us and we will get back to you ASAP.',
        href: '/contact-us',
        icon: EnvelopeIcon,
        iconForeground: 'text-yellow-700',
        iconBackground: 'bg-yellow-50',
    },
]

async function getBusiness(businessId: string) {

    const business = await db.business.findFirst({
        where: {
            id: businessId,
        },
        include: {
            locations: true,
            listings: true,
            bookings: true,
            users: true
        }
    }) as BusinessWithRelations;
    if (!business) throw new Error('Unexpected Error');

    const listings = await db.listing.findMany({
        where: {
            businessId: businessId
        },
        include: {
            location: true
        }
    }) as ListingWithLocation[];
    if (!listings) throw new Error('Unexpected Error');

    return { business: business, listings: listings };
}

// To force the page to opt out of full page cache https://nextjs.org/docs/app/building-your-application/caching#opting-out-2
export const dynamic = 'force-dynamic'

export default async function Page() {

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.businessId) throw new Error('Unexpected Error');

    const { business, listings } = await getBusiness(session.user.businessId);
    const user = session.user;

    return (
        <>
            <div className="pointer-events-none pb-5">
                <div className="pointer-events-auto px-6 py-2.5 rounded-md ring-1 ring-inset bg-business-50 text-business-500 ring-business-500 sm:py-3 sm:px-3 w-full xl:w-3/4 mx-auto">
                    <div className="text-sm leading-6 flex justify-center">
                        <a target="_blank" className="lg:flex lg:items-center lg:justify-center mx-auto" href="https://greetclubapp.notion.site/How-to-create-the-best-listing-1017e16bcf1a4a38872d92d9a650785a?pvs=4">
                            <div className="w-full text-center lg:text-left lg:w-auto font-semibold whitespace-nowrap">👉 How to create a great listing 👈</div>
                            <div className="text-center mx-2 hidden lg:block">
                                -
                            </div>
                            <div className="w-full text-center lg:text-left">
                                Click and learn how to attract more creators&nbsp;<span aria-hidden="true">&rarr;</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="profile-overview-title">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <h2 className="sr-only" id="profile-overview-title">
                            Profile Overview
                        </h2>
                        <div className="bg-white p-6">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <div className="sm:flex sm:space-x-5">
                                    <div className="flex-shrink-0">
                                        <div className="relative mx-auto h-20 w-20 rounded-full">
                                            <ProfilePicture
                                                name={user.name ? user.name : ""}
                                                pictureUrl={business.logo ? business.logo : undefined}
                                                size="5rem"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                                        <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                                        <p className="text-xl font-bold text-gray-900 sm:text-2xl">{user.name}</p>
                                        <p className="text-sm font-medium text-gray-600">{user.role?.name}</p>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-center sm:mt-0">
                                    <Link href="/dashboard/profile">
                                        <SecondaryButton>
                                            Edit profile
                                        </SecondaryButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                            <div className="px-6 py-5 text-center text-sm font-medium">
                                <span className="text-gray-900">{listings.length}</span>{' '}
                                <span className="text-gray-600">Listing{listings.length > 1 && 's'}</span>
                            </div>
                            <div className="px-6 py-5 text-center text-sm font-medium">
                                <span className="text-gray-900">{business.locations.length}</span>{' '}
                                <span className="text-gray-600">Location{business.locations.length > 1 && 's'}</span>
                            </div>
                            <div className="px-6 py-5 text-center text-sm font-medium">
                                <span className="text-gray-900">{business.bookings.length}</span>{' '}
                                <span className="text-gray-600">Booking{business.bookings.length > 1 && 's'}</span>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Errors */}

                <div className="grid grid-cols-1 gap-y-2">

                    {/* Missing logo */}
                    {!business.logo ? (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">Your profile is incomplete! <Link href="/dashboard/business-profile" className="underline text-red-800">Click here to complete your Business Profile and add a logo.</Link></p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}

                    {listings.length === 0 ? (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">Create a listing to start receiving offers. <Link href="/dashboard/listings" className="underline text-red-800">Click here to create your first listing.</Link></p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

                {/* Quick Links */}
                <section aria-labelledby="quick-links-title">
                    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                        {actions.map((action, actionIdx) => (
                            <div
                                key={action.title}
                                className={cn(
                                    actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
                                    actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                                    actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
                                    actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
                                    'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-business-500'
                                )}
                            >
                                <div>
                                    <span
                                        className={cn(
                                            action.iconBackground,
                                            action.iconForeground,
                                            'inline-flex rounded-lg p-3 ring-4 ring-white'
                                        )}
                                    >
                                        <action.icon className="h-6 w-6" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="mt-8">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                                        <a href={action.href} className="focus:outline-none">
                                            {/* Extend touch target to entire panel */}
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            {action.title}
                                        </a>
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {action.description}
                                    </p>
                                </div>
                                <span
                                    className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                                    aria-hidden="true"
                                >
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                                    </svg>
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>

    )

}