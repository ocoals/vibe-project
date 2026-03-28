import type { TimeSlot } from "@/lib/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export type CreateEventInput = {
  title: string;
  dates: string[];
  start_time: string;
  end_time: string;
};

export function parseCreateEventBody(
  body: unknown,
): { ok: true; value: CreateEventInput } | { ok: false; error: string } {
  if (body === null || typeof body !== "object") {
    return {
      ok: false,
      error: "title, dates, start_time, end_time 은 필수입니다.",
    };
  }

  const o = body as Record<string, unknown>;
  const title =
    typeof o.title === "string" ? o.title.trim() : "";
  const dates = o.dates;
  const start_time =
    typeof o.start_time === "string" ? o.start_time.trim() : "";
  const end_time =
    typeof o.end_time === "string" ? o.end_time.trim() : "";

  if (!title || !Array.isArray(dates) || dates.length === 0 || !start_time || !end_time) {
    return {
      ok: false,
      error: "title, dates, start_time, end_time 은 필수입니다.",
    };
  }

  if (!dates.every((d) => typeof d === "string" && DATE_RE.test(d))) {
    return {
      ok: false,
      error: "dates는 YYYY-MM-DD 형식의 문자열 배열이어야 합니다.",
    };
  }

  if (!TIME_RE.test(start_time) || !TIME_RE.test(end_time)) {
    return {
      ok: false,
      error: "start_time, end_time은 HH:mm 형식이어야 합니다.",
    };
  }

  return {
    ok: true,
    value: {
      title,
      dates: dates as string[],
      start_time,
      end_time,
    },
  };
}

export type UpsertResponseInput = {
  participant_name: string;
  available_slots: TimeSlot[];
};

export function parseUpsertResponseBody(
  body: unknown,
): { ok: true; value: UpsertResponseInput } | { ok: false; error: string } {
  if (body === null || typeof body !== "object") {
    return {
      ok: false,
      error: "participant_name, available_slots 은 필수입니다.",
    };
  }

  const o = body as Record<string, unknown>;
  const participant_name =
    typeof o.participant_name === "string" ? o.participant_name.trim() : "";
  const available_slots = o.available_slots;

  if (!participant_name || !Array.isArray(available_slots)) {
    return {
      ok: false,
      error: "participant_name, available_slots 은 필수입니다.",
    };
  }

  const slots: TimeSlot[] = [];
  for (const item of available_slots) {
    if (item === null || typeof item !== "object") {
      return {
        ok: false,
        error: "available_slots의 각 항목은 date, time을 포함해야 합니다.",
      };
    }
    const slot = item as Record<string, unknown>;
    const date = typeof slot.date === "string" ? slot.date.trim() : "";
    const time = typeof slot.time === "string" ? slot.time.trim() : "";
    if (!DATE_RE.test(date) || !TIME_RE.test(time)) {
      return {
        ok: false,
        error: "available_slots의 date는 YYYY-MM-DD, time은 HH:mm 형식이어야 합니다.",
      };
    }
    slots.push({ date, time });
  }

  return {
    ok: true,
    value: { participant_name, available_slots: slots },
  };
}
