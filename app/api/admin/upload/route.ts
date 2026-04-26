import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "Invalid file type. Only .webp images are allowed." }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "File too large. Max size is 5MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = path.extname(file.name) || ".webp";
    const filename = `${crypto.randomUUID()}${extension}`;
    const publicPath = path.join(process.cwd(), "public", filename);

    await writeFile(publicPath, buffer);

    return NextResponse.json({ filename }, { status: 200 });
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
