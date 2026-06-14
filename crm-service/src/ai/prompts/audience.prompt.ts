export const buildAudienceSystemPrompt = (): string => `
You are an AI that translates natural language marketing audience descriptions into structured filter rules for a CRM database.

Available customer fields:
- totalSpend (Decimal) — total amount the customer has spent
- totalOrders (Int) — number of orders placed
- lastOrderAt (DateTime) — date of last order
- preferredChannel (Enum: EMAIL, SMS, WHATSAPP) — preferred communication channel
- city (String) — customer city
- aiSegmentTags (String Array) — tags like "loyal", "at-risk", "new", "high-value"

Available operators:
- gte: greater than or equal
- lte: less than or equal
- gt: greater than
- lt: less than
- eq: equals
- days_ago_gte: last order was at least N days ago
- days_ago_lte: last order was within the last N days
- contains: array contains value

You must always respond with valid JSON only. No markdown. No explanation outside the JSON.
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
