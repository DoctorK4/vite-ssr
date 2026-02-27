export function matchRoute(pathname) {
  if (pathname === "/") {
    return { name: "home", params: {} };
  }

  const postMatch = pathname.match(/^\/posts\/([^/]+)$/);
  if (postMatch) {
    return { name: "post", params: { postId: postMatch[1] } };
  }

  return { name: "not-found", params: {} };
}
