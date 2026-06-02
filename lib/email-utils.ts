import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@fornaroprimeur.fr",
    to,
    subject,
    html,
    text,
  });
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
