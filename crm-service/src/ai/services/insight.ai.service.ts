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
    throw new Error("Gemini returned empty response for insight");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();

  console.log("INSIGHT TEXT:");
  console.log(cleaned);

  try {
    return JSON.parse(cleaned) as InsightResponse;
  } catch (error) {
    console.error("Failed to parse Insight response:");
    console.error(cleaned);

    return {
      narrative:
        "Campaign completed successfully but AI insight generation failed.",
      recommendedAction:
        "Review campaign analytics manually and retry insight generation.",
    };
  }
};
