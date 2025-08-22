export type Verse = {
  reference: string;
  translation: string;
  text: string;
  fetchedAt?: string;
  source?: string;
};

export async function getVerse(opts?: { ref?: string; bust?: number; mode?: "random" | "votd" }): Promise<Verse> {
  const base = import.meta.env.VITE_SUPABASE_URL!;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;
  const qs = new URLSearchParams();
  // default to random mode for "New verse"
  qs.set("mode", opts?.mode ?? "random");
  if (opts?.ref) qs.set("ref", opts.ref);
  if (opts?.bust != null) qs.set("_", String(opts.bust));
  const url = `${base}/functions/v1/verse?${qs.toString()}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${anon}` },
    cache: "no-store",
    mode: "cors",
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Verse HTTP ${res.status} ${t}`);
  }
  return res.json();
}