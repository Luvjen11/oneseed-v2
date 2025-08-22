import { useMemo, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Favorites() {
  const { toast } = useToast?.() ?? { toast: () => {} };
  const { data, isLoading, isError, remove } = useFavorites();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter(
      (v) =>
        v.reference.toLowerCase().includes(needle) ||
        v.text.toLowerCase().includes(needle) ||
        (v.theme ?? "").toLowerCase().includes(needle)
    );
  }, [data, q]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center gap-2 text-sm opacity-70">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your saved verses…
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-600">Couldn't load favorites. Are you signed in?</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bookmark className="h-5 w-5" /> Saved Verses
        </h1>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by text, reference, or tag…"
          className="max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6 text-sm opacity-70">
          No saved verses yet. Go to Daily Verse and tap "Favorite".
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((v) => (
            <Card key={v.id} className="p-4">
              <div className="flex flex-col gap-2">
                <div className="text-xs opacity-60">
                  {new Date(v.created_at).toLocaleString()}
                </div>
                <div className="font-medium">{v.reference}</div>
                <p className="leading-relaxed whitespace-pre-wrap">{v.text}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    {v.theme ? <Badge variant="secondary">{v.theme}</Badge> : null}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={remove.isPending}
                    onClick={async () => {
                      try {
                        await remove.mutateAsync(v.id);
                        toast({ title: "Removed", description: "Verse unfavorited." });
                      } catch (e: any) {
                        toast({ title: "Oops", description: e.message, variant: "destructive" });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Unfavorite
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}