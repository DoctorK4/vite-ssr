import { useEffect, useState } from "react";

export default function PostReactionsCsr({ postId }) {
  const [state, setState] = useState({ status: "loading", likes: 0 });

  useEffect(() => {
    let cancelled = false;

    async function loadReactions() {
      try {
        const response = await fetch(`/api/posts/${postId}/reactions`);
        const json = await response.json();
        if (!cancelled) {
          setState({ status: "ready", likes: json.likes });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error", likes: 0 });
        }
      }
    }

    loadReactions();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (state.status === "loading") {
    return <p>Client reactions loading...</p>;
  }

  if (state.status === "error") {
    return <p>Client reactions unavailable</p>;
  }

  return (
    <div>
      <p>Client reactions (CSR fetch): {state.likes}</p>
      <button type="button" onClick={() => setState((prev) => ({ ...prev, likes: prev.likes + 1 }))}>
        Like +1 (client state)
      </button>
    </div>
  );
}
