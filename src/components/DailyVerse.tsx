
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, BookmarkPlus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DailyVerse = () => {
  const [verse, setVerse] = useState({
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11",
    theme: "Hope & Future"
  });
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verses = [
    {
      text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
      reference: "Jeremiah 29:11",
      theme: "Hope & Future"
    },
    {
      text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      reference: "Proverbs 3:5-6",
      theme: "Trust & Guidance"
    },
    {
      text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      reference: "Romans 8:28",
      theme: "God's Purpose"
    },
    {
      text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
      reference: "Joshua 1:9",
      theme: "Courage & Strength"
    },
    {
      text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",
      reference: "Zephaniah 3:17",
      theme: "God's Love"
    }
  ];

  const getNewVerse = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * verses.length);
      setVerse(verses[randomIndex]);
      setIsLoading(false);
      setIsFavorited(false);
    }, 500);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Verse removed from your favorites" : "Verse saved to your favorites",
    });
  };

  const shareVerse = () => {
    if (navigator.share) {
      navigator.share({
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
          <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-relaxed">
            "{verse.text}"
          </blockquote>
          
          <cite className="text-xl font-semibold text-green-700 not-italic">
            — {verse.reference}
          </cite>
          
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
