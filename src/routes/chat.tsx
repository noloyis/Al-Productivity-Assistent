import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — Cadence" },
      {
        name: "description",
        content:
          "Chat with Cadence about your work: draft, rethink, unblock and plan with an AI assistant that answers in plain, practical language.",
      },
      { property: "og:title", content: "Assistant Chat — Cadence" },
      {
        property: "og:description",
        content: "A practical AI assistant for everyday workplace questions.",
      },
    ],
  }),
  component: ChatTool,
});

type Message = { role: "user" | "assistant"; content: string };

const starters = [
  "Help me push back on a deadline without sounding difficult.",
  "Draft an agenda for a 30-minute project kickoff.",
  "How should I structure a weekly update to leadership?",
];

function ChatTool() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());

      setMessages([...next, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch (error) {
      setMessages(next);
      toast.error(error instanceof Error ? error.message : "The assistant could not reply.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <AppShell title="Assistant Chat" description="Think out loud; get practical answers.">
      <div className="panel mx-auto flex h-[calc(100vh-16rem)] min-h-[30rem] max-w-3xl flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Bot className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold text-foreground">
                What are you working on?
              </h2>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Ask about drafting, planning, prioritising or how to phrase something tricky.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-border bg-surface px-3.5 py-2 text-xs text-surface-foreground transition-colors hover:border-primary/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <span
                className={
                  m.role === "user"
                    ? "grid size-7 shrink-0 place-items-center rounded-lg bg-surface text-surface-foreground"
                    : "grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground"
                }
              >
                {m.role === "user" ? (
                  <User className="size-3.5" aria-hidden="true" />
                ) : (
                  <Bot className="size-3.5" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="eyebrow">{m.role === "user" ? "You" : "Cadence"}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {m.content || "…"}
                </p>
              </div>
            </div>
          ))}

          {loading ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Thinking…
            </p>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="border-t border-border p-3 sm:p-4"
        >
          <div className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask Cadence anything about your work…"
              className="min-h-[3rem] resize-none"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="size-4" aria-hidden="true" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Cadence can make mistakes. Check anything important before you rely on it.
          </p>
        </form>
      </div>
    </AppShell>
  );
}
