import { render } from "@react-email/render";
import { ReactElement } from "react";
import sendgrid from "@sendgrid/mail";

interface EmailParams {
  from?: string;
  to: string;
  subject: string;
  component: ReactElement;
}

export async function sendEmail(params: EmailParams) {
  if (process.env.SEND_EMAILS === "false") {
    console.warn("SEND_EMAILS is false, returning");
    return;
  }

  const {
    from = process.env.NEXT_PUBLIC_FROM_EMAIL,
    to,
    subject,
    component,
  } = params;

  if (!from) {
    throw new Error("Missing From Parameter!");
  }

  const html = render(component, {
    pretty: true,
  });


  try {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY || "");
    const emailResponse = await sendgrid.send({
      to: to.includes("@greet.club") ? "info@greet.club" : to,  // To support managed businesses:
      from: from,
      subject: subject,
      html: html,
    });

    return emailResponse;
  } catch (err: any) {
    console.error("Error sending email", err);
    throw err;
  }
}
