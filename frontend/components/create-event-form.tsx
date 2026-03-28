"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarPicker } from "@/components/calendar-picker";
import { TimeRangeSelector } from "@/components/time-range-selector";
import type { Event } from "@/lib/types";
import { isEndAfterStart } from "@/lib/time-slots";

export function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("21:00");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmed = title.trim();
    if (!trimmed) {
      setFormError("이벤트 제목을 입력해 주세요.");
      return;
    }
    if (selectedDates.length === 0) {
      setFormError("후보 날짜를 하나 이상 선택해 주세요.");
      return;
    }
    if (!isEndAfterStart(startTime, endTime)) {
      setFormError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    const dates = [...selectedDates].sort((a, b) => a.localeCompare(b));
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmed,
          dates,
          start_time: startTime,
          end_time: endTime,
        }),
      });
      const payload: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "이벤트를 만들지 못했습니다.";
        setFormError(msg);
        return;
      }
      const created = payload as Event;
      router.push(`/events/${created.id}`);
    } catch {
      setFormError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {formError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {formError}
        </div>
      )}

      <div>
        <label htmlFor="event-title" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          이벤트 제목
        </label>
        <input
          id="event-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 3월 팀 회식"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          autoComplete="off"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">후보 날짜</p>
        <CalendarPicker selectedDates={selectedDates} onChange={setSelectedDates} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">후보 시간 범위 (30분 단위)</p>
        <TimeRangeSelector
          startTime={startTime}
          endTime={endTime}
          onStartChange={setStartTime}
          onEndChange={setEndTime}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto sm:px-8"
      >
        {isSubmitting ? "만드는 중…" : "이벤트 만들기"}
      </button>
    </form>
  );
}
