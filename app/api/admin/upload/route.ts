import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

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
    const base64 = buffer.toString("base64");
    const dataUri = `data:image/webp;base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "fornaro",
      resource_type: "image",
    });

    return NextResponse.json({ filename: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
