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
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to,
    subject,
    html: html ?? "",
    text: text ?? "",
  } as any);

  if (error) throw new Error(error.message);
  return data;
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
