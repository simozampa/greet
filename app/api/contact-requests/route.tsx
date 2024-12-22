import { ContactUsFormSchemaType } from "@/app/_components/ContactUsForm";
import { db } from "@/app/_utils/db";
import { sendEmail } from "@/app/_utils/sendgrid";
import { Validator } from "@/app/_utils/validation";
import NewContactReceivedTemplate from "@/mail-templates/emails/NewContactReceivedTemplate";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {

    // TODO: CSRF

    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        message
    } = await req.json();

    const validator = new Validator<ContactUsFormSchemaType>(
        {
            firstName,
            lastName,
            email,
            phoneNumber,
            message
        },
        {
            firstName: z.string().nonempty({ message: 'First Name is required.' }).max(50),
            lastName: z.string().nonempty({ message: 'Last Name is required.' }).max(50),
            email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
            phoneNumber: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
            message: z.string().nonempty({ message: 'Message is required.' }).max(1000),
        }
    );

    if (!(await validator.validate())){
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const contactRequest = await db.contactRequest.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            message: message
        }
    });

    try {
        const newContactReceivedComponent = <NewContactReceivedTemplate
            firstName={contactRequest.firstName}
            lastName={contactRequest.lastName}
            email={contactRequest.email}
            phoneNumber={contactRequest.phoneNumber}
            message={contactRequest.message}
            appName={process.env.NEXT_PUBLIC_NAME || ""}
        />

        await sendEmail({
            to: process.env.GREET_ADMIN_EMAIL || "",
            subject: `New Contact Received`,
            component: newContactReceivedComponent
        });
    } catch (err: any) {
        // Just handle the error gracefully
        console.error(err);
    }

    return NextResponse.json({ success: "Success" });
}