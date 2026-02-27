import PostReactionsCsr from "./components/PostReactionsCsr";

const shellStyle = { fontFamily: "sans-serif", maxWidth: 760, margin: "40px auto", lineHeight: 1.6 };

function HomePage({ data }) {
  const view = data ?? {
    profile: { name: "-", role: "-", lastLoginAt: "-" },
    notices: [],
    stats: { activeUsers: 0, conversionRate: 0, serverTime: "-" }
  };

  return (
    <>
      <h1>Vite + React SSR</h1>
      <p>홈 페이지는 다중 API를 SSR에서 병렬 로딩합니다.</p>
      <p>
        <a href="/posts/42">동적 라우트 예시 보기: /posts/42</a>
      </p>
      <hr />
      <h2>Profile Loader</h2>
      <p>
        <strong>name:</strong> {view.profile.name}
      </p>
      <p>
        <strong>role:</strong> {view.profile.role}
      </p>
      <p>
        <strong>lastLoginAt:</strong> {view.profile.lastLoginAt}
      </p>
      <hr />
      <h2>Notices Loader</h2>
      <ul>
        {view.notices.map((notice) => (
          <li key={notice.id}>
            {notice.title} ({notice.level})
          </li>
        ))}
      </ul>
      <hr />
      <h2>Stats Loader</h2>
      <p>
        <strong>activeUsers:</strong> {view.stats.activeUsers}
      </p>
      <p>
        <strong>conversionRate:</strong> {view.stats.conversionRate}%
      </p>
      <p>
        <strong>serverTime:</strong> {view.stats.serverTime}
      </p>
    </>
  );
}

function PostPage({ data }) {
  const post = data?.post ?? { id: "-", title: "-", body: "-" };
  const comments = data?.comments ?? [];

  return (
    <>
      <h1>Dynamic Route: /posts/{post.id}</h1>
      <p>
        <a href="/">홈으로</a>
      </p>
      <h2>SSR Section</h2>
      <article>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </article>
      <h3>SSR Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.author}:</strong> {comment.text}
          </li>
        ))}
      </ul>
      <hr />
      <h2>CSR Section</h2>
      <PostReactionsCsr postId={post.id} />
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <h1>404</h1>
      <p>Route not found</p>
      <a href="/">홈으로</a>
    </>
  );
}

export default function App({ route, data }) {
  return (
    <main style={shellStyle}>
      {route?.name === "home" && <HomePage data={data} />}
      {route?.name === "post" && <PostPage data={data} />}
      {route?.name === "not-found" && <NotFoundPage />}
    </main>
  );
}
