import { db } from "@/app/_utils/db";
import { Validator } from "@/app/_utils/validation";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/auth";
import { ZodRawShape, z } from "zod";
import { UpdateUserPasswordFormSchemaType } from "@/app/_components/UpdatePasswordForm";

export async function PUT(req: Request, { params }: { params: { user_id: string }; }) {

    const isAuthorized = await verifyUserIsAuthorized(params.user_id);
    if (!isAuthorized) return NextResponse.json([], { status: 400 });

    const user = await db.user.findFirst({
        where: {
            id: params.user_id
        },
    });

    if (!user) {
        return NextResponse.json({ submitError: "Not found" }, { status: 404 });
    }

    const {
        oldPassword,
        newPassword,
        confirmNewPassword,
    } = await req.json()

    const validator = new Validator<UpdateUserPasswordFormSchemaType>(
        {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword,
        },
        {
            oldPassword: z.string().nonempty({ message: 'Old Password is required.' }).max(50),
            newPassword: z.string().nonempty({ message: 'New Password is required.' }).min(8, { message: 'New Password should be at least 8 characters long.' }).max(50),
            confirmNewPassword: z.string().nonempty({ message: 'Confirm Password is required.' }).max(50),
        } as ZodRawShape
    );

    // First we validate the data
    await validator.validate();

    // Then we refine
    await validator.refine(async (data: UpdateUserPasswordFormSchemaType) => {

        // Check password
        if (data.newPassword !== data.confirmNewPassword) {
            validator.addIssue("confirmNewPassword", "Passwords do not match");
        }

        // Check if the old Password corresponds
        const validOldPassword = await bcrypt.compare(
            data.oldPassword || "", // unhashed password
            user?.password || "", // hashed password
        );

        if (!validOldPassword) {
            validator.addIssue("oldPassword", "Old Password does not match");
        }
    });
    
    // Finally we check if everything is ok!
    if (!validator.isValid()) {
        return NextResponse.json({ errors: validator.errors }, { status: 400 });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await db.user.update({
        where: { id: params.user_id },
        data: {
            password: encryptedPassword
        },
    })

    return NextResponse.json(updatedUser);
}

async function verifyUserIsAuthorized(user_id: string) {

    const session = await getServerSession(authOptions);
    if (!session) throw new Error('session is null');
    const user = session.user;
    if (!user) throw new Error('user is null');

    // Check user is authorized
    return user.id === user_id;
}