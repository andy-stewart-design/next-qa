import UserInput from "@/components/UserInput";

export default function Home() {
  return (
    <section className="text-l modern-gradient h-screen p-4 shadow-2xl">
      <div className="flex h-full w-full flex-col items-center justify-start bg-gray-700 p-16">
        <UserInput />
      </div>
    </section>
  );
}
