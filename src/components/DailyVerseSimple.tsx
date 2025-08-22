import { useQuery } from "@tanstack/react-query";
import { getVerse } from "@/lib/verse-api";
import { saveFavoriteVerse } from "@/lib/favorites";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function DailyVerse() {
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["daily-verse"],
    queryFn: () => getVerse(), // random for now
    staleTime: 1000 * 60 * 60,
  });

  const handleFavorite = async () => {
    if (!data) return;
    try {
      await saveFavoriteVerse({ 
        reference: data.reference, 
        text: data.text, 
        translation: data.translation 
      });
      toast({
        title: "Added to favorites",
        description: "Verse saved to your favorites",
      });
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err?.message || "Failed to save favorite", 
        variant: "destructive" 
      });
    }
  };

  if (isLoading) return <div className="p-4 opacity-70">Loading verse…</div>;
  if (isError || !data) return <div className="p-4 text-red-600">Couldn't load verse.</div>;

  return (
    <Card className="p-4 space-y-2">
      <div className="text-xs uppercase opacity-60">{data.translation}</div>
      <div className="font-medium">{data.reference}</div>
      <p className="leading-relaxed whitespace-pre-wrap">{data.text}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleFavorite}>Favorite</Button>
        <Button variant="outline" onClick={() => refetch()}>New random</Button>
      </div>
    </Card>
  );
}