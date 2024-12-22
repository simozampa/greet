import { AnalyticsEventType } from "@prisma/client";
import { db } from "./db";

let env_check = process.env.TRACK_ANALYTICS === "true";

let actions = {
    trackEvent: async (eventName: string, eventType?: AnalyticsEventType, data?: object) => {
        if (!env_check) return;

        try {
            await db.analyticsEvent.create({
                data: {
                    eventName: eventName,
                    eventType: eventType,
                    data: data ? JSON.stringify(data) : undefined,
                },
            });
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    },
    trackDistinctIdEvent: async (distincId: string, eventName: string, eventType?: AnalyticsEventType, data?: object) => {

        if (!env_check) return;

        try {
            await db.analyticsEvent.create({
                data: {
                    distinctId: distincId,
                    eventName: eventName,
                    eventType: eventType,
                    data: data ? JSON.stringify(data) : undefined,
                },
            });
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    },
};

export let Analytics = actions;