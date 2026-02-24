export default function App() {
  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 680, margin: "40px auto", lineHeight: 1.6 }}>
      <h1>Vite + React SSR</h1>
      <p>직접 구현한 SSR 테스트 프로젝트입니다.</p>
      <ul>
        <li>서버 렌더링 완료 후 HTML을 전달</li>
        <li>클라이언트에서 Hydration 수행</li>
      </ul>
    </main>
  );
}
