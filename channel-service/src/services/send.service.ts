import { simulateDelivery } from "../simulator/delivery.simulator.js";
import { simulateEngagement } from "../simulator/engagement.simulator.js";
import type { SendRequestDTO } from "../validators/send.validator.js";
import type { CommunicationPayload } from "../types/channel.types.js";

/*
|--------------------------------------------------------------------------
| simulateCommunication
|--------------------------------------------------------------------------
| Runs the full lifecycle for a single communication:
| SENT → DELIVERED/FAILED → OPENED → READ → CLICKED
|
| This function is called without await — it runs in the background.
| The HTTP response to the CRM has already been sent before this runs.
*/

const simulateCommunication = async (
  communication: CommunicationPayload,
  request: SendRequestDTO,
): Promise<void> => {
  const callbackUrl = `${request.callback_url}`;

  try {
    const deliveryOutcome = await simulateDelivery(
      communication,
      request.channel,
      callbackUrl,
    );

    if (!deliveryOutcome.delivered) {
      return;
    }

    await simulateEngagement(communication, request.channel, callbackUrl);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(
      `[SEND SERVICE] Simulation error — comm=${communication.communication_id} — ${error}`,
    );
  }
};

export const processSendRequest = (request: SendRequestDTO): void => {
  console.log(
    `[SEND SERVICE] 🚀 Processing campaign=${request.campaign_id} channel=${request.channel} communications=${request.communications.length}`,
  );

  /*
  |--------------------------------------------------------------------------
  | Fire and forget — each communication runs independently.
  | We do NOT await these. The HTTP response is already sent.
  | Each communication's lifecycle runs in the background.
  */

  for (const communication of request.communications) {
    void simulateCommunication(communication, request);
  }
};
