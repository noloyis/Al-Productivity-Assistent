import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Compass,
  MessagesSquare,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Compass },
  { to: "/chat", label: "Assistant Chat", icon: MessagesSquare },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-5 py-6 text-sidebar-foreground"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary font-display text-base font-bold text-sidebar-primary-foreground">
          C
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-bold">Cadence</span>
          <span className="block text-[11px] text-muted-foreground">Workplace AI</span>
        </span>
      </Link>

      <p className="eyebrow px-5 pb-2">Workspace</p>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeOptions={{ exact: to === "/" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            activeProps={{
              className: cn(
                "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
              ),
            }}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-card p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
          Responsible AI
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Everything here is an AI-generated draft. Review facts, tone and confidentiality before
          you send or act on it.
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-5 py-4 backdrop-blur-md sm:px-8">
          <button
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-bold text-foreground">{title}</h1>
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>

        <footer className="border-t border-border px-5 py-4 text-[11px] leading-relaxed text-muted-foreground sm:px-8">
          Cadence produces AI-generated suggestions that can be incomplete or inaccurate. Do not
          enter regulated personal data, and always apply your own professional judgement before
          sharing outputs.
        </footer>
      </div>
    </div>
  );
}
