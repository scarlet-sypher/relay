import { gemini, GEMINI_MODEL } from "../config/gemini.config.js";
import {
  buildCustomerSystemPrompt,
  buildCustomerUserPrompt,
  type CustomerPromptInput,
} from "../prompts/customer.prompt.js";
import type { CustomerInsightResponse } from "../types/ai.types.js";

export const generateCustomerInsight = async (
  input: CustomerPromptInput,
): Promise<CustomerInsightResponse> => {
  const response = await gemini.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildCustomerUserPrompt(input),
    config: {
      systemInstruction: buildCustomerSystemPrompt(),
      responseMimeType: "application/json",
      maxOutputTokens: 500,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  console.dir(response, { depth: null });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned empty response for customer insight");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();

  console.log("GEMINI TEXT:");
  console.log(cleaned);

  try {
    return JSON.parse(cleaned) as CustomerInsightResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:");
    console.error(cleaned);

    return {
      summary: "Customer insight unavailable.",
      riskFlag: "neutral",
    };
  }
  return JSON.parse(cleaned) as CustomerInsightResponse;

  //   return JSON.parse(cleaned) as CustomerInsightResponse;
};
