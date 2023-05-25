import UserInput from "@/components/UserInput";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 text-center">
      <h1 className="my-4 text-6xl font-bold">My GPT App</h1>
      <div className="flex flex-col items-center gap-2 font-mono md:flex-row">
        <p className="font-bold">
          Ask a question.
          <span className="text-neutral-400">(Max. 200 characters)</span>
        </p>
      </div>
      <UserInput />
    </main>
  );
}
