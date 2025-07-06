
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
          title: "Passwords don't match! 😅",
          description: "Please make sure your passwords match sweetly! 💕",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: isLogin ? "Welcome back, dear! 🌸" : "Welcome to OneSeed! 🎉",
        description: isLogin ? "You've successfully signed in! ✨" : "Your account has been created with love! 💝",
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
      <Card className="w-full max-w-md border-4 border-pink-200 shadow-2xl bg-gradient-to-br from-pink-50 via-yellow-50 to-green-50 transform scale-100 animate-bounce-in">
        <CardHeader className="text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-pink-600 transform hover:scale-110 transition-all duration-300 bg-white rounded-full p-2 shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/lovable-uploads/b7b57ebd-3dcb-418e-adf2-c5af277e3125.png" 
              alt="OneSeed Kawaii Logo" 
              className="w-20 h-20 transform hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            {isLogin ? '🌸 Welcome Back! 🌸' : '✨ Join OneSeed! ✨'}
          </CardTitle>
          <p className="text-gray-600 text-lg" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            {isLogin ? '💕 Continue your spiritual journey' : '🌱 Begin your spiritual growth adventure'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-pink-700 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>🌟 Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your lovely name ✨"
                  required={!isLogin}
                  className="border-3 border-pink-200 focus:border-pink-400 rounded-xl py-3 text-lg"
                  style={{fontFamily: 'Comic Sans MS, cursive'}}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-pink-700 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>💌 Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address 📧"
                required
                className="border-3 border-pink-200 focus:border-pink-400 rounded-xl py-3 text-lg"
                style={{fontFamily: 'Comic Sans MS, cursive'}}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-pink-700 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>🔐 Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your secret password 🤫"
                required
                className="border-3 border-pink-200 focus:border-pink-400 rounded-xl py-3 text-lg"
                style={{fontFamily: 'Comic Sans MS, cursive'}}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-pink-700 mb-2" style={{fontFamily: 'Comic Sans MS, cursive'}}>🔐 Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password sweetly 💕"
                  required={!isLogin}
                  className="border-3 border-pink-200 focus:border-pink-400 rounded-xl py-3 text-lg"
                  style={{fontFamily: 'Comic Sans MS, cursive'}}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:via-pink-600 hover:to-pink-700 text-white py-4 text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/50"
              style={{fontFamily: 'Comic Sans MS, cursive'}}
            >
              {isLoading ? '✨ Please wait... ✨' : (isLogin ? '🌸 Sign In 🌸' : '🌱 Create Account 🌱')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-lg" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              {isLogin ? "Don't have an account? 🤔 " : "Already have an account? 😊 "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-pink-600 hover:text-pink-700 font-bold underline transform hover:scale-105 transition-all duration-300"
                style={{fontFamily: 'Comic Sans MS, cursive'}}
              >
                {isLogin ? '🌱 Sign up' : '🌸 Sign in'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-pink-200">
            <p className="text-sm text-gray-500 text-center leading-relaxed" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              By continuing, you agree to grow in faith and fellowship with God through OneSeed! 🙏✨💕
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
