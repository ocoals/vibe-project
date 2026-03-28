"use client";

import { HALF_HOUR_TIMES, isEndAfterStart } from "@/lib/time-slots";

type TimeRangeSelectorProps = {
  startTime: string;
  endTime: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
};

export function TimeRangeSelector({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
}: TimeRangeSelectorProps) {
  const rangeInvalid = !isEndAfterStart(startTime, endTime);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            시작 시간
          </span>
          <select
            value={startTime}
            onChange={(e) => onStartChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            {HALF_HOUR_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            종료 시간
          </span>
          <select
            value={endTime}
            onChange={(e) => onEndChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          >
            {HALF_HOUR_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      {rangeInvalid && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          종료 시간은 시작 시간보다 늦어야 합니다.
        </p>
      )}
    </div>
  );
}
