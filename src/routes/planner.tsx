import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace, Field } from "@/components/tool-workspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Cadence" },
      {
        name: "description",
        content:
          "Break a work goal into a sequenced, prioritized task plan with owners, effort estimates and dependencies.",
      },
      { property: "og:title", content: "AI Task Planner — Cadence" },
      {
        property: "og:description",
        content: "Turn a goal into a sequenced, prioritized plan you can edit.",
      },
    ],
  }),
  component: PlannerTool,
});

const SYSTEM = `You are a pragmatic project planner. Produce a numbered task plan.
For each task give: task name, one-line description, priority (High/Medium/Low), rough effort, suggested owner role, and dependencies.
End with a short "Risks and assumptions" section. Be realistic — do not pad the plan with filler tasks.`;

const horizons = ["This week", "Two weeks", "One month", "This quarter"];

function PlannerTool() {
  const [goal, setGoal] = useState("");
  const [horizon, setHorizon] = useState(horizons[1]);
  const [team, setTeam] = useState("");
  const [constraints, setConstraints] = useState("");

  return (
    <AppShell title="AI Task Planner" description="A goal in, a sequenced plan out.">
      <ToolWorkspace
        system={SYSTEM}
        actionLabel="Build plan"
        outputLabel="Task plan"
        emptyState="Your task plan will appear here, ready to edit."
        buildPrompt={() =>
          goal.trim().length < 8
            ? null
            : `Create a task plan.
Goal: ${goal}
Time horizon: ${horizon}
People available: ${team || "Not stated"}
Constraints and context: ${constraints || "None stated"}`
        }
      >
        <Field label="Goal">
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Launch the customer onboarding revamp"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Time horizon">
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {horizons.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </Field>
          <Field label="People available">
            <Input
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="2 engineers, 1 designer"
            />
          </Field>
        </div>
        <Field label="Constraints and context">
          <Textarea
            rows={6}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="Budget frozen until July; legal review takes 5 working days…"
            className="resize-none"
          />
        </Field>
      </ToolWorkspace>
    </AppShell>
  );
}
