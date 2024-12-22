import bcrypt from 'bcryptjs';
import { db } from '@/app/_utils/db';
import { ApprovalStatus, User } from '@prisma/client';
import { NextResponse } from 'next/server';
import { validateBusinessRegistrationSection1 } from '@/app/actions';
import { sendEmail } from '@/app/_utils/sendgrid';
import MainEmailTemplate from '@/mail-templates/emails/main-template';
import NewUserRegistered from '@/mail-templates/emails/new-user-registered';

export async function POST(req: Request) {

    // TODO - CSRF

    const {
        phoneNumber,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        businessId,
    } = await req.json();

    const validationResult = await validateBusinessRegistrationSection1(
        {
            phoneNumber: phoneNumber,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            firstName: firstName,
            lastName: lastName,
        }
    );

    if (!validationResult.isValid) {
        return NextResponse.json({ errors: validationResult.errors }, { status: 400 });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = await db.user.create({
        data: {
            phoneNumber: phoneNumber,
            email: email.toLowerCase(),
            password: encryptedPassword,
            firstName: firstName,
            lastName: lastName,
            approvalStatus: ApprovalStatus.PENDING,
            business: {
                connect: {
                    id: businessId
                }
            },
            role: {
                connect: {
                    slug: 'business-owner',
                },
            },
        },
    });

    try {
        await sendThankYouEmail(newUser);
        await sendAdminNotificationEmail(newUser);
    }
    catch (error) {
        console.error("Email error: ", error);
    }

    return NextResponse.json(newUser);
}

async function sendThankYouEmail(newUser: User) {
    try {

        const businessOwnerRegisteredThankYouComponent = <MainEmailTemplate
            title={`Thank you for your Business Application on ${process.env.NEXT_PUBLIC_NAME}`}
            content={`Thank your for submitting your application for your business on ${process.env.NEXT_PUBLIC_NAME}. We will reach out shortly with an update on your application.`}
            firstName={newUser.firstName}
            lastName={newUser.lastName}
            appName={process.env.NEXT_PUBLIC_NAME}
            baseUrl={process.env.NEXT_PUBLIC_URL}
        />

        await sendEmail({
            to: newUser.email,
            subject: `Thank you for your Business Application on ${process.env.NEXT_PUBLIC_NAME}`,
            component: businessOwnerRegisteredThankYouComponent
        });
    } catch (err: any) {
        // Just handle the error gracefully
        console.error(err);
    }
};

async function sendAdminNotificationEmail(newUser: User) {
    try {
        const newUserRegisteredComponent = <NewUserRegistered
            userType="Creator"
            email={newUser.email}
            phoneNumber={newUser.phoneNumber || ""}
            name={newUser.firstName + ' ' + newUser.lastName}
            location={newUser.city + ', ' + newUser.region + ', ' + newUser.country + ' ' + newUser.postalCode}
            instagram={"TODO"}
            tiktok={newUser.tiktok}
            appName={process.env.NEXT_PUBLIC_NAME}
            appLogo="https://tailwindui.com/img/logos/mark.svg?color=gray&shade=900"
            actionUrl={`${process.env.NEXT_PUBLIC_URL}/dashboard/creators`}
        />

        await sendEmail({
            to: process.env.GREET_ADMIN_EMAIL || "pierlorenzo.peruzzo@gmail.com",
            subject: `New creator request - ${process.env.NEXT_PUBLIC_NAME}`,
            component: newUserRegisteredComponent
        });
    } catch (err: any) {
        // Just handle the error gracefully
        console.error(err);
    }
};