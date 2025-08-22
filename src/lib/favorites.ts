import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

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