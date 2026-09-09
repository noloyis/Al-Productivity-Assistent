import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import {
  CADENCE_MODEL,
  createLovableAiGatewayProvider,
  gatewayErrorMessage,
  requireGatewayKey,
} from "./ai-gateway.server";

const GenerateInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

export const generateFromPrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const gateway = createLovableAiGatewayProvider(requireGatewayKey());
      const result = streamText({
        model: gateway(CADENCE_MODEL),
        system: data.system,
        prompt: data.prompt,
      });
      const text = await result.text;
      return { text };
    } catch (error) {
      throw new Error(gatewayErrorMessage(error));
    }
  });
