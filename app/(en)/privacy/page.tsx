import type { Metadata } from "next";
import PrivacyPage from "@/components/PrivacyPage";
import { COPY } from "@/content/copy";
import { pageMeta } from "@/lib/pageMeta";

const c = COPY.en.privacy;
export const metadata: Metadata = pageMeta(c.title, c.description, "/privacy/");

export default function Privacy() {
  return <PrivacyPage lang="en" />;
}
