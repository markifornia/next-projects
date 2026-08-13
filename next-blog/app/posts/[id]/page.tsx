export default function PostPage() {
  const post = {
    title: "Hello World",
    body: "Lorem ipsum dolor sit amet, consectetur.",
  };

  return (
    <article className="space-y-6">
        <div className="space-y-4">
            <h1 className="text-center text-4xl font-semibold text-zinc-950 sm:text-5xl">
                {post.title.charAt(0).toUpperCase() + post.title.slice(1)}
            </h1>
            <p className="text-lg leading-8 text-zinc-700">{post.body}</p>
        </div>
    </article>
  );
}