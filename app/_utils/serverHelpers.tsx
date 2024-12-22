/*
 * This file contains helpers that can only be called serverside
 * For general helpers (client-only, or client-and-server), please see helpers.tsx
 */
import { db } from "./db";
import { User } from "@prisma/client";
import { sendEmail } from "./sendgrid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/auth";
import MainEmailTemplate from "@/mail-templates/emails/main-template";
import {
  getLast30DaysTimestamps,
  processInstagramApiBasicInfo,
  processInstagramApiDayInsights,
  processInstagramApiLifetimeInsights,
} from "./instagram/helpers";

export async function onCreatorApproved(user: User) {
  // When we approve a creator, we activate the instagram verification link (if they did not verify their instagram).
  const instagramVerification = await db.instagramVerification.findFirst({
    where: {
      userId: user.id,
    },
  });

  const verificationUrl = instagramVerification
    ? process.env.NEXT_PUBLIC_URL +
      "/verify-instagram/" +
      instagramVerification.token
    : "";

  // If we have a "Instagram verification" for the user, we send this in the email
  const verificationMessage = instagramVerification
    ? `On your first login you will be asked to verify your Instagram Account. Click on the button below to start the verification process on Greet`
    : "";

  // We also activate the verification
  if (instagramVerification) {
    await db.instagramVerification.update({
      where: {
        id: instagramVerification.id,
      },
      data: {
        active: true,
      },
    });
  }

  // Send email
  const message = `We are happy to inform you that your application has been approved. You can now sign into your account and use ${process.env.NEXT_PUBLIC_NAME}! ${verificationMessage}`;

  try {
    const creatorAccountApprovedComponent = (
      <MainEmailTemplate
        title="We Have An Update About Your Account!"
        content={message}
        firstName={user.firstName}
        lastName={user.lastName}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        actionTitle={instagramVerification ? "Start Verification" : undefined}
        actionUrl={instagramVerification ? verificationUrl : undefined}
      />
    );

    await sendEmail({
      to: user.email,
      subject: `Thank you for your ${process.env.NEXT_PUBLIC_NAME} Application`,
      component: creatorAccountApprovedComponent,
    });
  } catch (err: any) {
    console.error(err);
  }

  return verificationUrl;
}

export async function onCreatorRejected(user: User) {
  // When we reject a creator, we make sure to disable the instagramVerification (if exists)
  const instagramVerification = await db.instagramVerification.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (instagramVerification) {
    await db.instagramVerification.update({
      where: {
        id: instagramVerification.id,
      },
      data: {
        active: false,
      },
    });
  }

  // Send email
  const message = `We are sorry to inform you that we have decided to not move forward with your application.`;

  try {
    const creatorAccountApprovedComponent = (
      <MainEmailTemplate
        title="We Have An Update About Your Account!"
        content={message}
        firstName={user.firstName}
        lastName={user.lastName}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
      />
    );

    await sendEmail({
      to: user.email,
      subject: `Thank you for your ${process.env.NEXT_PUBLIC_NAME} Application`,
      component: creatorAccountApprovedComponent,
    });
  } catch (err: any) {
    console.error(err);
  }
}

export async function verifyUserIsAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("session is null");
  const user = session.user;
  if (!user) throw new Error("user is null");

  // Check user is authorized
  if (user.role?.slug !== "admin") {
    return false;
  }
  return true;
}

export async function verifyUserOwnsBusiness(
  businessId: string
): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("session is null");
  const user = session.user;
  if (!user) throw new Error("user is null");

  // Return alwasy true for admin!
  if (user.role?.slug === "admin") {
    return true;
  }

  // Check user is authorized
  if (user.businessId !== businessId) {
    return false;
  }
  return true;
}

export async function verifyUserIsAuthorized(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("session is null");
  const user = session.user;
  if (!user) throw new Error("user is null");

  // Check user is authorized
  return user.id === userId;
}

export async function getAllInstagramAccountData(
  pageId: string,
  pageAccessToken: string
): Promise<{
  isValid: boolean;
  data:
    | {
        businessAccountId: string;
        name?: string;
        biography?: string;
        followersCount: number;
        profilePictureUrl: string;
        username: string;
        totalImpressions: number;
        totalReach: number;
        totalProfileViews: number;
        totalFollowerCount: number;
        topCountries: any;
        topGenderAge: any;
        topLocale: any;
      }
    | undefined;
  error: string;
}> {
  // Getting instagram business account
  const igUserResponse = await fetch(
    `https://graph.facebook.com/v17.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`,
    {
      method: "GET",
    }
  );

  if (!igUserResponse.ok) {
    const error = await igUserResponse.json();
    console.error(error);
    return {
      isValid: false,
      data: undefined,
      error: `Error getting Instagram User. Please try again later. Are you logging in with the right account?`,
    };
  }

  // Get the user ID
  const igUser = await igUserResponse.json();
  const businessAccountId = igUser?.instagram_business_account?.id;
  if (!businessAccountId) {
    return {
      isValid: false,
      data: undefined,
      error:
        "Error getting the Instagram Creator account. Please make sure the Facebook page you selected is associated with your Instagram account.",
    };
  }

  const basicInfoResponse = await fetch(
    `https://graph.facebook.com/v17.0/${businessAccountId}?
                fields=biography,followers_count,name,profile_picture_url,username
                &access_token=${pageAccessToken}`,
    {
      method: "GET",
    }
  );

  if (!basicInfoResponse.ok) {
    return {
      isValid: false,
      data: undefined,
      error: `Unexpected error communicating with Instagram. Cannot retreive basic info for account ID: ${businessAccountId}. Please try again later. If the problem persist please contact us at info@greet.club`,
    };
  }

  const { name, biography, followersCount, profilePictureUrl, username } =
    processInstagramApiBasicInfo(await basicInfoResponse.json());

  const { since, until } = getLast30DaysTimestamps();

  const insightResponseDay = await fetch(
    `https://graph.facebook.com/v17.0/${businessAccountId}/insights?
                metric=impressions,reach,profile_views,follower_count
                &period=day
                &since=${since}
                &until=${until}
                &access_token=${pageAccessToken}`,
    {
      method: "GET",
    }
  );

  // const insightResponseLifetime = await fetch(
  //   `https://graph.facebook.com/v17.0/${businessAccountId}/insights?
  //               metric=audience_country,audience_gender_age,audience_locale
  //               &period=lifetime
  //               &access_token=${pageAccessToken}`,
  //   {
  //     method: "GET",
  //   }
  // );

  // if (!insightResponseDay.ok || !insightResponseLifetime.ok) {
  if (!insightResponseDay.ok) {
    return {
      isValid: false,
      data: undefined,
      error: `Unexpected error communicating with Instagram. Cannot retreive insights for account ID: ${businessAccountId} Please try again later. If the problem persist please contact us at info@greet.club`,
    };
  }

  const {
    totalImpressions,
    totalReach,
    totalProfileViews,
    totalFollowerCount,
  } = processInstagramApiDayInsights((await insightResponseDay.json()).data);

  // const { topCountries, topGenderAge, topLocale } =
  //   processInstagramApiLifetimeInsights(
  //     (await insightResponseLifetime.json()).data
  //   );

  return {
    isValid: true,
    data: {
      businessAccountId: businessAccountId,
      name: name,
      biography: biography,
      followersCount: followersCount,
      profilePictureUrl: profilePictureUrl ? profilePictureUrl : "",
      username: username,
      totalImpressions: totalImpressions,
      totalReach: totalReach,
      totalProfileViews: totalProfileViews,
      totalFollowerCount: totalFollowerCount,
      topCountries: [],
      topGenderAge: [],
      topLocale: [],

      // topCountries: topCountries,
      // topGenderAge: topGenderAge,
      // topLocale: topLocale,
    },
    error: "",
  };
}
