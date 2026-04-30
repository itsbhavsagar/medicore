import type { Patient } from '../types'

interface StreamAiSummaryOptions {
  patient: Patient
  signal?: AbortSignal
  onToken: (token: string) => void
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
    const message = await response.text()

    throw new Error(message || 'Unable to generate AI summary right now.')
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
