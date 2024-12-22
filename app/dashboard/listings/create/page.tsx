import ListingForm from "@/app/_components/ListingForm";
import { authOptions } from "@/app/_utils/auth";
import { BusinessWithRelations, db } from "@/app/_utils/db";
import { getServerSession } from "next-auth";

async function getBusiness(businessId: string) {
    const business = await db.business.findFirst({
        where: {
            id: businessId,
        },
        include: {
            locations: true,
            bookings: true
        }
    });
    if (!business) throw new Error('Could not fetch business');

    return business as BusinessWithRelations;
}

export default async function Page() {

    const session = await getServerSession(authOptions);
    if (!session?.user?.businessId) throw new Error('Unexpected error');

    const business = await getBusiness(session?.user?.businessId);

    return (

        <div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Create new Listing</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Setup a new listing to get bookings from influencers.
                    </p>
                </div>

                <div className="max-w-2xl md:col-span-2">
                    <ListingForm
                        submitButtonText="Create"
                        defaultValues={{
                            active: true,
                            title: '',
                            offer: '',
                            deal: `Minimum 3 stories OR 1 Reel\nTag @${business.instagram} and @greet.club (you can hide this tag)`,
                            images: [],
                            redeemAnytime: false,
                            availability: {
                                monday: [],
                                tuesday: [],
                                wednesday: [],
                                thursday: [],
                                friday: [],
                                saturday: [],
                                sunday: [],
                            },
                        }}
                        business={business}
                        onUpdateRedirectUrl="/dashboard/listings"
                    />
                </div>
            </div>
        </div>
    )
}