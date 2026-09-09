import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import {
  CADENCE_MODEL,
  createLovableAiGatewayProvider,
  requireGatewayKey,
} from "@/lib/ai-gateway.server";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatRequestBody = { messages?: ChatMessage[] };

const SYSTEM_PROMPT = `You are Cadence, an AI workplace productivity assistant for busy professionals.
Be concise, practical and business-appropriate. Use short paragraphs and bullet lists.
When you are uncertain about facts, say so plainly rather than guessing.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }

        try {
          const gateway = createLovableAiGatewayProvider(requireGatewayKey());
          const result = streamText({
            model: gateway(CADENCE_MODEL),
            system: SYSTEM_PROMPT,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
          });
          return result.toTextStreamResponse();
        } catch (error) {
          const message = error instanceof Error ? error.message : "AI request failed";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});
