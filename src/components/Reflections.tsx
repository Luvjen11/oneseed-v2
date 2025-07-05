
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, PenTool, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reflection {
  id: number;
  question: string;
  response: string;
  tags: string[];
  createdAt: Date;
}

const Reflections = () => {
  const [reflections, setReflections] = useState<Reflection[]>([
    {
      id: 1,
      question: "What are three things you're grateful for today?",
      response: "I'm grateful for my family's health, the beautiful sunrise this morning, and the opportunity to grow closer to God through His word.",
      tags: ['Gratitude', 'Family'],
      createdAt: new Date(2024, 0, 20)
    }
  ]);

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNewReflection, setShowNewReflection] = useState(false);

  const { toast } = useToast();

  const reflectionQuestions = [
    "What are three things you're grateful for today?",
    "How did you see God working in your life this week?",
    "What is one way you can show love to someone today?",
    "What fears or worries can you surrender to God right now?",
    "How has your faith grown recently?",
    "What Bible verse has been speaking to your heart?",
    "Where do you need God's guidance most right now?",
    "How can you be a blessing to others today?",
    "What is God teaching you through current challenges?",
    "How can you draw closer to God in your daily routine?"
  ];

  const availableTags = ['Gratitude', 'Growth', 'Family', 'Challenges', 'Praise', 'Confession', 'Hope', 'Love', 'Peace'];

  const startNewReflection = () => {
    const randomQuestion = reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setCurrentResponse('');
    setSelectedTags([]);
    setShowNewReflection(true);
  };

  const saveReflection = () => {
    if (!currentResponse.trim()) {
      toast({
        title: "Please write your reflection",
        description: "Your response cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const reflection: Reflection = {
      id: Date.now(),
      question: currentQuestion,
      response: currentResponse,
      tags: selectedTags,
      createdAt: new Date()
    };

    setReflections([reflection, ...reflections]);
    setShowNewReflection(false);
    
    toast({
      title: "Reflection saved! ✨",
      description: "Your spiritual reflection has been added to your journal",
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-green-800">Spiritual Reflections</h2>
          <p className="text-gray-600 mt-2">Search me, God, and know my heart; test me and know my anxious thoughts. - Psalm 139:23</p>
        </div>
        <Button
          onClick={startNewReflection}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Reflection
        </Button>
      </div>

      {showNewReflection && (
        <Card className="border-2 border-amber-200 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-amber-600" />
              <CardTitle className="text-amber-800">Today's Reflection</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/70 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-gray-800 mb-2">Reflection Question:</h3>
              <p className="text-gray-700 italic text-lg">{currentQuestion}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Reflection</label>
              <Textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder="Take a moment to reflect and share your thoughts..."
                rows={6}
                className="border-amber-200 focus:border-amber-400 bg-white/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tags (optional)</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'hover:bg-amber-100 hover:text-amber-800 border-amber-300'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowNewReflection(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={saveReflection}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Save Reflection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <PenTool className="w-5 h-5 mr-2 text-green-600" />
          Your Reflection Journey ({reflections.length})
        </h3>
        
        {reflections.map(reflection => (
          <Card key={reflection.id} className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-gray-800 leading-relaxed">
                  {reflection.question}
                </CardTitle>
                <span className="text-sm text-gray-500 ml-4">
                  {reflection.createdAt.toLocaleDateString()}
                </span>
              </div>
              {reflection.tags.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {reflection.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-white/70 border-green-300 text-green-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                <p className="text-gray-700 italic leading-relaxed">{reflection.response}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {reflections.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <PenTool className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">Your reflection journey awaits</p>
            <p>Click "New Reflection" to begin capturing your spiritual insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflections;
