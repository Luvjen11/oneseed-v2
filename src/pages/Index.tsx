
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
        <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-green-50 relative overflow-hidden">
          {/* Subtle floating elements */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-pink-200 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-3 h-3 bg-green-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 left-32 w-2 h-2 bg-pink-300 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="text-center mb-12">
              <div className="flex justify-center items-center mb-6">
                <div className="relative transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/lovable-uploads/b7b57ebd-3dcb-418e-adf2-c5af277e3125.png" 
                    alt="OneSeed Logo" 
                    className="w-24 h-24 drop-shadow-lg"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/e7e9fca7-a81e-44cb-9616-f4c08cc421ff.png" 
                  alt="OneSeed 3D Title" 
                  className="mx-auto max-w-md drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                Nurture your spiritual growth through daily scripture, prayer, and reflection
                <br />
                <span className="text-lg bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent font-medium">
                  Plant seeds of faith that will grow for eternity
                </span>
              </p>
              
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-600 hover:to-green-600 text-white px-8 py-3 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Begin Your Journey
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border border-gray-200 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-102 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 text-xl">Daily Scripture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Start each day with God's word. Receive carefully selected verses that speak to your heart
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-102 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 text-xl">Prayer Journal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Record your prayers and witness God's faithfulness. Track answered prayers with joy
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-102 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <PenTool className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 text-xl">Reflections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Pause and reflect on God's goodness. Guided questions and personal insights
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center bg-gradient-to-r from-pink-50 via-white to-green-50 p-8 rounded-xl border border-pink-200 shadow-lg">
              <blockquote className="text-2xl italic text-gray-800 mb-4 leading-relaxed">
                "Unless a grain of wheat falls to the ground and dies, it remains only a single seed. But if it dies, it produces many seeds."
              </blockquote>
              <cite className="text-xl bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent font-semibold">
                John 12:24
              </cite>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-green-50">
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          onLogout={() => setIsAuthenticated(false)}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent mb-2">
              {getGreeting()}, Child of God!
            </h1>
            <p className="text-gray-600 text-lg">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
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
