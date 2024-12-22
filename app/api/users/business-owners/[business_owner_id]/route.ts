import { authOptions } from "@/app/_utils/auth";
import { db } from "@/app/_utils/db";
import { Validator } from "@/app/_utils/validation";
import { UpdateBusinessOwnerFormSchemaType } from "@/app/dashboard/profile/page";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(req: Request, { params }: { params: { business_owner_id: string }; }) {

    const isAuthorized = await verifyUserIsAuthorized(params.business_owner_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const businessOwner = await db.user.findFirst({
        where: {
            id: params.business_owner_id
        },
    });

    if (!businessOwner) {
        return NextResponse.json({ submitError: "Not found" }, { status: 404 });
    }

    const {
        email,
        firstName,
        lastName,
        phoneNumber,
    } = await req.json()

    const shouldCheckEmail: boolean = (businessOwner?.email !== email);

    const validator = new Validator<UpdateBusinessOwnerFormSchemaType>(
        {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
        },
        {
            email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
            firstName: z.string().nonempty({ message: 'First Name is required.' }).max(50),
            lastName: z.string().nonempty({ message: 'Last Name is required.' }).max(50),
            phoneNumber: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
        }
    );

    await validator.validate();

    await validator.refine(async (data: UpdateBusinessOwnerFormSchemaType) => {

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

    if (!validator.isValid()) {
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const updatedBusinessOwner = await db.user.update({
        where: { id: params.business_owner_id },
        data: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
        },
    })

    return NextResponse.json(updatedBusinessOwner);
}

async function verifyUserIsAuthorized(user_id: string) {

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('session is null');
    const user = session.user;
    if (!user) throw new Error('user is null');

    // Check user is authorized
    return user.id === user_id;
}