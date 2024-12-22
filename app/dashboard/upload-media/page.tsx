import UploadMediaForm from "@/app/_components/UploadMediaForm";
import { db } from "@/app/_utils/db";

async function getData() {

    const creators = await db.user.findMany({
        where: {
            role: {
                slug: 'creator'
            }
        },
        include: {
            instagramAccount: true,
            bookings: true,
        }
    });

    const businesses = await db.business.findMany();

    return { creators, businesses };
}

export default async function Page() {

    const { creators, businesses } = await getData();

    return (
        <>
            <div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Upload Media</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Upload a media and select a creator and a business to send the media to the business.
                        </p>
                    </div>
                        <UploadMediaForm creators={creators} businesses={businesses} />
                </div>
            </div>
        </>
    )
}