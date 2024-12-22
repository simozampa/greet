import { db } from "@/app/_utils/db";
import { NextResponse } from "next/server";
import { ListingFormSchemaType } from "@/app/_components/ListingForm";
import { Validator, isValidAvailablity } from "@/app/_utils/validation";
import { z } from "zod";
import { verifyUserOwnsBusiness } from "@/app/_utils/serverHelpers";

export async function PUT(req: Request, { params }: { params: { business_id: string, listing_id: string }; }) {

    const isAuthorized = await verifyUserOwnsBusiness(params.business_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    // Note: we do not allow to change "redeem anytime" once the listing was created
    const {
        title,
        offer,
        deal,
        images,
        availability,
        active
    } = await req.json();

    const listing = await db.listing.findFirst({
        where: {
            id: params.listing_id
        }
    });

    if (!listing) {
        return NextResponse.json({ errors: {} }, { status: 400 });
    }

    const validator = new Validator<ListingFormSchemaType>(
        {
            active: active,
            title: title,
            offer: offer,
            deal: deal,
            availability: availability,
            images: images,
            redeemAnytime: listing.redeemAnytime
        },
        {
            active: z.boolean(),
            title: z.string().nonempty({ message: 'Title is required' }).max(50),
            offer: z.string().nonempty({ message: 'Offer is required' }).max(1000),
            deal: z.string().nonempty({ message: 'Deal is required' }).max(1000),
            images: z.array(z.string()).min(1, { message: 'Please upload at least 1 image for the listing.' }).max(10, { message: 'Please upload maximum 10 images for the listing.' }),
            availability: z.custom(),
        }
    );

    await validator.validate();

    await validator.refine(async (data: ListingFormSchemaType) => {

        if (!listing.redeemAnytime) {
            if (!isValidAvailablity(data.availability)) {
                validator.addIssue("availability", "Please select at least 1 availablity slot.");
            }
        }
    });

    if (!validator.isValid()) {
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const updatedListing = await db.listing.update({
        where: {
            id: params.listing_id,
        },
        data: {
            title: title,
            offer: offer,
            deal: deal,
            images: images,
            availability: availability,
            active: active
        }
    });

    return NextResponse.json(updatedListing);
}