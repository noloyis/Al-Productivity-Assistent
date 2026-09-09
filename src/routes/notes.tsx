import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace, Field } from "@/components/tool-workspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Cadence" },
      {
        name: "description",
        content:
          "Paste raw meeting notes or a transcript and get a structured summary with decisions, action items and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Cadence" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, actions and owners.",
      },
    ],
  }),
  component: NotesTool,
});

const SYSTEM = `You summarize workplace meetings. Output markdown-style plain text with these sections:
Summary (3 bullets max), Decisions, Action items (owner — task — due date if stated), Open questions, Risks.
Only use information present in the notes. Write "Not stated" where an owner or date is missing. Never invent attendees or commitments.`;

const styles = ["Concise bullets", "Detailed recap", "Executive summary"];

function NotesTool() {
  const [meeting, setMeeting] = useState("");
  const [attendees, setAttendees] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [notes, setNotes] = useState("");

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="From raw notes to decisions, owners and next steps."
    >
      <ToolWorkspace
        system={SYSTEM}
        actionLabel="Summarize meeting"
        outputLabel="Meeting summary"
        emptyState="Your structured summary will appear here, ready to edit."
        buildPrompt={() =>
          notes.trim().length < 20
            ? null
            : `Summarize these meeting notes.
Meeting: ${meeting || "Untitled meeting"}
Attendees: ${attendees || "Not stated"}
Preferred style: ${style}

Raw notes:
${notes}`
        }
      >
        <Field label="Meeting">
          <Input
            value={meeting}
            onChange={(e) => setMeeting(e.target.value)}
            placeholder="Q3 roadmap review"
          />
        </Field>
        <Field label="Attendees" hint="optional">
          <Input
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="Sam, Priya, Dev, Ops"
          />
        </Field>
        <Field label="Summary style">
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {styles.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Raw notes or transcript">
          <Textarea
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your notes or transcript here…"
            className="resize-none"
          />
        </Field>
      </ToolWorkspace>
    </AppShell>
  );
}
