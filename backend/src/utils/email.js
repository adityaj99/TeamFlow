import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log(`Attempting to send email to: ${to}`);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(
      "✅ Email successfully accepted by Google! Message ID:",
      info.messageId,
    );
  } catch (error) {
    console.error("🔴 Nodemailer failed to send email:", error);
    throw error;
  }
};
