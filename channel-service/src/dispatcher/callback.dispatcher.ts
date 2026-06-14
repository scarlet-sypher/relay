import { RETRY_CONFIG } from "../constants/enums.js";
import type { CallbackPayload } from "../types/channel.types.js";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fireCallback = async (
  callbackUrl: string,
  payload: CallbackPayload,
  attempt: number,
): Promise<void> => {
  try {
    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`CRM receipt responded with status ${response.status}`);
    }

    console.log(
      `[DISPATCHER] Callback delivered — comm=${payload.communication_id} status=${payload.status} attempt=${attempt}`,
    );
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);

    if (attempt < RETRY_CONFIG.MAX_ATTEMPTS) {
      const delay = RETRY_CONFIG.BASE_DELAY_MS * Math.pow(4, attempt - 1);
      console.warn(
        `[DISPATCHER] Callback failed — comm=${payload.communication_id} attempt=${attempt} retrying in ${delay}ms — reason: ${error}`,
      );
      await sleep(delay);
      return fireCallback(callbackUrl, payload, attempt + 1);
    }

    console.error(
      `[DISPATCHER] All ${RETRY_CONFIG.MAX_ATTEMPTS} attempts failed — comm=${payload.communication_id} status=${payload.status} — reason: ${error}`,
    );
  }
};

export const dispatchCallback = (
  callbackUrl: string,
  payload: CallbackPayload,
): void => {
  void fireCallback(callbackUrl, payload, 1);
};
