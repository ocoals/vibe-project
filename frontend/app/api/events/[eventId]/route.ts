import { NextResponse } from "next/server";
import { eventRowToApi, responseRowToApi } from "@/lib/api/serialize";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;

  try {
    const supabase = createServerSupabaseClient();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .maybeSingle();

    if (eventError) {
      console.error("[GET /api/events/[eventId]]", eventError);
      return NextResponse.json(
        { error: "이벤트를 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    if (!event) {
      return NextResponse.json(
        { error: "이벤트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (responsesError) {
      console.error("[GET /api/events/[eventId]] responses", responsesError);
      return NextResponse.json(
        { error: "응답 목록을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      event: eventRowToApi(event),
      responses: (responses ?? []).map((r) => responseRowToApi(r)),
    });
  } catch (e) {
    console.error("[GET /api/events/[eventId]]", e);
    return NextResponse.json(
      { error: "서버 설정을 확인하세요." },
      { status: 500 },
    );
  }
}
