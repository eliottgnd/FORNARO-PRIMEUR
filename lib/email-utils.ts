import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@fornaro.fr",
    to,
    subject,
    html,
    text,
  });
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}