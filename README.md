# WhenWeMeet

회원가입·로그인 없이 **공유 링크 하나**로 팀원들의 가능한 시간을 모아 최적의 미팅 시간을 찾는 웹 서비스입니다. [when2meet](https://when2meet.com)과 유사한 흐름을 목표로 합니다.

## 기능 요약

- **이벤트 생성**: 제목, 후보 날짜, 시간 범위를 설정하고 고유 공유 URL 생성
- **참여자 응답**: 링크로 접속해 이름 입력 후 격자에서 가능한 시간 선택·수정
- **결과 확인**: 슬롯별 참여 인원 히트맵, 전원 가능 시간 하이라이트 등

자세한 화면·API·데이터 모델은 저장소 루트의 [`spec.md`](./spec.md), [`api-spec.md`](./api-spec.md)를 참고하세요.

## 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| 프레임워크 | [Next.js](https://nextjs.org/) (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 백엔드·DB | [Supabase](https://supabase.com/) |

애플리케이션 소스는 **`frontend/`** 디렉터리에 있습니다.

## 사전 요구 사항

- [Node.js](https://nodejs.org/) (프로젝트에 맞는 LTS 권장)
- npm (`frontend/package-lock.json` 기준)

## 로컬 실행

1. 의존성 설치

   ```bash
   cd frontend
   npm install
   ```

2. 환경 변수

   `frontend/.env.local` 파일을 만들고 Supabase 프로젝트의 공개 값을 넣습니다. (실제 키 값은 문서에 커밋하지 마세요.)

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. 개발 서버

   ```bash
   npm run dev
   ```

   브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## npm 스크립트 (`frontend/`)

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (Turbopack) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |

## 프로젝트 구조 (요약)

```
vibe-project/
├── frontend/          # Next.js 앱 (App Router)
│   ├── app/           # 라우트·레이아웃
│   ├── components/    # UI 컴포넌트
│   └── lib/           # 유틸·Supabase 클라이언트 등
├── supabase/          # Supabase 관련 설정·마이그레이션 등
├── spec.md            # 제품 명세
└── api-spec.md        # API 명세
```

## 라이선스

이 저장소에 라이선스 파일이 없다면, 배포·재사용 전 저장소 관리자에게 확인하세요.
