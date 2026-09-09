import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const CADENCE_MODEL = "google/gemini-3.8-flash";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function requireGatewayKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this app yet.");
  return key;
}

export function gatewayErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);
  if (raw.includes("429")) return "The AI is busy right now. Please try again in a moment.";
  if (raw.includes("402")) return "AI credits have run out. Add credits to keep generating.";
  if (raw.includes("403")) return "AI access is blocked for this workspace.";
  return raw || "Something went wrong while generating.";
}
