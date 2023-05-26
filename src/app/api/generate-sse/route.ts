import { OpenAIStreamPayload, openAIStream } from "@/utils/open-ai-stream";
// import { NextResponse } from "next/server";
// import type { CreateCompletionRequest } from "openai";

export async function POST(request: Request) {
	try {
		const apiKey = process.env.OPENAI_KEY;
		if (!apiKey) throw new Error("OPENAI_KEY env var not set");

		const { prompt } = (await request.json()) as { prompt: string };
		if (!prompt) throw new Error("No prompt provided");

		const payload: OpenAIStreamPayload = {
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: prompt }],
			temperature: 0.7,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			max_tokens: 200,
			stream: true,
			n: 1,
		};

		const stream = await openAIStream(payload, apiKey);

		return new Response(stream);

		// const APIBody: CreateCompletionRequest = {
		// 	model: "text-davinci-003",
		// 	prompt,
		// 	max_tokens: 256,
		// 	temperature: 0.9,
		// 	// stream: true
		// };

		// const options: RequestInit = {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Authorization: `Bearer ${apiKey}`,
		// 	},
		// 	body: JSON.stringify(APIBody),
		// };

		// const response = await fetch("https://api.openai.com/v1/completions", options);

		// if (!response.ok) throw new Error(response.statusText);

		// const data = await response.json();
		// const [{ text }] = data.choices;

		// return NextResponse.json({ msg: "hello" });
	} catch (error) {
		console.error(error);
	}
}
