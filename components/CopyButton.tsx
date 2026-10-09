"use client";

import { useEffect, useState } from "react";

function fallbackCopy(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      fallbackCopy(value);
    }
    setCopied(true);
  }

  return (
    <button type="button" className="copy-button" onClick={copy} aria-label={`Copy ${label}`}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        {copied ? (
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="5" y="5" width="8.5" height="8.5" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        )}
      </svg>
      <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      <span className="sr-only" role="status">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
