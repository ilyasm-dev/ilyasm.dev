import type { Metadata } from "next";
import Link from "next/link";
import { allPosts, getPost } from "@/lib/posts";

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post.title, description: post.summary };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return (
    <main className="wrap section page">
      <p className="back">
        <Link href="/writing/">All writing</Link>
      </p>
      <article className="article">
        <header>
          {post.draft && <span className="tag tag-draft">draft, not published</span>}
          <h1>{post.title}</h1>
          <p className="post-meta">{Math.max(1, Math.round(post.words / 230))} min read</p>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
}
