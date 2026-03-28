import { NextResponse } from "next/server";
import { responseRowToApi } from "@/lib/api/serialize";
import { parseUpsertResponseBody } from "@/lib/api/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DUPLICATE_RESPONSE =
  "이미 같은 이름으로 응답이 존재합니다. 수정하려면 PUT을 사용하세요.";
const NOT_FOUND_RESPONSE =
  "해당 이름의 응답이 존재하지 않습니다.";

async function ensureEventExists(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  eventId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    console.error("[responses] ensureEventExists", error);
    return false;
  }
  return !!data;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 올바른 JSON이 아닙니다." },
      { status: 400 },
    );
  }

  const parsed = parseUpsertResponseBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { participant_name, available_slots } = parsed.value;

  try {
    const supabase = createServerSupabaseClient();

    const exists = await ensureEventExists(supabase, eventId);
    if (!exists) {
      return NextResponse.json(
        { error: "이벤트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const { data, error } = await supabase
      .from("responses")
      .insert({
        event_id: eventId,
        participant_name,
        available_slots,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: DUPLICATE_RESPONSE }, { status: 409 });
      }
      if (error.code === "23503") {
        return NextResponse.json(
          { error: "이벤트를 찾을 수 없습니다." },
          { status: 404 },
        );
      }
      console.error("[POST .../responses]", error);
      return NextResponse.json(
        { error: "응답을 등록하지 못했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json(responseRowToApi(data), { status: 201 });
  } catch (e) {
    console.error("[POST .../responses]", e);
    return NextResponse.json(
      { error: "서버 설정을 확인하세요." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 올바른 JSON이 아닙니다." },
      { status: 400 },
    );
  }

  const parsed = parseUpsertResponseBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { participant_name, available_slots } = parsed.value;
  const updated_at = new Date().toISOString();

  try {
    const supabase = createServerSupabaseClient();

    const exists = await ensureEventExists(supabase, eventId);
    if (!exists) {
      return NextResponse.json(
        { error: "이벤트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const { data, error } = await supabase
      .from("responses")
      .update({
        available_slots,
        updated_at,
      })
      .eq("event_id", eventId)
      .eq("participant_name", participant_name)
      .select()
      .maybeSingle();

    if (error) {
      console.error("[PUT .../responses]", error);
      return NextResponse.json(
        { error: "응답을 수정하지 못했습니다." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: NOT_FOUND_RESPONSE }, { status: 404 });
    }

    return NextResponse.json(responseRowToApi(data));
  } catch (e) {
    console.error("[PUT .../responses]", e);
    return NextResponse.json(
      { error: "서버 설정을 확인하세요." },
      { status: 500 },
    );
  }
}
