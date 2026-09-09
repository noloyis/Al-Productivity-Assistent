import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace, Field } from "@/components/tool-workspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Cadence" },
      {
        name: "description",
        content:
          "Generate professional, on-tone workplace emails from a recipient, intent and a few key points. Fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator — Cadence" },
      {
        property: "og:description",
        content: "Turn a few bullet points into a polished workplace email.",
      },
    ],
  }),
  component: EmailTool,
});

const SYSTEM = `You are an expert business communicator. Write clear, concise workplace emails.
Return a subject line on the first line prefixed with "Subject:", then a blank line, then the email body.
Never invent facts, names, figures or commitments that were not supplied. Keep it under 200 words unless asked otherwise.`;

const tones = ["Warm and professional", "Direct", "Formal", "Friendly", "Apologetic"];
const intents = [
  "Request something",
  "Follow up",
  "Give an update",
  "Decline politely",
  "Introduce / connect",
  "Say thank you",
];

function EmailTool() {
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [intent, setIntent] = useState(intents[0]);
  const [points, setPoints] = useState("");

  return (
    <AppShell
      title="Smart Email Generator"
      description="Structured inputs in, a ready-to-edit email out."
    >
      <ToolWorkspace
        system={SYSTEM}
        actionLabel="Generate email"
        outputLabel="Email draft"
        emptyState="Your generated email will appear here, ready to edit."
        buildPrompt={() =>
          points.trim().length < 5
            ? null
            : `Write an email.
Recipient: ${recipient || "a colleague"}
Tone: ${tone}
Intent: ${intent}
Key points to cover:
${points}`
        }
      >
        <Field label="Recipient" hint="name and role">
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Priya Nair, Head of Design"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tone">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {tones.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Intent">
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {intents.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Key points">
          <Textarea
            rows={6}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder={"• v2.1 shipped Friday\n• need sign-off by Thursday\n• demo link to follow"}
            className="resize-none"
          />
        </Field>
      </ToolWorkspace>
    </AppShell>
  );
}
