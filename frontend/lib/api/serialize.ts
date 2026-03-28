import type { Event, Response, TimeSlot } from "@/lib/types";

/** DB `time` / 문자열을 API 스펙의 `HH:mm`으로 맞춤 */
export function formatTimeForApi(t: string): string {
  if (t.length >= 5) return t.slice(0, 5);
  return t;
}

/** `date` / timestamptz 문자열을 `YYYY-MM-DD`로 맞춤 */
export function normalizeDateString(d: string): string {
  if (d.length >= 10) return d.slice(0, 10);
  return d;
}

type EventRow = {
  id: string;
  title: string;
  dates: string[];
  start_time: string;
  end_time: string;
  created_at: string;
};

export function eventRowToApi(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    dates: row.dates.map(normalizeDateString),
    start_time: formatTimeForApi(row.start_time),
    end_time: formatTimeForApi(row.end_time),
    created_at: row.created_at,
  };
}

type ResponseRow = {
  id: string;
  event_id: string;
  participant_name: string;
  available_slots: TimeSlot[] | unknown;
  created_at: string;
  updated_at: string;
};

export function responseRowToApi(row: ResponseRow): Response {
  const slots = Array.isArray(row.available_slots)
    ? (row.available_slots as TimeSlot[]).map((s) => ({
        date: normalizeDateString(s.date),
        time: formatTimeForApi(s.time),
      }))
    : [];

  return {
    id: row.id,
    event_id: row.event_id,
    participant_name: row.participant_name,
    available_slots: slots,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
