import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/pageMeta";
import { allPosts, getPost, monthYear, type Post } from "@/lib/posts";
import { getReport } from "@/lib/report";

// One route for the index (/writing/) and each post (/writing/<slug>/). The index is always built, so a static export
// with no published post yet still has a page to render.
export const dynamicParams = false;

type Params = { params: Promise<{ slug?: string[] }> };

export function generateStaticParams() {
  return [{ slug: [] }, ...allPosts().map((p) => ({ slug: [p.slug] }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!slug?.length) {
    const meta = pageMeta(
      "Writing",
      "Write-ups of performance investigations: what was slow, how I measured it, the cause in the source, and the fix.",
      "/writing/",
    );
    // Until a post is published the index holds only the sample report, so search engines leave it out.
    return allPosts().some((p) => !p.draft) ? meta : { ...meta, robots: { index: false, follow: true } };
  }
  const post = getPost(slug[0]);
  const meta = pageMeta(post.title, post.summary, `/writing/${post.slug}/`);
  return post.draft ? { ...meta, robots: { index: false, follow: false } } : meta;
}

export default async function Writing({ params }: Params) {
  const { slug } = await params;
  return slug?.length ? <PostPage post={getPost(slug[0])} /> : <WritingIndex />;
}

const metaLine = (p: Post) => `${p.date ? `${monthYear(p.date)} · ` : ""}${p.minutes} min read`;

function WritingIndex() {
  const report = getReport();
  return (
    <main id="main" className="wrap section page">
      <h1 className="page-title">Writing</h1>
      <p className="lede">What I find when something is slower than it should be, with the numbers and the dead ends.</p>
      <ul className="post-list">
        {allPosts().map((p) => (
          <li key={p.slug}>
            <Link className="post-link" href={`/writing/${p.slug}/`}>
              <span className="post-title">
                {p.title}
                {p.draft && <span className="tag tag-draft">draft</span>}
              </span>
              <span className="post-summary">{p.summary}</span>
              <span className="post-meta">{metaLine(p)}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link className="post-link" href="/sample-report/">
            <span className="post-title">
              {report.title}
              <span className="tag tag-soft">sample report</span>
            </span>
            <span className="post-summary">{report.intro}</span>
            <span className="post-meta">The written findings a client receives</span>
          </Link>
        </li>
      </ul>
    </main>
  );
}

function PostPage({ post }: { post: Post }) {
  return (
    <main id="main" className="wrap section page">
      <p className="back">
        <Link href="/writing/">All writing</Link>
      </p>
      <article className="article post">
        <header>
          {post.draft && <span className="tag tag-draft">draft, not published</span>}
          <h1>{post.title}</h1>
          <p className="post-meta">{metaLine(post)}</p>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        <p className="report-cta">
          <Link className="button" href="/#contact">
            Ask about a first project
          </Link>
        </p>
      </article>
    </main>
  );
}
