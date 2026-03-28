import Link from "next/link";
import { EventDetailClient } from "@/components/event-detail-client";
import { getAppOrigin } from "@/lib/api/app-origin";
import type { Event, Response } from "@/lib/types";

type EventDetailPayload = {
  event: Event;
  responses: Response[];
};

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const origin = await getAppOrigin();
  const res = await fetch(`${origin}/api/events/${encodeURIComponent(eventId)}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">이벤트를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">링크가 잘못되었거나 삭제된 이벤트일 수 있습니다.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          홈으로
        </Link>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">불러오지 못했습니다</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">잠시 후 다시 시도해 주세요.</p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          홈으로
        </Link>
      </div>
    );
  }

  const data = (await res.json()) as EventDetailPayload;
  return <EventDetailClient event={data.event} initialResponses={data.responses} />;
}
