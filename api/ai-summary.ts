import Groq from "groq-sdk";

const MODEL_NAME = "llama-3.1-8b-instant";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface VercelLikeRequest {
  body?: JsonValue | string;
  method?: string;
}

interface VercelLikeResponse {
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
  status: (code: number) => VercelLikeResponse;
}

interface PatientPayload {
  patient?: JsonValue;
}

const parseBody = (body: VercelLikeRequest["body"]): PatientPayload => {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as PatientPayload;
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object" && !Array.isArray(body)) {
    return body as PatientPayload;
  }

  return {};
};

export default async function handler(
  request: VercelLikeRequest,
  response: VercelLikeResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  if (!process.env.GROQ_API_KEY) {
    return response.status(500).json({
      error: "Missing GROQ_API_KEY environment variable.",
    });
  }

  try {
    const payload = parseBody(request.body);
    const patient = payload.patient;

    if (!patient) {
      return response.status(400).json({
        error: "Patient payload is required.",
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: MODEL_NAME,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a concise clinical operations assistant. Summarize the patient in plain English with short paragraphs covering current condition assessment, medication notes, and risk flags. Do not invent diagnoses or treatment changes.",
        },
        {
          role: "user",
          content: JSON.stringify(patient),
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) {
      return response.status(500).json({
        error: "No summary was generated.",
      });
    }

    return response.status(200).json({ summary });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate AI summary.";

    return response.status(500).json({ error: message });
  }
}
