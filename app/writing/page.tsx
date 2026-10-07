import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { allPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "Writing" };

export default function WritingIndex() {
  const posts = allPosts();
  return (
    <main className="wrap section page">
      <h1 className="page-title">Writing</h1>
      <p className="lede">What I find when something is slower than it should be, with the numbers and the dead ends.</p>
      <div className="post-list">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80}>
            <Link className="post-link" href={`/writing/${p.slug}/`}>
              <span className="post-title">
                {p.title}
                {p.draft && <span className="tag tag-draft">draft</span>}
              </span>
              <span className="post-summary">{p.summary}</span>
              <span className="post-meta">{Math.max(1, Math.round(p.words / 230))} min read</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
