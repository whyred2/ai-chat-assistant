import { mistral } from "@/lib/ai";

const SUMMARIZATION_PROMPT = `You are a conversation summarizer. Create a concise but comprehensive summary of the conversation provided below.

## Instructions:
- Capture the key topics discussed, decisions made, and important details
- Preserve any user preferences, facts, or context that would be useful for future conversation
- Write in third person (e.g., "The user asked about...", "The assistant explained...")
- Keep the summary under 500 words
- If there is an existing summary, integrate new information into it
- Respond in the same language as the majority of the conversation`;

interface SummarizationMessage {
  role: string;
  content: string;
}

export async function summarizeMessages(
  messages: SummarizationMessage[],
  existingSummary?: string | null,
  model?: string,
): Promise<string> {
  const conversationText = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");

  let userContent = "";

  if (existingSummary) {
    userContent = `## Existing Summary:\n${existingSummary}\n\n## New Messages to Integrate:\n${conversationText}`;
  } else {
    userContent = `## Conversation to Summarize:\n${conversationText}`;
  }

  const response = await mistral.chat.complete({
    model: model || "mistral-small-latest",
    messages: [
      { role: "system", content: SUMMARIZATION_PROMPT },
      { role: "user", content: userContent },
    ],
  });

  const summary = response.choices?.[0]?.message?.content;

  if (!summary || typeof summary !== "string") {
    throw new Error("Failed to generate summary");
  }

  return summary;
}
