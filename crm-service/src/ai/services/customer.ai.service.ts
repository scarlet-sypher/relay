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
      maxOutputTokens: 200,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned empty response for customer insight");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned) as CustomerInsightResponse;
};
