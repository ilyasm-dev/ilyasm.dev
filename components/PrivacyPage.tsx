import Link from "next/link";
import { Fragment } from "react";
import { COPY } from "@/content/copy";
import { HOME, type Lang } from "@/lib/i18n";

export default function PrivacyPage({ lang }: { lang: Lang }) {
  const c = COPY[lang].privacy;
  return (
    <main id="main" className="wrap section page">
      <p className="back">
        <Link href={HOME[lang]}>{c.back}</Link>
      </p>
      <article className="article privacy">
        <header>
          <h1>{c.title}</h1>
          <p className="case-lede">{c.lede}</p>
        </header>
        <div className="prose">
          {c.sections.map((s) => (
            <Fragment key={s.title}>
              <h2>{s.title}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Fragment>
          ))}
        </div>
      </article>
    </main>
  );
}
