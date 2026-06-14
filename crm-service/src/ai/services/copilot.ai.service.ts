import { gemini, GEMINI_MODEL } from "../config/gemini.config.js";
import {
  buildCopilotSystemPrompt,
  buildCopilotUserPrompt,
  type CopilotPromptInput,
} from "../prompts/copilot.prompt.js";
import type { CopilotResponse } from "../types/ai.types.js";

export const generateCampaignCopilot = async (
  input: CopilotPromptInput,
): Promise<CopilotResponse> => {
  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildCopilotUserPrompt(input),
    config: {
      systemInstruction: buildCopilotSystemPrompt(),
      maxOutputTokens: 1000,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned empty response for copilot");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned) as CopilotResponse;
};
