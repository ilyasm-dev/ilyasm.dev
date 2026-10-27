// A pull request or advisory state as plain text. The word carries the meaning, the color only follows GitHub's states.
export type StatusKind = "review" | "merged" | "done";

export function Status({ kind, children }: { kind: StatusKind; children: React.ReactNode }) {
  return <span className={`status status-${kind}`}>{children}</span>;
}
