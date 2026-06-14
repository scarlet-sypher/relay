import { GoogleGenAI } from "@google/genai";
import { ENV } from "../../config/env.js";

export const gemini = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

export const GEMINI_MODEL = "gemini-3.5-flash";
