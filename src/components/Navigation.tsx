
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sprout, BookOpen, Heart, PenTool, LogOut } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const Navigation = ({ activeSection, setActiveSection, onLogout }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: '📖 Daily Verse', icon: BookOpen },
    { id: 'prayer', label: '💕 Prayer Journal', icon: Heart },
    { id: 'reflections', label: '✍️ Reflections', icon: PenTool },
  ];

  return (
    <nav className="bg-gradient-to-r from-pink-100 via-yellow-100 to-green-100 backdrop-blur-sm border-b-4 border-pink-200 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/b7b57ebd-3dcb-418e-adf2-c5af277e3125.png" 
              alt="OneSeed Logo" 
              className="w-12 h-12 transform hover:scale-110 transition-transform duration-300"
            />
            <img 
              src="/lovable-uploads/56460e3c-9646-4e32-a343-c52b549ce325.png" 
              alt="OneSeed Title" 
              className="h-8 transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 border-2 transform hover:scale-105 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-pink-800 border-pink-300 shadow-xl scale-105'
                      : 'text-gray-700 hover:text-pink-700 hover:bg-pink-100 border-transparent hover:border-pink-200 hover:shadow-lg'
                  }`}
                  style={{fontFamily: 'Comic Sans MS, cursive'}}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline font-medium">{item.label}</span>
                </button>
              );
            })}
            
            <Button
              onClick={onLogout}
              variant="ghost"
              className="text-gray-600 hover:text-pink-600 hover:bg-pink-100 rounded-full px-6 py-3 border-2 border-transparent hover:border-pink-200 transform hover:scale-105 transition-all duration-300"
              style={{fontFamily: 'Comic Sans MS, cursive'}}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline ml-2 font-medium">✨ Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
