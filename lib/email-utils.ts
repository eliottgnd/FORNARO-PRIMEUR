import Email from "vercel-email";

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
  return Email.send({
    to,
    from: process.env.FROM_EMAIL || "noreply@fornaro.fr",
    subject,
    html,
    text,
  });
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}