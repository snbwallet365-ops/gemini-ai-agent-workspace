import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) parts.push(<strong key={i}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("*")) parts.push(<em key={i}>{token.slice(1, -1)}</em>);
    else if (token.startsWith("`"))
      parts.push(
        <code key={i} className="rounded bg-black/5 px-1 py-0.5 text-[0.92em]">
          {token.slice(1, -1)}
        </code>
      );
    else {
      const mm = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (mm)
        parts.push(
          <a key={i} href={mm[2]} className="underline decoration-black/20 hover:decoration-black" target="_blank" rel="noreferrer">
            {mm[1]}
          </a>
        );
    }
    i += 1;
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function MarkdownDoc({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={k++} className="font-serif text-[2rem] leading-tight tracking-tight text-neutral-900">
          {line.slice(2)}
        </h1>
      );
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={k++} className="mt-2 text-[1.05rem] font-semibold tracking-tight text-neutral-900">
          {line.slice(3)}
        </h2>
      );
      i += 1;
      continue;
    }

    if (line.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        if (!cells.every((c) => /^[-:]+$/.test(c))) rows.push(cells);
        i += 1;
      }
      if (rows.length) {
        const head = rows[0];
        const body = rows.slice(1);
        blocks.push(
          <div key={k++} className="overflow-hidden rounded-xl border border-black/10">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#d7e4c8]/70">
                <tr>
                  {head.map((c, idx) => (
                    <th key={idx} className="px-3 py-2 font-semibold text-neutral-800">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((r, ri) => (
                  <tr key={ri} className="border-t border-black/8">
                    {r.map((c, ci) => (
                      <td key={ci} className="px-3 py-2 align-top text-neutral-700">
                        {inline(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (/^\d+\.\s/.test(line) || line.trim().startsWith("- ")) {
      const items: { ordered: boolean; text: string }[] = [];
      const ordered = /^\d+\.\s/.test(line);
      while (i < lines.length && (ordered ? /^\d+\.\s/.test(lines[i]) : lines[i].trim().startsWith("- "))) {
        items.push({
          ordered,
          text: lines[i].replace(/^\d+\.\s/, "").replace(/^\s*-\s/, ""),
        });
        i += 1;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={k++} className={ordered ? "list-decimal space-y-1 pl-5 text-[14.5px] text-neutral-800" : "list-disc space-y-1 pl-5 text-[14.5px] text-neutral-800"}>
          {items.map((it, idx) => (
            <li key={idx}>{inline(it.text)}</li>
          ))}
        </List>
      );
      continue;
    }

    const para = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^#{1,3}\s/.test(lines[i]) && !lines[i].trim().startsWith("|") && !lines[i].trim().startsWith("- ") && !/^\d+\.\s/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={k++} className="text-[14.5px] leading-relaxed text-neutral-800">
        {inline(para.join(" "))}
      </p>
    );
  }

  return <div className="space-y-3">{blocks}</div>;
}
