"use client";

import { useId, useRef } from "react";
import NoteContent from "./note-content";

type Format =
  | "bold"
  | "underline"
  | "h1"
  | "h2"
  | "h3"
  | "bullets"
  | "numbers"
  | "align-left"
  | "align-center"
  | "align-right";

const toolbarItems: { format: Format; label: string; icon: string }[] = [
  { format: "bold", label: "Bold", icon: "B" },
  { format: "underline", label: "Underline", icon: "U" },
  { format: "h1", label: "Heading 1", icon: "H1" },
  { format: "h2", label: "Heading 2", icon: "H2" },
  { format: "h3", label: "Heading 3", icon: "H3" },
  { format: "numbers", label: "Numbered list", icon: "" },
  { format: "bullets", label: "Bulleted list", icon: "" },
  { format: "align-left", label: "Align left", icon: "" },
  { format: "align-center", label: "Align center", icon: "" },
  { format: "align-right", label: "Align right", icon: "" },
];

function ToolbarIcon({ format }: { format: Format }) {
  if (format === "numbers" || format === "bullets") {
    return (
      <svg
        aria-hidden="true"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        viewBox="0 0 24 24"
      >
        {format === "numbers" ? (
          <>
            <text
              fill="currentColor"
              fontFamily="Arial, sans-serif"
              fontSize="6"
              fontWeight="600"
              stroke="none"
              x="2"
              y="7"
            >
              1.
            </text>
            <text
              fill="currentColor"
              fontFamily="Arial, sans-serif"
              fontSize="6"
              fontWeight="600"
              stroke="none"
              x="2"
              y="13.5"
            >
              2.
            </text>
            <text
              fill="currentColor"
              fontFamily="Arial, sans-serif"
              fontSize="6"
              fontWeight="600"
              stroke="none"
              x="2"
              y="20"
            >
              3.
            </text>
          </>
        ) : (
          <>
            <circle cx="4.5" cy="5" r="1" fill="currentColor" />
            <circle cx="4.5" cy="12" r="1" fill="currentColor" />
            <circle cx="4.5" cy="19" r="1" fill="currentColor" />
          </>
        )}
        <path d="M9 5h11M9 12h11M9 19h11" />
      </svg>
    );
  }

  const lines =
    format === "align-left"
      ? ["M4 5h16", "M4 9h11", "M4 13h16", "M4 17h10", "M4 21h14"]
      : format === "align-center"
        ? ["M4 5h16", "M7 9h10", "M4 13h16", "M7 17h10", "M5 21h14"]
        : ["M4 5h16", "M9 9h11", "M4 13h16", "M10 17h10", "M6 21h14"];

  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {lines.map((line) => (
        <path d={line} key={line} />
      ))}
    </svg>
  );
}

export default function NoteEditor({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  rows = 5,
}: {
  id?: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyFormat(format: Format) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (format === "bold" || format === "underline") {
      const selectedText = value.slice(start, end);
      const placeholder = format === "bold" ? "bold text" : "underlined text";
      const prefix = format === "bold" ? "**" : "<u>";
      const suffix = format === "bold" ? "**" : "</u>";
      const text = selectedText || placeholder;
      const replacement = `${prefix}${text}${suffix}`;

      onChange(value.slice(0, start) + replacement + value.slice(end));
      window.requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + text.length,
        );
      });
      return;
    }

    const blockStart = value.lastIndexOf("\n", start - 1) + 1;
    const nextLineBreak = value.indexOf("\n", end);
    const blockEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
    const selectedBlock = value.slice(blockStart, blockEnd);

    if (format.startsWith("align-")) {
      const alignment = format.slice("align-".length);
      const prefix = `:::${alignment}\n`;
      const suffix = "\n:::";
      const replacement = `${prefix}${selectedBlock}${suffix}`;
      const selectionStart =
        start === end ? blockStart + prefix.length + selectedBlock.length : blockStart + prefix.length;
      const selectionEnd =
        start === end ? selectionStart : blockStart + prefix.length + selectedBlock.length;

      onChange(value.slice(0, blockStart) + replacement + value.slice(blockEnd));
      window.requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(selectionStart, selectionEnd);
      });
      return;
    }

    const lines = selectedBlock.split("\n");
    let number = 0;

    const formattedLines = lines.map((line) => {
      const content = line.replace(/^\s*(?:#{1,3}\s+|[-*]\s+|\d+\.\s+)/, "");

      if (format === "bullets") {
        return /^\s*[-*]\s+/.test(line) ? content : `- ${content}`;
      }

      if (format === "numbers") {
        number += 1;
        return `${number}. ${content}`;
      }

      const headingLevel = Number(format.slice(1));
      return `${"#".repeat(headingLevel)} ${content}`;
    });

    const replacement = formattedLines.join("\n");
    onChange(value.slice(0, blockStart) + replacement + value.slice(blockEnd));
    const selectionStart = start === end ? blockStart + replacement.length : blockStart;
    const selectionEnd = start === end ? selectionStart : blockStart + replacement.length;

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  return (
    <div>
      <label
        className="block text-sm font-semibold text-blue-950"
        htmlFor={inputId}
      >
        {label}
      </label>
      <div className="mt-1.5 overflow-hidden rounded-xl border border-blue-200 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
        <div
          aria-label="Note formatting"
          className="flex flex-wrap gap-1 border-b border-blue-100 bg-blue-50/80 p-2"
          role="toolbar"
        >
          {toolbarItems.map(({ format, label: toolLabel, icon }) => (
            <button
              aria-label={toolLabel}
              className={`grid size-9 place-items-center rounded-lg text-sm text-blue-900 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-700 ${
                format === "bold" ? "font-bold" : ""
              } ${format === "underline" ? "underline decoration-2 underline-offset-2" : ""}`}
              key={format}
              onClick={() => applyFormat(format)}
              onPointerDown={(event) => event.preventDefault()}
              title={toolLabel}
              type="button"
            >
              {icon ? icon : <ToolbarIcon format={format} />}
            </button>
          ))}
        </div>
        <textarea
          className="min-h-32 w-full resize-y border-0 bg-white px-3.5 py-3 text-base leading-6 text-slate-900 outline-none placeholder:text-slate-400"
          id={inputId}
          name={name}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder="Write down your beautiful ideas"
          ref={textareaRef}
          required={required}
          rows={rows}
          value={value}
        />
      </div>
      <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Preview
        </p>
        {value.trim() ? (
          <NoteContent body={value} />
        ) : (
          <p className="text-sm text-slate-500">
            Your formatted note will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
