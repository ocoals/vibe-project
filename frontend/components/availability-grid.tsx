"use client";

import { useCallback, useEffect, useRef } from "react";
import { slotKey } from "@/lib/time-slots";

type AvailabilityGridProps = {
  dates: string[];
  timeSlots: string[];
  selectedKeys: Set<string>;
  /** 드래그 연속 갱신 시 이전 Set 기준으로 안전하게 병합 */
  onChange: (updater: (prev: Set<string>) => Set<string>) => void;
  disabled?: boolean;
};

export function AvailabilityGrid({
  dates,
  timeSlots,
  selectedKeys,
  onChange,
  disabled = false,
}: AvailabilityGridProps) {
  const dragRef = useRef<{ active: boolean; mode: "add" | "remove" } | null>(null);

  const applyMode = useCallback((date: string, time: string, mode: "add" | "remove") => {
    const key = slotKey(date, time);
    onChange((prev) => {
      const next = new Set(prev);
      if (mode === "add") next.add(key);
      else next.delete(key);
      return next;
    });
  }, [onChange]);

  useEffect(() => {
    const endDrag = () => {
      dragRef.current = null;
    };
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  function handleDown(date: string, time: string) {
    if (disabled) return;
    const key = slotKey(date, time);
    const on = selectedKeys.has(key);
    const mode = on ? "remove" : "add";
    dragRef.current = { active: true, mode };
    applyMode(date, time, mode);
  }

  function handleEnter(date: string, time: string) {
    const d = dragRef.current;
    if (!d?.active) return;
    applyMode(date, time, d.mode);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div
        className="inline-block min-w-full select-none p-2"
        style={{ touchAction: "none" }}
      >
        <div
          className="grid gap-px bg-zinc-200 dark:bg-zinc-700"
          style={{
            gridTemplateColumns: `minmax(4.5rem,auto) repeat(${dates.length}, minmax(2.75rem,1fr))`,
          }}
        >
          <div className="bg-zinc-50 p-2 text-xs font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400" />
          {dates.map((d) => (
            <div
              key={d}
              className="bg-zinc-50 p-2 text-center text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {d.slice(5).replace("-", "/")}
            </div>
          ))}
          {timeSlots.map((time) => (
            <div key={time} className="contents">
              <div className="flex items-center bg-zinc-50 px-2 py-1 text-xs tabular-nums text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                {time}
              </div>
              {dates.map((date) => {
                const key = slotKey(date, time);
                const on = selectedKeys.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={disabled}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleDown(date, time);
                    }}
                    onPointerEnter={() => handleEnter(date, time)}
                    className={[
                      "min-h-8 min-w-8 transition-colors",
                      disabled
                        ? "cursor-not-allowed bg-zinc-100 opacity-50 dark:bg-zinc-900"
                        : "cursor-pointer bg-white hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800",
                      on && !disabled
                        ? "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={`${date} ${time}${on ? ", 선택됨" : ""}`}
                    aria-pressed={on}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        셀을 누르거나 드래그해 가능한 시간을 표시하세요.
      </p>
    </div>
  );
}
