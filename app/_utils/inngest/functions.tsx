
import MainEmailTemplate from '@/mail-templates/emails/main-template';
import { sendEmail } from "../sendgrid";
import { inngest } from "./client";
import { db } from '../db';
import { BookingStatus } from '@prisma/client';
import { randomBytes } from 'crypto';
import { generateServerSignature } from '../helpers';
import { refreshInstagramAccount } from '@/app/actions';

// Testing
export const createBooking = inngest.createFunction(
  {
    name: "Booking Created",
    cancelOn: [
      { event: "greet/booking.canceled", match: "data.booking.id" },
      { event: "greet/booking.declined", match: "data.booking.id" },
      { event: "greet/booking.approved", match: "data.booking.id" },
    ] as any,
  },
  { event: "greet/booking.created" },
  async ({ event, step }) => {
    const booking = event.data.booking;

    await step.run("Send email to business", async () => {

      const sendEmailToBusinessComponent = <MainEmailTemplate
        title={`You received a new application`}
        content={
          `${booking.user.firstName} ${booking.user.lastName} (@${booking.user.instagramAccount?.username}) applied to your listing, ${booking.listing.title}!
           Log into Greet to see the application details.`
        }
        firstName={event.data.businessUser.firstName || booking.business.name}
        lastName={event.data.businessUser.lastName || ''}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        actionTitle='Login'
        actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
      />

      await sendEmail({
        to: event.data.businessUser.email,
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        subject: `New Application Received - ${process.env.NEXT_PUBLIC_NAME}`,
        component: sendEmailToBusinessComponent
      });
    });

    await step.run("Send email to creator", async () => {

      const sendEmailToCreatorComponent = <MainEmailTemplate
        title={`Thank you for submitting an application for ${booking.business.name}`}
        content={
          `You've successfully applied for ${booking.listing.title}.
          We're excited to let you know that ${booking.business.name} will be reviewing your application shortly.
          Please log in to your Greet account to view the details of your application.`
        }
        firstName={booking.user.firstName}
        lastName={booking.user.lastName}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        actionTitle='Login'
        actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
      />

      await sendEmail({
        to: booking.user.email,
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        subject: `Your ${booking.business.name} Application - ${process.env.NEXT_PUBLIC_NAME}`,
        component: sendEmailToCreatorComponent
      });
    });

    if (!booking.listing.redeemAnytime) {
      const timeSlots = booking.timeSlots;
      if (!timeSlots) return;
      let latestDate = null;
      for (let i = 0; i < Object.entries(timeSlots).length; i++) {
        const d = Object.entries(timeSlots)[i][0];
        const date = new Date(d);
        if (!latestDate || date > latestDate) {
          latestDate = date;
        }
      }
      if (!latestDate) return;

      // TEMP: UTC -> PST
      latestDate.setHours(latestDate.getHours() + 7);

      await step.sleepUntil(latestDate);

      await step.run("Set the booking as unsuccessful", async () => {
        await db.booking.update({
          where: {
            id: booking.id
          },
          data: {
            status: BookingStatus.UNSUCCESSFUL
          }
        });
      })
    }
  }
);

export const cancelBooking = inngest.createFunction(
  { name: "Booking Cancelled" },
  { event: "greet/booking.canceled" },
  async ({ event, step }) => {
    const booking = event.data.booking;

    await step.run("Send email to business", async () => {

      const bookingCancelledBusinessComponent = <MainEmailTemplate
        title={`Your booking has been canceled`}
        content={
          `The confirmed booking for ${booking.user.firstName} ${booking.user.lastName} (@${booking.user.instagramAccount?.username}) regarding the listing ${booking.listing.title} has unfortunately been cancelled.
          Should you suspect any misunderstanding, please feel free to get in touch with us at info@greet.club or via our website.`
        }
        firstName={event.data.businessUser.firstName || booking.business.name}
        lastName={event.data.businessUser.lastName || ''}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        actionTitle='Login'
        actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
      />

      await sendEmail({
        to: event.data.businessUser.email,
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        subject: `Booking Canceled - ${process.env.NEXT_PUBLIC_NAME}`,
        component: bookingCancelledBusinessComponent
      });
    });

    await step.run("Send email to creator", async () => {

      const bookingCancelledCreatorComponent = <MainEmailTemplate
        title={`Your booking has been canceled`}
        content={
          `We regret to inform you that your booking for ${booking.listing.title} at ${booking.business.name} has been cancelled.
          If this cancellation was unexpected or you believe there might have been an error, please don't hesitate to reach out to us. 
          You can contact us at info@greet.club or via our website.`
        }
        firstName={booking.user.firstName}
        lastName={booking.user.lastName}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        actionTitle='Login'
        actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
      />

      await sendEmail({
        to: booking.user.email,
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        subject: `Booking Canceled - ${process.env.NEXT_PUBLIC_NAME}`,
        component: bookingCancelledCreatorComponent
      });
    });

    // Send SMSs
    await step.run("Send SMS to creator", async () => {

      const salt = randomBytes(16).toString('hex');
      const body = JSON.stringify({
        messageBody: `GREET - We regret to inform you that your booking at ${booking.business.name} has been canceled. Please contact us for assitance.`,
        phoneNumber: booking.user.phoneNumber,
      });

      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/twilio`, {
        method: 'POST',
        headers: {
          "X-SALT": salt,
          "X-SIGNATURE": generateServerSignature(salt, body),
        },
        body: body
      });
    });

    await step.run("Send SMS to business", async () => {

      const salt = randomBytes(16).toString('hex');
      const body = JSON.stringify({
        messageBody: `GREET - We regret to inform you that your booking with ${booking.user.firstName} ${booking.user.lastName} (@${booking.user.instagramAccount?.username}) has been canceled. Please contact us for assistance.`,
        phoneNumber: event.data.businessUser.phoneNumber,
      });

      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/twilio`, {
        method: 'POST',
        headers: {
          "X-SALT": salt,
          "X-SIGNATURE": generateServerSignature(salt, body),
        },
        body: body
      });
    });

  }
);

export const approveBooking = inngest.createFunction(
  {
    name: "Booking Approved",
    cancelOn: [
      { event: "greet/booking.canceled", match: "data.booking.id" },
    ] as any,
  },
  { event: "greet/booking.approved" },
  async ({ event, step }) => {
    const booking = event.data.booking;

    if (booking.listing.redeemAnytime) {

      await step.run("Send email to business", async () => {

        const sendEmailToBusinessComponent = <MainEmailTemplate
          title={`Thank you for approving a booking`}
          content={
            `Great news! An application for your listing, ${booking.listing.title}, has been successfully approved. 
            You'll receive notifications as soon as the offer is redeemed. To review the booking details, please log in to your account.
            Thank you for using Greet.`
          }
          firstName={event.data.businessUser.firstName || booking.business.name}
          lastName={event.data.businessUser.lastName || ''}
          appName={process.env.NEXT_PUBLIC_NAME}
          baseUrl={process.env.NEXT_PUBLIC_URL}
          actionTitle='Login'
          actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
        />

        await sendEmail({
          to: event.data.businessUser.email,
          from: process.env.NEXT_PUBLIC_FROM_EMAIL,
          subject: `Booking Confirmation - ${process.env.NEXT_PUBLIC_NAME}`,
          component: sendEmailToBusinessComponent
        });
      });

      await step.run("Send email to creator", async () => {

        const sendEmailToCreatorComponent = <MainEmailTemplate
          title={`${booking.business.name} approved your application`}
          content={
            `Good news! Your application for the listing titled '${booking.listing.title}' by ${booking.business.name} has been approved. 
            You're all set to redeem this offer whenever it suits you. We're looking forward to your upcoming visit.
            For all the booking details, kindly log in to your account. Thank you for using Greet.`
          }
          firstName={booking.user.firstName}
          lastName={booking.user.lastName}
          appName={process.env.NEXT_PUBLIC_NAME}
          baseUrl={process.env.NEXT_PUBLIC_URL}
          actionTitle='Sign n'
          actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
        />

        await sendEmail({
          to: booking.user.email,
          from: process.env.NEXT_PUBLIC_FROM_EMAIL,
          subject: `Booking Approved - ${process.env.NEXT_PUBLIC_NAME}`,
          component: sendEmailToCreatorComponent
        });
      });

    } else if (!booking.listing.redeemAnytime && booking.confirmedSlot) {

      await step.run("Send email to business", async () => {

        const sendEmailToBusinessComponent = <MainEmailTemplate
          title={`Thank you for approving a booking`}
          content={
            `Great news! An application for your listing, ${booking.listing.title}, has been successfully approved. 
            You've successfully confirmed the booking with ${booking.user.firstName} ${booking.user.lastName} (@${booking.user.instagramAccount?.username}) for ${booking.confirmedSlot}.
            To review the booking details, please log in to your account. Thank you for using Greet.`
          }
          firstName={event.data.businessUser.firstName || booking.business.name}
          lastName={event.data.businessUser.lastName || ''}
          appName={process.env.NEXT_PUBLIC_NAME}
          baseUrl={process.env.NEXT_PUBLIC_URL}
          actionTitle='Login'
          actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
        />

        await sendEmail({
          to: event.data.businessUser.email,
          from: process.env.NEXT_PUBLIC_FROM_EMAIL,
          subject: `Booking Confirmation - ${process.env.NEXT_PUBLIC_NAME}`,
          component: sendEmailToBusinessComponent
        });
      });

      await step.run("Send email to creator", async () => {

        const sendEmailToCreatorComponent = <MainEmailTemplate
          title={`${booking.business.name} approved your application`}
          content={
            `Good news! Your application for the listing titled '${booking.listing.title}' by ${booking.business.name} has been approved. 
            Your booking is confirmed for ${booking.confirmedSlot}, and we're eagerly anticipating your upcoming visit.
            For all the booking details, kindly log in to your Greet account. We're here to assist if you need anything.`
          }
          firstName={booking.user.firstName}
          lastName={booking.user.lastName}
          appName={process.env.NEXT_PUBLIC_NAME}
          baseUrl={process.env.NEXT_PUBLIC_URL}
          actionTitle='Sign n'
          actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
        />

        await sendEmail({
          to: booking.user.email,
          from: process.env.NEXT_PUBLIC_FROM_EMAIL,
          subject: `Booking Approved - ${process.env.NEXT_PUBLIC_NAME}`,
          component: sendEmailToCreatorComponent
        });
      });

      const [datePart, timePart] = booking.confirmedSlot.split(' - ');
      const dateWithoutDay = datePart.slice(datePart.indexOf(' ') + 1); // Remove the day of the week

      // wait until 24hrs before to send reminder via email
      const prevDay = new Date(`${dateWithoutDay} ${timePart}`);
      prevDay.setDate(prevDay.getDate() - 1);

      // TEMP: UTC -> PST
      prevDay.setHours(prevDay.getHours() + 7);

      await step.sleepUntil(prevDay);

      // Send emails
      await step.run("Send email to business", async () => {

        const sendEmailToBusinessComponent = <MainEmailTemplate
          title={`This is a reminder for your booking tomorrow`}
          content={
            `In just 24 hours, ${booking.user.firstName} ${booking.user.lastName} (@${booking.user.instagramAccount?.username}) is scheduled to visit. The booking is confirmed for ${booking.confirmedSlot}. 
            Your warm welcome awaits! For a quick refresher on the booking, kindly log in to your account. We're here to ensure everything goes smoothly. Thank you for trusting Greet!`
          }
          firstName={event.data.businessUser.firstName || booking.business.name}
          lastName={event.data.businessUser.lastName || ''}
          appName={process.env.NEXT_PUBLIC_NAME}
          baseUrl={process.env.NEXT_PUBLIC_URL}
          actionTitle='Login'
          actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
        />

        await sendEmail({
          to: event.data.businessUser.email,
          from: process.env.NEXT_PUBLIC_FROM_EMAIL,
          subject: `Your Booking Tomorrow - ${process.env.NEXT_PUBLIC_NAME}`,
          component: sendEmailToBusinessComponent
        });
      });

      await step.run("Send email to creator", async () => {
        const sendEmailToCreatorComponent = <MainEmailTemplate
          title={`This is a reminder for your booking tomorrow`}
          content={
            `Just a day away, your scheduled visit to ${booking.business.name} on ${booking.confirmedSlot} is right around the corner. We're eagerly awaiting your arrival!
            For a quick rundown of your booking details, please log in to your account. We appreciate you for trusting Greet!`
          }
          firstName={booking.user.firstName}
          lastName={booking.user.lastName}
          appName={process.env.NEXT_PUBLIC_NAME}
          baseUrl={process.env.NEXT_PUBLIC_URL}
          actionTitle='Login'
          actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
        />

        await sendEmail({
          to: booking.user.email,
          from: process.env.NEXT_PUBLIC_FROM_EMAIL,
          subject: `Your Booking Tomorrow - ${process.env.NEXT_PUBLIC_NAME}`,
          component: sendEmailToCreatorComponent
        });
      });

      // Wait until one hour before to send reminder via SMS
      const prevHour = new Date(`${dateWithoutDay} ${timePart}`);
      prevHour.setHours(prevHour.getHours() - 1);

      // TEMP: UTC -> PST
      prevHour.setHours(prevHour.getHours() + 7);

      await step.sleepUntil(prevHour);

      // Send SMSs
      await step.run("Send SMS to creator", async () => {

        const salt = randomBytes(16).toString('hex');
        const body = JSON.stringify({
          messageBody: `GREET - Reminder, your booking at ${booking.business.name} is due in an hour. For more: https://www.greet.club/bookings/${booking.id}`,
          phoneNumber: booking.user.phoneNumber,
        });

        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/twilio`, {
          method: 'POST',
          headers: {
            "X-SALT": salt,
            "X-SIGNATURE": generateServerSignature(salt, body),
          },
          body: body
        });
      });

      await step.run("Send SMS to business", async () => {

        const salt = randomBytes(16).toString('hex');
        const body = JSON.stringify({
          messageBody: `GREET - Reminder, your booking with ${booking.user.firstName} ${booking.user.lastName} (@${booking.user.instagramAccount?.username}) is due in an hour`,
          phoneNumber: event.data.businessUser.phoneNumber,
        });

        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/twilio`, {
          method: 'POST',
          headers: {
            "X-SALT": salt,
            "X-SIGNATURE": generateServerSignature(salt, body),
          },
          body: body
        });
      });

      // we set the date to 4 hours after to expire booking
      const later = new Date(`${dateWithoutDay} ${timePart}`);
      later.setHours(later.getHours() + 4);

      // TEMP: UTC -> PST
      later.setHours(later.getHours() + 7);

      await step.sleepUntil(later)

      // Update booking to COMPLETE
      await step.run("Update booking to complete", async () => {

        await db.booking.update({
          where: {
            id: booking.id
          },
          data: {
            status: BookingStatus.COMPLETED
          }
        });
      });

    }

  }
);

export const declineBooking = inngest.createFunction(
  {
    name: "Booking Declined",
  },
  { event: "greet/booking.declined" },
  async ({ event, step }) => {
    const booking = event.data.booking;

    await step.run("Send email to creator", async () => {

      const sendEmailToCreatorComponent = <MainEmailTemplate
        title={`Unfortunately, your application was not successful.`}
        content={
          `We regret to inform you that ${booking.business.name} has chosen not to proceed with your application for ${booking.listing.title} at this time. 
          We encourage you to consider applying to other available listings.
          Thank you for your interest and participation. We look forward to the possibility of working together in the future.`
        }
        firstName={booking.user.firstName}
        lastName={booking.user.lastName}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        actionTitle='Login'
        actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
      />

      return await sendEmail({
        to: booking.user.email,
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        subject: `Your Application - ${process.env.NEXT_PUBLIC_NAME}`,
        component: sendEmailToCreatorComponent
      });
    });

  }
);

export const redeemBooking = inngest.createFunction(
  {
    name: "Booking Redeemed",
    cancelOn: [
      { event: "greet/booking.canceled", match: "data.booking.id" },
    ] as any,
  },
  { event: "greet/booking.redeemed" },
  async ({ event, step }) => {
    const booking = event.data.booking;

    await step.run("Send email to business", async () => {

      const sendEmailToBusinessComponent = <MainEmailTemplate
        title={`@${booking.user.instagramAccount?.username} redeemed your offer`}
        content={
          `Exciting News: 
          ${booking.user.firstName} ${booking.user.lastName} (@${booking.user.instagramAccount?.username}) has successfully redeemed your offer (${booking.listing.title}) at ${booking.business.name}!
          Be prepared for their visit within the next 24 hours. `
        }
        firstName={event.data.businessUser.firstName || booking.business.name}
        lastName={event.data.businessUser.lastName || ''}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        actionTitle='Login'
        actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
      />

      return await sendEmail({
        to: event.data.businessUser.email,
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        subject: `Booking Redeemed - ${process.env.NEXT_PUBLIC_NAME}`,
        component: sendEmailToBusinessComponent
      });
    });

    await step.run("Send email to creator", async () => {

      const sendEmailToCreatorComponent = <MainEmailTemplate
        title={`You just redeemd an offer`}
        content={
          `Thank You for Redeeming ${booking.listing.title} at ${booking.business.name}. Your Visit is Welcome within the Next 24 Hours.
          Please log in to Greet to view the complete booking details. If you have any queries, feel free to reach out.`
        }
        firstName={booking.user.firstName}
        lastName={booking.user.lastName}
        appName={process.env.NEXT_PUBLIC_NAME}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        actionTitle='Login'
        actionUrl={`${process.env.NEXT_PUBLIC_URL}/login`}
      />

      return await sendEmail({
        to: booking.user.email,
        from: process.env.NEXT_PUBLIC_FROM_EMAIL,
        subject: `Booking Redemeed - ${process.env.NEXT_PUBLIC_NAME}`,
        component: sendEmailToCreatorComponent
      });
    });

    // Send SMSs
    await step.run("Send SMS to creator", async () => {

      const salt = randomBytes(16).toString('hex');
      const body = JSON.stringify({
        messageBody: `GREET - Thank you for redeeming the offer. You have 24hrs to visit ${booking.business.name}. For more: https://www.greet.club/bookings/${booking.id}`,
        phoneNumber: booking.user.phoneNumber,
      });

      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/twilio`, {
        method: 'POST',
        headers: {
          "X-SALT": salt,
          "X-SIGNATURE": generateServerSignature(salt, body),
        },
        body: body
      });

    });

    await step.run("Send SMS to business", async () => {

      const salt = randomBytes(16).toString('hex');
      const body = JSON.stringify({
        messageBody: `GREET - ${booking.user.firstName} ${booking.user.lastName} (@${booking.user.instagramAccount?.username}) just redeemed your offer. Expect a visit in the next 24hrs.`,
        phoneNumber: event.data.businessUser.phoneNumber,
      });

      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/twilio`, {
        method: 'POST',
        headers: {
          "X-SALT": salt,
          "X-SIGNATURE": generateServerSignature(salt, body),
        },
        body: body
      });
    });

    await step.sleep("1 day");

    await db.booking.update({
      where: {
        id: booking.id
      },
      data: {
        status: BookingStatus.COMPLETED
      }
    });

  }
);

export const updateInstagramAccounts = inngest.createFunction(
  { name: "Update Instagram Accounts" },
  { cron: "TZ=America/Los_Angeles 0 12 */2 * *" }, // Every 2 days in Los Angeles
  // { cron: "TZ=America/Los_Angeles * * * * *" }, // Every minute
  async ({ step }) => {

    await step.run("Update Instagram Accounts", async () => {

      const instagramAccounts = await db.instagramAccount.findMany();

      for (let i = 0; i < instagramAccounts.length; i++) {
        try {
          await refreshInstagramAccount(instagramAccounts[i].id);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
);