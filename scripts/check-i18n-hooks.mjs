import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const SRC_DIR = path.join(projectRoot, "src");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function isWordChar(ch) {
  return /[A-Za-z0-9_$]/.test(ch);
}

function findMatching(text, openIndex, openChar, closeChar) {
  let i = openIndex + 1;
  let depth = 1;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (ch === "/" && next === "/") {
        inLineComment = true;
        i++;
        continue;
      }
      if (ch === "/" && next === "*") {
        inBlockComment = true;
        i++;
        continue;
      }
    }

    if (inSingle) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === '"') inDouble = false;
      continue;
    }
    if (inTemplate) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === "`") {
        inTemplate = false;
        continue;
      }
      // Note: we intentionally do not parse ${} nesting; it is still balanced by braces below.
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (ch === "`") {
      inTemplate = true;
      continue;
    }

    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function splitTopLevelArgs(argText) {
  const args = [];
  let start = 0;
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < argText.length; i++) {
    const ch = argText[i];
    const next = argText[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (ch === "/" && next === "/") {
        inLineComment = true;
        i++;
        continue;
      }
      if (ch === "/" && next === "*") {
        inBlockComment = true;
        i++;
        continue;
      }
    }

    if (inSingle) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === '"') inDouble = false;
      continue;
    }
    if (inTemplate) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === "`") {
        inTemplate = false;
        continue;
      }
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (ch === "`") {
      inTemplate = true;
      continue;
    }

    if (ch === "(") depthParen++;
    else if (ch === ")") depthParen = Math.max(0, depthParen - 1);
    else if (ch === "{") depthBrace++;
    else if (ch === "}") depthBrace = Math.max(0, depthBrace - 1);
    else if (ch === "[") depthBracket++;
    else if (ch === "]") depthBracket = Math.max(0, depthBracket - 1);

    const atTop = depthParen === 0 && depthBrace === 0 && depthBracket === 0;
    if (atTop && ch === ",") {
      args.push(argText.slice(start, i).trim());
      start = i + 1;
    }
  }

  const last = argText.slice(start).trim();
  if (last) args.push(last);
  return args;
}

function depsArrayInfo(depsText) {
  const trimmed = depsText.trim();
  if (!trimmed.startsWith("[")) return null;
  const close = findMatching(trimmed, 0, "[", "]");
  if (close === -1) return null;
  const inside = trimmed.slice(1, close).trim();
  const items = inside
    ? splitTopLevelArgs(inside)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  return { items, isEmpty: items.length === 0 };
}

function containsTUsage(text) {
  return /\bt\(\s*(["'`])/.test(text);
}

function main() {
  const files = walk(SRC_DIR).filter((f) => /\.(ts|tsx)$/.test(f));

  const findings = [];

  for (const file of files) {
    const rel = path.relative(projectRoot, file);
    const text = fs.readFileSync(file, "utf8");

    // Find occurrences of useMemo( / useCallback( and React.useMemo( / React.useCallback(
    const re = /(?:\bReact\.)?\buseMemo\s*\(|(?:\bReact\.)?\buseCallback\s*\(/g;

    let m;
    while ((m = re.exec(text))) {
      const callStart = m.index;
      const openParen = text.indexOf("(", callStart);
      if (openParen === -1) continue;
      const closeParen = findMatching(text, openParen, "(", ")");
      if (closeParen === -1) continue;

      const callText = text.slice(callStart, closeParen + 1);
      if (!containsTUsage(callText)) continue;

      // Extract args text inside parentheses
      const argsText = text.slice(openParen + 1, closeParen);
      const args = splitTopLevelArgs(argsText);
      if (args.length < 2) continue;

      const deps = depsArrayInfo(args[1]);
      if (!deps) continue;

      const hasTInDeps = deps.items.some(
        (it) => it === "t" || it.endsWith(".t") || /\bt\b/.test(it)
      );
      if (deps.isEmpty || !hasTInDeps) {
        // best-effort line number
        const prefix = text.slice(0, callStart);
        const line = prefix.split("\n").length;

        findings.push({
          file: rel,
          line,
          kind: deps.isEmpty ? "EMPTY_DEPS" : "MISSING_T_DEPS",
          snippet:
            callText.slice(0, 180).replace(/\s+/g, " ") +
            (callText.length > 180 ? "…" : ""),
        });
      }

      // Move regex index forward to avoid quadratic behavior
      re.lastIndex = closeParen + 1;
    }
  }

  if (findings.length === 0) {
    console.log(
      "OK: No useMemo/useCallback blocks found that call t(...) with empty deps or deps missing t."
    );
    process.exit(0);
  }

  console.error(
    `ERROR: Found ${findings.length} potential stale-locale hook(s):`
  );
  for (const f of findings) {
    console.error(`- ${f.file}:${f.line}  ${f.kind}`);
    console.error(`  ${f.snippet}`);
  }

  process.exit(1);
}

main();
