import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const SRC_DIR = path.join(projectRoot, "src");

const LOCALE_FILES = [
  {
    locale: "en-US",
    file: path.join(projectRoot, "src/locales/en-US/messages.json"),
  },
  {
    locale: "en-CA",
    file: path.join(projectRoot, "src/locales/en-CA/messages.json"),
  },
  {
    locale: "en-GB",
    file: path.join(projectRoot, "src/locales/en-GB/messages.json"),
  },
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function getByPath(obj, key) {
  const parts = key.split(".").filter(Boolean);
  let current = obj;
  for (const part of parts) {
    if (
      current &&
      typeof current === "object" &&
      Object.prototype.hasOwnProperty.call(current, part)
    ) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function extractKeysFromText(text) {
  const keys = new Set();

  // t("...") / t('...')
  const literalCall = /\bt\(\s*(["'])([^"'\n]+)\1\s*\)/g;
  let match;
  while ((match = literalCall.exec(text))) {
    keys.add(match[2]);
  }

  // Capture template literal calls t(`prefix.${var}.suffix`) as a raw template
  const templateCall = /\bt\(\s*`([^`\n]+)`\s*\)/g;
  while ((match = templateCall.exec(text))) {
    keys.add(`TEMPLATE:${match[1]}`);
  }

  return keys;
}

function main() {
  const sourceFiles = walk(SRC_DIR).filter((f) => /\.(ts|tsx)$/.test(f));

  const usages = new Map(); // key -> Set(files)
  for (const file of sourceFiles) {
    const text = fs.readFileSync(file, "utf8");
    const keys = extractKeysFromText(text);
    for (const key of keys) {
      const files = usages.get(key) ?? new Set();
      files.add(path.relative(projectRoot, file));
      usages.set(key, files);
    }
  }

  const localeData = LOCALE_FILES.map(({ locale, file }) => {
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    return { locale, json };
  });

  const literalKeys = [...usages.keys()].filter(
    (k) => !k.startsWith("TEMPLATE:")
  );
  const templateKeys = [...usages.keys()].filter((k) =>
    k.startsWith("TEMPLATE:")
  );

  const missing = []; // { key, locale, files[] }
  for (const key of literalKeys) {
    for (const { locale, json } of localeData) {
      const found = getByPath(json, key);
      if (typeof found !== "string") {
        missing.push({ key, locale, files: [...(usages.get(key) ?? [])] });
      }
    }
  }

  if (templateKeys.length) {
    console.log("\nTemplate-key usages (manual review recommended):");
    for (const key of templateKeys.sort()) {
      const raw = key.replace(/^TEMPLATE:/, "");
      const files = [...(usages.get(key) ?? [])];
      console.log(`- t(\`${raw}\`)  (${files.length} file(s))`);
      for (const f of files.slice(0, 10)) console.log(`  - ${f}`);
      if (files.length > 10) console.log(`  - ... +${files.length - 10} more`);
    }
  }

  if (missing.length === 0) {
    console.log(
      `\nOK: ${literalKeys.length} i18n keys found; all present in ${localeData.length} locales.`
    );
    process.exit(0);
  }

  console.error(
    `\nERROR: Missing i18n keys (${missing.length} locale-misses across ${literalKeys.length} keys).`
  );

  // Group by key for readability
  const byKey = new Map();
  for (const item of missing) {
    const arr = byKey.get(item.key) ?? [];
    arr.push(item);
    byKey.set(item.key, arr);
  }

  for (const [key, items] of [...byKey.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    console.error(`\nKey: ${key}`);
    for (const it of items) {
      console.error(`  - Missing in ${it.locale}`);
    }
    const files = new Set(items.flatMap((i) => i.files));
    for (const f of [...files].slice(0, 10)) console.error(`    used in: ${f}`);
    if (files.size > 10)
      console.error(`    used in: ... +${files.size - 10} more`);
  }

  process.exit(1);
}

main();
