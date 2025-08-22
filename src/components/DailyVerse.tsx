
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, BookmarkPlus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getVerse } from '@/lib/verse-api';
import { fetchDailyVerse, getTranslationPreference, setTranslationPreference, TranslationOption } from '@/lib/verse';

const DailyVerse = () => {
  const [verse, setVerse] = useState({ text: '', reference: '', theme: '' });
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [translation, setTranslation] = useState<TranslationOption>(getTranslationPreference());

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const userId = sessionData.session?.user.id
        if (userId) {
          const { data } = await supabase
            .from('faith_profiles')
            .select('preferred_translation')
            .eq('user_id', userId)
            .single()
          const pref = (data?.preferred_translation as TranslationOption | undefined)
          if (pref === 'ourmanna' || pref === 'esv') {
            setTranslationPreference(pref)
            if (!ignore) setTranslation(pref)
          }
        }
      } catch { /* ignore */ }
      const v = await fetchDailyVerse()
      if (!ignore) setVerse({ text: v.text, reference: v.reference, theme: v.theme || '' })
    })()
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    // When translation changes, re-fetch (using its own cache key)
    let ignore = false
    ;(async () => {
      const v = await fetchDailyVerse()
      if (!ignore) setVerse({ text: v.text, reference: v.reference, theme: v.theme || '' })
    })()
    return () => { ignore = true }
  }, [translation])

  const getNewVerse = async () => {
    setIsLoading(true);
    try {
      // Try new Edge Function API first, fallback to existing
      try {
        const v = await getVerse(); // random verse from Edge Function
        setVerse({ text: v.text, reference: v.reference, theme: 'Random Verse' })
      } catch {
        // Fallback to existing implementation
        const v = await fetchDailyVerse({ bypassCache: true })
        setVerse({ text: v.text, reference: v.reference, theme: v.theme || '' })
      }
      setIsFavorited(false)
    } finally {
      setIsLoading(false)
    }
  };

  const onChangeTranslation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = (e.target.value as TranslationOption)
    setTranslationPreference(next)
    setTranslation(next)
    ;(async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const userId = sessionData.session?.user.id
        if (!userId) return
        await supabase
          .from('faith_profiles')
          .upsert({ user_id: userId, preferred_translation: next }, { onConflict: 'user_id' })
      } catch { /* ignore */ }
    })()
  }

  const toggleFavorite = async () => {
    setIsFavorited(!isFavorited);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;

      if (!isFavorited) {
        await supabase.from('faith_verses').insert({
          user_id: userId,
          text: verse.text,
          reference: verse.reference,
          theme: verse.theme,
        });
      } else {
        // Optimistic remove: delete matching verse rows
        await supabase
          .from('faith_verses')
          .delete()
          .match({ user_id: userId, text: verse.text, reference: verse.reference });
      }
      toast({
        title: !isFavorited ? 'Added to favorites' : 'Removed from favorites',
        description: !isFavorited ? 'Verse saved to your favorites' : 'Verse removed from your favorites',
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to update favorites', variant: 'destructive' });
    }
  };

  const shareVerse = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Daily Verse from OneSeed',
        text: `"${verse.text}" - ${verse.reference}`,
      });
    } else {
      navigator.clipboard.writeText(`"${verse.text}" - ${verse.reference}`);
      toast({
        title: "Verse copied!",
        description: "The verse has been copied to your clipboard",
      });
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;
      await supabase.from('faith_verses').upsert({
        user_id: userId,
        text: verse.text,
        reference: verse.reference,
        theme: verse.theme,
        shared_count: 1,
      }, { onConflict: 'user_id,reference' });
    } catch (_) {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-green-50 to-amber-50 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 uppercase tracking-wide">Today's Verse</span>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {verse.theme}
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center">
            <select
              value={translation}
              onChange={onChangeTranslation}
              className="text-sm border rounded-md px-3 py-1 bg-white/90"
            >
              <option value="ourmanna">Default (OurManna)</option>
              <option value="esv">ESV (requires API key)</option>
            </select>
          </div>

          <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-relaxed">
            "{verse.text}"
          </blockquote>
          
          <div className="space-y-1">
            <cite className="block text-xl font-semibold text-green-700 not-italic">
              — {verse.reference}
            </cite>
            {(verse as any).version || (verse as any).source ? (
              <p className="text-sm text-gray-500">
                {(verse as any).version ? `Version: ${(verse as any).version}` : ''}
                {(verse as any).version && (verse as any).source ? ' • ' : ''}
                {(verse as any).source ? (
                  (verse as any).sourceUrl ? (
                    <a className="underline hover:text-gray-700" href={(verse as any).sourceUrl} target="_blank" rel="noreferrer">
                      {(verse as any).source}
                    </a>
                  ) : (
                    (verse as any).source
                  )
                ) : null}
              </p>
            ) : null}
          </div>
          
          <div className="flex justify-center space-x-4 pt-6">
            <Button
              onClick={toggleFavorite}
              variant="outline"
              className={`border-2 transition-all duration-200 ${
                isFavorited 
                  ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Favorited' : 'Favorite'}
            </Button>
            
            <Button
              onClick={shareVerse}
              variant="outline"
              className="border-2 border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <Button
              onClick={getNewVerse}
              disabled={isLoading}
              variant="outline"
              className="border-2 border-green-300 hover:bg-green-50 hover:text-green-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              New Verse
            </Button>
          </div>
          
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
};

export default DailyVerse;
