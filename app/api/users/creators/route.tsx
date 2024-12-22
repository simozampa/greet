import { db } from "@/app/_utils/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/auth";
import { sendEmail } from "@/app/_utils/sendgrid";
import { getStrParam } from "@/app/_utils/helpers";
import { User, ApprovalStatus } from "@prisma/client";
import {
  updateCreatorApprovalStatus,
  validateCreatorRegistrationSection1,
  validateCreatorRegistrationSection2,
  validateCreatorRegistrationSection3,
} from "@/app/actions";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import MainEmailTemplate from "@/mail-templates/emails/main-template";
import NewUserRegistered from "@/mail-templates/emails/new-user-registered";
import { basicInstagramFollowerCheck } from "@/app/_utils/instagram/helpers";
import { onCreatorApproved } from "@/app/_utils/serverHelpers";

export async function GET(req: Request) {
  const isAuthorized = await verifyUserIsAdmin();
  if (!isAuthorized) return NextResponse.json([], { status: 400 });

  const url = new URL(req.url);
  const status = getStrParam(url, "status") as ApprovalStatus;

  const filters = [];
  filters.push({
    role: {
      slug: "creator",
    },
  });

  if (status !== null && status !== undefined) {
    filters.push({
      approvalStatus: status,
    });
  }

  const users = await db.user.findMany({
    where: {
      AND: filters,
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    phoneNumber,
    city,
    country,
    region,
    postalCode,
    instagramHandle,
    tiktokHandle,
  } = await req.json();

  const validationResult1 = await validateCreatorRegistrationSection1({
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  });

  const validationResult2 = await validateCreatorRegistrationSection2({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    city: city,
    country: country,
    region: region,
    postalCode: postalCode,
  });

  const validationResult3 = await validateCreatorRegistrationSection3({
    instagramHandle: instagramHandle,
    tiktokHandle: tiktokHandle,
  });

  if (
    !validationResult1.isValid ||
    !validationResult1.isValid ||
    !validationResult1.isValid
  ) {
    return NextResponse.json(
      {
        errors: {
          ...validationResult1.errors,
          ...validationResult2.errors,
          ...validationResult3.errors,
        },
      },
      { status: 400 }
    );
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser: User = await db.user.create({
    data: {
      email: email.toLowerCase(),
      password: encryptedPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      city: city,
      country: country,
      region: region,
      postalCode: postalCode,
      tiktok: tiktokHandle,
      approvalStatus: ApprovalStatus.PENDING,
      role: {
        connect: {
          slug: "creator",
        },
      },
    },
  });

  // Upon registration we just ask for the Instagram Handle.
  // We will then send a verification link where the ser has to login with the account to confirm.
  // So for now, we just create the verification entry in the database
  const token = crypto.randomBytes(64).toString("hex");
  await db.instagramVerification.create({
    data: {
      active: true, // Use to only activate the verification link (eg: /verify-instagram/[token]) from the dashboard. By default is FALSE.
      token: token,
      handle: instagramHandle.trim().toLowerCase(), // The handle provided on the registration
      user: {
        connect: {
          id: newUser.id,
        },
      },
    },
  });

  // Perform extra checks:
  // We scrape the provided handle.
  // If the account has more than 5k, we accept the user immediately
  // Otherwise if the scraper fails or if the user has less than 5k
  // we just leave the user as "pending"
  const minFollowersCheck = await basicInstagramFollowerCheck(
    instagramHandle
  );

  console.log(`Min followers check result for ${instagramHandle}`, minFollowersCheck)

  // Update the user to "Accepted", return true
  if (minFollowersCheck) {
    const updatedNewUser = await db.user.update({
      data: {
        approvalStatus: ApprovalStatus.APPROVED,
      },
      where: {
        id: newUser.id,
      },
    });

    const instagramVerificationUrl = await onCreatorApproved(updatedNewUser);

    try {
      await sendAdminNotificationEmail(newUser, instagramHandle);
    } catch (error) {
      console.error("Email error: ", error);
    }

    return NextResponse.json({
      user: updatedNewUser,
      verificationUrl: instagramVerificationUrl,
    });
  }

  // Leave the user in "Pending" status, return false

  try {
    await sendThankYouEmail(newUser);
    await sendAdminNotificationEmail(newUser, instagramHandle);
  } catch (error) {
    console.error("Email error: ", error);
  }

  return NextResponse.json({ user: newUser, verificationUrl: null });
}

async function sendThankYouEmail(newUser: User) {
  try {
    const creatorRegisteredThankYouComponent = (
      <MainEmailTemplate
        title={`Thank you for your Application on ${process.env.NEXT_PUBLIC_NAME}`}
        content={`Thank your for submitting your application on ${process.env.NEXT_PUBLIC_NAME}. We will reach out shortly with an update on your application.`}
        firstName={newUser.firstName}
        lastName={newUser.lastName}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
      />
    );

    await sendEmail({
      to: newUser.email,
      subject: `Thank you for your Application on ${process.env.NEXT_PUBLIC_NAME}`,
      component: creatorRegisteredThankYouComponent,
    });
  } catch (err: any) {
    // Just handle the error gracefully
    console.error(err);
  }
}

async function sendAdminNotificationEmail(
  newUser: User,
  instagramUsername: string
) {
  try {
    const newUserRegisteredComponent = (
      <NewUserRegistered
        userType="Creator"
        email={newUser.email}
        phoneNumber={newUser.phoneNumber || ""}
        name={newUser.firstName + " " + newUser.lastName}
        location={
          newUser.city +
          ", " +
          newUser.region +
          ", " +
          newUser.country +
          " " +
          newUser.postalCode
        }
        instagram={instagramUsername}
        tiktok={newUser.tiktok}
        appName={process.env.NEXT_PUBLIC_NAME}
        appLogo="https://tailwindui.com/img/logos/mark.svg?color=gray&shade=900"
        actionUrl={`${process.env.NEXT_PUBLIC_URL}/dashboard/creators`}
      />
    );

    await sendEmail({
      to: process.env.GREET_ADMIN_EMAIL || "pierlorenzo.peruzzo@gmail.com",
      subject: `New creator request - ${process.env.NEXT_PUBLIC_NAME}`,
      component: newUserRegisteredComponent,
    });
  } catch (err: any) {
    // Just handle the error gracefully
    console.error(err);
  }
}

async function verifyUserIsAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("session is null");
  const user = session.user;
  if (!user) throw new Error("user is null");

  // Check user is authorized
  return user.role?.slug === "admin";
}
