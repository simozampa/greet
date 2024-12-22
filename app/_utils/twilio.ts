import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export const twilio = new Twilio(accountSid, authToken);