// OneSeed verse function — diag + fallback + CORS
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
const VERSION = "diag-2025-08-22b";

const LOCAL_RANDOM_KJV = [
  { ref: "John 3:16", txt: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { ref: "Psalm 23:1", txt: "The LORD is my shepherd; I shall not want." },
  { ref: "Proverbs 3:5-6", txt: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
  { ref: "Isaiah 41:10", txt: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness." },
  { ref: "Philippians 4:6-7", txt: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
  { ref: "Romans 8:28", txt: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { ref: "Matthew 6:33", txt: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you." },
  { ref: "Jeremiah 29:11", txt: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
  { ref: "1 Corinthians 10:13", txt: "There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape, that ye may be able to bear it." },
  { ref: "2 Timothy 1:7", txt: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind." },
];

function pickLocalRandom() {
  const i = Math.floor(Math.random() * LOCAL_RANDOM_KJV.length);
  const v = LOCAL_RANDOM_KJV[i];
  return {
    reference: v.ref,
    translation: "KJV",
    text: v.txt,
    fetchedAt: new Date().toISOString(),
    source: "local-fallback",
  };
}

type Ok = { ok: true; provider: string; reference: string; translation: string; text: string; sample: string };
type Fail = { ok: false; provider: string; status: number; raw: string };

async function tryBibleApi(reference?: string): Promise<Ok | Fail> {
  const bust = Date.now();
  const base = "https://bible-api.com/";
  const url = reference ? `${base}${encodeURIComponent(reference)}?_${bust}`
                        : `${base}random?_${bust}`;

  const r = await fetch(url, {
    headers: { "cache-control": "no-store", "accept": "application/json", "user-agent": "oneseed-edge/1.0" },
  });
  const raw = await r.text();

  if (!r.ok) return { ok: false, provider: "bible-api", status: r.status, raw: raw.slice(0, 400) };

  let j: any = null; try { j = JSON.parse(raw); } catch {}
  const text = j && Array.isArray(j.verses) ? j.verses.map((v: any) => v.text).join("").trim()
                                            : (j?.text ?? raw).toString().trim();

  return { ok: true, provider: "bible-api",
           reference: j?.reference ?? reference ?? "Random Verse",
           translation: (j?.translation_id ?? "KJV").toUpperCase(),
           text, sample: raw.slice(0, 120) };
}

async function tryOurManna(): Promise<Ok | Fail> {
  const url = `https://beta.ourmanna.com/api/v1/get/?format=json&_=${Date.now()}`;
  const r = await fetch(url, {
    headers: { "cache-control": "no-store", "accept": "application/json", "user-agent": "oneseed-edge/1.0" },
  });
  const raw = await r.text();

  if (!r.ok) return { ok: false, provider: "ourmanna", status: r.status, raw: raw.slice(0, 400) };

  let j: any = null; try { j = JSON.parse(raw); } catch {}
  const d = j?.verse?.details ?? {};
  const text = (d.text ?? raw).toString().trim();

  return { ok: true, provider: "ourmanna",
           reference: d.reference ?? "Random Verse",
           translation: (d.version ?? "N/A").toUpperCase(),
           text, sample: raw.slice(0, 120) };
}

Deno.serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") return new Response("ok", { headers: { ...CORS, "X-OneSeed-Version": VERSION } });

  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref") ?? undefined;
    const mode = searchParams.get("mode") ?? "random"; // "random" | "votd"

    // Pure diagnostic — no network
    if (searchParams.get("diag") === "1") {
      return new Response(JSON.stringify({ ok: true, diag: "edge-function-alive", now: new Date().toISOString() }), {
        headers: { ...CORS, "content-type": "application/json", "X-OneSeed-Version": VERSION },
      });
    }

    // Primary: bible-api
    const a = await tryBibleApi(ref);
    if (a.ok) {
      return new Response(JSON.stringify({
        reference: a.reference, translation: a.translation, text: a.text,
        fetchedAt: new Date().toISOString(), source: a.provider, upstreamSample: a.sample,
      }), {
        headers: {
          ...CORS, "content-type": "application/json", "X-OneSeed-Version": VERSION,
          "cache-control": "no-store, no-cache, must-revalidate, max-age=0", "pragma": "no-cache",
        },
      });
    }

    // If mode is random and bible-api failed, use local fallback to guarantee change
    if (mode === "random") {
      const localVerse = pickLocalRandom();
      return new Response(JSON.stringify(localVerse), {
        headers: {
          ...CORS, "content-type": "application/json", "X-OneSeed-Version": VERSION,
          "cache-control": "no-store, no-cache, must-revalidate, max-age=0", "pragma": "no-cache",
        },
      });
    }

    // Fallback: OurManna (for votd mode)
    const b = await tryOurManna();
    if (b.ok) {
      return new Response(JSON.stringify({
        reference: b.reference, translation: b.translation, text: b.text,
        fetchedAt: new Date().toISOString(), source: b.provider, upstreamSample: b.sample,
        fallbackFrom: { provider: a.provider, status: a.status, raw: a.raw },
      }), {
        headers: {
          ...CORS, "content-type": "application/json", "X-OneSeed-Version": VERSION,
          "cache-control": "no-store, no-cache, must-revalidate, max-age=0", "pragma": "no-cache",
        },
      });
    }

    // Both failed → structured 502
    return new Response(JSON.stringify({ error: "Both providers failed", first: a, second: b }), {
      status: 502, headers: { ...CORS, "content-type": "application/json", "X-OneSeed-Version": VERSION },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500, headers: { ...CORS, "content-type": "application/json", "X-OneSeed-Version": VERSION },
    });
  }
});