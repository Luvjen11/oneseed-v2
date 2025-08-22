
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sprout, BookOpen, Heart, PenTool, LogOut, Bookmark } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const Navigation = ({ activeSection, setActiveSection, onLogout }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Daily Verse', icon: BookOpen },
    { id: 'favorites', label: 'Saved', icon: Bookmark },
    { id: 'prayer', label: 'Prayer Journal', icon: Heart },
    { id: 'reflections', label: 'Reflections', icon: PenTool },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-green-800">OneSeed</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-green-100 text-green-800 shadow-md'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
            
            <Button
              onClick={onLogout}
              variant="ghost"
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
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
