"use client";

import { useCallback, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Response } from "@/lib/types";
import { slotKey } from "@/lib/time-slots";

type HeatmapProps = {
  dates: string[];
  timeSlots: string[];
  responses: Response[];
};

type TooltipState = {
  x: number;
  y: number;
  names: string[];
  date: string;
  time: string;
};

function namesForSlot(responses: Response[], date: string, time: string): string[] {
  const names: string[] = [];
  for (const r of responses) {
    const hit = r.available_slots.some((s) => s.date === date && s.time === time);
    if (hit) names.push(r.participant_name);
  }
  return names;
}

/** 0명=거의 투명, 전원=가장 진한 색 (라이트/다크 모두 대비 유지) */
function cellBackground(count: number, total: number): string {
  if (total <= 0 || count <= 0) {
    return "rgba(24, 24, 27, 0.06)"; // zinc-900 @ low alpha (light)
  }
  const t = count / total;
  // emerald-500 ≈ rgb(16, 185, 129)
  const alpha = 0.12 + 0.78 * t;
  return `rgba(16, 185, 129, ${alpha})`;
}

function cellBackgroundDark(count: number, total: number): string {
  if (total <= 0 || count <= 0) {
    return "rgba(244, 244, 245, 0.06)";
  }
  const t = count / total;
  const alpha = 0.14 + 0.72 * t;
  return `rgba(52, 211, 153, ${alpha})`;
}

export function Heatmap({ dates, timeSlots, responses }: HeatmapProps) {
  const total = responses.length;
  const [tip, setTip] = useState<TooltipState | null>(null);

  const showTip = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, date: string, time: string, names: string[]) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setTip({
        x: rect.left + rect.width / 2,
        y: rect.top,
        names,
        date,
        time,
      });
    },
    [],
  );

  const hideTip = useCallback(() => setTip(null), []);

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="inline-block min-w-full p-2">
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
                  const names = namesForSlot(responses, date, time);
                  const count = names.length;
                  const allAvailable = total > 0 && count === total;

                  return (
                    <div
                      key={key}
                      className={[
                        "relative min-h-8 min-w-8",
                        allAvailable
                          ? "ring-2 ring-amber-400 ring-inset dark:ring-amber-300"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onPointerEnter={(e) => showTip(e, date, time, names)}
                      onPointerLeave={hideTip}
                      onPointerCancel={hideTip}
                    >
                      <div
                        className="absolute inset-0 dark:hidden"
                        style={{ backgroundColor: cellBackground(count, total) }}
                        aria-hidden
                      />
                      <div
                        className="absolute inset-0 hidden dark:block"
                        style={{ backgroundColor: cellBackgroundDark(count, total) }}
                        aria-hidden
                      />
                      <span className="sr-only">
                        {date} {time}, 가능 {count}명
                        {names.length > 0 ? `: ${names.join(", ")}` : ""}
                        {allAvailable ? ", 전원 가능" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          색이 진할수록 가능한 인원이 많습니다. 노란 테두리는 전원이 가능한 슬롯입니다. 셀에 마우스를 올리면
          참여자 이름을 볼 수 있습니다.
        </p>
      </div>

      {tip && tip.names.length > 0 && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 max-w-xs rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          style={{
            left: tip.x,
            top: tip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-semibold tabular-nums">
            {tip.date} {tip.time}
          </div>
          <ul className="mt-1 list-inside list-disc text-zinc-700 dark:text-zinc-300">
            {tip.names.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {tip && tip.names.length === 0 && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
          style={{
            left: tip.x,
            top: tip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tip.date} {tip.time} — 가능한 사람 없음
        </div>
      )}
    </div>
  );
}
