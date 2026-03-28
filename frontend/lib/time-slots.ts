/** 30분 단위 시각 라벨 00:00 ~ 23:30 */
export const HALF_HOUR_TIMES: string[] = (() => {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      if (h === 23 && m === 30) {
        out.push("23:30");
        return out;
      }
      out.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }
  }
  return out;
})();

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function isEndAfterStart(start: string, end: string): boolean {
  return timeToMinutes(end) > timeToMinutes(start);
}

/** [start, end) 구간의 30분 슬롯 시작 시각 (예: 09:00~21:00 → …20:30까지) */
export function slotTimesBetween(start: string, end: string): string[] {
  const out: string[] = [];
  let m = timeToMinutes(start);
  const endM = timeToMinutes(end);
  while (m < endM) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    out.push(`${String(h).padStart(2, "0")}:${mm === 0 ? "00" : "30"}`);
    m += 30;
  }
  return out;
}

export function slotKey(date: string, time: string): string {
  return `${date}__${time}`;
}
