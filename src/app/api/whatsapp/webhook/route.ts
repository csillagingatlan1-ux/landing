import { NextRequest, NextResponse } from "next/server";
import MessageClient, { isUnexpected } from "@azure-rest/communication-messages";

type EventGridEvent = {
  id?: string;
  eventType?: string;
  subject?: string;
  eventTime?: string;
  dataVersion?: string;
  metadataVersion?: string;
  topic?: string;
  data?: any;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

async function sendAutoReply(to: string, text: string) {
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
    throw new Error(
      `ACS auto-reply failed with status ${response.status}: ${JSON.stringify(response.body ?? {})}`
    );
  }

  return response.body?.receipts ?? [];
}

function tryGetIncomingText(event: EventGridEvent): string | null {
  const message = event?.data?.message;

  if (!message) return null;

  if (typeof message?.content === "string") {
    return message.content;
  }

  if (typeof message?.text === "string") {
    return message.text;
  }

  if (typeof message?.content?.text === "string") {
    return message.content.text;
  }

  return null;
}

function tryGetFrom(event: EventGridEvent): string | null {
  const candidates = [
    event?.data?.from,
    event?.data?.sender,
    event?.data?.message?.from,
    event?.data?.message?.sender,
    event?.data?.message?.fromPhoneNumber?.value,
    event?.data?.message?.fromPhoneNumber,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const events = Array.isArray(payload) ? payload : [payload];

    const validationEvent = events.find(
      (event: EventGridEvent) => event?.eventType === "Microsoft.EventGrid.SubscriptionValidationEvent"
    );

    if (validationEvent) {
      const validationCode = validationEvent?.data?.validationCode;

      return NextResponse.json({
        validationResponse: validationCode,
      });
    }

    const processed: Array<{
      eventType: string | undefined;
      from: string | null;
      text: string | null;
      autoReplySent: boolean;
      autoReplyReceipts?: unknown;
      error?: string;
    }> = [];

    for (const event of events as EventGridEvent[]) {
      if (event?.eventType !== "Microsoft.Communication.AdvancedMessageReceived") {
        processed.push({
          eventType: event?.eventType,
          from: null,
          text: null,
          autoReplySent: false,
        });
        continue;
      }

      const from = tryGetFrom(event);
      const text = tryGetIncomingText(event);

      const entry = {
        eventType: event?.eventType,
        from,
        text,
        autoReplySent: false,
      } as {
        eventType: string | undefined;
        from: string | null;
        text: string | null;
        autoReplySent: boolean;
        autoReplyReceipts?: unknown;
        error?: string;
      };

      try {
        if (from) {
          const receipts = await sendAutoReply(
            from,
            "Szia! Koszonjuk az erdeklodest. Hamarosan jelentkezunk."
          );

          entry.autoReplySent = true;
          entry.autoReplyReceipts = receipts;
        }
      } catch (error) {
        entry.error = error instanceof Error ? error.message : "Auto-reply error";
      }

      processed.push(entry);
    }

    return NextResponse.json({
      ok: true,
      processed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown webhook error",
      },
      { status: 500 }
    );
  }
}
