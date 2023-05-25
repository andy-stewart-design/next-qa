"use client";

import { useState, MouseEvent, KeyboardEvent } from "react";

export default function ClientSection() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState<string | undefined>(undefined);

  const generateResponse = async (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if (answer) setAnswer(undefined);
    setPrompt("");
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    if (!data) return;

    setAnswer(data.msg);
    setLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateResponse();
    }
  };

  return (
    <div className="w-full max-w-xl space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        rows={4}
        maxLength={200}
        className="focus:outline-0 w-full rounded-md border
         p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 block"
        placeholder={"e.g. What is React?"}
      />
      {!loading ? (
        <button
          className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-black/80"
          onClick={(e) => generateResponse(e)}
        >
          Generate Response
        </button>
      ) : (
        <button
          disabled
          className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white"
        >
          <div className="animate-pulse font-bold tracking-widest">...</div>
        </button>
      )}
      {answer && (
        <div>
          <p className="text-left">{answer}</p>
        </div>
      )}
    </div>
  );
}
