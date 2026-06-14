import { gemini, GEMINI_MODEL } from "../config/gemini.config.js";
import {
  buildInsightSystemPrompt,
  buildInsightUserPrompt,
  type InsightPromptInput,
} from "../prompts/insight.prompt.js";
import type { InsightResponse } from "../types/ai.types.js";

export const generateCampaignInsight = async (
  input: InsightPromptInput,
): Promise<InsightResponse> => {
  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildInsightUserPrompt(input),
    config: {
      systemInstruction: buildInsightSystemPrompt(),
      maxOutputTokens: 500,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned empty response for insight");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned) as InsightResponse;
};
