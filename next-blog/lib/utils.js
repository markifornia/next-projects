import { cacheLife } from "next/cache";

export const getPosts = async () => {
  "use cache";

  // cacheLife("days");
  // cacheTag("posts");

  const response = await fetch ("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();
  return posts;
}

// // bust cache
// updateTag("posts");
// revalidateTag("posts");