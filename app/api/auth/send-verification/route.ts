import { NextResponse } from "next/server";
import { sendEmail, generateCode } from "@/lib/email-utils";

export async function POST(req: Request) {
  try {
    const { email, type, firstName } = await req.json();

    if (!email || !type) {
      return NextResponse.json(
        { message: "Email et type requis" },
        { status: 400 }
      );
    }

    if (!["signup", "password_reset"].includes(type)) {
      return NextResponse.json(
        { message: "Type invalide" },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10);

    const { prisma } = await import("@/lib/auth/prisma");

    // Delete any existing codes for this email/type combination
    await prisma.verificationCode.deleteMany({
      where: { email, type },
    });

    // Create new code
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        type,
        expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
      },
    });

    // Build email content
    const greeting = firstName ? `Bonjour ${firstName}` : "Bonjour";
    const isSignup = type === "signup";

    const subject = isSignup
      ? "Votre code de vérification Fornaro"
      : "Réinitialisation de votre mot de passe Fornaro";

    const html = `
      <div style="font-family: Georgia, serif; background-color: #faf8f5; padding: 40px;">
        <div style="background-color: #ffffff; border-radius: 12px; max-width: 480px; margin: 0 auto; padding: 40px; border: 1px solid #e8e0d5;">
          <h2 style="color: #2d3a2e; text-align: center; margin-bottom: 30px;">
            ${isSignup ? "Bienvenue chez Fornaro" : "Réinitialisation de mot de passe"}
          </h2>
          <div style="background-color: #faf8f5; border-radius: 8px; padding: 30px; text-align: center;">
            <p style="color: #2d3a2e; font-size: 16px; margin: 0 0 20px 0;">${greeting},</p>
            <p style="color: #5a5a5a; font-size: 14px; margin: 0 0 20px 0;">Voici votre code de vérification :</p>
            <p style="color: #2d3a2e; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0 0 20px 0;">${code}</p>
            <p style="color: #888888; font-size: 12px; margin: 0;">Ce code expire dans 10 minutes.</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e8e0d5; margin: 30px 0;">
          <div style="text-align: center;">
            <p style="color: #888888; font-size: 12px; margin: 5px 0;">Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
            <p style="color: #888888; font-size: 12px; margin: 5px 0;">L'équipe Fornaro</p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({ to: email, subject, html, text: `Votre code: ${code}` });

    return NextResponse.json({ message: "Code envoyé" }, { status: 200 });
  } catch (error: any) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi du code" },
      { status: 500 }
    );
  }
}