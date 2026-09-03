// Minimal markdown renderer for Phase 1.
// Supports: headings (##, ###), paragraphs, bullet lists, ordered lists,
// bold (**x**), italic (*x*), inline code (`x`), and links [x](y).
// Phase 2: swap for MDX + remark-gfm pipeline.

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export function parseMarkdown(src: string): Block[] {
  const lines = src.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const flushPara = (buffer: string[]) => {
    const text = buffer.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^##\s/.test(line)) {
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "").trim() });
      i++;
      continue;
    }
    if (/^###\s/.test(line)) {
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "").trim() });
      i++;
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const buffer: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^##?\s/.test(lines[i]) &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      buffer.push(lines[i]);
      i++;
    }
    flushPara(buffer);
  }

  return blocks;
}

// Inline rendering → React nodes. Simple regex-walk, good enough for Phase 1.
import { Fragment, type ReactNode, createElement } from "react";

export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let key = 0;

  const patterns: { re: RegExp; render: (m: RegExpExecArray) => ReactNode }[] = [
    {
      re: /\*\*([^*]+)\*\*/,
      render: (m) => createElement("strong", { key: key++ }, m[1]),
    },
    {
      re: /\*([^*]+)\*/,
      render: (m) => createElement("em", { key: key++ }, m[1]),
    },
    {
      re: /`([^`]+)`/,
      render: (m) =>
        createElement(
          "code",
          {
            key: key++,
            className: "rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[0.9em]",
          },
          m[1],
        ),
    },
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (m) => {
        const href = m[2];
        const isExternal = /^https?:\/\//i.test(href);
        const props: Record<string, string> = {
          key: String(key++),
          href,
          className: "text-brand underline-offset-4 hover:underline",
        };
        if (isExternal) {
          props.target = "_blank";
          props.rel = "noopener nofollow";
        }
        return createElement("a", props, m[1]);
      },
    },
  ];

  while (rest.length > 0) {
    let earliest: { idx: number; match: RegExpExecArray; p: (typeof patterns)[number] } | null = null;
    for (const p of patterns) {
      const m = p.re.exec(rest);
      if (m && (earliest === null || m.index < earliest.idx)) {
        earliest = { idx: m.index, match: m, p };
      }
    }
    if (!earliest) {
      nodes.push(rest);
      break;
    }
    if (earliest.idx > 0) nodes.push(rest.slice(0, earliest.idx));
    nodes.push(earliest.p.render(earliest.match));
    rest = rest.slice(earliest.idx + earliest.match[0].length);
  }

  return nodes;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export type RenderOptions = {
  /**
   * Called for each H2. If it returns a node, that node is emitted *above* the H2.
   * Receives the heading's raw text and its slugified form.
   */
  beforeH2?: (text: string, slug: string) => ReactNode | null;
};

export function renderMarkdown(src: string, opts: RenderOptions = {}): ReactNode {
  const blocks = parseMarkdown(src);
  const items: ReactNode[] = [];
  let key = 0;
  for (const b of blocks) {
    const k = key++;
    switch (b.type) {
      case "h2": {
        const slug = slugifyHeading(b.text);
        const before = opts.beforeH2?.(b.text, slug);
        if (before) items.push(createElement(Fragment, { key: `h2-before-${k}` }, before));
        items.push(
          createElement("h2", { key: k, id: slug }, renderInline(b.text)),
        );
        break;
      }
      case "h3":
        items.push(createElement("h3", { key: k }, renderInline(b.text)));
        break;
      case "p":
        items.push(createElement("p", { key: k }, renderInline(b.text)));
        break;
      case "ul":
        items.push(
          createElement(
            "ul",
            { key: k },
            ...b.items.map((it, j) =>
              createElement("li", { key: j }, renderInline(it)),
            ),
          ),
        );
        break;
      case "ol":
        items.push(
          createElement(
            "ol",
            { key: k },
            ...b.items.map((it, j) =>
              createElement("li", { key: j }, renderInline(it)),
            ),
          ),
        );
        break;
    }
  }
  return createElement(Fragment, null, ...items);
}
