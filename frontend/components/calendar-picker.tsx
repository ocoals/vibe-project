"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useMemo, useState } from "react";
import { I18nProvider, useLocale } from "react-aria-components";

import { cn } from "@/lib/utils";
import {
  calendarGridClass,
  calendarHeaderClass,
  calendarManualCellClasses,
  calendarManualPickerHeadingClass,
  calendarManualPickerWeekdayHeaderCellClass,
  calendarNavButtonClass,
  calendarRootClass,
} from "@/components/ui/calendar-classes";

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

function todayDateKey(): string {
  const t = today(getLocalTimeZone());
  return `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
}

function CalendarPickerInner({ selectedDates, onChange }: CalendarPickerProps) {
  const { direction } = useLocale();

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

  const todayKey = useMemo(() => todayDateKey(), []);

  const weeks = useMemo(() => {
    const cells: Array<number | "blank"> = [
      ...Array.from({ length: leadingBlanks }, () => "blank" as const),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ];
    const trailing = (7 - (cells.length % 7)) % 7;
    for (let i = 0; i < trailing; i++) cells.push("blank");
    const rows: Array<Array<number | "blank">> = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [leadingBlanks, days]);

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

  return (
    <div
      className={cn(
        "@container w-full min-w-84 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
      )}
    >
      <div className={cn(calendarRootClass, "max-w-none")}>
        <header className={calendarHeaderClass}>
          <button type="button" onClick={goPrev} className={calendarNavButtonClass} aria-label="이전 달">
            {direction === "rtl" ? (
              <ChevronRightIcon className="size-[18px]" aria-hidden />
            ) : (
              <ChevronLeftIcon className="size-[18px]" aria-hidden />
            )}
          </button>
          <div className={calendarManualPickerHeadingClass}>
            {year}년 {month + 1}월
          </div>
          <button type="button" onClick={goNext} className={calendarNavButtonClass} aria-label="다음 달">
            {direction === "rtl" ? (
              <ChevronLeftIcon className="size-[18px]" aria-hidden />
            ) : (
              <ChevronRightIcon className="size-[18px]" aria-hidden />
            )}
          </button>
        </header>

        <table className={calendarGridClass}>
          <thead>
            <tr>
              {WEEKDAYS.map((w) => (
                <th key={w} scope="col" className={calendarManualPickerWeekdayHeaderCellClass}>
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((cell, ci) => {
                  if (cell === "blank") {
                    return (
                      <td key={`${wi}-${ci}`} className="p-0 align-middle" />
                    );
                  }
                  const dateKey = toDateKey(new Date(year, month, cell));
                  const selected = selectedSet.has(dateKey);
                  const isTodayCell = dateKey === todayKey;
                  return (
                    <td key={dateKey} className="p-0 align-middle">
                      <button
                        type="button"
                        onClick={() => toggleDay(cell)}
                        className={calendarManualCellClasses({
                          isSelected: selected,
                          isToday: isTodayCell,
                          size: "lg",
                        })}
                        aria-pressed={selected}
                        aria-label={`${parseDateKey(dateKey).toLocaleDateString("ko-KR")}${selected ? ", 선택됨" : ""}`}
                      >
                        {cell}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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

export function CalendarPicker(props: CalendarPickerProps) {
  return (
    <I18nProvider locale="ko-KR">
      <CalendarPickerInner {...props} />
    </I18nProvider>
  );
}
