import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace, Field } from "@/components/tool-workspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Cadence" },
      {
        name: "description",
        content:
          "Get a structured briefing on any work topic: key points, considerations, trade-offs and the questions you still need to answer.",
      },
      { property: "og:title", content: "AI Research Assistant — Cadence" },
      {
        property: "og:description",
        content: "Structured briefings on work topics, with uncertainty flagged.",
      },
    ],
  }),
  component: ResearchTool,
});

const SYSTEM = `You are a careful research assistant for business professionals.
Produce a briefing with: Overview, Key points, Considerations and trade-offs, What to watch, Open questions to verify.
You have no live web access, so never fabricate statistics, sources, dates or quotes. State clearly where the reader must verify with primary sources.`;

const depths = ["Quick brief", "Standard briefing", "Deep dive"];
const audiences = ["Team", "Leadership", "Client", "Myself"];

function ResearchTool() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState(depths[1]);
  const [audience, setAudience] = useState(audiences[0]);
  const [questions, setQuestions] = useState("");

  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured briefings, with uncertainty stated up front."
    >
      <ToolWorkspace
        system={SYSTEM}
        actionLabel="Create briefing"
        outputLabel="Research briefing"
        emptyState="Your briefing will appear here, ready to edit."
        buildPrompt={() =>
          topic.trim().length < 4
            ? null
            : `Research topic: ${topic}
Depth: ${depth}
Audience: ${audience}
Specific questions to address: ${questions || "None stated"}`
        }
      >
        <Field label="Topic">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Moving our support team to a shared inbox model"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Depth">
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {depths.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Audience">
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {audiences.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Specific questions" hint="optional">
          <Textarea
            rows={6}
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="What breaks at 40+ tickets a day? What does handover look like?"
            className="resize-none"
          />
        </Field>
      </ToolWorkspace>
    </AppShell>
  );
}
