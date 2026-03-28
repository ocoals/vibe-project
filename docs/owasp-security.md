# OWASP 중심 보안 감사 (미니)

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | Medium | `frontend/app/api/events/route.ts` | `POST` 핸들러, `process.env.NODE_ENV === "development"` 분기(약 48–52행) | 개발 모드에서 500 응답 JSON에 `debug.code`, `debug.message`로 Supabase 오류 정보를 클라이언트에 반환함. | 운영·스테이징과 동일하게 최소 오류 본문만 반환하거나, 상세 원인은 서버 로그·관측 도구로만 남기기. |
| 2 | N/A | (전역) | — | 로그인·JWT·리프레시 토큰·세션 쿠키(`HttpOnly` 등)를 설정하는 코드가 검토 범위에 없음. | 인증을 도입할 때 쿠키 속성·만료·토큰 회전·재사용 완화를 별도 설계. |
| 3 | N/A | (전역) | — | Bcrypt(또는 동등 해시)·`compare` 등 비밀번호 처리 코드가 없음. | 비밀번호 기능 추가 시 cost 12 이상 등 안전한 해시·검증 패턴 적용. |
| 4 | — | `frontend/app/api/events/route.ts`, `frontend/app/api/events/[eventId]/route.ts`, `frontend/app/api/events/[eventId]/responses/route.ts`, `frontend/lib/supabase/server.ts` | `.from()`·`.insert()`·`.eq()` 등 Supabase JS 빌더 호출 | 사용자 입력을 문자열로 이어 붙여 실행하는 Raw SQL·템플릿 리터럴 SQL이 보이지 않음. 파라미터는 클라이언트 API를 통해 전달됨. | 현재 패턴 유지. 최종 접근 통제는 DB **RLS·정책**에 의존하므로, anon 키 사용 전제에서 정책이 의도대로인지 주기적으로 점검. |
