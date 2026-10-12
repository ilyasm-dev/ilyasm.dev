import { BadgeCheck, CircleDashed, CircleDot, GitMerge, GitPullRequest, Package, type LucideIcon } from "lucide-react";

// A category icon in a tile, so a reader sees what kind of work a card is before reading it.
export function Mark({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="mark" aria-hidden="true">
      <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

export type StatusKind = "review" | "merged" | "issue" | "done" | "dev" | "release";

const ICONS = {
  review: GitPullRequest,
  merged: GitMerge,
  issue: CircleDot,
  done: BadgeCheck,
  dev: CircleDashed,
  release: Package,
};

export function Status({ kind, children }: { kind: StatusKind; children: React.ReactNode }) {
  const Icon = ICONS[kind];
  return (
    <span className={`status status-${kind}`}>
      <Icon size={13} strokeWidth={2} aria-hidden="true" />
      {children}
    </span>
  );
}
