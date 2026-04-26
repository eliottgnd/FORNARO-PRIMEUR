import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, password, firstName, lastName, address } =
      await req.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { message: "Code et mot de passe requis" },
        { status: 400 }
      );
    }

    const verification = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        type: "signup",
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { message: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un compte existe déjà pour cet email" },
        { status: 400 }
      );
    }

    await prisma.verificationCode.delete({
      where: { id: verification.id },
    });

    const hashedPassword = await bcrypt.hash(password, 12);
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        address,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Compte créé avec succès", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Verify signup error:", error);
    return NextResponse.json(
      { message: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}