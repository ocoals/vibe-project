# WhenWeMeet — API 명세서 (Phase 1)

> 프론트엔드 ↔ 백엔드(Route Handlers) 간 데이터 통신 규격

---

## API 엔드포인트 요약

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/events` | 이벤트 생성 |
| GET | `/api/events/[eventId]` | 이벤트 상세 + 응답 목록 조회 |
| POST | `/api/events/[eventId]/responses` | 응답 등록 (새 참여자) |
| PUT | `/api/events/[eventId]/responses` | 응답 수정 (기존 참여자) |

---

## 1. 이벤트 생성

사용자가 홈 화면에서 이벤트를 만들면 호출됩니다.

### `POST /api/events`

**Request Body**

```json
{
  "title": "3월 팀 회식",
  "dates": ["2026-04-01", "2026-04-02", "2026-04-03"],
  "start_time": "09:00",
  "end_time": "21:00"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | `string` | O | 이벤트 제목 |
| `dates` | `string[]` | O | 후보 날짜 목록 (`YYYY-MM-DD`) |
| `start_time` | `string` | O | 시간 범위 시작 (`HH:mm`, 30분 단위) |
| `end_time` | `string` | O | 시간 범위 종료 (`HH:mm`, 30분 단위) |

**Response — 201 Created**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "3월 팀 회식",
  "dates": ["2026-04-01", "2026-04-02", "2026-04-03"],
  "start_time": "09:00",
  "end_time": "21:00",
  "created_at": "2026-03-27T12:00:00Z"
}
```

**Response — 400 Bad Request**

```json
{
  "error": "title, dates, start_time, end_time 은 필수입니다."
}
```

**프론트 사용 흐름**: 응답의 `id`를 받아 `/events/a1b2c3d4-e5f6-7890-abcd-ef1234567890` 페이지로 이동합니다.

---

## 2. 이벤트 상세 + 응답 목록 조회

공유 링크로 접속하면 이벤트 정보와 기존 응답 목록을 함께 가져옵니다.

### `GET /api/events/[eventId]`

**요청 예시**

```
GET /api/events/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response — 200 OK**

```json
{
  "event": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "3월 팀 회식",
    "dates": ["2026-04-01", "2026-04-02", "2026-04-03"],
    "start_time": "09:00",
    "end_time": "21:00",
    "created_at": "2026-03-27T12:00:00Z"
  },
  "responses": [
    {
      "id": "resp-0001",
      "participant_name": "채민",
      "available_slots": [
        { "date": "2026-04-01", "time": "09:00" },
        { "date": "2026-04-01", "time": "09:30" },
        { "date": "2026-04-01", "time": "10:00" },
        { "date": "2026-04-02", "time": "14:00" },
        { "date": "2026-04-02", "time": "14:30" }
      ],
      "created_at": "2026-03-27T13:00:00Z",
      "updated_at": "2026-03-27T13:00:00Z"
    },
    {
      "id": "resp-0002",
      "participant_name": "지수",
      "available_slots": [
        { "date": "2026-04-01", "time": "09:00" },
        { "date": "2026-04-01", "time": "09:30" },
        { "date": "2026-04-03", "time": "15:00" }
      ],
      "created_at": "2026-03-27T14:00:00Z",
      "updated_at": "2026-03-27T14:00:00Z"
    }
  ]
}
```

**Response — 404 Not Found**

```json
{
  "error": "이벤트를 찾을 수 없습니다."
}
```

**프론트 사용 흐름**: `event`로 격자(grid) 뼈대를 그리고, `responses`로 히트맵을 렌더링합니다.

---

## 3. 응답 등록

참여자가 이름을 입력하고 가능한 시간대를 선택한 뒤 제출하면 호출됩니다.

### `POST /api/events/[eventId]/responses`

**Request Body**

```json
{
  "participant_name": "채민",
  "available_slots": [
    { "date": "2026-04-01", "time": "09:00" },
    { "date": "2026-04-01", "time": "09:30" },
    { "date": "2026-04-01", "time": "10:00" },
    { "date": "2026-04-02", "time": "14:00" },
    { "date": "2026-04-02", "time": "14:30" }
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `participant_name` | `string` | O | 참여자 이름 |
| `available_slots` | `array` | O | 선택한 슬롯 목록 |
| `available_slots[].date` | `string` | O | 날짜 (`YYYY-MM-DD`) |
| `available_slots[].time` | `string` | O | 시간 (`HH:mm`, 30분 단위) |

**Response — 201 Created**

```json
{
  "id": "resp-0001",
  "event_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "participant_name": "채민",
  "available_slots": [
    { "date": "2026-04-01", "time": "09:00" },
    { "date": "2026-04-01", "time": "09:30" },
    { "date": "2026-04-01", "time": "10:00" },
    { "date": "2026-04-02", "time": "14:00" },
    { "date": "2026-04-02", "time": "14:30" }
  ],
  "created_at": "2026-03-27T13:00:00Z",
  "updated_at": "2026-03-27T13:00:00Z"
}
```

**Response — 409 Conflict**

```json
{
  "error": "이미 같은 이름으로 응답이 존재합니다. 수정하려면 PUT을 사용하세요."
}
```

---

## 4. 응답 수정

기존 참여자가 자신의 가능 시간을 변경할 때 호출됩니다. 기존 슬롯을 **전체 교체**합니다.

### `PUT /api/events/[eventId]/responses`

**Request Body**

```json
{
  "participant_name": "채민",
  "available_slots": [
    { "date": "2026-04-01", "time": "10:00" },
    { "date": "2026-04-01", "time": "10:30" },
    { "date": "2026-04-03", "time": "15:00" },
    { "date": "2026-04-03", "time": "15:30" }
  ]
}
```

**Response — 200 OK**

```json
{
  "id": "resp-0001",
  "event_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "participant_name": "채민",
  "available_slots": [
    { "date": "2026-04-01", "time": "10:00" },
    { "date": "2026-04-01", "time": "10:30" },
    { "date": "2026-04-03", "time": "15:00" },
    { "date": "2026-04-03", "time": "15:30" }
  ],
  "created_at": "2026-03-27T13:00:00Z",
  "updated_at": "2026-03-27T18:30:00Z"
}
```

**Response — 404 Not Found**

```json
{
  "error": "해당 이름의 응답이 존재하지 않습니다."
}
```

---

## 공통 에러 형식

모든 에러 응답은 동일한 형식을 따릅니다.

```json
{
  "error": "에러 메시지"
}
```

| 상태 코드 | 의미 |
|-----------|------|
| 400 | 요청 데이터 누락 또는 형식 오류 |
| 404 | 이벤트 또는 응답을 찾을 수 없음 |
| 409 | 중복 (같은 이름의 응답이 이미 존재) |
| 500 | 서버 내부 오류 |

---

## 데이터 흐름 요약

```
[홈 페이지]
  사용자가 이벤트 생성 폼 작성
    → POST /api/events
    ← { id: "..." }
    → /events/[id] 페이지로 이동

[이벤트 상세 페이지]
  페이지 진입 시
    → GET /api/events/[eventId]
    ← { event, responses }
    → 격자 UI + 히트맵 렌더링

  참여자가 이름 + 가능 시간 선택 후 제출
    → POST /api/events/[eventId]/responses
    ← 생성된 응답 데이터
    → 히트맵 갱신

  기존 참여자가 응답 수정
    → PUT /api/events/[eventId]/responses
    ← 수정된 응답 데이터
    → 히트맵 갱신
```
