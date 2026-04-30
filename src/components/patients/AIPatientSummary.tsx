import { Bot, Sparkles, Square } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Patient } from '../../types'
import { streamAiPatientSummary } from '../../services/ai'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface AIPatientSummaryProps {
  patient: Patient
}

export function AIPatientSummary({ patient }: AIPatientSummaryProps) {
  const controllerRef = useRef<AbortController | null>(null)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const handleGenerate = async () => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setSummary("Based on the patient's records, ")
    setError(null)
    setIsStreaming(true)

    try {
      const seedLength = "Based on the patient's records, ".length

      await streamAiPatientSummary({
        onToken: (token) => {
          setSummary((current) =>
            current.length <= seedLength ? current + token : current + token,
          )
        },
        patient,
        signal: controller.signal,
      })
    } catch (streamError) {
      if (controller.signal.aborted) {
        setSummary((current) => current || 'Summary generation was stopped.')
      } else {
        setError(
          streamError instanceof Error
            ? streamError.message
            : 'Unable to generate summary.',
        )
      }
    } finally {
      setIsStreaming(false)
      controllerRef.current = null
    }
  }

  const handleStop = () => {
    controllerRef.current?.abort()
  }

  return (
    <Card className="rounded-[24px] border-primary/20 bg-[linear-gradient(145deg,var(--app-primary-soft),transparent_55%),var(--app-surface)] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold text-foreground">
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
          >
            <Sparkles className="h-4 w-4" />
            Generate AI Summary
          </Button>
          {isStreaming ? (
            <Button onClick={handleStop} variant="danger">
              <Square className="h-4 w-4" />
              Stop
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-border bg-surface p-5">
        {summary ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {summary}
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Ready to generate contextual summary
            </p>
            <p className="text-sm leading-6 text-muted">
              The response will stream into this panel word by word from the
              Groq-powered backend.
            </p>
          </div>
        )}

        {error ? (
          <div className="mt-4 rounded-2xl border border-danger/30 bg-[var(--status-critical-bg)] px-4 py-3 text-sm text-[var(--status-critical-text)]">
            {error}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
