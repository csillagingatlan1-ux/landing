import { NextRequest, NextResponse } from "next/server";
import MessageClient, { isUnexpected } from "@azure-rest/communication-messages";

type SendWhatsAppBody = {
  to?: string;
  text?: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SendWhatsAppBody;

    const to = body?.to?.trim();
    const text = body?.text?.trim();

    if (!to) {
      return NextResponse.json(
        { ok: false, error: "A 'to' mező kötelező." },
        { status: 400 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { ok: false, error: "A 'text' mező kötelező." },
        { status: 400 }
      );
    }

    const connectionString = getRequiredEnv("ACS_CONNECTION_STRING");
    const channelRegistrationId = getRequiredEnv("ACS_CHANNEL_ID");

    const client = MessageClient(connectionString);

    const response = await client.path("/messages/notifications:send").post({
      body: {
        channelRegistrationId,
        to: [to],
        kind: "text",
        content: text,
      },
    });

    if (isUnexpected(response)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Azure Communication Services hiba",
          details: response.body ?? null,
          status: response.status,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      receipts: response.body?.receipts ?? [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ismeretlen szerverhiba";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
