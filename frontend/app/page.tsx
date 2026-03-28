import { CreateEventForm } from "@/components/create-event-form";

export default function Home() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:max-w-xl sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          WhenWeMeet
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          후보 날짜와 시간을 정한 뒤 링크로 팀원과 가능 시간을 모아 보세요.
        </p>
      </header>

      <CreateEventForm />
    </div>
  );
}
