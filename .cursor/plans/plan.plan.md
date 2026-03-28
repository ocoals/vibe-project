---
name: WhenWeMeet 개발 계획
overview: spec.md·api-spec.md 기준으로 frontend/에 Next.js 앱을 두고, 0단계 셋업 → 1단계 mockData 목업(섹션 A~D, 단계마다 사용자 확인) → 2단계 Supabase(MCP·vibe-tutorial)·API·프론트 연동 순으로 구현한다.
todos:
  - id: phase-0-setup
    content: "0단계: frontend/ Next.js(App Router+TS+Tailwind), 폴더 구조, lib/types.ts, lib/mockData.ts, npm run dev 확인"
    status: completed
  - id: phase-1a-layout
    content: "1단계 섹션 A: app/layout.tsx, globals.css, 렌더 확인 후 사용자 확인"
    status: completed
  - id: phase-1b-home
    content: "1단계 섹션 B: calendar-picker, time-range-selector, 홈 폼·유효성·/events/[id] 이동 후 사용자 확인"
    status: completed
  - id: phase-1c-response
    content: "1단계 섹션 C: 이벤트 상세, 이름·availability-grid·제출·수정 모드 후 사용자 확인"
    status: completed
  - id: phase-1d-heatmap
    content: "1단계 섹션 D: heatmap·전원 하이라이트·툴팁·플로우 점검 후 사용자 확인"
    status: completed
  - id: phase-2a-supabase-tables
    content: "2단계 섹션 A: Supabase MCP로 events·responses 테이블(vibe-tutorial) 생성·검증 후 사용자 확인"
    status: completed
  - id: phase-2b-supabase-client
    content: "2단계 섹션 B: @supabase/supabase-js, .env.local, lib/supabase client·server 후 사용자 확인"
    status: completed
  - id: phase-2c-api-routes
    content: "2단계 섹션 C: POST/GET events, POST/PUT responses Route Handlers(api-spec) 후 사용자 확인"
    status: completed
  - id: phase-2d-frontend-api
    content: "2단계 섹션 D: 페이지를 API 호출로 교체, mockData.ts 삭제, E2E 점검"
    status: completed
isProject: false
---

# WhenWeMeet — 개발 계획서

> 참조 문서: [spec.md](../../docs/spec.md) · [api-spec.md](../../docs/api-spec.md)

위 **todos**는 Cursor Plan에서 진행 상태를 추적한다. 아래 본문은 상세 체크리스트다.

---

## AI 실행 방식 (필수)

프론트매터의 **9개 todos를 한 번에 연속으로 수행하지 않는다.**

1. **한 번에 하나의 todo만** 구현한다 (`phase-0-setup` → `phase-1a-layout` → … 순서 유지).
2. 선택한 todo에 해당하는 작업을 끝까지 마친 뒤 **반드시 멈춘다.**
3. 사용자에게 **「다음 단계(todo)로 진행해도 될까요?」**처럼 다음 진행 여부를 **명시적으로 묻는다.**
4. 사용자가 동의(또는 진행 지시)하기 전에는 **다음 todo를 시작하지 않는다.**

---

## 진행 규칙

1. **단계 순서 엄수** — 0단계 → 1단계 → 2단계 순서로 진행한다.
2. **1단계 완료 전 2단계 진입 금지** — 1단계의 모든 섹션이 완료되고 전체 플로우 검증이 끝나기 전에는 절대 2단계를 시작하지 않는다.
3. **섹션 단위 확인** — 1단계와 2단계는 각 섹션(A, B, C, D) 완료 후 반드시 멈추고, 사용자에게 다음 진행 여부를 확인받는다.
4. **목업 우선** — 1단계는 Supabase 연동 없이 `mockData.ts`의 하드코딩 데이터만 사용한다.

---

## 0단계: 프로젝트 초기 셋업

`frontend/` 폴더에 Next.js 프로젝트를 생성하고 기본 구조를 잡는다.

- **0-1** `frontend/` 폴더에 Next.js 프로젝트 생성 (App Router, TypeScript)
- **0-2** Tailwind CSS 설치 및 설정 확인
- **0-3** 불필요한 보일러플레이트 정리 (`app/page.tsx` 기본 내용 제거 등)
- **0-4** 폴더 구조 생성
  - `app/events/[eventId]/`
  - `app/api/events/`
  - `app/api/events/[eventId]/responses/`
  - `lib/`
  - `components/`
- **0-5** 공통 타입 정의 — `lib/types.ts`
  - `Event` 타입 (id, title, dates, start_time, end_time, created_at)
  - `TimeSlot` 타입 (date, time)
  - `Response` 타입 (id, event_id, participant_name, available_slots, created_at, updated_at)
- **0-6** Mock 데이터 파일 생성 — `lib/mockData.ts`
  - 이벤트 1개 (3일 후보, 09:00~21:00)
  - 응답 2~3개 (각각 다른 시간대 선택)
- **0-7** `npm run dev`로 로컬 서버 정상 실행 확인

---

## 1단계: 목업 (Supabase 연동 없음)

Supabase 없이 `mockData.ts`만 사용하여 모든 화면을 클릭으로 확인할 수 있는 수준까지 구현한다.

### 섹션 A — 루트 레이아웃

- **1-A-1** `app/layout.tsx` — 루트 레이아웃 작성 (HTML 기본 구조, 폰트, 메타데이터)
- **1-A-2** 글로벌 스타일 정리 (`globals.css`에 Tailwind 디렉티브 확인)
- **1-A-3** 브라우저에서 빈 페이지가 정상 렌더링되는지 확인

> 섹션 A 완료 → 사용자 확인 후 섹션 B 진행

### 섹션 B — 홈 페이지 (이벤트 생성)

- **1-B-1** `components/calendar-picker.tsx` — 달력 UI 컴포넌트
  - 월 단위 달력 표시
  - 날짜 클릭으로 복수 선택/해제
  - 선택된 날짜 시각적 표시
- **1-B-2** `components/time-range-selector.tsx` — 시간 범위 선택 컴포넌트
  - 시작 시간 드롭다운 (00:00 ~ 23:30, 30분 단위)
  - 종료 시간 드롭다운 (00:00 ~ 23:30, 30분 단위)
  - 종료 시간이 시작 시간보다 뒤인지 기본 검증
- **1-B-3** `app/page.tsx` — 이벤트 생성 폼 조합
  - 이벤트 제목 텍스트 입력
  - CalendarPicker 배치
  - TimeRangeSelector 배치
  - "이벤트 만들기" 버튼
- **1-B-4** 생성 버튼 클릭 시 mock 이벤트 ID로 `/events/[eventId]` 페이지 이동 (router.push)
- **1-B-5** 필수 입력값 미입력 시 간단한 유효성 안내 (제목 비어있음, 날짜 미선택 등)

> 섹션 B 완료 → 사용자 확인 후 섹션 C 진행

### 섹션 C — 이벤트 상세: 응답 영역

- **1-C-1** `app/events/[eventId]/page.tsx` — 이벤트 상세 페이지 기본 구조
  - URL 파라미터에서 eventId 추출
  - mockData에서 해당 이벤트 데이터 로드
  - 이벤트 제목, 날짜 범위, 시간 범위 표시
- **1-C-2** 참여자 이름 입력 필드 구현
  - 텍스트 입력 + "참여하기" 버튼
  - 이름 입력 후 격자 영역 활성화
- **1-C-3** `components/availability-grid.tsx` — 시간 격자 컴포넌트
  - 가로축: 후보 날짜, 세로축: 30분 단위 시간 슬롯
  - 셀 클릭으로 선택/해제 토글
  - 드래그로 연속 선택 지원
  - 선택된 셀 시각적 표시
- **1-C-4** "제출" 버튼 → mockData의 responses 배열에 추가 (로컬 state)
- **1-C-5** 이미 응답한 이름 재입력 시 기존 응답 불러와서 수정 모드 진입

> 섹션 C 완료 → 사용자 확인 후 섹션 D 진행

### 섹션 D — 이벤트 상세: 결과 영역

- **1-D-1** `components/heatmap.tsx` — 히트맵 컴포넌트
  - 격자와 동일한 날짜 × 시간 구조
  - 슬롯별 참여 가능 인원 수에 따라 색상 농도 변경 (0명=빈 색, 전원=가장 진한 색)
- **1-D-2** 전원 참석 가능 시간대 하이라이트 표시 (테두리 또는 별도 색상)
- **1-D-3** 슬롯 hover 시 툴팁으로 해당 시간에 가능한 참여자 이름 목록 표시
- **1-D-4** 응답 제출/수정 후 히트맵이 즉시 갱신되는지 확인
- **1-D-5** 전체 플로우 점검
  - 홈 → 이벤트 생성 → 상세 페이지 이동
  - 이름 입력 → 시간 선택 → 제출 → 히트맵 반영
  - 같은 이름 재입력 → 기존 응답 로드 → 수정 → 히트맵 갱신

> 섹션 D 완료 → 1단계 전체 플로우 검증 → 사용자 확인 후 2단계 진행

---

## 2단계: 실제 구현 (Supabase 연동)

> **전제 조건**: 1단계 목업의 모든 플로우가 정상 동작하고, 사용자 확인이 완료된 후에만 시작한다.

`mockData.ts`를 Supabase API 호출로 교체하고, Route Handlers를 구현한다.
Supabase 프로젝트 이름: **vibe-tutorial** / Supabase 작업은 **Supabase MCP** 사용.

### 섹션 A — Supabase 테이블 생성

- **2-A-1** Supabase MCP를 통해 `events` 테이블 생성
  - id (uuid, PK, default gen_random_uuid())
  - title (text, NOT NULL)
  - dates (date[], NOT NULL)
  - start_time (time, NOT NULL)
  - end_time (time, NOT NULL)
  - created_at (timestamptz, default now())
- **2-A-2** Supabase MCP를 통해 `responses` 테이블 생성
  - id (uuid, PK, default gen_random_uuid())
  - event_id (uuid, FK → events.id, ON DELETE CASCADE)
  - participant_name (text, NOT NULL)
  - available_slots (jsonb, NOT NULL)
  - created_at (timestamptz, default now())
  - updated_at (timestamptz, default now())
  - UNIQUE(event_id, participant_name)
- **2-A-3** Supabase 대시보드 또는 MCP로 테이블 생성 결과 확인

> 섹션 A 완료 → 사용자 확인 후 섹션 B 진행

### 섹션 B — Supabase 클라이언트 설정

- **2-B-1** `@supabase/supabase-js` 패키지 설치
- **2-B-2** `.env.local` 파일 생성 (플레이스홀더)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **2-B-3** `lib/supabase/client.ts` — 브라우저용 Supabase 클라이언트 생성
- **2-B-4** `lib/supabase/server.ts` — 서버용 Supabase 클라이언트 생성
- **2-B-5** `.env.local`에 실제 값 세팅 후 연결 테스트

> 섹션 B 완료 → 사용자 확인 후 섹션 C 진행

### 섹션 C — Route Handlers 구현

- **2-C-1** `app/api/events/route.ts` — POST: 이벤트 생성
  - Request Body 검증 (title, dates, start_time, end_time 필수)
  - Supabase에 INSERT → 생성된 이벤트 반환 (201)
  - 에러 시 400 반환
- **2-C-2** `app/api/events/[eventId]/route.ts` — GET: 이벤트 상세 + 응답 목록
  - events 테이블에서 이벤트 조회
  - responses 테이블에서 해당 이벤트의 응답 목록 조회
  - `{ event, responses }` 형태로 반환 (200)
  - 이벤트 없을 시 404 반환
- **2-C-3** `app/api/events/[eventId]/responses/route.ts` — POST: 응답 등록
  - Request Body 검증 (participant_name, available_slots 필수)
  - Supabase에 INSERT → 생성된 응답 반환 (201)
  - 동일 이름 중복 시 409 반환
- **2-C-4** `app/api/events/[eventId]/responses/route.ts` — PUT: 응답 수정
  - event_id + participant_name으로 기존 응답 찾기
  - available_slots, updated_at 갱신 → 수정된 응답 반환 (200)
  - 응답 없을 시 404 반환

> 섹션 C 완료 → 사용자 확인 후 섹션 D 진행

### 섹션 D — 프론트엔드 API 연동

- **2-D-1** 홈 페이지 이벤트 생성 → `POST /api/events` 호출로 교체, 응답의 id로 페이지 이동
- **2-D-2** 이벤트 상세 페이지 진입 시 → `GET /api/events/[eventId]` 호출로 교체
- **2-D-3** 응답 제출 → `POST /api/events/[eventId]/responses` 호출로 교체
- **2-D-4** 응답 수정 → `PUT /api/events/[eventId]/responses` 호출로 교체
- **2-D-5** `lib/mockData.ts` 파일 삭제
- **2-D-6** 전체 E2E 플로우 점검
  - 이벤트 생성 → DB 저장 확인
  - 공유 링크 접속 → 이벤트 데이터 로드 확인
  - 응답 제출 → DB 저장 + 히트맵 갱신 확인
  - 응답 수정 → DB 갱신 + 히트맵 갱신 확인

> 섹션 D 완료 → 2단계 전체 완료
