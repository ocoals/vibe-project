/** 공통 타입 — spec.md §5 기준 */

export type TimeSlot = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
};

export type Event = {
  id: string;
  title: string;
  dates: string[];
  start_time: string;
  end_time: string;
  created_at: string;
};

export type Response = {
  id: string;
  event_id: string;
  participant_name: string;
  available_slots: TimeSlot[];
  created_at: string;
  updated_at: string;
};
