
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sprout, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  onClose: () => void;
  onAuth: () => void;
}

const AuthModal = ({ onClose, onAuth }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match!",
          description: "Please make sure your passwords match.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: isLogin ? "Welcome back!" : "Welcome to OneSeed!",
        description: isLogin ? "You've successfully signed in!" : "Your account has been created!",
      });

      setIsLoading(false);
      onAuth();
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md border border-pink-200 shadow-2xl bg-white">
        <CardHeader className="text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-pink-600 transform hover:scale-110 transition-all duration-300 bg-gray-100 rounded-full p-2"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/lovable-uploads/b7b57ebd-3dcb-418e-adf2-c5af277e3125.png" 
              alt="OneSeed Logo" 
              className="w-16 h-16 transform hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-green-600 bg-clip-text text-transparent mb-2">
            {isLogin ? 'Welcome Back!' : 'Join OneSeed!'}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? 'Continue your spiritual journey' : 'Begin your spiritual growth adventure'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required={!isLogin}
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required={!isLogin}
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-600 hover:to-green-600 text-white py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-pink-600 hover:text-pink-700 font-medium underline transform hover:scale-105 transition-all duration-300"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By continuing, you agree to grow in faith and fellowship with God through OneSeed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
