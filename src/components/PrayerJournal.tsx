
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Check, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Prayer {
  id: number;
  title: string;
  content: string;
  isAnswered: boolean;
  category: string;
  createdAt: Date;
  answeredAt?: Date;
}

const PrayerJournal = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([
    {
      id: 1,
      title: "Health and Healing",
      content: "Lord, please watch over my family's health and grant healing where it's needed. Give us strength during this time.",
      isAnswered: false,
      category: "Health",
      createdAt: new Date(2024, 0, 15)
    }
  ]);

  const [showNewPrayer, setShowNewPrayer] = useState(false);
  const [newPrayer, setNewPrayer] = useState({
    title: '',
    content: '',
    category: 'Personal'
  });

  const { toast } = useToast();

  const categories = ['Personal', 'Family', 'Health', 'Work', 'Ministry', 'Others'];

  const addPrayer = () => {
    if (!newPrayer.title.trim() || !newPrayer.content.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both title and prayer content are required",
        variant: "destructive"
      });
      return;
    }

    const prayer: Prayer = {
      id: Date.now(),
      title: newPrayer.title,
      content: newPrayer.content,
      category: newPrayer.category,
      isAnswered: false,
      createdAt: new Date()
    };

    setPrayers([prayer, ...prayers]);
    setNewPrayer({ title: '', content: '', category: 'Personal' });
    setShowNewPrayer(false);

    toast({
      title: "Prayer added! 🙏",
      description: "Your prayer has been added to your journal",
    });
  };

  const markAsAnswered = (id: number) => {
    setPrayers(prayers.map(prayer => 
      prayer.id === id 
        ? { ...prayer, isAnswered: true, answeredAt: new Date() }
        : prayer
    ));

    toast({
      title: "Praise God! 🎉",
      description: "Prayer marked as answered. Give thanks to the Lord!",
    });
  };

  const answeredPrayers = prayers.filter(p => p.isAnswered);
  const activePrayers = prayers.filter(p => !p.isAnswered);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-green-800">Prayer Journal</h2>
          <p className="text-gray-600 mt-2">Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. - Philippians 4:6</p>
        </div>
        <Button
          onClick={() => setShowNewPrayer(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Prayer
        </Button>
      </div>

      {showNewPrayer && (
        <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              Add New Prayer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Title</label>
              <Input
                value={newPrayer.title}
                onChange={(e) => setNewPrayer({...newPrayer, title: e.target.value})}
                placeholder="What are you praying for?"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newPrayer.category}
                onChange={(e) => setNewPrayer({...newPrayer, category: e.target.value})}
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Prayer</label>
              <Textarea
                value={newPrayer.content}
                onChange={(e) => setNewPrayer({...newPrayer, content: e.target.value})}
                placeholder="Pour out your heart to God..."
                rows={6}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowNewPrayer(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={addPrayer}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add Prayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            Active Prayers ({activePrayers.length})
          </h3>
          <div className="space-y-4">
            {activePrayers.map(prayer => (
              <Card key={prayer.id} className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-gray-800">{prayer.title}</CardTitle>
                      <Badge variant="outline" className="mt-2 bg-white/70">
                        {prayer.category}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {prayer.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white/70 p-4 rounded-lg border border-purple-200 mb-4">
                    <p className="text-gray-700 italic leading-relaxed">{prayer.content}</p>
                  </div>
                  <Button
                    onClick={() => markAsAnswered(prayer.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Answered
                  </Button>
                </CardContent>
              </Card>
            ))}

            {activePrayers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No active prayers</p>
                <p className="text-sm">Add a prayer to begin your journey</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Check className="w-5 h-5 mr-2 text-green-600" />
            Answered Prayers ({answeredPrayers.length})
          </h3>
          <div className="space-y-4">
            {answeredPrayers.map(prayer => (
              <Card key={prayer.id} className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-gray-800 flex items-center">
                        {prayer.title}
                        <Check className="w-5 h-5 ml-2 text-green-600" />
                      </CardTitle>
                      <Badge variant="outline" className="mt-2 bg-white/70 border-green-300">
                        {prayer.category}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Prayed: {prayer.createdAt.toLocaleDateString()}</div>
                      <div>Answered: {prayer.answeredAt?.toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white/70 p-4 rounded-lg border border-green-200">
                    <p className="text-gray-700 italic leading-relaxed">{prayer.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {answeredPrayers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Check className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No answered prayers yet</p>
                <p className="text-sm">Keep praying and watch God work!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerJournal;
