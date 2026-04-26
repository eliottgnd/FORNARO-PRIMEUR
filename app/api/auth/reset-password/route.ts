import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Password validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Find the verification code
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: "password_reset",
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { message: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    // Delete the used verification code
    await prisma.verificationCode.delete({
      where: { id: verification.id },
    });

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Mot de passe réinitialisé avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Erreur lors de la réinitialisation" },
      { status: 500 }
    );
  }
}