import { clsx, type ClassValue } from "clsx";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { analyticsEventTypeBadges, approvalStatusBadges, bookingStatusBadges, businessTypes, contentTypeBadges } from "./constants";
import { createHash } from "crypto";
import { AnalyticsEventType, ApprovalStatus, BookingStatus, MediaType } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getIntParam(url: URL, name: string) {
    const intParam = url.searchParams.get(name);

    if (!intParam) return null;

    const int = parseInt(intParam, 10);
    if (isNaN(int)) return null;

    return int;
}

export function getStrParam(url: URL, name: string) {
    const strParam = url.searchParams.get(name);

    if (!strParam) return null;

    return strParam;
}

export function getBoolParam(url: URL, name: string) {
    const strParam = url.searchParams.get(name);

    if (!strParam) return null;

    if (strParam.toLowerCase() === "true") return true;

    if (strParam.toLowerCase() === "false") return false;

    return null;
}

export function loginRedirect(session: Session | null) {
    if (!session) {
        return;
    }

    switch (session.user?.role?.slug) {
        case "admin":
            redirect("/dashboard/admin");
        case "business-owner":
            redirect("/dashboard");
        case "creator":
            redirect("/listings");
        default:
            break;
    }
}

export function getBusinessTypeName(value: string) {
    const foundItem = businessTypes.find((item) => item.value === value);
    return foundItem ? foundItem.label : "Invalid Type";
}

export async function readFile(file: File) {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const fileData = reader.result;
            resolve(fileData);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

export function isFormDataEmpty(formData: FormData): boolean {
    const entriesIterator = formData.entries();
    return entriesIterator.next().done !== false;
}

export function formatInstagramMetric(num: number | undefined) {
    if (!num || num === 0) return '0';

    const absNum = Math.abs(num);
    const suffixes = ["", "k", "M", "B", "T"]; // Add more suffixes as needed

    // Find the appropriate suffix based on the number's magnitude
    const suffixIndex = Math.floor(Math.log10(absNum) / 3);

    // Calculate the scaled number
    const scaledNum = num / Math.pow(1000, suffixIndex);

    // Round to two decimal places
    const roundedNum = Math.round(scaledNum * 100) / 100;

    return roundedNum.toString() + suffixes[suffixIndex];
}

export async function verifyServerRequest(
    req: Request
): Promise<{ isValid: boolean; error: string }> {
    const salt = req.headers.get("X-SALT");
    const signature = req.headers.get("X-SIGNATURE");

    if (!salt) {
        return { isValid: false, error: "Missing salt." };
    }
    if (!signature) {
        return { isValid: false, error: "Missing signature." };
    }

    const body = await req.json();
    const digest = generateServerSignature(salt, JSON.stringify(body));

    if (digest !== signature) {
        return { isValid: false, error: "Invalid signature." };
    }

    // // Check if the signature has expired
    // if (!body.expireOn || new Date(body.expireOn).getTime() <= Date.now()) {
    //     return { isValid: false, error: "Expired signature." };
    // }

    return { isValid: true, error: "" };
}

export function generateServerSignature(salt: string, body: string): string {
    //SHA256("<secret>.<salt>.<body>")
    const hashString = `${process.env.GREET_ACCESS_TOKEN}.${salt}.${body}`;
    // Create and return digest
    const signature = createHash("sha256").update(hashString).digest("hex");
    return signature;
}

export function getInitials(fullName: string | null | undefined): string {
    if (!fullName) return "";

    const nameParts = fullName.trim().split(" ");

    if (nameParts.length === 1) {
        return nameParts[0].charAt(0);
    } else if (nameParts.length >= 2) {
        return nameParts[0].charAt(0) + nameParts[1].charAt(0);
    } else {
        return ""; // Handle edge cases where no initials can be determined
    }
}


export function getApprovalStatusBadge(status: ApprovalStatus) {
    const badge = approvalStatusBadges.find((x) => x.status === status);

    if (!badge) return (<></>);

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badge?.class}`}>
            {badge.name}
        </span>
    );
}

export function getAnalyticsEventsTypeBadge(eventType: AnalyticsEventType) {
    const badge = analyticsEventTypeBadges.find((x) => x.type === eventType);

    if (!badge) return (<></>);

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badge?.class}`}>
            {badge.name}
        </span>
    );
}

export function getInstagramVerifiedBadge(verified: boolean) {

    const classes = verified ? "bg-green-50 ring-green-600/20 text-green-700" : "bg-red-50 ring-red-600/20 text-red-700";
    const text = verified ? "Verified" : "Needs Verification";

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${classes}`}>
            {text}
        </span>
    );
}

export function getBookingStatusBadge(status: BookingStatus) {
    const badge = bookingStatusBadges.find((x) => x.status === status);

    if (!badge) return (<></>);

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badge?.class}`}>
            {badge.name}
        </span>
    );
}

export function getConentTypeBage(type: MediaType) {
    const badge = contentTypeBadges.find((x) => x.type === type);

    if (!badge) return (<></>);

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badge?.class}`}>
            {badge.name}
        </span>
    );
}