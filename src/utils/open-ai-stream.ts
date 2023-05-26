import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
	role: ChatGPTAgent;
	content: string;
}

export interface OpenAIStreamPayload {
	model: string;
	messages: ChatGPTMessage[];
	temperature: number;
	top_p: number;
	frequency_penalty: number;
	presence_penalty: number;
	max_tokens: number;
	stream: boolean;
	n: number;
}

export interface OpenAIResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: [{ delta: { role?: "ChatGPTAgent"; content?: string }; index: number; finish_reason: string | null }];
}

export async function openAIStream(payload: OpenAIStreamPayload, key: string) {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

	let counter = 0;

	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${key}`,
		},
		body: JSON.stringify(payload),
	};

	const response = await fetch("https://api.openai.com/v1/chat/completions", options);

	const stream = new ReadableStream({
		async start(controller) {
			function onParse(event: ParsedEvent | ReconnectInterval) {
				if (event.type === "event") {
					const { data } = event;

					if (data === "[DONE]") {
						// console.log("The stream is done");

						controller.close();
						return;
					}

					try {
						const json: OpenAIResponse = JSON.parse(data);
						const text = json.choices[0].delta?.content || "";
						// console.log("text", text);
						// console.log("counter", counter);

						// I'm don't completely the purpose of this line. It checks if we receive a line break
						// as one of the first two responses, but I'm not sure why that is necessary
						if (counter < 2 && (text.match(/\n/) || []).length) return;

						const queue = encoder.encode(text);
						controller.enqueue(queue);

						counter++;
					} catch (error) {
						controller.error(error);
					}
				}
			}

			const parser = createParser(onParse);

			for await (const chunk of response.body as any) {
				parser.feed(decoder.decode(chunk));
			}
		},
	});

	return stream;
}
