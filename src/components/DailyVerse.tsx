import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUniformVerse } from "@/lib/verse-uniform";
import { saveFavoriteVerse, isVerseSaved } from "@/lib/favorites";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Verse = {
  reference: string;
  translation: string;
  text: string;
  fetchedAt?: string;
  source?: string;
};

const STORAGE_KEY = "oneseed.currentVerse";

export default function DailyVerse() {
  const { toast } = useToast();
  
  const [verse, setVerse] = useState<Verse | null>(null);
  const [alreadySaved, setAlreadySaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const v = JSON.parse(raw) as Verse;
        setVerse(v);
      }
    } catch {}
  }, []);

  const { refetch, isFetching } = useQuery({
    queryKey: ["uniform-verse"],
    queryFn: () => getUniformVerse({ mode: "random" }),
    enabled: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!verse?.reference || !verse?.text) return;
    isVerseSaved(verse.reference, verse.text)
      .then(setAlreadySaved)
      .catch(() => setAlreadySaved(false));
  }, [verse?.reference, verse?.text]);

  const fetchNew = async () => {
    try {
      const { data } = await refetch();
      if (data) {
        const v: Verse = {
          reference: data.reference,
          translation: data.translation,
          text: data.text,
          fetchedAt: data.fetchedAt,
          source: data.source,
        };
        setVerse(v);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
        setAlreadySaved(false);
      }
    } catch (err: any) {
      toast({
        title: "Couldn't get a verse",
        description: err?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleFavorite = async () => {
    if (!verse || alreadySaved) return;
    try {
      await saveFavoriteVerse({
        reference: verse.reference,
        text: verse.text,
        translation: verse.translation,
      });
      setAlreadySaved(true);
      toast({ title: "Added to favorites", description: "Verse saved to your favorites" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save", variant: "destructive" });
    }
  };

  const shareVerse = async () => {
    if (!verse) return;
    const payload = `"${verse.text}" — ${verse.reference}`;
    if (navigator.share) {
      await navigator.share({ title: "Daily Verse • OneSeed", text: payload });
    } else {
      await navigator.clipboard.writeText(payload);
      toast({ title: "Copied", description: "Verse copied to clipboard" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-green-50 to-amber-50 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700 uppercase tracking-wide">Today's Verse</span>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="text-xs uppercase opacity-60">
            {verse?.translation || "WEB"}{verse?.source ? ` • ${verse.source}` : ""}
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {verse ? (
            <>
              <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-relaxed">
                "{verse.text}"
              </blockquote>
              <div className="space-y-1">
                <cite className="block text-xl font-semibold text-green-700 not-italic">
                  — {verse.reference}
                </cite>
              </div>
            </>
          ) : (
            <div className="py-10 text-gray-600">
              No verse yet. Click <span className="font-semibold">New Verse</span> to get one.
            </div>
          )}

          <div className="flex justify-center gap-3 pt-6 flex-wrap">
            <Button
              onClick={handleFavorite}
              variant="outline"
              disabled={!verse || alreadySaved}
              className={`border-2 transition-all duration-200 ${
                alreadySaved
                  ? "border-green-300 bg-green-50 text-green-600"
                  : "border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${alreadySaved ? "fill-current" : ""}`} />
              {alreadySaved ? "Saved" : "Favorite"}
            </Button>

            <Button
              onClick={shareVerse}
              variant="outline"
              disabled={!verse}
              className="border-2 border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              onClick={fetchNew}
              disabled={isFetching}
              variant="outline"
              className="border-2 border-green-300 hover:bg-green-50 hover:text-green-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Loading…" : (verse ? "New Verse" : "Get Verse")}
            </Button>
          </div>

          {verse?.fetchedAt && (
            <div className="text-[11px] opacity-60 pt-1">
              Fetched: {new Date(verse.fetchedAt).toLocaleString()}
              {verse.source ? ` • ${verse.source}` : ""}
            </div>
          )}
          
          <div className="mt-8 p-6 bg-white/50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Reflection Question</h3>
            <p className="text-gray-700 italic">
              How can you apply this verse to your life today? What is God speaking to your heart through these words?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}