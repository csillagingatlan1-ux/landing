import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { adminMessage, customerEmail, customerName } = await req.json();

    if (!adminMessage || typeof adminMessage !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing adminMessage" },
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

    const adminResult = await resend.emails.send({
      from,
      to: ["csillagingatlan1@gmail.com"],
      subject: "New apartment request",
      text: adminMessage,
      replyTo: customerEmail || "csillagingatlan1@gmail.com",
    });

    if (customerEmail && typeof customerEmail === "string") {
      await resend.emails.send({
        from,
        to: [customerEmail],
        subject: "We received your request - STAR REAL ESTATE AGENCY",
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;background:#0b0b0b;color:#f5f5f5;padding:32px;">
            <div style="max-width:560px;margin:0 auto;background:#121212;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px;">
              <h2 style="margin:0 0 16px 0;font-size:24px;color:#ffffff;">Thank you for your request</h2>
              <p style="margin:0 0 12px 0;color:#d7d7d7;line-height:1.7;">
                Dear ${customerName ? customerName : "Customer"},
              </p>
              <p style="margin:0 0 12px 0;color:#d7d7d7;line-height:1.7;">
                We have received your apartment request successfully.
              </p>
              <p style="margin:0 0 12px 0;color:#d7d7d7;line-height:1.7;">
                Our team will contact you soon.
              </p>
              <p style="margin:18px 0 0 0;color:#ffffff;font-weight:600;">
                STAR REAL ESTATE AGENCY<br />
                Debrecen
              </p>
              <p style="margin:8px 0 0 0;color:#bdbdbd;">
                csillagingatlan1@gmail.com
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      adminResult,
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
