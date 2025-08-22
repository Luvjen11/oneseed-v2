// src/lib/verse-uniform.ts
export type UniformVerse = {
  reference: string;
  translation: "WEB";
  text: string;
  fetchedAt: string;
  source: "local-web";
};

type Manifest = {
  translation: "WEB";
  totalVerses: number; // should be ~31,102
  books: { id: number; name: string; slug: string; chapters: number[] }[];
};

let manifestCache: Manifest | null = null;

async function loadManifest(): Promise<Manifest> {
  if (manifestCache) return manifestCache;
  const res = await fetch("/bible/web/manifest.json", { cache: "force-cache" });
  if (!res.ok) throw new Error("manifest failed");
  manifestCache = await res.json();
  return manifestCache!;
}

// Deterministic daily index
function dayIndex(total: number) {
  const days = Math.floor(Date.now() / 86_400_000);
  return ((days % total) + total) % total;
}

// Optional deterministic PRNG for "sequential" if you ever want it
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function mapGlobalIndex(m: Manifest, globalIdx: number) {
  // globalIdx is 0..totalVerses-1
  let idx = globalIdx;
  for (const book of m.books) {
    for (let c = 0; c < book.chapters.length; c++) {
      const count = book.chapters[c] || 0;
      if (idx < count) {
        const verse = idx + 1;
        return { book, chapter: c + 1, verse };
      }
      idx -= count;
    }
  }
  throw new Error("index out of range");
}

/**
 * mode:
 *  - "random"     -> true random every call (default)
 *  - "sequential" -> only if you pass a seed; maps deterministically
 *  - "votd"       -> same verse for all users per day
 * seed: number used only by "sequential" (optional)
 */
export async function getUniformVerse(opts?: { mode?: "random" | "sequential" | "votd"; seed?: number }): Promise<UniformVerse> {
  const m = await loadManifest();
  const total = m.totalVerses;
  if (!total || total < 10000) {
    throw new Error(`Manifest looks wrong (totalVerses=${total}). Rebuild your /public/bible/web data.`);
  }

  let globalIdx: number;
  const mode = opts?.mode ?? "random";

  if (mode === "votd") {
    globalIdx = dayIndex(total);
  } else if (mode === "sequential" && typeof opts?.seed === "number") {
    // deterministic but NOT random; only when you explicitly want sequential
    const rnd = mulberry32(Math.abs(opts.seed));
    globalIdx = Math.floor(rnd() * total);
  } else {
    // TRUE random: ignore seeds
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    globalIdx = buf[0] % total;
  }

  const { book, chapter, verse } = mapGlobalIndex(m, globalIdx);
  const url = `/bible/web/${book.slug}/${chapter}.json`;
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`chapter fetch failed (${url})`);
  const verses: string[] = await res.json();
  const text = (verses[verse - 1] || "").trim();

  return {
    reference: `${book.name} ${chapter}:${verse}`,
    translation: "WEB",
    text,
    fetchedAt: new Date().toISOString(),
    source: "local-web",
  };
}