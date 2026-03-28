# WhenWeMeet — 프로젝트 명세서 (Phase 1)

> 로그인 없이 URL만으로 팀 일정을 조율하는 서비스

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스 이름 | **WhenWeMeet** |
| 한 줄 설명 | 회원가입·로그인 없이 링크 하나로 팀원들의 가능한 시간을 모아 최적의 미팅 시간을 찾는 서비스 |
| 레퍼런스 | [when2meet](https://when2meet.com) |

---

## 2. 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 데이터베이스 · 백엔드 | Supabase |

---

## 3. Phase 1 기능 목록

### 3-1. 이벤트 생성

- 이벤트 제목 입력
- 후보 날짜 선택 (달력 UI)
- 후보 시간 범위 설정 (시작 ~ 종료, 30분 단위)
- 고유 공유 링크(URL) 자동 생성

### 3-2. 참여자 응답

- 공유 링크 접속 → 이름 입력 후 참여
- 날짜 × 시간 격자(grid)에서 드래그로 가능한 시간대 선택
- 본인 응답 수정

### 3-3. 결과 확인

- 시간 슬롯별 참여 가능 인원 수 히트맵 표시
- 전원 참석 가능 시간대 하이라이트
- 슬롯 hover 시 참여 가능 인원 이름 표시

### 3-4. 공유

- URL 기반 공유 (로그인 불필요)

---

## 4. 화면 구성

| 경로 | 페이지 | 역할 |
|------|--------|------|
| `/` | 홈 (이벤트 생성) | 이벤트 제목 입력, 달력에서 후보 날짜 선택, 시간 범위 설정 후 이벤트 생성 |
| `/events/[eventId]` | 이벤트 상세 | 이름 입력 → 시간 격자에서 가능 시간 드래그 선택 · 응답 제출/수정, 히트맵으로 전체 결과 확인 |

### 페이지별 상세

#### `/` — 홈 (이벤트 생성)

- 이벤트 제목 텍스트 입력
- 달력 UI에서 후보 날짜 복수 선택
- 시작 시간 · 종료 시간 드롭다운 (30분 단위, 예: 09:00 ~ 21:00)
- "이벤트 만들기" 버튼 → 생성 후 `/events/[eventId]` 로 이동

#### `/events/[eventId]` — 이벤트 상세

- **응답 영역**: 참여자 이름 입력 → 날짜 × 시간 격자에서 드래그로 가능 시간 선택 → 제출
- **결과 영역**: 슬롯별 참여 인원 수를 색상 농도로 표현하는 히트맵, 전원 참석 가능 슬롯 하이라이트, hover 시 인원 이름 툴팁

---

## 5. Supabase 테이블 설계

### events

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | `uuid` (PK, default `gen_random_uuid()`) | 이벤트 고유 ID — URL 경로에 사용 |
| `title` | `text` | 이벤트 제목 |
| `dates` | `date[]` | 후보 날짜 배열 |
| `start_time` | `time` | 후보 시간 범위 시작 (예: `09:00`) |
| `end_time` | `time` | 후보 시간 범위 종료 (예: `21:00`) |
| `created_at` | `timestamptz` (default `now()`) | 생성 시각 |

### responses

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | `uuid` (PK, default `gen_random_uuid()`) | 응답 고유 ID |
| `event_id` | `uuid` (FK → `events.id`, ON DELETE CASCADE) | 소속 이벤트 |
| `participant_name` | `text` | 참여자 이름 |
| `available_slots` | `jsonb` | 선택한 슬롯 배열 — `[{"date":"2026-04-01","time":"09:00"}, ...]` |
| `created_at` | `timestamptz` (default `now()`) | 최초 응답 시각 |
| `updated_at` | `timestamptz` (default `now()`) | 마지막 수정 시각 |

**제약 조건**

- `UNIQUE(event_id, participant_name)` — 같은 이벤트에서 동일 이름의 중복 응답 방지 및 수정(UPSERT) 지원

---

## 6. 폴더 구조

```
app/
  layout.tsx                          # 루트 레이아웃
  page.tsx                            # 홈 — 이벤트 생성 폼
  events/
    [eventId]/
      page.tsx                        # 이벤트 상세 — 응답 + 결과
  api/
    events/
      route.ts                        # POST: 이벤트 생성
      [eventId]/
        responses/
          route.ts                    # POST/PUT: 응답 등록 · 수정
          [participantName]/
            route.ts                  # GET: 특정 참여자 응답 조회

lib/
  supabase/
    client.ts                         # 브라우저용 Supabase 클라이언트
    server.ts                         # 서버용 Supabase 클라이언트
  types.ts                            # 공통 타입 정의 (Event, Response 등)

components/
  calendar-picker.tsx                 # 달력 날짜 선택 UI
  time-range-selector.tsx             # 시간 범위 드롭다운
  availability-grid.tsx               # 날짜×시간 격자 (드래그 선택)
  heatmap.tsx                         # 결과 히트맵
```
