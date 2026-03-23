# Hospital SNS Content Desk

병원 SNS 콘텐츠 초안 생성 이후의 내부 운영 흐름을 관리하는 Next.js 관리자 앱입니다.  
관리자는 초안을 검토하고 승인 상태를 변경한 뒤, 채널별 게시 문안을 복사해 수동 게시할 수 있습니다. 자동 SNS 업로드는 포함하지 않습니다.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- shadcn/ui 스타일의 로컬 UI 컴포넌트
- Supabase Auth / Postgres / Storage
- Vercel 배포 기준 구조

## Included Features

- `/login` 관리자 로그인
- `/dashboard` 카드형 운영 대시보드
- `/contents` 테이블 + 필터 기반 콘텐츠 목록
- `/contents/[id]` 섹션형 상세 화면
- `/approvals` 승인/보류/수정요청 처리
- `/publishing` approved 콘텐츠 채널 문안 생성 및 복사
- `/metrics` posted 콘텐츠 성과 입력
- `/settings/generation` 생성 설정 관리
- 대시보드/콘텐츠 화면에서 `AI 초안 생성` 버튼으로 GPT 기반 draft 3건 생성
- 상태 변경 시 `approval_logs` 기록
- 대시보드에 metrics summary 반영
- 시드 콘텐츠 10건

## Local Run

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 파일 생성

```bash
Copy-Item .env.example .env.local
```

3. 개발 서버 실행

```bash
npm run dev
```

4. 브라우저에서 `http://localhost:3000` 접속

## Preview Before Vercel

배포 전에 화면을 확인하는 가장 빠른 방법은 로컬 실행입니다.

```bash
npm run dev
```

- 브라우저에서 `http://localhost:3000`
- 데모 모드에서는 로그인/회원가입 화면을 바로 테스트 가능
- Supabase를 연결했다면 실제 Auth 회원가입 흐름도 함께 확인 가능

배포 환경과 비슷하게 확인하고 싶다면 아래로 프로덕션 서버를 로컬에서 띄울 수 있습니다.

```bash
npm run build
npm start
```

## Demo Mode

Supabase 환경 변수를 비워두면 데모 모드로 동작합니다.

- 로그인 계정: `admin@hospital-desk.local`
- 비밀번호: `demo1234`
- 데모 데이터는 첫 실행 시 `data/demo-db.json`에 자동 생성됩니다.

주의:
- 데모 모드의 파일 저장은 로컬 개발용입니다.
- Vercel 배포에서는 반드시 Supabase를 연결하세요.

## Supabase Setup

1. Supabase 프로젝트 생성
2. SQL Editor에서 [`supabase/schema.sql`](/C:/Users/jacob/OneDrive/바탕%20화면/자동화코딩/sns%20app/supabase/schema.sql) 실행
3. 이어서 [`supabase/seed.sql`](/C:/Users/jacob/OneDrive/바탕%20화면/자동화코딩/sns%20app/supabase/seed.sql) 실행
4. `.env.local`에 아래 값 입력

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-mini
```

5. Supabase Auth에서 관리자 사용자를 생성하고, 로그인 계정으로 사용

## Project Structure

- [`app`](/C:/Users/jacob/OneDrive/바탕%20화면/자동화코딩/sns%20app/app): App Router 페이지와 서버 액션
- [`components`](/C:/Users/jacob/OneDrive/바탕%20화면/자동화코딩/sns%20app/components): 카드, 테이블, 폼, 복사 버튼 등 UI
- [`lib/repositories`](/C:/Users/jacob/OneDrive/바탕%20화면/자동화코딩/sns%20app/lib/repositories): Supabase/데모 저장소 공통 데이터 계층
- [`types`](/C:/Users/jacob/OneDrive/바탕%20화면/자동화코딩/sns%20app/types): 도메인 타입 및 DB 타입
- [`supabase`](/C:/Users/jacob/OneDrive/바탕%20화면/자동화코딩/sns%20app/supabase): 스키마, RLS, 시드 SQL

## Notes

- 채널 문안은 `approved` 상태에서만 생성됩니다.
- `AI 초안 생성`은 OpenAI API를 호출해 3개의 콘텐츠를 만들고 `draft` 상태로만 저장합니다.
- 게시 완료 처리는 수동 SNS 업로드 이후 운영자가 실행합니다.
- `posted` 상태가 된 콘텐츠만 metrics 입력이 가능합니다.
- 앱은 서버 액션 기반으로 상태 변경, 문안 생성, 성과 저장을 처리합니다.
