/**
 * Supabase 연결 환경 변수.
 *
 * - **서버(Route Handler 등)**: `SUPABASE_URL` + `SUPABASE_ANON_KEY` 를 권장합니다.
 *   Next.js는 `NEXT_PUBLIC_*` 를 빌드 시 번들에 넣을 수 있어, Vercel에 변수를 나중에 넣은 경우
 *   빌드 없이는 반영이 안 되는 문제가 생길 수 있습니다. 서버 전용 이름은 런타임에 읽힙니다.
 * - **브라우저**: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` 만 사용 가능합니다.
 */

export function tryGetServerSupabaseEnv():
  | { ok: true; url: string; anonKey: string }
  | { ok: false } {
  const url = (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  );
  const anonKey = (
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
  if (!url || !anonKey) {
    return { ok: false };
  }
  return { ok: true, url, anonKey };
}

export function getServerSupabaseEnv(): { url: string; anonKey: string } {
  const r = tryGetServerSupabaseEnv();
  if (!r.ok) {
    throw new Error(
      "Supabase URL/키가 없습니다. SUPABASE_URL·SUPABASE_ANON_KEY 또는 NEXT_PUBLIC_SUPABASE_URL·NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.",
    );
  }
  return { url: r.url, anonKey: r.anonKey };
}

function tryGetBrowserSupabaseEnv():
  | { ok: true; url: string; anonKey: string }
  | { ok: false } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    return { ok: false };
  }
  return { ok: true, url, anonKey };
}

/** 클라이언트 컴포넌트용 — NEXT_PUBLIC_* 만 */
export function getSupabaseEnv(): { url: string; anonKey: string } {
  const r = tryGetBrowserSupabaseEnv();
  if (!r.ok) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다. frontend/.env.local을 확인하세요.",
    );
  }
  return { url: r.url, anonKey: r.anonKey };
}
