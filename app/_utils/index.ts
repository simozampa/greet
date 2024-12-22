
// Facebook Javascript API
declare global {
    interface Window {
        FB: any;
        fbAsyncInit: any
    }
}

export type FacebookAuthResponse = {
    authResponse: any,
    status: string
}

export type SelectOption = {
    value: string;
    label: string;
};

export type OpeningHour = {
    label: string,
    open: string,
    close: string
};

export type DaySlug = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type DayData = {
    slug: DaySlug;
    longName: string;
    mediumName: string;
    shortName: string;
};

export type Availability = {
    [K in DaySlug]: string[];
};

export type DateAndTimeSlots = {
    [date: string]: string[];
};

export type InstagramInsightElement = {
    key: string
    value: number
}