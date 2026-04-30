import type { Patient } from '../types'

interface StreamAiSummaryOptions {
  patient: Patient
  signal?: AbortSignal
  onToken: (token: string) => void
}

interface AiSummaryResponse {
  summary?: string
  error?: string
}

export async function streamAiPatientSummary({
  onToken,
  patient,
  signal,
}: StreamAiSummaryOptions) {
  const response = await fetch('/api/ai-summary', {
    body: JSON.stringify({ patient }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal,
  })

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? ""

    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as AiSummaryResponse

      throw new Error(payload.error || "Unable to generate AI summary right now.")
    }

    const message = await response.text()

    throw new Error(message || 'Unable to generate AI summary right now.')
  }

  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as AiSummaryResponse
    const summary = payload.summary?.trim()

    if (!summary) {
      throw new Error(payload.error || "No summary was generated.")
    }

    onToken(summary)

    return summary
  }

  if (!response.body) {
    throw new Error('Streaming is not available for this response.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let completeText = ''

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    const token = decoder.decode(value, { stream: true })

    completeText += token
    onToken(token)
  }

  return completeText
}
