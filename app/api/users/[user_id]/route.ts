import { authOptions } from "@/app/_utils/auth";
import { db } from "@/app/_utils/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { user_id: string }; }) {

    const isAuthorized = await verifyUserIsAuthorized(params.user_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const user = await db.user.findFirst({
        where: {
            id: params.user_id
        },
        include: {
            instagramAccount: true
        }
    })

    return NextResponse.json(user);
}

async function verifyUserIsAuthorized(user_id: string) {

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('session is null');
    const user = session.user;
    if (!user) throw new Error('user is null');

    // Check user is authorized
    return user.id === user_id;
}