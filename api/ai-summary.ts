import Groq from "groq-sdk";

export const config = {
  runtime: "nodejs",
};

const MODEL_NAME = "llama-3.1-8b-instant";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed. Use POST." },
      {
        status: 405,
        headers: {
          Allow: "POST",
        },
      },
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "Missing GROQ_API_KEY environment variable." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const patient = body?.patient;

    if (!patient) {
      return Response.json(
        { error: "Patient payload is required." },
        { status: 400 },
      );
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
      return Response.json(
        { error: "No summary was generated." },
        { status: 500 },
      );
    }

    return Response.json({ summary }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate AI summary.";

    return Response.json({ error: message }, { status: 500 });
  }
}
