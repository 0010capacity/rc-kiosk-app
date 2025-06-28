# RC Kiosk App

이 프로젝트는 RC Kiosk 애플리케이션의 프론트엔드 코드입니다. Vite와 React, TailwindCSS를 사용하여 제작되었습니다.

## 필요한 Node 버전

- Node.js 18 이상 (GitHub Actions에서는 Node 18을 사용합니다.)

## 의존성 설치

```bash
npm install
```

## 개발 서버 실행

```bash
npm run dev
```

## 빌드

```bash
npm run build
```

## Supabase 설정

프로젝트에서 Supabase를 사용하므로, 서비스 URL과 익명 키를 `.env` 파일에 다음과 같이 작성합니다. (실제 키 값은 본인이 사용하는 Supabase 콘솔에서 확인하세요.)

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

`.env` 파일은 버전 관리에 포함되지 않도록 주의하세요.
