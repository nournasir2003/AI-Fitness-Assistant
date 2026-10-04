// src/components/chat/MessageBubble.tsx

import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { exerciseSearchUrl, isRestRow } from "@/lib/exercise-media";

/**
 * Safety net: strips stray HTML tags the model might still emit despite the
 * system prompt's instructions ("NEVER output HTML"). Applied per text
 * segment / per table cell. Keeps markdown autolinks like <https://...>.
 */
function stripStrayHtml(text: string): string {
  return text.replace(/<[^>]{1,60}>/g, (match) =>
    /^<https?:\/\//i.test(match) ? match : "",
  );
}

const mdComponents = {
  p: ({ children }: any) => <p className="mb-3 last:mb-0">{children}</p>,
  ul: ({ children }: any) => (
    <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

/** Exercise name plus a plain link to search YouTube for its proper form. */
function ExerciseCell({ name }: { name: string }) {
  if (isRestRow(name)) {
    return <span>{name}</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      <span>{name}</span>
      <a
        href={exerciseSearchUrl(name)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-brand underline w-fit"
      >
        🎥Watch a tutorial
      </a>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Hand-written pipe-table parsing. We do NOT rely on remark's internal   */
/* AST shape (mdast vs hast differs by library/version and breaks         */
/* easily, especially mid-stream). Instead we split the raw text into     */
/* "markdown" and "table" blocks ourselves, and parse table blocks with   */
/* plain string splitting. This also lets us merge the "Day" column with  */
/* a real rowSpan, and sanitize each cell individually.                   */
/* ---------------------------------------------------------------------- */

type Block =
  | { type: "md"; content: string }
  | { type: "table"; content: string };

function isTableLine(line: string): boolean {
  const t = line.trim();
  return t.startsWith("|") && t.endsWith("|") && t.length > 1;
}

function isSeparatorLine(line: string): boolean {
  const t = line.trim();
  return /^[\s|:-]+$/.test(t) && t.includes("-");
}

function splitIntoBlocks(raw: string): Block[] {
  const lines = raw.split("\n");
  const blocks: Block[] = [];
  let mdBuf: string[] = [];
  let tableBuf: string[] = [];
  let inTable = false;

  const flushMd = () => {
    if (mdBuf.length) {
      blocks.push({ type: "md", content: mdBuf.join("\n") });
      mdBuf = [];
    }
  };
  const flushTable = () => {
    if (tableBuf.length) {
      blocks.push({ type: "table", content: tableBuf.join("\n") });
      tableBuf = [];
    }
  };

  for (const line of lines) {
    if (isTableLine(line)) {
      if (!inTable) {
        flushMd();
        inTable = true;
      }
      tableBuf.push(line);
    } else {
      if (inTable) {
        flushTable();
        inTable = false;
      }
      mdBuf.push(line);
    }
  }
  flushTable();
  flushMd();

  return blocks;
}

function cellsFromLine(line: string): string[] {
  let l = line.trim();
  if (l.startsWith("|")) l = l.slice(1);
  if (l.endsWith("|")) l = l.slice(0, -1);
  return l.split("|").map((c) => stripStrayHtml(c.trim()));
}

function parseTable(
  block: string,
): { header: string[]; rows: string[][] } | null {
  const rawLines = block.split("\n").filter((l) => l.trim().length > 0);
  const lines = rawLines.filter((l) => !isSeparatorLine(l));
  if (lines.length === 0) return null;

  const [headerLine, ...bodyLines] = lines;
  const header = cellsFromLine(headerLine);
  const rows = bodyLines
    .map(cellsFromLine)
    // drop any ragged / incomplete row (can happen on the very last
    // streaming chunk before the table finishes arriving)
    .filter((r) => r.length === header.length);

  return { header, rows };
}

type MergedCell = { text: string; rowSpan: number; skip: boolean };

/**
 * Merges consecutive rows that share the same value, independently for
 * every "grouping" column (every column before "Exercise"). A normal
 * single-week table has one grouping column (Day). A multi-week table has
 * two (Week, then Day) — each is merged on its own consecutive-run basis,
 * so Week 1's five Mondays merge under one "Week 1" cell while each day
 * within that week still merges separately under its own "Monday" cell.
 */
function buildMergedGrid(
  rows: string[][],
  groupColumnCount: number,
): MergedCell[][] {
  const grid: MergedCell[][] = rows.map((row) =>
    row.map((text) => ({ text, rowSpan: 1, skip: false })),
  );

  for (let col = 0; col < groupColumnCount; col++) {
    for (let i = 0; i < grid.length; i++) {
      if (!grid[i][col] || grid[i][col].skip) continue;
      let span = 1;
      for (let j = i + 1; j < grid.length; j++) {
        if (grid[j][col] && grid[j][col].text === grid[i][col].text) {
          grid[j][col].skip = true;
          span++;
        } else {
          break;
        }
      }
      grid[i][col].rowSpan = span;
    }
  }

  return grid;
}

function TableBlock({ content }: { content: string }) {
  const parsed = parseTable(content);
  if (!parsed || parsed.rows.length === 0) {
    // Not a real/complete table yet (e.g. still streaming) — show as plain text.
    return <p className="mb-3 last:mb-0 whitespace-pre-wrap">{content}</p>;
  }

  const { header, rows } = parsed;

  const exerciseColIndex = header.findIndex((h) =>
    h.toLowerCase().includes("exercise"),
  );
  // Every column before "Exercise" is a grouping column to merge (Day
  // alone normally; Week + Day for multi-week plans). Fall back to
  // merging just the first column if "Exercise" isn't found for some reason.
  const groupColumnCount = exerciseColIndex > 0 ? exerciseColIndex : 1;

  const grid = buildMergedGrid(rows, groupColumnCount);

  return (
    <div className="my-4 max-w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-max border-collapse text-sm">
        <thead className="bg-muted">
          <tr className="border-b border-border">
            {header.map((cell, i) => (
              <th
                key={i}
                className="border-b border-border px-3 py-2.5 text-left font-semibold whitespace-nowrap"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, i) => (
            <tr key={i} className="border-b border-border">
              {row.map((cell, j) =>
                cell.skip ? null : (
                  <td
                    key={j}
                    rowSpan={j < groupColumnCount ? cell.rowSpan : 1}
                    className={`border-b border-border px-3 py-2.5 align-top ${
                      j < groupColumnCount
                        ? "font-medium whitespace-nowrap"
                        : "max-w-[240px]"
                    }`}
                  >
                    {j === exerciseColIndex ? (
                      <ExerciseCell name={cell.text} />
                    ) : (
                      cell.text
                    )}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RenderedText({ text }: { text: string }) {
  const blocks = splitIntoBlocks(text);

  return (
    <>
      {blocks.map((block, i) =>
        block.type === "table" ? (
          <TableBlock key={i} content={block.content} />
        ) : block.content.trim().length > 0 ? (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            components={mdComponents}
          >
            {stripStrayHtml(block.content)}
          </ReactMarkdown>
        ) : null,
      )}
    </>
  );
}

export default function MessageBubble({
  role,
  parts,
}: {
  role: string;
  parts: UIMessage["parts"];
}) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`w-fit max-w-[95%] sm:max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
          isUser
            ? "bg-brand text-brand-foreground shadow-md shadow-brand/20 rounded-br-sm"
            : "bg-card text-card-foreground border border-border rounded-bl-sm"
        }`}
      >
        {parts.map((part, i) =>
          part.type === "text" ? (
            <RenderedText key={i} text={part.text} />
          ) : null,
        )}
      </div>
    </div>
  );
}
