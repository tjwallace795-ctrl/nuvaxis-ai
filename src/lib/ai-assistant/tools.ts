import type Anthropic from "@anthropic-ai/sdk";

// Tool definitions passed to Claude
export const ASSISTANT_TOOLS: Anthropic.Tool[] = [
  {
    name: "search_web",
    description:
      "Search the web for real-time information — current trends, competitor moves, pricing, news, market data, viral content, or anything that may have changed recently. Always use this for live data rather than relying on training knowledge.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Specific search query. Include location, industry, and year when relevant. Example: 'real estate agent marketing trends El Paso 2026'",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_my_leads",
    description:
      "Retrieve the business owner's current lead list — people who have been identified as potential customers. Returns their names, contact info, intent signals, scores, and suggested outreach. Use this to answer questions about their leads, draft emails, or plan outreach campaigns.",
    input_schema: {
      type: "object" as const,
      properties: {
        filter: {
          type: "string",
          enum: ["all", "hot", "warm", "cold", "with_email", "with_phone"],
          description: "Filter which leads to return. Default: 'all'",
        },
      },
      required: [],
    },
  },
  {
    name: "send_email",
    description:
      "Send an actual email to a lead or contact on behalf of the business owner. Only use this when the user explicitly asks to send an email. Always confirm the recipient, subject, and body before sending.",
    input_schema: {
      type: "object" as const,
      properties: {
        to_email: {
          type: "string",
          description: "Recipient email address",
        },
        to_name: {
          type: "string",
          description: "Recipient's name (used in greeting)",
        },
        subject: {
          type: "string",
          description: "Email subject line — concise and compelling, under 10 words",
        },
        body: {
          type: "string",
          description:
            "Full email body text. Write it naturally — warm, personal, referencing what you know about the lead. Under 200 words. Sign off with the business owner's name.",
        },
      },
      required: ["to_email", "subject", "body"],
    },
  },
  {
    name: "research_market",
    description:
      "Research live market conditions, trends, and opportunities specific to the business's industry and location. Runs multiple searches to surface competitor strategies, pricing benchmarks, trending content topics, and growth opportunities.",
    input_schema: {
      type: "object" as const,
      properties: {
        focus: {
          type: "string",
          description:
            "What to research. Examples: 'pricing trends', 'competitor strategies', 'content ideas', 'customer pain points', 'viral hooks'",
        },
        location: {
          type: "string",
          description: "Geographic market to focus on (optional — uses profile location if omitted)",
        },
      },
      required: ["focus"],
    },
  },
  {
    name: "scan_social_trends",
    description:
      "Scan what's trending right now on social media for the business's niche. Returns viral content ideas, trending hashtags, high-performing hooks, and what competitors are posting. Use this to help the owner create content that will perform well.",
    input_schema: {
      type: "object" as const,
      properties: {
        platform: {
          type: "string",
          enum: ["all", "TikTok", "Instagram", "YouTube"],
          description: "Which platform to focus on. Default: 'all'",
        },
      },
      required: [],
    },
  },
];

export { executeTool } from "./executor";
