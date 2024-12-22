
import { db } from "@/app/_utils/db";
import { NextResponse } from "next/server";

// THIS MUST BE AN API ROUTE. SERVER ACTION WON'T WORK IN THE MIDDLEWARE
export async function POST(req: Request) {
    
    const { userId } = await req.json();

    const instagramVerification = await db.instagramVerification.findFirst({
        where: {
            userId: userId || undefined
        }
    });

    return NextResponse.json({ isVerified: (instagramVerification == null), verification: instagramVerification });
}