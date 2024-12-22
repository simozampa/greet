import InputSwitch from "@/app/_components/InputSwitch";
import ProfilePicture from "@/app/_components/ProfilePicture";
import SecondaryButton from "@/app/_components/SecondaryButton";
import CreatorApprovalStatusSelect from "@/app/_components/admin/CreatorApprovalStatusSelect";
import AnalyticsTimeTable from "@/app/_components/analytics/AnalyticsTimeTable";
import { countries } from "@/app/_utils/constants";
import { UserWithRelations, db } from "@/app/_utils/db";
import { formatInstagramMetric, getApprovalStatusBadge, getInstagramVerifiedBadge } from "@/app/_utils/helpers";
import { verifyUserIsAdmin } from "@/app/_utils/serverHelpers";
import { ChatBubbleBottomCenterIcon, EnvelopeIcon, GlobeAmericasIcon, PhoneIcon, RocketLaunchIcon, UserCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { BookingStatus } from "@prisma/client";
import Link from "next/link";

async function getCreator(creatorId: string) {
    const creator = await db.user.findUnique({
        where: {
            id: creatorId
        },
        include: {
            instagramAccount: true,
            bookings: true,
        },
    });
    if (!creator) throw new Error('Creator not found');

    return creator as UserWithRelations;
}

async function getInstagramVerification(creatorId: string) {
    return await db.instagramVerification.findFirst({
        where: {
            userId: creatorId,
        }
    })
}

async function getAnalyticsEvents(creatorId: string) {
    return await db.analyticsEvent.findMany({
        where: {
            distinctId: creatorId,
        },
        take: 100,
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export default async function Page({
    params,
}: {
    params: { [key: string]: string | string[] | undefined },
}) {

    const creatorId = params.creator_id ? String(params.creator_id) : null;
    if (!creatorId) throw new Error('Id is invalid');

    const creator = await getCreator(creatorId);

    if (!creator) throw new Error('Invalid User');

    const instagramVerification = await getInstagramVerification(creator.id);
    const analyticsEvents = await getAnalyticsEvents(creator.id);

    /*
    * Server action to change the "enable" status of the Instagram Verification form.
    */
    async function onInstagramVerificationActiveChange(val: boolean) {
        'use server'

        try {
            const isAuthorized = await verifyUserIsAdmin();
            if (!isAuthorized) { return false; }

            await db.instagramVerification.update({
                where: {
                    id: instagramVerification?.id,
                },
                data: {
                    active: val
                }
            });

            return true;
        }
        catch (error) {
            return false;
        }
    }

    return (
        <div>

            <div className="flex flex-auto items-start">
                <div className="flex flex-wrap items-start space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-gray-100">
                        <ProfilePicture
                            size="10rem"
                            pictureUrl={creator.instagramAccount?.profilePictureUrl}
                            name={creator.firstName + ' ' + creator.lastName}
                        />
                    </div>
                    <div className="">
                        <p className="text-xl font-semibold text-gray-900">{creator.firstName + " " + creator.lastName}</p>
                        <div className="flex items-center space-x-1">
                            <CreatorApprovalStatusSelect
                                status={creator.approvalStatus}
                                creatorId={creator.id}
                            />
                            <p className="text-xs text-gray-500">Applied on {new Date(creator.createdAt).toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "numeric" })}</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 my-8 gap-y-6 lg:gap-6">

                {/* Greet Account */}
                <div className="rounded-lg shadow-sm ring-1 ring-gray-900/5 flex flex-col">

                    <dl className="flex flex-wrap">
                        <div className="flex-auto pl-6 pt-6 ">
                            <dt className="text-base font-semibold leading-6 text-gray-900">Greet Account</dt>
                        </div>
                        <div className="flex-none self-end px-6 pt-4">
                            {getApprovalStatusBadge(creator.approvalStatus)}
                        </div>
                    </dl>
                    <dl className="flex flex-1 flex-col">
                        {/* Email */}
                        <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                            <dt className="flex-none">
                                <EnvelopeIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                            </dt>
                            <a href={`mailto:${creator.email}`} className="underline text-sm font-medium leading-6 text-gray-900 hover:text-gray-700">
                                {creator.email}
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                            <dt className="flex-none">
                                <PhoneIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                            </dt>
                            <dd className="text-sm leading-6 font-semibold text-gray-900">
                                {creator.phoneNumber}
                            </dd>
                        </div>

                        {/* Address */}
                        <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                            <dt className="flex-none">
                                <GlobeAmericasIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                            </dt>
                            <dd className="text-sm leading-6 text-gray-500">
                                {creator.city}, {creator.region?.toUpperCase()}, {countries.find((x) => x.value === creator.country)?.label} {creator.postalCode}
                            </dd>
                        </div>
                    </dl>


                    <div className="mt-6 border-t border-gray-900/5 px-6 py-6 flex justify-between">
                        <dl className="divide-y divide-gray-100 text-sm leading-6 w-full">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Applications</dt>
                                <dd className="text-gray-900 font-semibold">
                                    {creator.bookings.length}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Active Bookings</dt>
                                <dd className="flex items-start gap-x-2">
                                    <div className="text-gray-900 font-semibold">
                                        {creator.bookings.filter(x => x.status === BookingStatus.APPROVED || x.status === BookingStatus.PENDING).length}
                                    </div>
                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Completed Bookings</dt>
                                <dd className="flex items-start gap-x-2">
                                    <div className="text-gray-900 font-semibold">
                                        {creator.bookings.filter(x => x.status === BookingStatus.COMPLETED).length}
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Instagram Account */}
                <div className="rounded-lg shadow-sm ring-1 ring-gray-900/5 flex flex-col">

                    <dl className="flex flex-wrap">
                        <div className="flex-auto pl-6 pt-6 ">
                            <dt className="text-base font-semibold leading-6 text-gray-900">Instagram Account</dt>
                        </div>
                        <div className="flex-none self-end px-6 pt-4">
                            {getInstagramVerifiedBadge(instagramVerification == null)}
                        </div>
                    </dl>
                    <dl className="flex flex-col flex-1">

                        {/* Handle */}
                        <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                            <dt className="flex-none">
                                <UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                            </dt>

                            <a target="_blank" href={`https://www.instagram.com/${instagramVerification ? instagramVerification.handle : creator.instagramAccount?.username}`} className="underline text-sm font-medium leading-6 text-gray-900 hover:text-gray-700">
                                @{instagramVerification ? instagramVerification.handle : creator.instagramAccount?.username}
                            </a>
                        </div>

                        {/* Metrics from already verified Instagram Account */}
                        {creator.instagramAccount && (
                            <>
                                {/* Bio */}
                                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                                    <dt className="flex-none">
                                        <ChatBubbleBottomCenterIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                                    </dt>
                                    <dd className="text-sm leading-6 text-gray-500">
                                        {creator.instagramAccount?.biography}
                                    </dd>
                                </div>

                                {/* Followers */}
                                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                                    <dt className="flex-none">
                                        <UserGroupIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                                    </dt>
                                    <dd className="text-sm leading-6 text-gray-500">
                                        <span className="font-semibold text-gray-900">{formatInstagramMetric(creator.instagramAccount?.followersCount)}</span> Followers
                                    </dd>
                                </div>

                                {/* Reach */}
                                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                                    <dt className="flex-none">
                                        <RocketLaunchIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                                    </dt>
                                    <dd className="text-sm leading-6 text-gray-500">
                                        <span className="font-semibold text-gray-900">{formatInstagramMetric(creator.instagramAccount?.totalReach)}</span> Total Reach
                                    </dd>
                                </div>

                                {/* Impressions */}
                                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                                    <dt className="flex-none">
                                        <GlobeAmericasIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                                    </dt>
                                    <dd className="text-sm leading-6 text-gray-500">
                                        <span className="font-semibold text-gray-900">{formatInstagramMetric(creator.instagramAccount?.totalImpressions)}</span> Total Impressions
                                    </dd>
                                </div>
                            </>
                        )}
                    </dl>

                    {creator.instagramAccount && (
                        <div className="mt-6 border-t border-gray-900/5 px-6 py-6 flex justify-between">
                            <dl className="divide-y divide-gray-100 text-sm leading-6 w-full">
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Top Countries</dt>
                                    <dd className="text-gray-900 font-semibold">
                                        {creator.instagramAccount?.topCountries.length > 0 ?
                                            creator.instagramAccount?.topCountries.map((entry: any, index: number) => (
                                                <span key={entry.key}>
                                                    {entry.key}
                                                    {index !== (creator.instagramAccount?.topCountries.length as number) - 1 ? ', ' : ''}
                                                </span>
                                            ))
                                            :
                                            <span className="">N/A</span>
                                        }
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Top Gender/Age</dt>
                                    <dd className="flex items-start gap-x-2">
                                        <div className="text-gray-900 font-semibold">
                                            {creator.instagramAccount?.topGenderAge.length > 0 ?
                                                creator.instagramAccount?.topGenderAge.map((entry: any, index: number) => (
                                                    <span key={entry.key}>
                                                        {entry.key}
                                                        {index !== (creator.instagramAccount?.topGenderAge.length as number) - 1 ? ', ' : ''}
                                                    </span>
                                                ))
                                                :
                                                <span className="">N/A</span>
                                            }
                                        </div>
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Top Locale</dt>
                                    <dd className="flex items-start gap-x-2">
                                        <div className="text-gray-900 font-semibold">
                                            {creator.instagramAccount?.topLocale.length > 0 ?
                                                creator.instagramAccount?.topLocale.map((entry: any, index: number) => (
                                                    <span key={entry.key}>
                                                        {entry.key}
                                                        {index !== (creator.instagramAccount?.topLocale.length as number) - 1 ? ', ' : ''}
                                                    </span>
                                                ))
                                                :
                                                <span>N/A</span>
                                            }
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    {instagramVerification && (
                        <div className="mt-6 border-t border-gray-900/5 px-6 py-6 flex justify-between">
                            <div className="flex flex-col items-center">
                                <div className="text-xs text-gray-700 mb-1">Toggle Verification</div>
                                <InputSwitch defaultValue={instagramVerification.active} onChange={onInstagramVerificationActiveChange} />
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="text-xs text-gray-700 mb-1">Link to connect</div>
                                <Link href={`/verify-instagram/${instagramVerification.token}`}>
                                    <SecondaryButton className="py-1 px-2 text-sm">
                                        View link
                                    </SecondaryButton>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <hr className="my-6" />

            {/* Analytics Events */}
            <div className="text-sm">
                <h3 className="text-base font-semibold leading-6 text-gray-900 mb-6">Analytics Events</h3>
                <AnalyticsTimeTable data={analyticsEvents} />
            </div>
        </div>
    )
}