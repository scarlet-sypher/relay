import { gemini, GEMINI_MODEL } from "../config/gemini.config.js";
import {
  buildAudienceSystemPrompt,
  buildAudienceUserPrompt,
} from "../prompts/audience.prompt.js";
import type { AudienceBuilderResponse } from "../types/ai.types.js";

export const buildAudienceFromNL = async (
  nlQuery: string,
): Promise<AudienceBuilderResponse> => {
  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildAudienceUserPrompt(nlQuery),
    config: {
      systemInstruction: buildAudienceSystemPrompt(),
      responseMimeType: "application/json",
      maxOutputTokens: 1000,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  console.dir(response, { depth: null });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned empty response for audience builder");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();

  console.log("AUDIENCE TEXT:");
  console.log(cleaned);

  try {
    return JSON.parse(cleaned) as AudienceBuilderResponse;
  } catch (error) {
    console.error("Failed to parse Audience response:");
    console.error(cleaned);

    throw new Error("Failed to parse Gemini audience builder response");
  }
};
