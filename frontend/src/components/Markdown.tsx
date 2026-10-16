"use client";

/**
 * Minimal Markdown renderer for lesson content.
 * Handles: h1-h4, bold, italic, inline code, unordered lists, blockquotes, hr, paragraphs.
 * No external dependency. Safe by default (no raw HTML).
 */
import React from "react";

type Props = {
  content: string;
  className?: string;
};

function renderInline(text: string): React.ReactNode {
  // Bold **x**, italic *x*, inline code `x`
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns: Array<[RegExp, (m: string) => React.ReactNode]> = [
    [
      /\*\*(.+?)\*\*/,
      (m) => (
        <strong key={key++} className="font-semibold text-white">
          {m}
        </strong>
      ),
    ],
    [
      /`([^`]+)`/,
      (m) => (
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[0.9em] text-cyan-300"
        >
          {m}
        </code>
      ),
    ],
    [
      /\*([^*]+)\*/,
      (m) => (
        <em key={key++} className="italic">
          {m}
        </em>
      ),
    ],
  ];

  while (remaining.length > 0) {
    let earliest: { idx: number; match: RegExpExecArray; render: (m: string) => React.ReactNode } | null =
      null;

    for (const [re, render] of patterns) {
      const match = re.exec(remaining);
      if (match && (earliest === null || match.index < earliest.idx)) {
        earliest = { idx: match.index, match, render };
      }
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    if (earliest.idx > 0) {
      parts.push(remaining.slice(0, earliest.idx));
    }
    parts.push(earliest.render(earliest.match[1]));
    remaining = remaining.slice(earliest.idx + earliest.match[0].length);
  }

  return <>{parts}</>;
}

export default function Markdown({ content, className = "" }: Props) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let paragraphBuffer: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    blocks.push(
      <p key={key++} className="my-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {renderInline(paragraphBuffer.join(" "))}
      </p>,
    );
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul
        key={key++}
        className="list-disc list-inside space-y-2 my-4 ml-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {listBuffer.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Blank line -> flush list
    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      blocks.push(
        <hr
          key={key++}
          className="my-8 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        />,
      );
      continue;
    }

    // Headings
    const h = /^(#{1,4})\s+(.+)$/.exec(line);
    if (h) {
      flushParagraph();
      flushList();
      const level = h[1].length;
      const text = h[2];
      if (level === 1) {
        blocks.push(
          <h1
            key={key++}
            className="text-3xl md:text-4xl font-bold mt-8 mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {renderInline(text)}
          </h1>,
        );
      } else if (level === 2) {
        blocks.push(
          <h2
            key={key++}
            className="text-2xl font-bold mt-8 mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {renderInline(text)}
          </h2>,
        );
      } else if (level === 3) {
        blocks.push(
          <h3
            key={key++}
            className="text-lg font-semibold mt-6 mb-2"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {renderInline(text)}
          </h3>,
        );
      } else {
        blocks.push(
          <h4 key={key++} className="text-base font-semibold mt-4 mb-2">
            {renderInline(text)}
          </h4>,
        );
      }
      continue;
    }

    // Unordered list item
    const li = /^[-*]\s+(.+)$/.exec(line);
    if (li) {
      flushParagraph();
      listBuffer.push(li[1]);
      continue;
    }

    // Blockquote
    const bq = /^>\s+(.+)$/.exec(line);
    if (bq) {
      flushParagraph();
      flushList();
      blocks.push(
        <blockquote
          key={key++}
          className="border-l-2 pl-4 my-6 italic"
          style={{
            borderColor: "var(--brand-cyan)",
            color: "var(--text-secondary)",
          }}
        >
          {renderInline(bq[1])}
        </blockquote>,
      );
      continue;
    }

    // Collect soft-wrapped lines into one Markdown paragraph.
    flushList();
    paragraphBuffer.push(line.trim());
  }

  flushParagraph();
  flushList();

  return <div className={`lesson-prose ${className}`.trim()}>{blocks}</div>;
}
