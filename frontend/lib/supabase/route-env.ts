import { NextResponse } from "next/server";

import { tryGetServerSupabaseEnv } from "./env";

/** Supabase 서버용 환경 변수가 없으면 503 + 안내 JSON, 있으면 null */
export function supabaseEnvMissingResponse(): NextResponse | null {
  if (tryGetServerSupabaseEnv().ok) {
    return null;
  }
  return NextResponse.json(
    {
      error:
        "Supabase 연결 정보가 없습니다. Vercel → Environment Variables에 SUPABASE_URL·SUPABASE_ANON_KEY(권장) 또는 NEXT_PUBLIC_SUPABASE_URL·NEXT_PUBLIC_SUPABASE_ANON_KEY를 넣고, 특히 NEXT_PUBLIC_*만 썼다면 한 번 재배포하세요.",
    },
    { status: 503 },
  );
}
