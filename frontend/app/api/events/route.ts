import { NextResponse } from "next/server";
import { parseCreateEventBody } from "@/lib/api/validation";
import { eventRowToApi } from "@/lib/api/serialize";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 올바른 JSON이 아닙니다." },
      { status: 400 },
    );
  }

  const parsed = parseCreateEventBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { title, dates, start_time, end_time } = parsed.value;

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("events")
      .insert({
        title,
        dates,
        start_time,
        end_time,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/events]", error);
      return NextResponse.json(
        { error: "이벤트를 생성하지 못했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json(eventRowToApi(data), { status: 201 });
  } catch (e) {
    console.error("[POST /api/events]", e);
    return NextResponse.json(
      { error: "서버 설정을 확인하세요." },
      { status: 500 },
    );
  }
}
