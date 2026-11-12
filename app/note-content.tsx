import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|<u>[\s\S]+?<\/u>)/g)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      if (part.startsWith("<u>") && part.endsWith("</u>")) {
        return <u key={index}>{part.slice(3, -4)}</u>;
      }

      return part;
    });
}

function isBlockStart(line: string) {
  return (
    /^#{1,3}\s+/.test(line) ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    /^:::(left|center|right)$/.test(line)
  );
}

function renderBlocks(lines: string[], depth = 0): ReactNode[] {
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const alignment = line.match(/^:::(left|center|right)$/);

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (alignment) {
      const content: string[] = [];
      const alignmentClass =
        alignment[1] === "left"
          ? "text-left"
          : alignment[1] === "center"
            ? "text-center"
            : "text-right";
      index += 1;
      while (index < lines.length && lines[index] !== ":::") {
        content.push(lines[index]);
        index += 1;
      }
      if (lines[index] === ":::") {
        index += 1;
      }

      const alignedContent =
        depth < 8
          ? renderBlocks(content, depth + 1)
          : [renderInline(content.join("\n"))];
      blocks.push(
        <div className={alignmentClass} key={`align-${index}`}>
          {alignedContent}
        </div>,
      );
      continue;
    }

    if (heading) {
      const content = renderInline(heading[2]);
      const key = `heading-${index}`;

      if (heading[1].length === 1) {
        blocks.push(
          <h1 className="text-xl font-bold text-blue-950" key={key}>
            {content}
          </h1>,
        );
      } else if (heading[1].length === 2) {
        blocks.push(
          <h2 className="text-lg font-bold text-blue-950" key={key}>
            {content}
          </h2>,
        );
      } else {
        blocks.push(
          <h3 className="text-base font-semibold text-blue-950" key={key}>
            {content}
          </h3>,
        );
      }

      index += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: ReactNode[] = [];

      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(
          <li key={index}>
            {renderInline(lines[index].replace(/^\s*[-*]\s+/, ""))}
          </li>,
        );
        index += 1;
      }

      blocks.push(
        <ul className="list-disc space-y-1 pl-6" key={`unordered-${index}`}>
          {items}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: ReactNode[] = [];

      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(
          <li key={index}>
            {renderInline(lines[index].replace(/^\s*\d+\.\s+/, ""))}
          </li>,
        );
        index += 1;
      }

      blocks.push(
        <ol className="list-decimal space-y-1 pl-6" key={`ordered-${index}`}>
          {items}
        </ol>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isBlockStart(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }

    blocks.push(
      <p className="whitespace-pre-wrap" key={`paragraph-${index}`}>
        {renderInline(paragraph.join("\n"))}
      </p>,
    );
  }

  return blocks;
}

export default function NoteContent({ body }: { body: string }) {
  return (
    <div className="space-y-2 break-words leading-6">
      {renderBlocks(body.split(/\r?\n/))}
    </div>
  );
}
