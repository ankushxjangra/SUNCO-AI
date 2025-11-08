import React, { useState } from 'react';
import { SuncoLogo } from './Icons';
import * as firebaseService from '../services/firebaseService';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        await firebaseService.signInUser(email, password);
      } else {
        await firebaseService.signUpUser(email, password);
      }
      // On success, the onAuthStateChanged listener in App.tsx will handle the redirect.
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black text-white p-4">
      <div className="w-full max-w-sm mx-auto bg-[#1c1c1c] rounded-2xl shadow-2xl p-8 border border-purple-500/20">
        <div className="flex flex-col items-center mb-6">
          <SuncoLogo />
          <h1 className="text-2xl font-bold text-white tracking-wider mt-2">SUNCO AI</h1>
          <p className="text-gray-400 text-sm">{isLogin ? 'Welcome back' : 'Create an account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-400 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-[#111111] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-inner"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400 block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 bg-[#111111] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-inner"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-sm font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_15px_rgba(168,85,247,0.8)]"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-bold text-purple-400 hover:underline ml-1">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
      <footer className="fixed bottom-1 right-4 text-xs text-white opacity-70 pointer-events-none">
          THIS AI IS MADE BY KARAM SINGH
      </footer>
    </div>
  );
};

export default Auth;
