# Next.js + TypeScript 아키텍처·코드 품질 감사

**검토 범위:** `frontend/` (App Router, `components/`, `lib/`, `app/api/`). `.env` 실제 값은 읽지 않음.

| 일련번호 | 우선순위 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | Medium | `components/create-event-form.tsx`, `components/event-detail-client.tsx` | fetch 후 JSON 파싱·`!res.ok` 분기(각각 약 50–62행, 108–147행 등) | API 오류 메시지 추출(`error` 문자열 필드) 패턴이 클라이언트 여러 곳에서 반복됨 | 공통 유틸 함수(예: 알려진 형태의 JSON에서 오류 문자열 추출)로 묶어 수정 시 한곳만 갱신하도록 정리. |
| 2 | Medium | `components/heatmap.tsx`, `components/availability-grid.tsx` | 격자 레이아웃(날짜 헤더, 시간 행, `gridTemplateColumns` 등) | 동일한 “날짜×시간” 격자 뼈대와 일부 스타일 패턴이 두 파일에 중복됨 | 읽기 전용(히트맵)과 선택(격자) 차이는 두되, 헤더·행 렌더 공통 부분을 작은 프레젠테이션 컴포넌트나 공유 레이아웃으로 분리하는 방안 검토. |
| 3 | Medium | `app/api/events/[eventId]/responses/route.ts` | `POST`·`PUT` 각각 | `request.json()` 처리, `supabaseEnvMissingResponse`, `ensureEventExists`, try/catch 구조가 거의 동일하게 이중화됨 | 라우트 핸들러용 소규모 헬퍼(본문 파싱·환경 검사·이벤트 존재 확인)로 공통화하면 분기(삽입 vs 갱신)만 남길 수 있음. |
| 4 | Low | `app/api/events/route.ts`, `app/api/events/[eventId]/route.ts`, `responses/route.ts` | 각 핸들러 시작부 | JSON 파싱 실패 시 400 응답 패턴이 라우트마다 반복됨 | 규모가 작아 필수는 아님. 필요 시 `readJsonBody` 같은 한 줄 래퍼로만 통일. |
| 5 | Medium | `components/event-detail-client.tsx` | 파일 전체(약 320줄) | 참여·이름 검증·격자 선택·제출·히트맵 안내까지 한 컴포넌트에 집중됨 | 응답 입력·배너/에러 영역과 “응답 요약(히트맵)” 섹션을 하위 컴포넌트로 나누면 상태 경계가 명확해지고 테스트·수정 범위가 줄어듦. |
| 6 | Low | `components/fluid-particles.tsx` | 전체(400줄대) | 파일은 길지만 캔버스 애니메이션·입자 시뮬레이션 단일 책임에 가까움 | 필요 시 `Particle` 클래스와 리사이즈·입력 처리만 별 파일로 옮기는 수준의 선택적 분리. |
| 7 | Medium | `lib/api/serialize.ts` | `ResponseRow`, `responseRowToApi` | `available_slots`가 `TimeSlot[] \| unknown`이고 배열일 때 구조 단언에 의존 | DB/JSONB 실제 형태에 맞는 좁은 타입 또는 검증(스키마) 후 매핑하면 잘못된 저장 형태가 조용히 빈 배열로 떨어지는 위험을 줄일 수 있음. |
| 8 | Medium | `app/(site)/events/[eventId]/page.tsx` | `res.json()` 이후(약 46행) | `EventDetailPayload`로 타입 단언만 하고 런타임 검증 없음 | 서버 컴포넌트에서도 API 응답에 대한 최소 검증(필수 필드 존재) 또는 공유 파서 사용을 검토. |
| 9 | Low | `components/create-event-form.tsx` | 성공 분기(약 62행) | 생성 응답을 `Event`로 단언 | API 계약이 바뀔 때 타입만으로는 런타임 오류를 못 잡을 수 있어, 필드 검증 또는 공유 타입 가드로 보강 가능. |
| 10 | Low | `lib/types.ts` | 파일 상단 주석 | 삭제된 외부 스펙 문서를 가리키는 설명 | 현재 프로젝트에서 타입 근거를 설명하는 한 줄로 갱신하거나 불필요하면 제거. |
| 11 | Low | `frontend/components` 일반 | 파일명·export | 컴포넌트 파일은 kebab-case, export는 PascalCase, 라우트는 App Router 규칙 준수 | 검토 범위 내 네이밍 관례 어긋남은 없음. |
| 12 | High | `lib/supabase/client.ts` | `createBrowserSupabaseClient` | 저장소 전체에서 import·사용처가 없음(미연결 API 표면) | 브라우저에서 Supabase를 쓸 계획이 없으면 파일 제거 또는 문서화된 진입점만 남기기. 사용 예정이면 실제 클라이언트 컴포넌트와 연결. |
| 13 | Medium | `components/ui/calendar.tsx` | 파일 전체 | `calendar-classes`는 `calendar-picker`에서 쓰이나, `ui/calendar.tsx` 자체는 어디에서도 import되지 않음 | 미사용이면 제거해 유지보수·번들 혼동 방지. 향후 Aria 기본 캘린더가 필요할 때까지 보류 시 주석으로 의도 표시. |
| 14 | Low | `components/event-detail-client.tsx` | `AvailabilityGrid` 호출부(약 281–287행) | `disabled={false}`로 항상 고정 | 실질적으로 비활성이 없으면 prop을 제거하거나, 향후 조건부 비활성이 필요할 때만 전달. |
| 15 | Low | `components/event-detail-client.tsx` | `handleJoin`, `handleSubmit`, `existingForTypedName` | 동일한 “이름 정규화 후 응답 찾기” 패턴이 반복됨 | 작은 헬퍼(정규화된 이름으로 `responses`에서 찾기)로 묶어 중복과 실수 가능성 감소. |

---

성능·보안 전용 점검은 각각 전용 감사 스킬을 사용하는 것이 적합합니다.
