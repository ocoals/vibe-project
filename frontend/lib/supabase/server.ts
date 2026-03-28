import { createClient } from "@supabase/supabase-js";
import { getServerSupabaseEnv } from "./env";

/**
 * 서버(Server Components, Route Handlers, Server Actions)에서 사용하는 Supabase 클라이언트.
 * anon 키 + RLS를 전제로 합니다. 서비스 롤 키는 이 파일에 넣지 마세요.
 */
export function createServerSupabaseClient() {
  const { url, anonKey } = getServerSupabaseEnv();
  return createClient(url, anonKey);
}
