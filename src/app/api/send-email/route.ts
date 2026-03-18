import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing message" },
        { status: 400 }
      );
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      return NextResponse.json(
        { success: false, error: "Missing EMAIL_USER or EMAIL_PASS" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"STAR Real Estate Agency" <${user}>`,
      to: "csillagingatlan1@gmail.com",
      replyTo: user,
      subject: "New apartment request",
      text: message,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
