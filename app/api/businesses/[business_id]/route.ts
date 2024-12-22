import { authOptions } from "@/app/_utils/auth";
import { businessTypes } from "@/app/_utils/constants";
import { db } from "@/app/_utils/db";
import { Validator } from "@/app/_utils/validation";
import { UpdateBusinessFormSchemaType } from "@/app/dashboard/business-profile/page";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: { business_id: string }; }) {

    const isAuthorized = await verifyUserIsBusiness(params.business_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const business = await db.business.findFirst({
        where: {
            id: params.business_id,
        },
        include: {
            locations: true,
            bookings: true,
            users: true
        }
    });


    if (!business) {
        return NextResponse.json({ submitError: "Not found" }, { status: 404 });
    }

    return NextResponse.json(business);
}

export async function PUT(req: Request, { params }: { params: { business_id: string }; }) {

    const isAuthorized = await verifyUserIsBusiness(params.business_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const business = await db.business.findFirst({
        where: {
            id: params.business_id
        },
    });

    if (!business) {
        return NextResponse.json({ submitError: "Not found" }, { status: 404 });
    }

    const {
        logo,
        name,
        description,
        email,
        phoneNumber,
        cuisineType,
        type,
        website,
        instagram,
        tiktok,
    } = await req.json()

    const validator = new Validator<UpdateBusinessFormSchemaType>(
        {
            logo: logo,
            name: name,
            description: description,
            email: email,
            phoneNumber: phoneNumber,
            cuisineType: cuisineType,
            type: type,
            website: website,
            instagram: instagram,
            tiktok: tiktok,
        },
        {
            logo: z.string().nonempty({ message: 'Business Logo is required.' }),
            name: z.string().nonempty({ message: 'Business Name is required.' }).max(50),
            description: z.string().nonempty({ message: 'Business Description is required.' }).max(1000),
            cuisineType: z.string().nonempty({ message: 'Cuisine Type is required.' }).max(50),
            type: z.string().refine((value) => businessTypes.some((c) => c.value === value), {
                message: 'Please select a valid business type.',
            }),
        
            email: z.string().nonempty({ message: 'Business Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
            phoneNumber: z.string().regex(/^$|^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
            website: z.string().max(50),
            instagram: z.string().max(50),
        }
    );

    if (!(await validator.validate())){
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const updatedBusiness = await db.business.update({
        where: { id: params.business_id },
        data: {
            logo: logo,
            name: name,
            description: description,
            email: email,
            phoneNumber: phoneNumber,
            cuisineType: cuisineType,
            type: type,
            website: website,
            instagram: instagram,
            tiktok: tiktok,
        },
        include: {
            locations: true,
            users: true
        }
    })

    return NextResponse.json(updatedBusiness);
}

async function verifyUserIsBusiness(business_id: string) {

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('session is null');
    const user = session.user;
    if (!user) throw new Error('user is null');

    if (user.role?.slug === "admin"){
        return true;
    }

    // Check user is authorized
    if (user.businessId !== business_id) {
        return false;
    }
    return true;
}