# AI Handoff

## Project
- Name: `vite-ssr-react-test`
- Stack: Vite + React + custom SSR server (`server.js`)
- Purpose: SSR 동작 원리 검증 및 NestJS 이전 전 구조 실험

## Current Architecture
- SSR server: `server.js`
  - HTML 템플릿 로딩
  - `entry-server` 렌더 호출
  - `window.__INITIAL_DATA__` 주입
  - mock API 제공
- Server entry: `src/entry-server.jsx`
  - `loadHomePageData` 호출
  - React `renderToString` 수행
- Client entry: `src/entry-client.jsx`
  - `window.__INITIAL_DATA__` 우선 사용
  - 없으면 `loadHomePageData()` 호출 후 hydrate
- UI: `src/App.jsx`
  - `profile/notices/stats` 데이터 표시

## Data Layer (Multi API pattern)
- API layer
  - `src/api/http.js`
  - `src/api/profileApi.js`
  - `src/api/noticesApi.js`
  - `src/api/statsApi.js`
- Loader layer
  - `src/loaders/profileLoader.js`
  - `src/loaders/noticesLoader.js`
  - `src/loaders/statsLoader.js`
  - `src/loaders/homePageLoader.js` (`Promise.all` 집계)

## Mock Endpoints
- `GET /api/profile`
- `GET /api/notices`
- `GET /api/stats`

## How To Run
1. Install:
   - `npm install`
2. Dev SSR:
   - `npm run dev`
3. Build:
   - `npm run build`
4. Production preview:
   - `PORT=5180 NODE_ENV=production node server.js`

## SSR Verification
- Browser:
  - 페이지 소스 보기에서 `#root` 내부에 실제 마크업이 있는지 확인
- CLI:
  - `curl -s http://localhost:5180 | sed -n '1,160p'`
  - `Profile Loader`, `Notices Loader`, `Stats Loader` 텍스트가 HTML에 포함되면 SSR 성공

## Decisions Made
- 컴포넌트 내부 `useEffect` 초기 fetch 대신 loader 패턴 채택
- 초기 데이터는 서버에서 조회 후 HTML에 주입
- 클라이언트는 동일 loader 재사용 (fallback fetch)
- API 호출 로직과 loader를 분리해 확장성 확보

## Next Steps
1. NestJS 통합 시 `server.js` 책임을 Nest Controller/Service로 이전
2. 라우트 단위 loader 분리 (`home`, `dashboard`, etc.)
3. 에러/타임아웃/부분 실패 처리 정책 추가
4. 캐시 전략(HTTP/Redis) 및 revalidation 전략 정의
5. 타입스크립트 전환 고려 (`*.ts`, `*.tsx`)

## Restart Prompt (for new machine/session)
```text
이 프로젝트는 Vite SSR + React 테스트 프로젝트다.
현재는 loader 패턴과 API 레이어 분리 구조를 적용했다.
핵심 파일은 server.js, src/entry-server.jsx, src/entry-client.jsx, src/api/*, src/loaders/* 이다.
docs/ai-handoff.md 기준으로 현재 상태를 파악하고 다음 작업을 이어서 진행해줘.
```
