import { headers } from "next/headers";

/** 서버 컴포넌트에서 동일 오리진 Route Handler를 호출할 때 사용 */
export async function getAppOrigin(): Promise<string> {
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  return `${protocol}://${host}`;
}
