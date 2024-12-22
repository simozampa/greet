import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import MainEmailTemplate from '@/mail-templates/emails/main-template';
import { db } from '@/app/_utils/db';
import { sendEmail } from '@/app/_utils/sendgrid';
import { User } from '@prisma/client';
import { Validator } from '@/app/_utils/validation';
import { getStrParam } from '@/app/_utils/helpers';
import { NextResponse } from 'next/server';
import { ForgotPasswordFormSchemaType } from '@/app/(landing)/forgot-password/page';
import { ResetPasswordFormSchemaType } from '@/app/(landing)/forgot-password/[token]/page';
import { z } from 'zod';


export async function GET(req: Request) {
    const url = new URL(req.url);
    const token = getStrParam(url, 'token');

    if (!token) {
        return NextResponse.json({}, { status: 404 });
    }

    try {
        const forgotPasswordRequest = await db.forgotPasswordRequest.findFirst({
            where: {
                token: token,
            }
        });

        if (!forgotPasswordRequest?.createdAt) {
            return NextResponse.json({}, { status: 404 });
        }

        if (hasRequestExpired(forgotPasswordRequest?.createdAt)) {
            return NextResponse.json({}, { status: 404 });
        }

        return NextResponse.json(forgotPasswordRequest);

    } catch (error: any) {
        return NextResponse.json({}, { status: 404 });
    }
}

export async function POST(req: Request) {

    const {
        email,
    } = await req.json();

    const validator = new Validator<ForgotPasswordFormSchemaType>(
        {
            email: email,
        },
        {
            email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
        }
    );

    if (!(await validator.validate())) {
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }


    const user = await db.user.findFirst({
        where: {
            email: email,
        }
    })

    if (!user) {
        // Fail silently
        return NextResponse.json({ success: "success" });
    }

    try {

        // Invalidate all previous requests for this email
        await db.forgotPasswordRequest.deleteMany({
            where: {
                email: user.email,
            },
        });

        const token = crypto.randomBytes(64).toString('hex');

        await db.forgotPasswordRequest.create({
            data: {
                email: user.email,
                token: token,
            }
        });

        await sendResetPasswordEmail(user, token);

    } catch (error: any) {

        let errorMessage = 'Unexpected error. Please try again later.';
        console.error(error);

        return NextResponse.json({ errors: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ success: "success" });
}

export async function PUT(req: Request) {

    const {
        password,
        confirmPassword,
        token,
    } = await req.json()

    const forgotPasswordRequest = await db.forgotPasswordRequest.findFirst({
        where: {
            token: token
        }
    });

    if (!forgotPasswordRequest?.createdAt) {
        return NextResponse.json({}, { status: 404 });
    }

    if (hasRequestExpired(forgotPasswordRequest?.createdAt)) {
        return NextResponse.json({}, { status: 404 });
    }

    if (!forgotPasswordRequest) {
        return NextResponse.json({}, { status: 404 });
    }





    const validator = new Validator<ResetPasswordFormSchemaType>(
        {
            password: password,
            confirmPassword: confirmPassword,
        },
        {
            password: z.string().nonempty({ message: 'Password is required.' }).min(8, { message: 'Password should be at least 8 characters long.' }).max(50),
            confirmPassword: z.string().nonempty({ message: 'Confirm Password is required.' }).max(50),
        }
    );

    await validator.validate();

    await validator.refine(async (data: ResetPasswordFormSchemaType) => {

        if ((data.password && data.confirmPassword) && (data.password !== data.confirmPassword)) {
            validator.addIssue("confirmPassword", "Passwords do not match");
        }
    });

    if (!validator.isValid()) {
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        // Update the password
        await db.user.update({
            where: { email: forgotPasswordRequest.email },
            data: {
                password: encryptedPassword,
            },
        });

        // Delete the request to update the password
        await db.forgotPasswordRequest.deleteMany({
            where: {
                token: token,
            },
        });

        return NextResponse.json({ message: "Success" });

    } catch (error: any) {
        return NextResponse.json({}, { status: 400 });
    }

}

async function sendResetPasswordEmail(user: User, token: string) {
    try {

        const resetYourPasswordComponent = <MainEmailTemplate
            title={`Reset your password on ${process.env.NEXT_PUBLIC_NAME}`}
            content="You're just one step away from regaining access to your account! We received a request to reset your password.
            To reset your password, click the button below:"
            firstName={user.firstName}
            lastName={user.lastName}
            appName={process.env.NEXT_PUBLIC_NAME}
            baseUrl={process.env.NEXT_PUBLIC_URL}
            actionTitle="Reset your Password"
            actionUrl={`${process.env.NEXT_PUBLIC_URL}/forgot-password/${token}`}
        />

        await sendEmail({
            to: user.email,
            from: process.env.NEXT_PUBLIC_FROM_EMAIL,
            subject: `Reset your password - ${process.env.NEXT_PUBLIC_NAME}`,
            component: resetYourPasswordComponent
        });
    } catch (err: any) {
        // Just handle the error gracefully
        console.error(err);
    }
}

function hasRequestExpired(dateTime: Date): boolean {

    // Get the current date and time
    const currentDate = new Date();

    // Subtract 1 hour from the current date to get the threshold date
    const oneHourAgo = new Date(currentDate);
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    // Compare the 'createdAt' field with the threshold date
    if (dateTime < oneHourAgo) {
        return true;
    }

    return false;
}