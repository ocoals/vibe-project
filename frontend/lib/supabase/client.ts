"use client";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/**
 * 브라우저(클라이언트 컴포넌트)에서 사용하는 Supabase 클라이언트.
 */
export function createBrowserSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey);
}
