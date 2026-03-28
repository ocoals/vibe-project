"use client";

import { useMemo, useState } from "react";

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type CalendarPickerProps = {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
};

export function CalendarPicker({ selectedDates, onChange }: CalendarPickerProps) {
  const [view, setView] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();

  const { days, leadingBlanks } = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const count = last.getDate();
    const startWeekday = first.getDay();
    return { days: count, leadingBlanks: startWeekday };
  }, [year, month]);

  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);

  function toggleDay(day: number) {
    const key = toDateKey(new Date(year, month, day));
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange([...next].sort());
  }

  function goPrev() {
    setView(new Date(year, month - 1, 1));
  }

  function goNext() {
    setView(new Date(year, month + 1, 1));
  }

  const todayKey = toDateKey(new Date());

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-lg px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="이전 달"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {year}년 {month + 1}월
        </span>
        <button
          type="button"
          onClick={goNext}
          className="rounded-lg px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 font-medium">
            {w}
          </div>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1;
          const key = toDateKey(new Date(year, month, day));
          const selected = selectedSet.has(key);
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleDay(day)}
              className={[
                "aspect-square max-h-10 rounded-lg text-sm transition-colors",
                selected
                  ? "bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                isToday && !selected ? "ring-2 ring-zinc-400 ring-offset-1 dark:ring-zinc-500" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={selected}
              aria-label={`${parseDateKey(key).toLocaleDateString("ko-KR")}${selected ? ", 선택됨" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      {selectedDates.length > 0 && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          선택 {selectedDates.length}일 ·{" "}
          {selectedDates
            .map((d) => parseDateKey(d).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }))
            .join(", ")}
        </p>
      )}
    </div>
  );
}
