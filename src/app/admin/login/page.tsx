
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ADMIN_EMAIL = 'a36310792@gmail.com';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        router.push('/admin/dashboard');
      } else {
        setAuthChecking(false);
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email !== ADMIN_EMAIL) {
      setError("Unauthorized access. Only the master admin email is allowed.");
      return;
    }

    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection is handled by the useEffect listener
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid admin credentials. Please check your email and password.');
      } else {
        setError('Login failed. Please ensure you have created this user in the Firebase Console.');
      }
      setIsLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 max-w-[420px] mx-auto border-x border-white/5 shadow-2xl">
      <div className="w-full mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#8b95a5] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
        </Link>
      </div>

      <div className="w-full bg-[#121212] border border-white/5 p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[80px]"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-[#8b95a5] text-sm mt-2 font-bold">Sign in with authorized credentials</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-[12px] font-bold">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555] group-focus-within:text-primary transition-colors" />
            <Input 
              type="email"
              placeholder="Admin Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-white/5 h-14 rounded-2xl pl-12 text-white font-bold focus:border-primary/50"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555] group-focus-within:text-primary transition-colors" />
            <Input 
              type="password"
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-white/5 h-14 rounded-2xl pl-12 text-white font-bold focus:border-primary/50"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-primary text-black font-black text-lg rounded-2xl hover:brightness-110 shadow-[0_10px_30px_rgba(0,229,255,0.2)] active:scale-95 transition-all"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'LOGIN SECURELY'}
          </Button>
        </form>
        
        <p className="text-center text-[10px] text-[#444] mt-6 font-bold uppercase tracking-widest">
          Only a36310792@gmail.com is authorized
        </p>
      </div>
    </div>
  );
}
