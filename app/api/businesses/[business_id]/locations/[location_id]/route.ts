import { UpdateLocationFormSchemaType } from "@/app/_components/UpdateLocationForm";
import { authOptions } from "@/app/_utils/auth";
import { countries } from "@/app/_utils/constants";
import { db } from "@/app/_utils/db";
import { Validator } from "@/app/_utils/validation";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: { business_id: string, location_id: string }; }) {

    const isAuthorized = await verifyUserIsBusiness(params.business_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const location = await db.location.findFirst({
        where: {
            AND: [
                {
                    id: params.location_id
                },
                {
                    businessId: params.business_id,
                }
            ]
        }
    })

    if (!location) {
        return NextResponse.json({ submitError: "Not found" }, { status: 404 });
    }

    return NextResponse.json(location);
}

export async function PUT(req: Request, { params }: { params: { business_id: string, location_id: string }; }) {

    const isAuthorized = await verifyUserIsBusiness(params.business_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const location = await db.location.findFirst({
        where: {
            AND: [
                {
                    id: params.location_id
                },
                {
                    businessId: params.business_id,
                }
            ]
        }
    });

    if (!location) {
        return NextResponse.json({ submitError: "Not found" }, { status: 404 });
    }

    const {
        name,
        phoneNumber,
        street,
        city,
        country,
        region,
        postalCode
    } = await req.json()

    const validator = new Validator<UpdateLocationFormSchemaType>(
        {
            name: name,
            phoneNumber: phoneNumber,
            street: street,
            city: city,
            country: country,
            region: region,
            postalCode: postalCode
        },
        {
            name: z.string().max(50),
            street: z.string().nonempty({ message: 'Street is required.' }).max(50),
            phoneNumber: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
            city: z.string().nonempty({ message: 'City is required.' }).max(50),
            country: z.string().refine((value) => countries.some((c) => c.value === value), {
                message: 'Please select a valid country.',
            }),
            region: z.string().nonempty({ message: 'Region is required.' }).max(50),
            postalCode: z.string().nonempty({ message: 'Postal code is required.' }).max(50),
        }
    );

    if (!(await validator.validate())){
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const updatedLocation = await db.location.update({
        where: {
            id: params.location_id,
        },
        data: {
            name: name,
            phoneNumber: phoneNumber,
            street: street,
            city: city,
            country: country,
            region: region,
            postalCode: postalCode
        }
    })

    return NextResponse.json(updatedLocation);
}

async function verifyUserIsBusiness(business_id: string) {

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('session is null');
    const user = session.user;
    if (!user) throw new Error('user is null');

    // Check user is authorized
    if (user.businessId !== business_id) {
        return false;
    }
    return true;
}