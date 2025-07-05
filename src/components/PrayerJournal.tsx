
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle, Clock, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Prayer {
  id: number;
  title: string;
  content: string;
  category: string;
  isAnswered: boolean;
  createdAt: Date;
  answeredAt?: Date;
}

const PrayerJournal = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([
    {
      id: 1,
      title: "Guidance for Career Decision",
      content: "Lord, please give me wisdom and clarity as I consider this new job opportunity. Help me discern your will for my life.",
      category: "Guidance",
      isAnswered: false,
      createdAt: new Date(2024, 0, 1)
    },
    {
      id: 2,
      title: "Healing for Mom",
      content: "Father, I pray for complete healing for my mother's health issues. Give the doctors wisdom and surround her with your peace.",
      category: "Healing",
      isAnswered: true,
      createdAt: new Date(2024, 0, 15),
      answeredAt: new Date(2024, 1, 10)
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPrayer, setNewPrayer] = useState({
    title: '',
    content: '',
    category: 'General'
  });

  const { toast } = useToast();

  const categories = ['General', 'Healing', 'Guidance', 'Family', 'Work', 'Gratitude', 'Forgiveness'];

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
    setNewPrayer({ title: '', content: '', category: 'General' });
    setShowAddForm(false);
    
    toast({
      title: "Prayer added",
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
      title: "Praise God! 🙏",
      description: "Prayer marked as answered. What a blessing!",
    });
  };

  const activePrayers = prayers.filter(p => !p.isAnswered);
  const answeredPrayers = prayers.filter(p => p.isAnswered);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-green-800">Prayer Journal</h2>
          <p className="text-gray-600 mt-2">Cast all your anxiety on him because he cares for you. - 1 Peter 5:7</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Prayer
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-800">Add New Prayer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Title</label>
              <Input
                value={newPrayer.title}
                onChange={(e) => setNewPrayer({...newPrayer, title: e.target.value})}
                placeholder="What are you praying about?"
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newPrayer.category}
                onChange={(e) => setNewPrayer({...newPrayer, category: e.target.value})}
                className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:border-purple-400"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prayer</label>
              <Textarea
                value={newPrayer.content}
                onChange={(e) => setNewPrayer({...newPrayer, content: e.target.value})}
                placeholder="Pour out your heart to God..."
                rows={4}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowAddForm(false)}
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Prayers */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-semibold text-gray-800">Active Prayers ({activePrayers.length})</h3>
          </div>
          <div className="space-y-4">
            {activePrayers.map(prayer => (
              <Card key={prayer.id} className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-800">{prayer.title}</CardTitle>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {prayer.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {prayer.createdAt.toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{prayer.content}</p>
                  <Button
                    onClick={() => markAsAnswered(prayer.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Answered
                  </Button>
                </CardContent>
              </Card>
            ))}
            {activePrayers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No active prayers. Click "New Prayer" to add one.</p>
              </div>
            )}
          </div>
        </div>

        {/* Answered Prayers */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">Answered Prayers ({answeredPrayers.length})</h3>
          </div>
          <div className="space-y-4">
            {answeredPrayers.map(prayer => (
              <Card key={prayer.id} className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-800">{prayer.title}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {prayer.category}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Prayed: {prayer.createdAt.toLocaleDateString()}</span>
                    <span>Answered: {prayer.answeredAt?.toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{prayer.content}</p>
                  <div className="mt-3 flex items-center text-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Prayer Answered ✨</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {answeredPrayers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your answered prayers will appear here. Keep praying!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerJournal;
