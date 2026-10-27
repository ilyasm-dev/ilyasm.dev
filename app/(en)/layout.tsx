import SiteShell from "@/components/SiteShell";
import { fontVars } from "@/lib/fonts";
import { siteMeta } from "@/lib/pageMeta";
import "../globals.css";

export const metadata = siteMeta("en");
export { viewport } from "@/lib/pageMeta";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell lang="en" fontClass={fontVars}>
      {children}
    </SiteShell>
  );
}
