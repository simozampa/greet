import { db } from "@/app/_utils/db";
import { NextResponse } from "next/server";
import { Validator, isValidAvailablity } from "@/app/_utils/validation";
import { ListingFormSchemaType } from "@/app/_components/ListingForm";
import { z } from "zod";
import { verifyUserOwnsBusiness } from "@/app/_utils/serverHelpers";

export async function POST(req: Request, { params }: { params: { business_id: string }; }) {

    const isAuthorized = await verifyUserOwnsBusiness(params.business_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const {
        businessId,
        active,
        title,
        offer,
        deal,
        availability,
        redeemAnytime,
        images,
        locationIds,
    } = await req.json();

    const validator = new Validator<ListingFormSchemaType>(
        {
            active: active,
            title: title,
            offer: offer,
            deal: deal,
            availability: availability,
            redeemAnytime: redeemAnytime,
            images: images,
        },
        {
            active: z.boolean(),
            title: z.string().nonempty({ message: 'Title is required' }).max(50),
            offer: z.string().nonempty({ message: 'Offer is required' }).max(1000),
            deal: z.string().nonempty({ message: 'Deal is required' }).max(1000),
            images: z.array(z.string()).min(1, { message: 'Please upload at least 1 image for the listing.' }).max(10, { message: 'Please upload maximum 10 images for the listing.' }),
            redeemAnytime: z.boolean(),
            availability: z.custom(),
        }
    );

    await validator.validate();

    await validator.refine(async (data: ListingFormSchemaType) => {

        if (!data.redeemAnytime) {
            if (!isValidAvailablity(data.availability)) {
                validator.addIssue("availability", "Please select at least 1 availablity slot.");
            }
        }
    });

    if (!validator.isValid()) {
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const business = await db.business.findFirst({
        where: {
            id: businessId
        }
    });

    if (!business) {
        return NextResponse.json({ errors: {} }, { status: 400 });
    }

    // We create a separate listing for EACH location
    for (let index = 0; index < locationIds.length; index++) {
        await db.listing.create({
            data: {
                business: {
                    connect: { id: business.id }
                },
                active: active,
                title: title,
                offer: offer,
                images: images,
                deal: deal,
                availability: availability,
                redeemAnytime: redeemAnytime,
                location: {
                    connect: {
                        id: locationIds[index]
                    }
                },
            }
        })
    }

    return NextResponse.json({ success: "Success" });
}