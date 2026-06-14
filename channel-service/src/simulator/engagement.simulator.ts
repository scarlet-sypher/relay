import { CHANNEL_PROBABILITIES, DELAY_MS } from "../constants/enums.js";
import { dispatchCallback } from "../dispatcher/callback.dispatcher.js";
import type {
  ChannelType,
  CommunicationPayload,
  EngagementOutcome,
} from "../types/channel.types.js";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const roll = (probability: number): boolean => Math.random() < probability;

export const simulateEngagement = async (
  communication: CommunicationPayload,
  channel: ChannelType,
  callbackUrl: string,
): Promise<EngagementOutcome> => {
  const probabilities = CHANNEL_PROBABILITIES[channel];

  /*
  |--------------------------------------------------------------------------
  | SMS has no open/read events — only clicked is tracked
  |--------------------------------------------------------------------------
  */

  if (channel === "SMS") {
    const clickDelay = randomBetween(DELAY_MS.CLICK_MIN, DELAY_MS.CLICK_MAX);
    await sleep(clickDelay);

    const clicked = roll(probabilities.clickRate);
    if (clicked) {
      dispatchCallback(callbackUrl, {
        communication_id: communication.communication_id,
        status: "CLICKED",
      });

      console.log(
        `[ENGAGEMENT] 🖱️  CLICKED — comm=${communication.communication_id} channel=SMS`,
      );
    }

    return { opened: false, read: false, clicked };
  }

  /*
  |--------------------------------------------------------------------------
  | Stage 1 — OPENED
  |--------------------------------------------------------------------------
  */

  const openDelay = randomBetween(DELAY_MS.OPEN_MIN, DELAY_MS.OPEN_MAX);
  await sleep(openDelay);

  const opened = roll(probabilities.openRate);

  if (!opened) {
    console.log(
      `[ENGAGEMENT] 👁️  Not opened — comm=${communication.communication_id}`,
    );
    return { opened: false, read: false, clicked: false };
  }

  dispatchCallback(callbackUrl, {
    communication_id: communication.communication_id,
    status: "OPENED",
  });

  console.log(
    `[ENGAGEMENT] 👁️  OPENED — comm=${communication.communication_id}`,
  );

  /*
  |--------------------------------------------------------------------------
  | Stage 2 — READ
  |--------------------------------------------------------------------------
  */

  const readDelay = randomBetween(DELAY_MS.READ_MIN, DELAY_MS.READ_MAX);
  await sleep(readDelay);

  const read = roll(probabilities.readRate);

  if (!read) {
    console.log(
      `[ENGAGEMENT] 📖 Not read — comm=${communication.communication_id}`,
    );
    return { opened: true, read: false, clicked: false };
  }

  dispatchCallback(callbackUrl, {
    communication_id: communication.communication_id,
    status: "READ",
  });

  console.log(`[ENGAGEMENT] 📖 READ — comm=${communication.communication_id}`);

  /*
  |--------------------------------------------------------------------------
  | Stage 3 — CLICKED
  |--------------------------------------------------------------------------
  */

  const clickDelay = randomBetween(DELAY_MS.CLICK_MIN, DELAY_MS.CLICK_MAX);
  await sleep(clickDelay);

  const clicked = roll(probabilities.clickRate);

  if (!clicked) {
    console.log(
      `[ENGAGEMENT] 🖱️  Not clicked — comm=${communication.communication_id}`,
    );
    return { opened: true, read: true, clicked: false };
  }

  dispatchCallback(callbackUrl, {
    communication_id: communication.communication_id,
    status: "CLICKED",
  });

  console.log(
    `[ENGAGEMENT] 🖱️  CLICKED — comm=${communication.communication_id}`,
  );

  return { opened: true, read: true, clicked: true };
};
