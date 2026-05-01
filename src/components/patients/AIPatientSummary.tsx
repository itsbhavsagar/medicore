import { Bot, Sparkles, Square } from "lucide-react";
import { useRef, useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useToasts } from "../../hooks/useToasts";
import { showAppNotification } from "../../services/notifications";
import type { Patient } from "../../types";
import { streamAiPatientSummary } from "../../services/ai";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface AIPatientSummaryProps {
  patient: Patient;
}

const formatSummaryText = (text: string) => {
  const normalizedText = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .trim();

  return normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      isBullet: /^[-*]\s+/.test(line),
      text: line.replace(/^[-*]\s+/, "").trim(),
    }));
};

export function AIPatientSummary({ patient }: AIPatientSummaryProps) {
  const { add } = useNotifications();
  const { show } = useToasts();
  const controllerRef = useRef<AbortController | null>(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [generatedOnce, setGeneratedOnce] = useState(false);

  const handleGenerate = async () => {
    if (generatedOnce || isStreaming) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setSummary("Based on the patient's records, ");
    setError(null);
    setIsStreaming(true);

    try {
      await streamAiPatientSummary({
        onToken: (token) => {
          setSummary((current) => current + token);
        },
        patient,
        signal: controller.signal,
      });

      setGeneratedOnce(true);

      add({
        id: `ai-summary-${patient.id}`,
        message: `AI Summary ready for ${patient.name}`,
        title: "AI Summary ready",
      });
      show({
        id: `toast-ai-summary-${patient.id}`,
        message: `${patient.name}'s AI summary is ready to review.`,
        title: "AI summary generated",
        tone: "success",
      });

      await showAppNotification(
        "AI Summary ready",
        `AI Summary ready for ${patient.name}`,
      );
    } catch (streamError) {
      if (controller.signal.aborted) {
        setSummary((current) => current || "Summary generation was stopped.");
      } else {
        show({
          id: `toast-ai-summary-error-${patient.id}`,
          message:
            streamError instanceof Error
              ? streamError.message
              : "Unable to generate the AI summary right now.",
          title: "Summary generation failed",
          tone: "error",
        });
        setError(
          streamError instanceof Error
            ? streamError.message
            : "Unable to generate summary.",
        );
      }
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  };

  const handleStop = () => {
    controllerRef.current?.abort();
  };

  return (
    <Card className="border-primary/20 bg-surface p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              AI patient summary
            </p>
          </div>
          {!summary && !isStreaming ? (
            <p className="mt-2 text-sm leading-6 text-muted">
              Generate a streamed summary covering condition assessment,
              medication notes, and current risk flags.
            </p>
          ) : null}
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 xl:w-auto xl:justify-end">
          {isStreaming ? <Badge tone="info">Streaming</Badge> : null}
          <Button
            iconLeft={<Sparkles className="h-4 w-4" />}
            loading={isStreaming}
            onClick={handleGenerate}
            variant="primary"
            className="min-w-0 flex-1 cursor-pointer px-4 sm:flex-none"
            disabled={generatedOnce}
          >
            {generatedOnce ? "Already Generated" : "Generate AI Summary"}
          </Button>
          {isStreaming ? (
            <Button
              className="flex-1 px-4 sm:flex-none"
              iconLeft={<Square className="h-4 w-4" />}
              onClick={handleStop}
              variant="danger"
            >
              Stop
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 max-w-full overflow-hidden rounded-xl border border-border bg-surface-elevated p-4 sm:p-5">
        {summary ? (
          <div className="space-y-2">
            {formatSummaryText(summary).map((line, index) =>
              line.isBullet ? (
                <div
                  className="flex items-start gap-2 text-sm leading-7 text-foreground"
                  key={`${line.text}-${index}`}
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-subtle" />
                  <span>{line.text}</span>
                </div>
              ) : (
                <p
                  className="text-sm leading-7 text-foreground"
                  key={`${line.text}-${index}`}
                >
                  {line.text}
                </p>
              ),
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Ready to generate contextual summary
            </p>
            <p className="text-sm leading-6 text-muted">
              The response will stream into this panel word by word from the
              Groq-powered backend.
            </p>
          </div>
        )}

        {error ? <div className="mt-4 text-sm text-muted">{error}</div> : null}
      </div>
    </Card>
  );
}
