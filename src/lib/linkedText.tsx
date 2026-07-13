import type { ReactNode } from "react";

// Renders plain text containing one or more markdown-lite [label](url) links
// as real <a> tags, leaving everything else as plain text. Used anywhere an
// admin-editable string needs to support inline links: the profile image
// tooltip, additional-project descriptions, etc.
//
// e.g. renderLinkedText("Photo by [Olivia Chen](https://example.com)")
export function renderLinkedText(text: string, linkClassName?: string, linkStyle?: React.CSSProperties): ReactNode[] {
  if (!text) return [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, label, url] = match;
    parts.push(
      <a
        key={key++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        style={{ textDecoration: "underline", ...linkStyle }}
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
