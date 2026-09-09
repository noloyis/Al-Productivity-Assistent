import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateFromPrompt } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      {hint ? <span className="ml-2 text-[11px] text-muted-foreground">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function ToolWorkspace({
  system,
  buildPrompt,
  outputLabel,
  actionLabel,
  emptyState,
  children,
}: {
  system: string;
  buildPrompt: () => string | null;
  outputLabel: string;
  actionLabel: string;
  emptyState: string;
  children: ReactNode;
}) {
  const generate = useServerFn(generateFromPrompt);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    const prompt = buildPrompt();
    if (!prompt) {
      toast.error("Add a little more detail before generating.");
      return;
    }
    setLoading(true);
    try {
      const result = await generate({ data: { system, prompt } });
      setOutput(result.text.trim());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <section className="panel p-5 sm:p-6">
        <h2 className="font-display text-sm font-bold text-foreground">Structured prompt</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Fill in the details — Cadence turns them into a well-formed instruction for the model.
        </p>
        <div className="mt-5 space-y-4">{children}</div>
        <Button className="mt-6 w-full" onClick={run} disabled={loading}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="size-4" aria-hidden="true" />
          )}
          {loading ? "Generating…" : actionLabel}
        </Button>
      </section>

      <section className="panel flex min-h-[26rem] flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-bold text-foreground">{outputLabel}</h2>
            <p className="text-xs text-muted-foreground">Fully editable before you use it.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!output}
              onClick={() => {
                void navigator.clipboard.writeText(output);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="size-3.5" aria-hidden="true" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={run} disabled={loading}>
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Regenerate
            </Button>
          </div>
        </div>

        <Textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder={emptyState}
          className="mt-4 min-h-[20rem] flex-1 resize-none bg-surface/60 font-sans text-sm leading-relaxed"
        />

        <p className="mt-3 text-[11px] text-muted-foreground">
          AI-generated draft · verify accuracy and tone before sending.
        </p>
      </section>
    </div>
  );
}
