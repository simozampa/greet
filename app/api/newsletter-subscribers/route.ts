import { JoinNewsletterFormSchemaType } from "@/app/_components/Newsletter";
import { db } from "@/app/_utils/db";
import { Validator } from "@/app/_utils/validation";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {

    const {
        email,
        userType
    } = await req.json();


    const validator = new Validator<JoinNewsletterFormSchemaType>(
        {
            email: email,
            userType: userType,
        },
        {
            email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
            userType: z.string().nonempty().max(50),
        }
    );

    await validator.validate();

    await validator.refine(async (data: JoinNewsletterFormSchemaType) => {

        // Check Email
        if (data.email) {

            const emailExists = await db.newsletterSubscriber.findUnique({
                where: {
                    email: email
                }
            });

            if (emailExists) { validator.addIssue("email", "Email address exists already"); }
        }
    });

    if (!validator.isValid()) {
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const newsletter = await db.newsletterSubscriber.create({
        data: {
            email: email,
            userType: userType
        }
    })

    return NextResponse.json({ success: "Success" });
}