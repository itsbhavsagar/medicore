import { Bot, Sparkles, Square } from "lucide-react";
import { useRef, useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { showAppNotification } from "../../services/notifications";
import type { Patient } from "../../types";
import { streamAiPatientSummary } from "../../services/ai";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface AIPatientSummaryProps {
  patient: Patient;
}

export function AIPatientSummary({ patient }: AIPatientSummaryProps) {
  const { add } = useNotifications();
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

      await showAppNotification(
        "AI Summary ready",
        `AI Summary ready for ${patient.name}`,
      );
    } catch (streamError) {
      if (controller.signal.aborted) {
        setSummary((current) => current || "Summary generation was stopped.");
      } else {
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
    <Card className="border-primary/20 bg-surface p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              AI patient summary
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">
            Generate a streamed summary covering condition assessment,
            medication notes, and current risk flags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isStreaming ? <Badge tone="info">Streaming</Badge> : null}
          <Button
            loading={isStreaming}
            onClick={handleGenerate}
            variant="primary"
            className="cursor-pointer"
            disabled={generatedOnce}
          >
            <Sparkles className="h-4 w-4 inline-flex! mr-2" />
            {generatedOnce ? "Already Generated" : "Generate AI Summary"}
          </Button>
          {isStreaming ? (
            <Button onClick={handleStop} variant="danger">
              <Square className="h-4 w-4 inline-flex! mr-2" />
              Stop
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-surface-elevated p-5">
        {summary ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {summary}
          </p>
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
