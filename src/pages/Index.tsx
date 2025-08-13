import React, { useState, useEffect } from 'react';
import { Sprout, Heart, BookOpen, PenTool, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import DailyVerse from '@/components/DailyVerse';
import PrayerJournal from '@/components/PrayerJournal';
import Reflections from '@/components/Reflections';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load session on mount and subscribe to auth state
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) setShowAuthModal(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-green-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <div className="flex justify-center items-center mb-6">
                <div className="relative">
                  <Sprout className="w-16 h-16 text-green-600" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">✝</span>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-700 via-amber-700 to-green-800 bg-clip-text text-transparent mb-4">
                OneSeed
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Nurture your spiritual growth through daily scripture, prayer, and reflection. 
                Plant seeds of faith that will grow for eternity.
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Begin Your Journey
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-green-800">Daily Scripture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Start each day with God's word. Receive carefully selected verses that speak to your heart.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-green-800">Prayer Journal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Record your prayers and witness God's faithfulness as you track answered prayers.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PenTool className="w-6 h-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-green-800">Reflections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Pause and reflect on God's goodness through guided questions and personal insights.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <blockquote className="text-2xl italic text-gray-700 mb-4">
                "Unless a grain of wheat falls to the ground and dies, it remains only a single seed. But if it dies, it produces many seeds."
              </blockquote>
              <cite className="text-lg text-green-700 font-semibold">John 12:24</cite>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-green-50">
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          onLogout={async () => {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              {getGreeting()}, Child of God
            </h1>
            <p className="text-gray-600">
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
