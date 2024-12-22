import { NextResponse } from "next/server";
import { twilio } from "@/app/_utils/twilio";
import { verifyServerRequest } from "@/app/_utils/helpers";

export async function POST(req: Request) {

    const serverRequestValidation = await verifyServerRequest(req.clone());

    if (!serverRequestValidation.isValid) {
        return NextResponse.json({ error: serverRequestValidation.error }, { status: 400 });
    }

    const { messageBody, phoneNumber } = await req.json();

    const message = await twilio.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });

    return NextResponse.json(message.status);
}