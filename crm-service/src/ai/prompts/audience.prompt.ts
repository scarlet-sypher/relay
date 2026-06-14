export const buildAudienceSystemPrompt = (): string => `
You are an AI that translates natural language audience descriptions into CRM filter rules.

Return ONLY valid JSON.

Do not explain.
Do not use markdown.
Do not use code blocks.
Do not write any text before or after the JSON.

The response must exactly match the schema requested by the user.
`;
export const buildAudienceUserPrompt = (nlQuery: string): string => `
Translate this audience description into filter rules:

"${nlQuery}"

Respond with this exact JSON structure:
{
  "filterRules": {
    "operator": "AND",
    "conditions": [
      { "field": "fieldName", "op": "operator", "value": someValue }
    ]
  },
  "explanation": "Plain English explanation of what these filters do",
  "suggestedName": "A short, descriptive segment name",
  "warnings": ["Any warnings about the query, e.g. might return too few results"]
}
`;
