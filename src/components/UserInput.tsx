"use client";

import { useState, MouseEvent, KeyboardEvent } from "react";

export default function ClientSection() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateResponse();
    }
  };

  return (
    <div className="grid w-full max-w-2xl gap-6">
      <div className="flex items-center gap-2 rounded-full bg-gray-900 p-6 px-8 shadow-2xl">
        {loading ? <LoadingSpinner /> : <Search />}
        <input
          className="grow bg-transparent p-2 focus:outline-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="What do you want to know?"
          disabled={loading}
        />
      </div>

      {answer && (
        <div className={"px-8 pt-6"}>
          <p className="text-left">{answer}</p>
        </div>
      )}
    </div>
  );
}

const Search = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 14L22 22M16 9C16 12.866 12.866 16 9 16C5.13401 16 2 12.866 2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const LoadingSpinner = () => {
  return (
    <svg
      className="animate-spin"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.3"
      ></circle>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
        d="M12 4a8 8 0 00-5.657 13.657"
      ></path>
    </svg>
  );
};
