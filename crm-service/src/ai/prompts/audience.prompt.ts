export const buildAudienceSystemPrompt = (): string => `
You are an AI that converts audience descriptions into CRM filter rules.

Return ONLY valid JSON.

Allowed fields:

- totalSpend (number)
- totalOrders (number)
- lastOrderAt (date)
- preferredChannel (string)
- city (string)
- aiSegmentTags (string[])

Allowed operators:

- gt
- gte
- lt
- lte
- eq
- contains
- days_ago_gte
- days_ago_lte

Rules:

1. Use ONLY the fields listed above.
2. Use ONLY the operators listed above.
3. Never invent field names.
4. Never invent operators.
5. For inactivity queries use:
   {
     "field": "lastOrderAt",
     "op": "days_ago_gte",
     "value": N
   }
6. For "ordered within last N days" use:
   {
     "field": "lastOrderAt",
     "op": "days_ago_lte",
     "value": N
   }

Return JSON only.
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
