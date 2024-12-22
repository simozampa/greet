import { db } from '@/app/_utils/db';
import { validateBusinessRegistrationSection2, validateBusinessRegistrationSection3 } from '@/app/actions';
import { ApprovalStatus, Business, Location } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    // TODO - CSRF
    const {
        name,
        description,
        cuisineType,
        type,
        email,
        phoneNumber,
        website,
        instagram,
        tiktok,
        locationName,
        locationPhoneNumber,
        locationStreet,
        locationCity,
        locationCountry,
        locationRegion,
        locationPostalCode,
        logo
    } = await req.json();

    const validation2Result = await validateBusinessRegistrationSection2(
        {
            businessName: name,
            businessDescription: description,
            businessCuisineType: cuisineType,
            businessType: type,

            locationName: locationName,
            locationPhoneNumber: locationPhoneNumber,
            locationStreet: locationStreet,
            locationCity: locationCity,
            locationCountry: locationCountry,
            locationRegion: locationRegion,
            locationPostalCode: locationPostalCode,
        }
    );

    const validation3Result = await validateBusinessRegistrationSection3(
        {
            businessEmail: email,
            businessPhoneNumber: phoneNumber,
            businessWebsite: website,
            businessInstagram: instagram,
            businessTiktok: tiktok,
        }
    );

    if ((!validation2Result.isValid) || (!validation3Result.isValid)) {
        return NextResponse.json({ errors: {...validation2Result.errors, ...validation3Result.errors} }, { status: 400 });
    }

    try {

        // First we create the business
        const business: Business = await db.business.create({
            data: {
                name: name,
                description: description,
                email: email,
                phoneNumber: phoneNumber,
                cuisineType: cuisineType,
                type: type,
                website: website,
                instagram: instagram,
                tiktok: tiktok,
                approvalStatus: ApprovalStatus.PENDING,
                logo: logo ? logo : ""
            },
        });

        //Then we create the location and we link it to the business
        const location: Location = await db.location.create({
            data: {
                name: locationName,
                street: locationStreet,
                city: locationCity,
                country: locationCountry,
                region: locationRegion,
                postalCode: locationPostalCode,
                phoneNumber: locationPhoneNumber,
                openingHours: [],
                business: {
                    connect: { id: business.id }
                }
            }
        });

        return NextResponse.json({ business: business, location: location });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ errors: {}, submitErrror: 'An error occurred while creating the business. Please try again later.' }, { status: 400 });
    }
}