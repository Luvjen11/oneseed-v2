import { supabase } from "@/lib/supabase";

export type FavoriteVerse = {
  id: string;
  reference: string;
  text: string;
  theme: string | null;
  created_at: string;
};

export async function saveFavoriteVerse(v: { 
  reference: string; 
  text: string; 
  theme?: string; 
  translation?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in");
  
  const { error } = await supabase.from("faith_verses").insert({
    user_id: user.id,
    reference: v.reference,
    text: v.text,
    theme: v.theme ?? null,
  });
  
  if (error) throw error;
}

export async function fetchFavorites(): Promise<FavoriteVerse[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not-authenticated");
  const { data, error } = await supabase
    .from("faith_verses")
    .select("id, reference, text, theme, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FavoriteVerse[];
}

export async function removeFavorite(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not-authenticated");
  const { error } = await supabase
    .from("faith_verses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
}

export async function isVerseSaved(reference: string, text: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase
    .from("faith_verses")
    .select("id")
    .eq("user_id", user.id)
    .eq("reference", reference)
    .eq("text", text)
    .limit(1)
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error; // ignore "no rows"
  return !!data;
}