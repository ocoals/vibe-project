"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AvailabilityGrid } from "@/components/availability-grid";
import { Heatmap } from "@/components/heatmap";
import type { Event, Response, TimeSlot } from "@/lib/types";
import { slotKey, slotTimesBetween } from "@/lib/time-slots";

type EventDetailClientProps = {
  event: Event;
  initialResponses: Response[];
};

function slotsFromKeys(keys: Set<string>): TimeSlot[] {
  const list: TimeSlot[] = [];
  for (const k of keys) {
    const sep = k.indexOf("__");
    if (sep === -1) continue;
    list.push({ date: k.slice(0, sep), time: k.slice(sep + 2) });
  }
  list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  return list;
}

function keysFromSlots(slots: TimeSlot[]): Set<string> {
  return new Set(slots.map((s) => slotKey(s.date, s.time)));
}

export function EventDetailClient({ event, initialResponses }: EventDetailClientProps) {
  const [responses, setResponses] = useState<Response[]>(initialResponses);
  const [participantName, setParticipantName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [banner, setBanner] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = useMemo(
    () => slotTimesBetween(event.start_time, event.end_time),
    [event.start_time, event.end_time],
  );

  const sortedDates = useMemo(
    () => [...event.dates].sort((a, b) => a.localeCompare(b)),
    [event.dates],
  );

  function handleJoin() {
    setBanner(null);
    setSubmitError(null);
    setNameError(null);
    const name = participantName.trim();
    if (!name) {
      setNameError("이름을 입력해 주세요.");
      return;
    }

    const existing = responses.find(
      (r) => r.participant_name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (existing) {
      setSelectedKeys(keysFromSlots(existing.available_slots));
      setIsEditMode(true);
    } else {
      setSelectedKeys(new Set());
      setIsEditMode(false);
    }
    setHasJoined(true);
  }

  async function handleSubmit() {
    setBanner(null);
    setSubmitError(null);
    const name = participantName.trim();
    if (!name || !hasJoined) return;

    const slots = slotsFromKeys(selectedKeys);
    const body = JSON.stringify({
      participant_name: name,
      available_slots: slots,
    });

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const res = await fetch(`/api/events/${encodeURIComponent(event.id)}/responses`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const payload: unknown = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg =
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof (payload as { error: unknown }).error === "string"
              ? (payload as { error: string }).error
              : "응답을 수정하지 못했습니다.";
          setSubmitError(msg);
          return;
        }
        const updated = payload as Response;
        setResponses((prev) =>
          prev.map((r) =>
            r.participant_name.trim().toLowerCase() === name.toLowerCase() ? updated : r,
          ),
        );
        setBanner("응답을 수정했습니다.");
      } else {
        const res = await fetch(`/api/events/${encodeURIComponent(event.id)}/responses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const payload: unknown = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg =
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof (payload as { error: unknown }).error === "string"
              ? (payload as { error: string }).error
              : "응답을 등록하지 못했습니다.";
          setSubmitError(msg);
          return;
        }
        const created = payload as Response;
        setResponses((prev) => [...prev, created]);
        setBanner("응답을 등록했습니다.");
        setIsEditMode(true);
      }
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← 홈으로
      </Link>

      <header className="mt-6 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {event.title}
        </h1>
        <dl className="mt-4 flex flex-wrap gap-6 text-sm">
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">후보 날짜</dt>
            <dd className="mt-1 font-medium text-zinc-800 dark:text-zinc-200">
              {sortedDates.join(", ")}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">시간 범위</dt>
            <dd className="mt-1 font-medium text-zinc-800 dark:text-zinc-200">
              {event.start_time} ~ {event.end_time} (30분 단위)
            </dd>
          </div>
        </dl>
      </header>

      <section className="mt-10" aria-labelledby="response-heading">
        <h2 id="response-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          내 가능 시간
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          이름을 입력한 뒤 참여하기를 누르면 격자에서 시간을 고를 수 있습니다.
        </p>

        {banner && (
          <div
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-100"
            role="status"
          >
            {banner}
          </div>
        )}
        {submitError && (
          <div
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="participant-name" className="sr-only">
              참여자 이름
            </label>
            <input
              id="participant-name"
              type="text"
              value={participantName}
              onChange={(e) => {
                setParticipantName(e.target.value);
                setNameError(null);
              }}
              disabled={hasJoined}
              placeholder="이름"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:disabled:bg-zinc-900"
              autoComplete="name"
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {nameError}
              </p>
            )}
          </div>
          {!hasJoined ? (
            <button
              type="button"
              onClick={handleJoin}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              참여하기
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setHasJoined(false);
                setParticipantName("");
                setSelectedKeys(new Set());
                setIsEditMode(false);
                setBanner(null);
                setSubmitError(null);
                setNameError(null);
              }}
              className="rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              다른 이름으로
            </button>
          )}
        </div>

        {hasJoined && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {isEditMode ? "기존 응답을 불러왔습니다. 수정 후 제출하세요." : "새 응답입니다. 가능한 칸을 선택하세요."}
          </p>
        )}

        <div className="mt-6">
          <AvailabilityGrid
            dates={sortedDates}
            timeSlots={timeSlots}
            selectedKeys={selectedKeys}
            onChange={(updater) => setSelectedKeys((prev) => updater(prev))}
            disabled={!hasJoined}
          />
        </div>

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!hasJoined || isSubmitting}
          className="mt-6 rounded-xl bg-zinc-900 px-8 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? "제출 중…" : isEditMode ? "수정 제출" : "제출"}
        </button>
      </section>

      <section className="mt-14" aria-labelledby="heatmap-heading">
        <h2 id="heatmap-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          응답 요약
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          등록된 응답을 바탕으로 슬롯별 가능 인원을 색으로 표시합니다. 제출·수정 직후 바로 반영됩니다.
        </p>
        {responses.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            아직 응답이 없습니다. 첫 응답이 들어오면 히트맵이 채워집니다.
          </p>
        ) : null}
        <div className="mt-6">
          <Heatmap dates={sortedDates} timeSlots={timeSlots} responses={responses} />
        </div>
      </section>

    </div>
  );
}
