export type Verse = {
  reference: string;
  translation: string;
  text: string;
  fetchedAt?: string;
  source?: string;       // "bible-api" | "ourmanna" | "local-fallback"
  note?: string;
};

type GetOpts = {
  ref?: string;                    // "John 3:16" etc
  bust?: number;                   // pass a nonce to force refetch
  mode?: "random" | "votd";        // random on click, or Verse Of The Day
  version?: "web";                 // keeping for future (NIV later)
};

// --- tiny local fallback in case network fails
const LOCAL = [
  { ref: "John 3:16", txt: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { ref: "Psalm 23:1", txt: "The LORD is my shepherd; I shall not want." },
  { ref: "Proverbs 3:5-6", txt: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
  { ref: "Isaiah 41:10", txt: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness." },
  { ref: "Romans 8:28", txt: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { ref: "Philippians 4:6-7", txt: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
  { ref: "Matthew 6:33", txt: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you." },
  { ref: "Jeremiah 29:11", txt: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
];

function localRandom(): Verse {
  const v = LOCAL[Math.floor(Math.random() * LOCAL.length)];
  return {
    reference: v.ref,
    translation: "WEB",
    text: v.txt,
    fetchedAt: new Date().toISOString(),
    source: "local-fallback",
    note: "Offline fallback",
  };
}

async function fetchBibleApi({ ref, bust }: { ref?: string; bust?: number }): Promise<Verse> {
  const base = "https://bible-api.com/";
  const qs = new URLSearchParams({ translation: "web" });
  if (bust != null) qs.set("_", String(bust));
  const url = ref
    ? `${base}${encodeURIComponent(ref)}?${qs}`
    : `${base}random?${qs}`;

  const res = await fetch(url, { cache: "no-store", mode: "cors" });
  if (!res.ok) throw new Error(`bible-api HTTP ${res.status}`);
  const data = await res.json();

  const text = Array.isArray(data?.verses)
    ? data.verses.map((v: any) => v.text).join("").trim()
    : (data?.text ?? "").trim();

  return {
    reference: data?.reference ?? ref ?? "Random Verse",
    translation: (data?.translation_id ?? "WEB").toUpperCase(),
    text,
    fetchedAt: new Date().toISOString(),
    source: "bible-api",
  };
}

async function fetchVOTD({ bust }: { bust?: number }): Promise<Verse> {
  // OurManna = Verse of the Day. No key. Daily deterministic.
  const url = `https://beta.ourmanna.com/api/v1/get/?format=json&_=${bust ?? Date.now()}`;
  const res = await fetch(url, { cache: "no-store", mode: "cors" });
  if (!res.ok) throw new Error(`ourmanna HTTP ${res.status}`);
  const j = await res.json();
  const d = j?.verse?.details ?? {};
  return {
    reference: d.reference ?? "Verse of the Day",
    translation: (d.version ?? "WEB").toUpperCase(),
    text: (d.text ?? "").toString().trim(),
    fetchedAt: new Date().toISOString(),
    source: "ourmanna",
  };
}

export async function getVerse(opts: GetOpts = {}): Promise<Verse> {
  const { ref, bust, mode = "random" } = opts;
  try {
    if (mode === "votd") {
      return await fetchVOTD({ bust });
    }
    // default: fresh random from bible-api (WEB)
    return await fetchBibleApi({ ref, bust });
  } catch {
    return localRandom(); // always show something
  }
}