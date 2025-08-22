export type Verse = { reference: string; translation: string; text: string };

const base = import.meta.env.VITE_SUPABASE_URL!;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export async function getVerse(ref?: string): Promise<Verse> {
  const qs = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  const res = await fetch(`${base}/functions/v1/verse${qs}`, {
    headers: { Authorization: `Bearer ${anon}` },
  });
  if (!res.ok) throw new Error(`Verse HTTP ${res.status}`);
  return res.json();
}