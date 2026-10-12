import type { Metadata } from "next";
import { pageMeta } from "@/lib/pageMeta";
import Link from "next/link";

export const metadata: Metadata = pageMeta("Privacy", "What this site and my emails do with personal data, and how to object.", "/privacy/");

export default function Privacy() {
  return (
    <main id="main" className="wrap section page">
      <p className="back">
        <Link href="/">Back to the home page</Link>
      </p>
      <article className="article privacy">
        <header>
          <h1>Privacy</h1>
          <p className="case-lede">
            I am Ilyas Mallah, trading as I. Mallah Development (KvK 98045024), Torenlaan 5 B, 1402 AT Bussum, the Netherlands. I am
            the controller. Contact: <a href="mailto:ilyas@ilyasm.dev">ilyas@ilyasm.dev</a>.
          </p>
        </header>
        <div className="prose">
          <h2>This website</h2>
          <p>
            The site is static and hosted on GitHub Pages. It has no forms, no accounts and no cookies. Cloudflare Web Analytics counts
            page views and processes your IP address to do it, without cookies and without following you across sites. Fonts are served from
            this site. Your browser keeps one setting, light or dark theme, in local storage on your device. I never receive it.
          </p>

          <h2>Email you send me</h2>
          <p>
            I keep your message and my reply in my mailbox (Spacemail, forwarded to Gmail) as long as the conversation is useful. I delete it
            two years after the last message. If we work together, invoices and contracts stay for seven years because Dutch tax law requires it.
          </p>

          <h2>Email I send first</h2>
          <p>
            Sometimes I write to a person at a company about performance work. I use your name, work email and role from the company&apos;s
            own website. I also note what caught my attention, such as a blog post, a job ad or an open source project. I do not buy lists or
            guess addresses.
          </p>
          <p>
            My legal basis is legitimate interest (GDPR Art. 6(1)(f)). I weighed it this way. I contact you about your own work, I send one
            personal message, and you can stop it at once. If I hear nothing, I delete your details after 12 months.
          </p>
          <p>
            To opt out, reply &ldquo;no&rdquo; or email me. I keep only your address on a suppression list so I never contact you again. I do
            not sell or share your data.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask me for access to your data, to correct it, to erase it, or to stop using it. You can also object to my emails at any
            time. Email me and I answer within one month. You can complain to the{" "}
            <a href="https://autoriteitpersoonsgegevens.nl/en">Autoriteit Persoonsgegevens</a>, the Dutch data protection authority.
          </p>
        </div>
      </article>
    </main>
  );
}
