import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt } = body;

  const APIBody = {
    model: "text-davinci-003",
    prompt,
    temperature: 0,
    max_tokens: 60,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
    },
    body: JSON.stringify(APIBody),
  };

  const response = await fetch(
    "https://api.openai.com/v1/completions",
    options
  );

  if (!response.ok) throw new Error(response.statusText);

  const data = await response.json();
  const [{ text }] = data.choices;

  return NextResponse.json({ msg: text.trim() });
}

export async function GET() {
  return NextResponse.json({ hello: "world" });
}
