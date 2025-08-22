// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.210.0/http/server.ts";

async function fetchBibleApiCom(reference?: string) {
  const base = "https://bible-api.com/";
  const url = reference ? `${base}${encodeURIComponent(reference)}` : `${base}random`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`bible-api.com HTTP ${r.status}`);
  const data = await r.json();
  const text = Array.isArray(data?.verses) ? data.verses.map((v: any) => v.text).join("").trim() : (data?.text ?? "").trim();
  return {
    reference: data?.reference ?? reference ?? "Random Verse",
    translation: (data?.translation_id ?? "kjv").toUpperCase(),
    text,
  };
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const ref = url.searchParams.get("ref") || undefined;
    const payload = await fetchBibleApiCom(ref);
    return new Response(JSON.stringify(payload), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});