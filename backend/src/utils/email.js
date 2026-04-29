import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });
    console.log("✅ Email sent via HTTP API:", data);
  } catch (error) {
    console.error("🔴 Failed to send via API:", error);
    throw error;
  }
};
