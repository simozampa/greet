'use server'


import { z } from "zod";
import { db } from "./_utils/db";
import { Section1RegisterBusinessFormSchemaType, Section2RegisterBusinessFormSchemaType, Section3RegisterBusinessFormSchemaType } from "./(landing)/register/businesses/page";
import { Validator } from "./_utils/validation";
import { businessTypes, countries } from "./_utils/constants";
import { Section1RegisterCreatorFormSchemaType, Section2RegisterCreatorFormSchemaType, Section3RegisterCreatorFormSchemaType } from "./(landing)/register/creators/page";
import { UploadMediaSchemaType } from "./_components/UploadMediaForm";
import { ApprovalStatus, InstagramAccount, InstagramVerification } from "@prisma/client";
import { getAllInstagramAccountData, onCreatorApproved, onCreatorRejected, verifyUserIsAdmin } from "./_utils/serverHelpers";
import MainEmailTemplate from "@/mail-templates/emails/main-template";
import { sendEmail } from "./_utils/sendgrid";

/*
* VALIDATE BUSINESS REGISTRATION
*/
export async function validateBusinessRegistrationSection1(data: Section1RegisterBusinessFormSchemaType): Promise<{ isValid: boolean, errors: Partial<Record<keyof Section1RegisterBusinessFormSchemaType, string>> }> {

    const validator = new Validator<Section1RegisterBusinessFormSchemaType>(
        data, {
        firstName: z.string().nonempty({ message: 'First Name is required.' }).max(50),
        lastName: z.string().nonempty({ message: 'Last Name is required.' }).max(50),
        phoneNumber: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
        email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
        password: z.string().nonempty({ message: 'Password is required.' }).min(8, { message: 'Password should be at least 8 characters long.' }).max(50),
        confirmPassword: z.string().nonempty({ message: 'Confirm Password is required.' }).max(50),
    });

    await validator.validate();

    await validator.refine(async (data: Section1RegisterBusinessFormSchemaType) => {

        // Refine password
        if ((data.password && data.confirmPassword) && (data.password !== data.confirmPassword)) {
            validator.addIssue("confirmPassword", "Passwords do not match");
        }

        // Refine email
        if (data.email) {
            const emailExists = await db.user.findUnique({
                where: {
                    email: data.email.toLowerCase()
                }
            });

            if (emailExists) { validator.addIssue("email", "Email address exists already"); }
        }
    });

    if (!validator.isValid()) {
        return { isValid: false, errors: validator.errors };
    }

    return { isValid: true, errors: {} };
}

export async function validateBusinessRegistrationSection2(data: Section2RegisterBusinessFormSchemaType): Promise<{ isValid: boolean, errors: Partial<Record<keyof Section2RegisterBusinessFormSchemaType, string>> }> {

    const validator = new Validator<Section2RegisterBusinessFormSchemaType>(
        data, {
        businessName: z.string().nonempty({ message: 'Business Name is required.' }).max(50),
        businessDescription: z.string().nonempty({ message: 'Business Description is required.' }).max(1000),
        businessCuisineType: z.string().nonempty({ message: 'Cuisine Type is required.' }).max(50),
        businessType: z.string().refine((value) => businessTypes.some((c) => c.value === value), {
            message: 'Please select a valid business type.',
        }),

        locationName: z.string().max(50),
        locationStreet: z.string().nonempty({ message: 'Street is required.' }).max(50),
        locationPhoneNumber: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
        locationCity: z.string().nonempty({ message: 'City is required.' }).max(50),
        locationCountry: z.string().refine((value) => countries.some((c) => c.value === value), {
            message: 'Please select a valid country.',
        }),
        locationRegion: z.string().nonempty({ message: 'Region is required.' }).max(50),
        locationPostalCode: z.string().nonempty({ message: 'Postal code is required.' }).max(50),
    });

    if (!(await validator.validate())) {
        return { isValid: false, errors: validator.errors };
    }

    return { isValid: true, errors: {} };
}

export async function validateBusinessRegistrationSection3(data: Section3RegisterBusinessFormSchemaType): Promise<{ isValid: boolean, errors: Partial<Record<keyof Section3RegisterBusinessFormSchemaType, string>> }> {

    const validator = new Validator<Section3RegisterBusinessFormSchemaType>(
        data, {
        businessEmail: z.string().nonempty({ message: 'Business Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
        businessPhoneNumber: z.string().regex(/^$|^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
        businessWebsite: z.string().max(50),
        businessInstagram: z.string().nonempty({ message: 'Business Instagram is required' }).max(50),
    });

    await validator.validate();

    if (!(await validator.validate())) {
        return { isValid: false, errors: validator.errors };
    }

    return { isValid: true, errors: {} };
}


/*
* VALIDATE CREATOR REGISTRATION
*/
export async function validateCreatorRegistrationSection1(data: Section1RegisterCreatorFormSchemaType): Promise<{ isValid: boolean, errors: Partial<Record<keyof Section1RegisterCreatorFormSchemaType, string>> }> {

    const validator = new Validator<Section1RegisterCreatorFormSchemaType>(
        data, {
        email: z.string().nonempty({ message: 'Email is required' }).email({ message: 'Please enter a valid email.' }).max(50),
        password: z.string().nonempty({ message: 'Password is required.' }).min(8, { message: 'Password should be at least 8 characters long.' }).max(50),
        confirmPassword: z.string().nonempty({ message: 'Confirm Password is required.' }).max(50),

    });

    await validator.validate();

    await validator.refine(async (data: Section1RegisterCreatorFormSchemaType) => {

        // Refine password
        if ((data.password && data.confirmPassword) && (data.password !== data.confirmPassword)) {
            validator.addIssue("confirmPassword", "Passwords do not match");
        }

        // Refine email
        if (data.email) {
            const emailExists = await db.user.findUnique({
                where: {
                    email: data.email.toLowerCase()
                }
            });

            if (emailExists) { validator.addIssue("email", "Email address exists already"); }
        }
    });

    if (!validator.isValid()) {
        return { isValid: false, errors: validator.errors };
    }

    return { isValid: true, errors: {} };
}

export async function validateCreatorRegistrationSection2(data: Section2RegisterCreatorFormSchemaType): Promise<{ isValid: boolean, errors: Partial<Record<keyof Section2RegisterCreatorFormSchemaType, string>> }> {

    const validator = new Validator<Section2RegisterCreatorFormSchemaType>(
        data, {
        firstName: z.string().nonempty({ message: 'First Name is required.' }).max(50),
        lastName: z.string().nonempty({ message: 'Last Name is required.' }).max(50),
        phoneNumber: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, { message: 'Invalid phone number.' }),
        city: z.string().nonempty({ message: 'City is required.' }).max(50),
        country: z.string().refine((value) => countries.some((c) => c.value === value), {
            message: 'Please select a valid country.',
        }),
        region: z.string().nonempty({ message: 'Region is required.' }).max(50),
        postalCode: z.string().nonempty({ message: 'Postal code is required.' }).max(50),
    });

    if (!(await validator.validate())) {
        return { isValid: false, errors: validator.errors };
    }

    return { isValid: true, errors: {} };
}

export async function validateCreatorRegistrationSection3(data: Section3RegisterCreatorFormSchemaType): Promise<{ isValid: boolean, errors: Partial<Record<keyof Section3RegisterCreatorFormSchemaType, string>> }> {

    const validator = new Validator<Section3RegisterCreatorFormSchemaType>(
        data, {
        instagramHandle: z.string().nonempty({ message: 'Instagram Handle is required.' }).max(100),
    });

    await validator.validate();

    if (!(await validator.validate())) {
        return { isValid: false, errors: validator.errors };
    }

    return { isValid: true, errors: {} };
}


/*
* OTHERS
*/
export async function createMediaObject(data: UploadMediaSchemaType): Promise<{ isValid: boolean, errors: Partial<Record<keyof UploadMediaSchemaType, string>> }> {

    const validator = new Validator<UploadMediaSchemaType>(
        data, {
        url: z.string().nonempty({ message: 'Please provide at least 1 media.' }),
        permalink: z.string(),
        caption: z.string(),
        commentsCount: z.number(),
        likeCount: z.number(),
        thumbnail: z.string(),
        reach: z.number(),
        impressions: z.number(),
        totalInteractions: z.number(),
        creator: z.object({
            id: z.string().nonempty({ message: 'Please provide a creator' }),
        }),
        business: z.object({
            id: z.string().nonempty({ message: 'Please provide a business' }),
        }),
    });

    if (!(await validator.validate())) {
        return { isValid: false, errors: validator.errors };
    }


    await db.mediaObject.create({
        data: {
            type: data.mediaType,
            url: data.url,
            permalink: data.permalink,
            caption: data.caption,
            commentsCount: data.commentsCount,
            likeCount: data.likeCount,
            thumbnail: data.thumbnail,
            reach: data.reach,
            impressions: data.impressions,
            totalInteractions: data.totalInteractions,
            social: data.socialType,
            user: {
                connect: {
                    id: data.creator?.id
                }
            },
            business: {
                connect: {
                    id: data.business?.id
                }
            }
        }
    })

    return { isValid: true, errors: {} };
}

export async function updateCreatorApprovalStatus(creatorId: string, newStatus: ApprovalStatus) {

    const isAuthorized = await verifyUserIsAdmin();
    if (!isAuthorized) return;

    const user = await db.user.update({
        data: {
            approvalStatus: newStatus,
        },
        where: {
            id: creatorId
        }
    });


    if (newStatus == ApprovalStatus.APPROVED) {
        await onCreatorApproved(user);
        return;
    }

    if (newStatus == ApprovalStatus.UNSUCCESSFUL) {
        await onCreatorRejected(user);
        return;
    }
}

export async function updateBusinessApprovalStatus(businessId: string, newStatus: ApprovalStatus) {

    const isAuthorized = await verifyUserIsAdmin();
    if (!isAuthorized) return false;

    const business = await db.business.update({
        where: {
            id: businessId
        },
        data: {
            approvalStatus: newStatus
        }
    });

    const businessUsers = await db.user.findMany({
        where: {
            businessId: business.id
        },
    });

    for (const user of businessUsers) {

        await db.user.update({
            where: { id: user.id },
            data: {
                approvalStatus: newStatus
            }
        });

        if (newStatus === ApprovalStatus.APPROVED || newStatus === ApprovalStatus.UNSUCCESSFUL) {

            const message = ApprovalStatus.APPROVED ?
                `We are happy to inform you that your application has been approved. You can now sign into your account and use the ${process.env.NEXT_PUBLIC_NAME}`
                :
                "We are sorry to inform you that we have decided to not move forward with your application."

            // Send update account email to user
            try {
                const creatorAccountUpdatedComponent = <MainEmailTemplate
                    title="We Have An Update About Your Account!"
                    content={message}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    appName={process.env.NEXT_PUBLIC_NAME}
                    baseUrl={process.env.NEXT_PUBLIC_URL}
                />

                const userEmailResponse = await sendEmail({
                    to: user.email,
                    subject: `Update about your Application on ${process.env.NEXT_PUBLIC_NAME}`,
                    component: creatorAccountUpdatedComponent
                });

                console.error(userEmailResponse);
            } catch (err: any) {
                console.error(err);
            }
        }
    }
}

export async function createInstagramAccount(
    pageId: string,
    pageAccessToken: string,
    userAccessToken: string,
    userId: string,
    originalHandle: string // For verification
): Promise<{ isValid: boolean, instagramAccount: InstagramAccount | undefined, error: string }> {

    // Gather all the data
    const { isValid, data, error } = await getAllInstagramAccountData(pageId, pageAccessToken);

    if (!isValid || !data) {
        return {
            isValid: false,
            instagramAccount: undefined,
            error: error
        };
    }

    // Perform verification on the data

    // Check if the user already has an instagram account with us
    const existingAccount = await db.instagramAccount.findUnique({
        where: {
            userId: userId
        }
    })

    // If we found an existing account
    if (existingAccount) {
        if (existingAccount.businessAccountId !== data.businessAccountId) {
            return {
                isValid: false,
                instagramAccount: undefined,
                error: `You already have an instagram account registered with Greet (@${existingAccount.username}). Please login with that account to continue.`
            };
        }
    }

    // or if the user is trying to connect a different account from what they mentioned in the application (originalHandle)
    if (data.username !== originalHandle) {
        return {
            isValid: false,
            instagramAccount: undefined,
            error: `You are trying to connect the Instagram account @${data.username} but during your Greet application you provided another Instagram Account (@${originalHandle}). Please login with that account to continue, or contact us at info@greet.club if you are having any problems.`
        };
    }


    const instagramAccount = await db.instagramAccount.create({
        data: {
            pageId: pageId,
            businessAccountId: data.businessAccountId,
            pageAccessToken: pageAccessToken,
            userAccessToken: userAccessToken,
            name: data.name,
            biography: data.biography,
            followersCount: data.followersCount,
            profilePictureUrl: data.profilePictureUrl ? data.profilePictureUrl : "",
            username: data.username,
            totalImpressions: data.totalImpressions,
            totalReach: data.totalReach,
            totalProfileViews: data.totalProfileViews,
            totalFollowerCount: data.totalFollowerCount,
            topCountries: data.topCountries,
            topGenderAge: data.topGenderAge,
            topLocale: data.topLocale,
            user: {
                connect: {
                    id: userId
                }
            },
            expired: false,
        }
    });

    return {
        isValid: true,
        instagramAccount: instagramAccount,
        error: ""
    };
}

export async function refreshInstagramAccount(
    instagramAccountId: string // The greet instagram account mongo id
): Promise<{ isValid: boolean, instagramAccount: InstagramAccount | undefined, error: string }> {

    const toRefreshAccount = await db.instagramAccount.findUnique({
        where: {
            id: instagramAccountId
        }
    });

    if (!toRefreshAccount) {
        return {
            isValid: false,
            instagramAccount: undefined,
            error: `Could not find the instagram account with id ${instagramAccountId}`
        };
    }


    // Start the refresh process
    // Gather all the data
    const { isValid, data, error } = await getAllInstagramAccountData(toRefreshAccount.pageId, toRefreshAccount.pageAccessToken);

    if (!isValid || !data) {
        return {
            isValid: false,
            instagramAccount: undefined,
            error: error
        };
    }


    const updatedInstagramAccount = await db.instagramAccount.update({
        where:{
            id: toRefreshAccount.id
        },
        data: {
            businessAccountId: data.businessAccountId,
            name: data.name,
            biography: data.biography,
            followersCount: data.followersCount,
            profilePictureUrl: data.profilePictureUrl ? data.profilePictureUrl : "",
            username: data.username,
            totalImpressions: data.totalImpressions,
            totalReach: data.totalReach,
            totalProfileViews: data.totalProfileViews,
            totalFollowerCount: data.totalFollowerCount,
            topCountries: data.topCountries,
            topGenderAge: data.topGenderAge,
            topLocale: data.topLocale,
            expired: false,
        }
    });

    return {
        isValid: true,
        instagramAccount: updatedInstagramAccount,
        error: ""
    };

}

export async function getInstagramVerification(token: string) {
    return await db.instagramVerification.findFirst({
        where: {
            AND: [
                {
                    token: token,
                },
                {
                    active: true
                }
            ]
        }
    });
}

export async function deleteInstagramVerification(instagramVerification: InstagramVerification | null) {

    await db.instagramVerification.delete({
        where: {
            id: instagramVerification?.id
        }
    });
}
