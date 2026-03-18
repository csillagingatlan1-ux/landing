import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing message" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    if (!from) {
      return NextResponse.json(
        { success: false, error: "Missing RESEND_FROM" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const data = await resend.emails.send({
      from,
      to: ["csillagingatlan1@gmail.com"],
      subject: "New apartment request",
      text: message,
      replyTo: "csillagingatlan1@gmail.com",
    });

    return NextResponse.json({
      success: true,
      data,
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
