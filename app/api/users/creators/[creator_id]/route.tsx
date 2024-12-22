import { UpdateCreatorFormSchemaType } from "@/app/(application)/profile/page";
import { authOptions } from "@/app/_utils/auth";
import { countries } from "@/app/_utils/constants";
import { db } from "@/app/_utils/db";
import { Validator } from "@/app/_utils/validation";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";


export async function PUT(req: Request, { params }: { params: { creator_id: string }; }) {

    const isAuthorized = await verifyUserIsAuthorized(params.creator_id);
    if (!isAuthorized) {
        return NextResponse.json({}, { status: 400 });
    }

    const creator = await db.user.findFirst({
        where: {
            id: params.creator_id
        },
    });

    if (!creator) {
        return NextResponse.json({ submitError: "Not found" }, { status: 404 });
    }

    const {
        email,
        firstName,
        lastName,
        phoneNumber,
        city,
        country,
        region,
        postalCode,
    } = await req.json()

    const shouldCheckEmail: boolean = (creator?.email !== email);

    const validator = new Validator<UpdateCreatorFormSchemaType>(
        {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            city: city,
            country: country,
            region: region,
            postalCode: postalCode,
        },
        {
            email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
            firstName: z.string().nonempty({ message: 'First Name is required.' }).max(50),
            lastName: z.string().nonempty({ message: 'Last Name is required.' }).max(50),
            phoneNumber: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
            city: z.string().nonempty({ message: 'City is required.' }).max(50),
            country: z.string().refine((value) => countries.some((c) => c.value === value), {
                message: 'Please select a valid country.',
            }),
            region: z.string().nonempty({ message: 'Region is required.' }).max(50),
            postalCode: z.string().nonempty({ message: 'Postal code is required.' }).max(50),
        }
    );


    await validator.validate();

    await validator.refine(async (data: UpdateCreatorFormSchemaType) => {

        if (!shouldCheckEmail) {
            return;
        }

        if (data.email) {

            const emailExists = await db.user.findUnique({
                where: {
                    email: email.toLowerCase()
                }
            });

            if (emailExists) { validator.addIssue("email", "Email address exists already"); }
        }
    });

    if (!validator.isValid()){
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const updatedCreator = await db.user.update({
        where: { id: params.creator_id },
        data: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            city: city,
            country: country,
            region: region,
            postalCode: postalCode,
        },
    })

    return NextResponse.json(updatedCreator);
}


async function verifyUserIsAuthorized(user_id: string) {

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('session is null');
    const user = session.user;
    if (!user) throw new Error('user is null');

    // Check user is authorized
    return user.id === user_id;
}