import { CHANNEL_PROBABILITIES, DELAY_MS } from "../constants/enums.js";
import { dispatchCallback } from "../dispatcher/callback.dispatcher.js";
import type {
  ChannelType,
  CommunicationPayload,
  DeliveryOutcome,
} from "../types/channel.types.js";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const roll = (probability: number): boolean => Math.random() < probability;

export const simulateDelivery = async (
  communication: CommunicationPayload,
  channel: ChannelType,
  callbackUrl: string,
): Promise<DeliveryOutcome> => {
  const probabilities = CHANNEL_PROBABILITIES[channel];

  /*
  |--------------------------------------------------------------------------
  | Stage 1 — SENT
  |--------------------------------------------------------------------------
  | Fire immediately to indicate the message left our system.
  */

  dispatchCallback(callbackUrl, {
    communication_id: communication.communication_id,
    status: "SENT",
  });

  console.log(
    `[DELIVERY] 📤 SENT — comm=${communication.communication_id} channel=${channel}`,
  );

  /*
  |--------------------------------------------------------------------------
  | Stage 2 — DELIVERED or FAILED
  |--------------------------------------------------------------------------
  | After a realistic delay, decide if the message reached the recipient.
  */

  const deliveryDelay = randomBetween(
    DELAY_MS.DELIVERY_MIN,
    DELAY_MS.DELIVERY_MAX,
  );
  await sleep(deliveryDelay);

  const delivered = roll(probabilities.deliveryRate);

  if (!delivered) {
    const failureReasons: Record<ChannelType, string[]> = {
      EMAIL: ["Invalid email address", "Mailbox full", "Domain not found"],
      SMS: ["Invalid phone number", "Number not reachable", "Carrier rejected"],
      WHATSAPP: [
        "WhatsApp not installed",
        "Number not on WhatsApp",
        "Message blocked",
      ],
    };

    const reasons = failureReasons[channel];
    const reason = reasons[Math.floor(Math.random() * reasons.length)]!;

    dispatchCallback(callbackUrl, {
      communication_id: communication.communication_id,
      status: "FAILED",
      failure_reason: reason,
    });

    console.log(
      `[DELIVERY] ❌ FAILED — comm=${communication.communication_id} reason="${reason}"`,
    );

    return { delivered: false, failure_reason: reason };
  }

  dispatchCallback(callbackUrl, {
    communication_id: communication.communication_id,
    status: "DELIVERED",
  });

  console.log(
    `[DELIVERY] ✅ DELIVERED — comm=${communication.communication_id}`,
  );

  return { delivered: true };
};
