import { authOptions } from "@/app/_utils/auth";
import { MediaWithRelations, db } from "@/app/_utils/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import BusinessContentCard from "./BusinessContentCard";

async function getContent() {

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.businessId) throw new Error('Unexpected Error');

    const content: MediaWithRelations[] = await db.mediaObject.findMany({
        where: {
            businessId: session.user.businessId,
        },
        include: {
            user: {
                include: {
                    instagramAccount: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return content;
};


export default async function Page() {

    const content = await getContent();

    return (
        <>
            <div className="border-b border-gray-200 pb-5 mb-5">
                <div className="sm:flex sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Content</h3>
                        <p className="mt-2 max-w-4xl text-sm text-gray-500">
                            View influencers content insights and download the media files.
                        </p>
                    </div>
                    <div className="mt-3 sm:ml-4 sm:mt-0">
                        <Link
                            href="/dashboard/content/example"
                            className="inline-flex items-center rounded-md bg-business-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-business-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-business-500"
                        >
                            View example content
                        </Link>
                    </div>
                </div>
            </div>

            {content.length > 0 ?
                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                    {content.map((content: MediaWithRelations) => (
                        <li key={content.id} className="col-span-1 flex flex-col">
                            <BusinessContentCard content={content} />
                        </li>
                    ))}
                </ul>
                :
                <p className="w-full flex items-center justify-center text-gray-600">
                    No content yet.
                </p>
            }
        </>
    );
}
