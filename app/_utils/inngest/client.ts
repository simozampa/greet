import { EventSchemas, EventsFromOpts, Inngest } from "inngest";
import { BookingWithRelations } from "../db";
import { User } from "@prisma/client";
import { SendEventPayload } from "inngest/helpers/types";

type AppBooking = {
    data: {
        booking: BookingWithRelations,
        businessUser: User,
    }
}

type Events = {
    "greet/booking.created": AppBooking
    "greet/booking.canceled": AppBooking
    "greet/booking.approved": AppBooking
    "greet/booking.redeemed": AppBooking
    "greet/booking.declined": AppBooking
};

// Create a client to send and receive events
export const inngest = new Inngest({
    name: "greet",
    schemas: new EventSchemas().fromRecord<Events>(),
});