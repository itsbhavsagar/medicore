import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import Groq from 'groq-sdk'

dotenv.config()

const app = express()
const PORT = Number(process.env.AI_SERVER_PORT ?? 8787)
const MODEL_NAME = 'llama-3.1-8b-instant'

app.use(cors())
app.use(express.json())

app.get('/health', (_request, response) => {
  response.json({ ok: true, service: 'medicore-ai-server' })
})

app.post('/api/ai-summary', async (request, response) => {
  const { patient } = request.body ?? {}

  if (!process.env.GROQ_API_KEY) {
    response
      .status(500)
      .send('Missing GROQ_API_KEY. Add it to your environment to enable AI summaries.')

    return
  }

  if (!patient) {
    response.status(400).send('Patient payload is required.')

    return
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.setHeader('Transfer-Encoding', 'chunked')

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a concise clinical operations assistant. Summarize the patient in plain English with short paragraphs covering current condition assessment, medication notes, and risk flags. Do not invent diagnoses or treatment changes.',
        },
        {
          role: 'user',
          content: JSON.stringify(patient),
        },
      ],
      model: MODEL_NAME,
      stream: true,
      temperature: 0.3,
    })

    for await (const chunk of completion) {
      const token = chunk.choices[0]?.delta?.content ?? ''

      if (token) {
        response.write(token)
      }
    }

    response.end()
  } catch (error) {
    if (!response.headersSent) {
      response.status(500).send('Unable to stream AI summary right now.')

      return
    }

    const message =
      error instanceof Error
        ? `\n\nSummary stream interrupted: ${error.message}`
        : '\n\nSummary stream interrupted.'

    response.write(message)
    response.end()
  }
})

app.listen(PORT, () => {
  process.stdout.write(`MediCore AI server listening on port ${PORT}\n`)
})
