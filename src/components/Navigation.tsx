
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
    { id: 'home', label: 'Daily Verse', icon: BookOpen },
    { id: 'prayer', label: 'Prayer Journal', icon: Heart },
    { id: 'reflections', label: 'Reflections', icon: PenTool },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/b7b57ebd-3dcb-418e-adf2-c5af277e3125.png" 
              alt="OneSeed Logo" 
              className="w-10 h-10 transform hover:scale-110 transition-transform duration-300"
            />
            <img 
              src="/lovable-uploads/56460e3c-9646-4e32-a343-c52b549ce325.png" 
              alt="OneSeed Title" 
              className="h-6 transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-pink-500 to-green-500 text-white shadow-md'
                      : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline font-medium">{item.label}</span>
                </button>
              );
            })}
            
            <Button
              onClick={onLogout}
              variant="ghost"
              className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg px-4 py-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
