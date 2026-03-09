import { fetchPost } from "../../api/postApi";
import { fetchPostComments } from "../../api/postCommentsApi";
import type { ApiRequestOptions, PostPageData } from "../../types";

interface PostPageLoaderOptions extends ApiRequestOptions {
  postId: string;
}

export async function loadPostPageData({ postId, ...options }: PostPageLoaderOptions): Promise<PostPageData> {
  const [post, comments] = await Promise.all([
    fetchPost(postId, options),
    fetchPostComments(postId, options)
  ]);

  return { post, comments };
}
