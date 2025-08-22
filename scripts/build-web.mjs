// scripts/build-web.mjs
// Build per-chapter JSON + manifest from the WEB source (TehShrike repo)

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 66-book order (Protestant canon)
const BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms",
  "Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
  "Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi",
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians",
  "Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James",
  "1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];

// The TehShrike repo keeps files as lowercase names with spaces removed in /json
const SRC_DIR = path.join(__dirname, "..", "data", "web", "json");
const OUT_DIR = path.join(__dirname, "..", "public", "bible", "web");

function slug(i, name) {
  const n = String(i + 1).padStart(2, "0");
  return `${n}-${name.replace(/\s+/g, "")}`;
}

function srcFile(name) {
  const f = name.replace(/\s+/g, "").toLowerCase() + ".json";
  return path.join(SRC_DIR, f);
}

// extract a per-chapter array of verse texts from TehShrike's flat event list
function buildChaptersFromEvents(events) {
  // { [chapterNum]: { [verseNum]: string } }
  const m = new Map(); // chapter -> Map(verse -> text)
  for (const e of events) {
    const t = e?.type;
    const c = e?.chapterNumber;
    const v = e?.verseNumber;
    if (!c || !v) continue;
    if (t === "paragraph text" || t === "line text") {
      if (!m.has(c)) m.set(c, new Map());
      const vm = m.get(c);
      vm.set(v, (vm.get(v) || "") + (e.value || ""));
    }
  }
  // normalize to array: chapters[chapterIndex] = [verse1, verse2, ...]
  const out = [];
  for (const [chapNum, vm] of [...m.entries()].sort((a,b)=>a[0]-b[0])) {
    const maxVerse = Math.max(...vm.keys());
    const verses = Array.from({ length: maxVerse }, (_, i) => (vm.get(i+1) || "").trim());
    out[chapNum - 1] = verses;
  }
  return out;
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function main() {
  await ensureDir(OUT_DIR);
  const manifest = { translation: "WEB", totalVerses: 0, books: [] };

  for (let i = 0; i < BOOKS.length; i++) {
    const name = BOOKS[i];
    const input = srcFile(name);
    const outSlug = slug(i, name);
    const bookOut = path.join(OUT_DIR, outSlug);
    await ensureDir(bookOut);

    console.log(`Processing ${name}...`);

    try {
      const raw = await fs.readFile(input, "utf-8");
      const events = JSON.parse(raw); // TehShrike format: flat array of events
      const chapters = buildChaptersFromEvents(events);

      const chapterCounts = [];
      for (let c = 0; c < chapters.length; c++) {
        const verses = chapters[c] || [];
        if (!verses.length) continue;
        const chapterFile = path.join(bookOut, `${c + 1}.json`);
        await fs.writeFile(chapterFile, JSON.stringify(verses));
        chapterCounts[c] = verses.length;
        manifest.totalVerses += verses.length;
      }

      manifest.books.push({
        id: i + 1,
        name,
        slug: outSlug,
        chapters: chapterCounts
      });
    } catch (err) {
      console.warn(`Skipping ${name}: ${err.message}`);
    }
  }

  await fs.writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Done. totalVerses =", manifest.totalVerses);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});