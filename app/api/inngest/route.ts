import { serve } from "inngest/next";
import { inngest } from "@/app/_utils/inngest/client";
import { createBooking, cancelBooking, approveBooking, redeemBooking, updateInstagramAccounts, declineBooking } from "@/app/_utils/inngest/functions";

export const { GET, POST, PUT } = serve(inngest, [
  createBooking,
  cancelBooking,
  approveBooking,
  redeemBooking,
  declineBooking,
  updateInstagramAccounts,
],
  {
    // Your digitalocean hostname.  This is required otherwise your functions won't work.
    serveHost: process.env.NEXT_PUBLIC_URL,
    // And your DO path, also required.
    servePath: "/api/inngest",
  }
);