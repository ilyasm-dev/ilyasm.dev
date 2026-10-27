import SiteShell from "@/components/SiteShell";
import { mono } from "@/lib/fonts";
import { siteMeta } from "@/lib/pageMeta";
import "../globals.css";

export const metadata = siteMeta("nl");
export { viewport } from "@/lib/pageMeta";

export default function DutchLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="nl" fontClass={mono.variable}>{children}</SiteShell>;
}
