import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Compass, MessagesSquare, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cadence — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Cadence helps professionals draft emails, summarize meetings, plan tasks and research faster with AI-assisted, fully editable outputs.",
      },
      { property: "og:title", content: "Cadence — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan tasks and research faster with editable AI outputs.",
      },
    ],
  }),
  component: Overview,
});

const tools = [
  {
    to: "/email" as const,
    icon: Mail,
    name: "Smart Email Generator",
    blurb: "Turn a few bullet points into a polished, on-tone email in seconds.",
  },
  {
    to: "/notes" as const,
    icon: NotebookPen,
    name: "Meeting Notes Summarizer",
    blurb: "Condense raw notes or transcripts into decisions, actions and owners.",
  },
  {
    to: "/planner" as const,
    icon: ListChecks,
    name: "AI Task Planner",
    blurb: "Break a goal into a sequenced plan with effort estimates and priorities.",
  },
  {
    to: "/research" as const,
    icon: Compass,
    name: "AI Research Assistant",
    blurb: "Get a structured briefing on any work topic, with open questions flagged.",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    name: "Assistant Chat",
    blurb: "Think out loud with an assistant that keeps your working context.",
  },
];

function Overview() {
  return (
    <AppShell
      title="Overview"
      description="Five AI tools for the work that eats your calendar."
    >
      <section className="panel overflow-hidden p-6 sm:p-8">
        <p className="eyebrow">Cadence workspace</p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl font-extrabold text-foreground sm:text-3xl">
          Automate the writing, summarizing and planning around your real work.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Every tool uses a structured prompt so results are consistent, and every output lands in
          an editable panel so the final words are always yours.
        </p>
        <Link
          to="/email"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start with an email
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, icon: Icon, name, blurb }) => (
          <Link
            key={to}
            to={to}
            className="panel group p-5 transition-colors hover:border-primary/40"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-sm font-bold text-foreground">{name}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{blurb}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              Open
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
