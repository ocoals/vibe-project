# AGENTS.md

이 저장소는 초보 개발자가 **Next.js**로 웹사이트를 만드는 프로젝트입니다. AI는 아래 **기술 스택**과 **반드시 지킬 것 / 하지 말 것**만 따르세요.

---

## 기술 스택 (고정)

| 영역 | 선택 |
|------|------|
| 프레임워크 | **Next.js**, **App Router** (`app/` 디렉터리, `page.tsx`, `layout.tsx`, Route Handlers `route.ts` 등) |
| 언어 | **TypeScript** (`.ts`, `.tsx`) |
| 스타일 | **Tailwind CSS** |
| 데이터베이스·백엔드 연동 | **Supabase** |

- **Pages Router는 사용하지 않습니다.** `pages/` 디렉터리나 `getServerSideProps`, `getStaticProps` 등으로 새 기능을 만들지 마세요.
- **bkit를 사용하지 않습니다.** bkit·bkend·PDCA 전용 에이전트 워크플로, bkit 문서 템플릿이나 플러그인 가이드를 이 프로젝트에 적용하지 마세요.

### TypeScript

- 새 코드는 TypeScript로 작성합니다. 불필요한 `any` 남용은 피하고, 가능하면 타입을 명시합니다.

### 스타일

- UI는 **Tailwind 유틸리티 클래스**를 기본으로 합니다. 대규모 UI를 인라인 `<style>`이나 CSS Modules만으로 구성하는 것은 기본 방침이 아닙니다. (디자인 토큰·`globals.css`의 소량 베이스 스타일은 예외로 둘 수 있습니다.)

### Supabase

- **클라이언트(브라우저)** 에서는 공개 가능한 **anon 키**만 사용하고, **Row Level Security(RLS)** 가 데이터 접근을 제어한다고 가정합니다.
- **서비스 롤(service role)** 등 서버 전용 비밀 키는 **서버에서만** 사용합니다 (Server Components, Server Actions, Route Handlers 등). 클라이언트 번들이나 `NEXT_PUBLIC_*` 환경 변수에 넣지 마세요.

### 환경 변수

- 브라우저에 노출돼도 되는 값만 `NEXT_PUBLIC_` 접두사를 붙입니다.
- 실제 비밀 값은 문서에 적지 말고, 예시는 플레이스홀더(예: `your_supabase_anon_key`)만 사용합니다. 로컬은 `.env.local`을 사용합니다.

### 패키지 매니저

- 프로젝트에 `pnpm-lock.yaml` / `package-lock.yaml` / `yarn.lock` 중 무엇이 있는지에 맞춰 **하나만** 사용합니다. 아직 없다면 `npm` 또는 `pnpm` 중 팀에서 정한 것으로 통일합니다.

---

## 반드시 지킬 것

- **App Router** 규칙을 따릅니다. 라우팅·레이아웃·로딩·에러 UI는 `app/` 구조에 맞게 구성합니다.
- **Server Component를 기본**으로 하고, 훅·브라우저 API·이벤트 핸들러가 필요한 경우에만 해당 파일 상단에 `"use client"`를 둡니다.
- **TypeScript**로 타입을 맞추고, 폼·API 입력 등은 가능하면 **Zod** 등으로 검증하는 패턴을 권장합니다.
- **Tailwind**로 레이아웃·반응형을 맞추고, 시맨틱 HTML·이미지 `alt`·키보드 포커스 등 **접근성 기본**을 고려합니다.
- **Supabase**는 역할에 맞게 클라이언트 SDK와 서버 전용 처리를 분리하고, 민감한 작업은 서버 측에서 수행합니다.
- **기존 코드 스타일·폴더 구조**에 맞추고, 요청된 범위 안에서만 수정합니다.

---

## 하지 말 것

- **Pages Router**로 새 페이지나 API를 만들거나, `getServerSideProps` / `getStaticProps` 등 **레거시 데이터 패칭**을 도입하지 마세요.
- **`.js` / `.jsx`만의 신규 파일**을 추가해 TypeScript 일관성을 깨지 마세요. (기존 레거시 파일이 있다면 사용자가 마이그레이션을 요청할 때만 다룹니다.)
- **Tailwind 없이** 대규모 UI를 인라인 스타일·전역 CSS만으로만 구성하지 마세요.
- Supabase **service role** 키를 **클라이언트 코드**에 넣거나 **`NEXT_PUBLIC_`** 로 노출하지 마세요.
- **bkit·bkend·PDCA(bkit 전용)** 워크플로·스킬·문서 체계를 이 레포에 끌어와 적용하지 마세요.
- 사용자가 요청하지 않은 **대규모 리팩터**, **무관한 파일 수정**, **불필요한 문서**(예: README 전면 개편)를 추가하지 마세요.
- **불필요한 의존성**을 임의로 늘리지 마세요. 필요하면 이유를 짧게 설명하고 최소한으로 추가합니다.
