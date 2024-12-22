import Link from "next/link"
import { BusinessWithRelations, db } from "../../_utils/db"
import ProfilePicture from "../ProfilePicture"
import SecondaryButton from "../SecondaryButton"
import BusinessApprovalStatusSelect from "./BusinessApprovalStatusSelect"

interface AdminBusinessCardProps {
    business: BusinessWithRelations
}

async function getMostRecentAnalyticsEvent(business: BusinessWithRelations) {
    return await db.analyticsEvent.findFirst({
        where: {
            distinctId: {
                in: business.users.map(user => user.id)
            },
        },
        take: 100,
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export default async function AdminBusinessCard({ business }: AdminBusinessCardProps) {

    const mostRecentAnalyticsEvent = await getMostRecentAnalyticsEvent(business);

    return (
        <div className="mt-2 rounded-lg bg-white shadow-md ring-1 ring-gray-200 flex flex-col">

            {/* Heading */}
            <div className="flex w-full items-start justify-between bg-gray-50 p-4 border-b border-gray-200">

                {/* Profile Picture */}
                <div className="flex items-start space-x-2">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-gray-100">
                        <ProfilePicture
                            size="6rem"
                            pictureUrl={business.logo || undefined}
                            name={`${business.name} Business Profile Picture`}
                        />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">{business.name}</p>
                        <p className="text-gray-500 text-sm font-medium">{business.email}</p>
                        <p className="text-gray-500 text-sm flex items-center mt-2 space-x-2">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                                <path
                                    fillRule="evenodd"
                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <a target="_blank" href={`https://www.instagram.com/${business.instagram}`} className="underline hover:text-gray-700">
                                @{business.instagram}
                            </a>
                        </p>
                    </div>
                </div>

                {/* Manage Button */}
                <div className="flex flex-col space-y-2 items-end">
                    <Link href={`businesses/profile/${business.id}`}>
                        <SecondaryButton className="py-1 px-2 text-sm">
                            View
                        </SecondaryButton>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <BusinessApprovalStatusSelect
                        status={business.approvalStatus}
                        businessId={business.id}
                    />
                    <p className="text-xs text-gray-500 text-right">Applied on {new Date(business.createdAt).toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "numeric" })}</p>
                </div>
                <div className="text-xs text-gray-500 text-right">
                    Last activity {mostRecentAnalyticsEvent ? (<time dateTime={mostRecentAnalyticsEvent.createdAt.toLocaleString()}>{new Date(mostRecentAnalyticsEvent.createdAt).toLocaleString()}</time>) : "N/A"}
                </div>
            </div>

        </div>
    )
}