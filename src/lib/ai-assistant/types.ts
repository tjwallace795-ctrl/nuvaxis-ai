export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

export interface SerperSearchResponse {
  organic?: SerperResult[];
  answerBox?: { answer?: string; snippet?: string; title?: string };
  knowledgeGraph?: { description?: string; title?: string };
}

export interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}
