import { AnalyticsEventType, ApprovalStatus, BookingStatus, MediaType } from '@prisma/client';
import { DayData } from '../_utils';

export const creatorRegistrationSteps = [
    { id: "Step 1", name: "Identifiers", index: 0 },
    { id: "Step 2", name: "Info", index: 1 },
    { id: "Step 3", name: "Social", index: 2 },
];

export const businessRegistrationSteps = [
    { id: "Step 1", name: "Personal Info", index: 0 },
    { id: "Step 2", name: "Business Info", index: 1 },
    { id: "Step 3", name: "Business Contacts", index: 2 },
];

export const countries = [
    { label: "United States", value: "united-states" },
    // { label: 'Canada', value: 'canada' },
    // { label: 'Mexico', value: 'mexico' },
];

export const businessTypes = [
    { label: "In-Store", value: "in-store" },
    { label: "Delivery", value: "delivery" },
    { label: "Both", value: "both" },
];

export const daysData: DayData[] = [
    { slug: "monday", longName: "Monday", mediumName: "Mon", shortName: "M" },
    { slug: "tuesday", longName: "Tuesday", mediumName: "Tue", shortName: "T" },
    {
        slug: "wednesday",
        longName: "Wednesday",
        mediumName: "Wed",
        shortName: "W",
    },
    { slug: "thursday", longName: "Thursday", mediumName: "Thu", shortName: "T" },
    { slug: "friday", longName: "Friday", mediumName: "Fri", shortName: "F" },
    { slug: "saturday", longName: "Saturday", mediumName: "Sat", shortName: "S" },
    { slug: "sunday", longName: "Sunday", mediumName: "Sun", shortName: "S" },
];

export const approvalStatusBadges = [
    {
        status: ApprovalStatus.APPROVED,
        name: "Approved",
        class: "bg-green-50 ring-green-600/20 text-green-700",
    },
    {
        status: ApprovalStatus.PENDING,
        name: "Pending",
        class: "bg-yellow-50 ring-yellow-600/20 text-yellow-700",
    },
    {
        status: ApprovalStatus.UNSUCCESSFUL,
        name: "Unsuccessful",
        class: "bg-red-50 ring-red-600/20 text-red-700",
    },
];

export const bookingStatusBadges = [
    {
        status: BookingStatus.APPROVED,
        name: "Approved",
        class: "bg-green-50 ring-green-600/20 text-green-700",
    },
    {
        status: BookingStatus.PENDING,
        name: "Pending",
        class: "bg-yellow-50 ring-yellow-600/20 text-yellow-700",
    },
    {
        status: BookingStatus.UNSUCCESSFUL,
        name: "Unsuccessful",
        class: "bg-red-50 ring-red-600/20 text-red-700",
    },
    {
        status: BookingStatus.COMPLETED,
        name: "Completed",
        class: "bg-blue-50 ring-blue-600/20 text-blue-700",
    },
];

export const analyticsEventTypeBadges = [
    { type: AnalyticsEventType.SUCCESS, name: 'Success', class: 'bg-green-50 ring-green-600/20 text-green-700' },
    { type: AnalyticsEventType.IMPORTANT, name: 'Important', class: 'bg-yellow-50 ring-yellow-600/20 text-yellow-700' },
    { type: AnalyticsEventType.ERROR, name: 'Error', class: 'bg-red-50 ring-red-600/20 text-red-700' },
    { type: AnalyticsEventType.INFO, name: 'Info', class: 'bg-blue-50 ring-blue-600/20 text-blue-700' },
]

export const contentTypeBadges = [
    { type: MediaType.POST, name: 'Post', class: 'bg-green-50 ring-green-600/20 text-green-700' },
    { type: MediaType.REEL, name: 'Reel', class: 'bg-yellow-50 ring-yellow-600/20 text-yellow-700' },
    { type: MediaType.STORY, name: 'Story', class: 'bg-red-50 ring-red-600/20 text-red-700' },
    { type: MediaType.TIKTOK, name: 'TikTok', class: 'bg-blue-50 ring-blue-600/20 text-blue-700' },
]

export function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}