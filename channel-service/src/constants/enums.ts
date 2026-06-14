import type {
  ChannelType,
  SimulationProbabilities,
} from "../types/channel.types.js";

/*
|--------------------------------------------------------------------------
| Simulation Probabilities
|--------------------------------------------------------------------------
| Based on real industry benchmarks from the product design document.
| These govern how the simulator decides delivery and engagement outcomes.
*/

export const CHANNEL_PROBABILITIES: Record<
  ChannelType,
  SimulationProbabilities
> = {
  EMAIL: {
    deliveryRate: 0.85,
    openRate: 0.28,
    readRate: 0.8,
    clickRate: 0.12,
  },
  SMS: {
    deliveryRate: 0.92,
    openRate: 0.0,
    readRate: 0.0,
    clickRate: 0.18,
  },
  WHATSAPP: {
    deliveryRate: 0.96,
    openRate: 0.45,
    readRate: 0.9,
    clickRate: 0.15,
  },
};

/*
|--------------------------------------------------------------------------
| Timing Delays (milliseconds)
|--------------------------------------------------------------------------
| Each stage fires after a realistic async delay.
| These ranges model real-world delivery and engagement latency.
*/

export const DELAY_MS = {
  DELIVERY_MIN: 1000,
  DELIVERY_MAX: 3000,
  OPEN_MIN: 5000,
  OPEN_MAX: 15000,
  READ_MIN: 3000,
  READ_MAX: 10000,
  CLICK_MIN: 2000,
  CLICK_MAX: 8000,
} as const;

/*
|--------------------------------------------------------------------------
| Retry Configuration
|--------------------------------------------------------------------------
*/

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY_MS: 1000,
} as const;
