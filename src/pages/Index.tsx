
import React, { useState, useEffect } from 'react';
import { Sprout, Heart, BookOpen, PenTool, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import DailyVerse from '@/components/DailyVerse';
import PrayerJournal from '@/components/PrayerJournal';
import Reflections from '@/components/Reflections';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-green-50 relative overflow-hidden">
          {/* Cute floating elements */}
          <div className="absolute top-10 left-10 w-8 h-8 bg-pink-200 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-32 right-20 w-6 h-6 bg-yellow-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 left-32 w-4 h-4 bg-green-200 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 right-16 w-5 h-5 bg-purple-200 rounded-full opacity-45 animate-bounce" style={{animationDelay: '1.5s'}}></div>
          
          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="text-center mb-12">
              <div className="flex justify-center items-center mb-6">
                <div className="relative transform hover:scale-110 transition-transform duration-300">
                  <img 
                    src="/lovable-uploads/b7b57ebd-3dcb-418e-adf2-c5af277e3125.png" 
                    alt="OneSeed Kawaii Logo" 
                    className="w-32 h-32 drop-shadow-lg"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/e7e9fca7-a81e-44cb-9616-f4c08cc421ff.png" 
                  alt="OneSeed 3D Title" 
                  className="mx-auto max-w-md drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-medium leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                ✨ Nurture your spiritual growth through daily scripture, prayer, and reflection ✨
                <br />
                <span className="text-lg text-pink-600">🌱 Plant seeds of faith that will grow for eternity! 🌱</span>
              </p>
              
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:via-pink-600 hover:to-pink-700 text-white px-10 py-4 text-lg rounded-full shadow-xl transform hover:scale-110 transition-all duration-300 border-4 border-white/50"
                style={{fontFamily: 'Comic Sans MS, cursive'}}
              >
                🌸 Begin Your Journey 🌸
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-4 border-pink-200 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                    <BookOpen className="w-8 h-8 text-blue-700" />
                  </div>
                  <CardTitle className="text-blue-800 text-xl" style={{fontFamily: 'Comic Sans MS, cursive'}}>📖 Daily Scripture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    Start each day with God's word! 💝 Receive carefully selected verses that speak to your heart ✨
                  </p>
                </CardContent>
              </Card>

              <Card className="border-4 border-pink-200 shadow-xl bg-gradient-to-br from-purple-50 to-pink-100 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-300 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                    <Heart className="w-8 h-8 text-purple-700" />
                  </div>
                  <CardTitle className="text-purple-800 text-xl" style={{fontFamily: 'Comic Sans MS, cursive'}}>💕 Prayer Journal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    Record your prayers and witness God's faithfulness! 🙏 Track answered prayers with joy 🌈
                  </p>
                </CardContent>
              </Card>

              <Card className="border-4 border-pink-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                    <PenTool className="w-8 h-8 text-orange-700" />
                  </div>
                  <CardTitle className="text-orange-800 text-xl" style={{fontFamily: 'Comic Sans MS, cursive'}}>✍️ Reflections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-center leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                    Pause and reflect on God's goodness! 🌟 Guided questions and personal insights 💭
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center bg-gradient-to-r from-pink-100 via-yellow-100 to-green-100 p-8 rounded-3xl border-4 border-pink-200 shadow-xl">
              <blockquote className="text-2xl italic text-gray-800 mb-4 leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                "Unless a grain of wheat falls to the ground and dies, it remains only a single seed. But if it dies, it produces many seeds." 🌾
              </blockquote>
              <cite className="text-xl text-pink-700 font-bold" style={{fontFamily: 'Comic Sans MS, cursive'}}>✨ John 12:24 ✨</cite>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-green-50">
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          onLogout={() => setIsAuthenticated(false)}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-pink-800 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              {getGreeting()}, Sweet Child of God! 🌸
            </h1>
            <p className="text-gray-600 text-lg" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              ✨ {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} ✨
            </p>
          </div>

          {activeSection === 'home' && <DailyVerse />}
          {activeSection === 'prayer' && <PrayerJournal />}
          {activeSection === 'reflections' && <Reflections />}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuth={() => {
            setIsAuthenticated(true);
            setShowAuthModal(false);
          }}
        />
      )}
    </>
  );
};

export default Index;
