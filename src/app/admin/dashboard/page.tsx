
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit3, LogOut, Check, X, ArrowLeft, Calendar, Sparkles, Loader2, Film, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type Movie } from '@/components/movie/MovieCard';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchMovieMetadata } from '@/ai/flows/fetch-movie-metadata';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const MASTER_ADMIN_EMAIL = 'a36310792@gmail.com';
const FALLBACK_ADMIN_EMAIL = 'admin@gmail.com';
const AVAILABLE_GENRES = ['Action', 'Horror', 'Anime', 'Sci-Fi', 'Animation', 'Cartoon', 'Drama', 'Comedy', 'Thriller', 'Mystery'];
const INDUSTRIES = ['Bollywood', 'Hollywood', 'South', 'Web Series'];
const QUALITIES = ['HD', '4K', 'CAM'];

export default function AdminDashboard() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication Protection
  useEffect(() => {
    const localSession = localStorage.getItem('admin_session');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user && localSession !== 'true') {
        router.push('/admin/login');
      } else if (user && user.email !== MASTER_ADMIN_EMAIL && user.email !== FALLBACK_ADMIN_EMAIL && localSession !== 'true') {
        await signOut(auth);
        router.push('/admin/login');
      } else {
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  // Firestore Sync - Live updates from the database
  const moviesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'movies'), orderBy('title', 'asc'));
  }, [db]);

  const { data: firestoreMovies, loading: firestoreLoading } = useCollection<Movie>(moviesQuery);

  const [formData, setFormData] = useState<Partial<Movie>>({
    title: '',
    posterUrl: '',
    rating: 0,
    quality: 'HD',
    releaseYear: new Date().getFullYear(),
    audio: 'Hindi',
    genres: [],
    description: '',
    watchUrl: '',
    directDownloadUrl: ''
  });

  const handleLogout = async () => {
    localStorage.removeItem('admin_session');
    try {
      await signOut(auth);
    } catch (e) {}
    router.push('/admin/login');
  };

  const handleFetchMetadata = async () => {
    if (!formData.title) return;
    setIsFetching(true);
    try {
      const metadata = await fetchMovieMetadata({ title: formData.title });
      setFormData(prev => ({
        ...prev,
        posterUrl: metadata.posterUrl,
        rating: metadata.rating,
        releaseYear: metadata.releaseYear,
        description: metadata.description,
        audio: metadata.audio,
        quality: metadata.quality as any,
        genres: [...new Set([...(prev.genres || []), ...metadata.genres])]
      }));
    } catch (error) {
      console.error("Failed to fetch metadata", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsSubmitting(true);
    
    const movieData = { 
      title: formData.title || 'Untitled',
      posterUrl: formData.posterUrl || '',
      rating: Number(formData.rating) || 0,
      quality: formData.quality || 'HD',
      releaseYear: Number(formData.releaseYear) || new Date().getFullYear(),
      audio: formData.audio || 'Hindi',
      genres: formData.genres || [],
      description: formData.description || '',
      watchUrl: formData.watchUrl || '',
      directDownloadUrl: formData.directDownloadUrl || '',
      updatedAt: serverTimestamp()
    };
    
    try {
      if (editingMovie) {
        const movieRef = doc(db, 'movies', editingMovie.id);
        updateDoc(movieRef, movieData).catch(async () => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: movieRef.path,
            operation: 'update',
            requestResourceData: movieData
          }));
        });
        setEditingMovie(null);
      } else {
        const moviesRef = collection(db, 'movies');
        addDoc(moviesRef, movieData).catch(async () => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: moviesRef.path,
            operation: 'create',
            requestResourceData: movieData
          }));
        });
        setIsAdding(false);
      }
      
      setFormData({ 
        title: '', posterUrl: '', rating: 0, quality: 'HD', 
        releaseYear: new Date().getFullYear(), audio: 'Hindi', 
        genres: [], description: '', watchUrl: '', directDownloadUrl: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMovie = async (id: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this movie permanently from the library?')) return;
    
    if (db) {
      const movieRef = doc(db, 'movies', id);
      // Initiation of deleteDoc - updates local cache instantly via onSnapshot listener
      deleteDoc(movieRef).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: movieRef.path,
          operation: 'delete'
        } satisfies any));
      });
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl relative">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl p-5 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#8b95a5] hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-black tracking-tight">Management</h1>
        </div>
        <button onClick={handleLogout} className="text-[#ff3b30] p-2 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="p-5">
        {!isAdding && !editingMovie ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
               <div className="bg-[#121212] border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Film className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-[#444] uppercase">Total</span>
                  </div>
                  <div className="text-2xl font-black">{firestoreMovies?.length || 0}</div>
                  <div className="text-[9px] font-bold text-[#555] mt-1 uppercase">Media Entries</div>
               </div>
               <div className="bg-[#121212] border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-[#444] uppercase">Active</span>
                  </div>
                  <div className="text-2xl font-black">{QUALITIES.length}</div>
                  <div className="text-[9px] font-bold text-[#555] mt-1 uppercase">Quality Types</div>
               </div>
            </div>

            <Button 
              onClick={() => setIsAdding(true)}
              className="w-full h-14 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(0,229,255,0.2)] hover:scale-[1.01] transition-all"
            >
              <Plus className="w-5 h-5" /> PUBLISH NEW MOVIE
            </Button>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-black text-[#555] uppercase tracking-[2px]">Library Management</h3>
                <span className="text-[10px] font-bold text-primary/50 uppercase">{(firestoreMovies?.length || 0)} Items</span>
              </div>
              
              <div className="space-y-3">
                {firestoreLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : (
                  firestoreMovies?.map(movie => {
                    const poster = movie.posterUrl || movie.imageUrl || movie.image || `https://picsum.photos/seed/${movie.id}/400/600`;
                    return (
                      <div key={movie.id} className="flex gap-4 p-3 rounded-2xl bg-[#121212] border border-white/5 group hover:border-primary/30 transition-all">
                        <div className="w-16 h-20 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={poster} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="text-[14px] font-bold truncate">{movie.title}</h4>
                          <p className="text-[10px] text-primary font-black uppercase mt-1">{movie.quality} • {movie.releaseYear}</p>
                          <div className="flex gap-2 mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setEditingMovie(movie); setFormData(movie); }} 
                              className="p-1.5 text-white/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteMovie(movie.id)} 
                              className="p-1.5 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#121212] p-6 rounded-[32px] border border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-primary">{editingMovie ? 'Edit Media' : 'New Media'}</h2>
              <button onClick={() => { setIsAdding(false); setEditingMovie(null); }} className="p-2 text-[#555] hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Movie Title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="bg-black border-white/5 h-12 rounded-xl text-white font-bold flex-1"
                  required 
                />
                <Button 
                  type="button"
                  onClick={handleFetchMetadata}
                  disabled={isFetching || !formData.title}
                  className="h-12 w-12 bg-primary/20 text-primary border border-primary/30 rounded-xl hover:bg-primary hover:text-black transition-all"
                >
                  {isFetching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                </Button>
              </div>

              <Input 
                placeholder="Poster URL" 
                value={formData.posterUrl} 
                onChange={e => setFormData({...formData, posterUrl: e.target.value})} 
                className="bg-black border-white/5 h-12 rounded-xl text-white font-bold"
                required 
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#555] uppercase ml-1">Quality</label>
                  <Select 
                    value={formData.quality} 
                    onValueChange={val => setFormData({...formData, quality: val as any})}
                  >
                    <SelectTrigger className="bg-black border-white/5 h-12 rounded-xl">
                      <SelectValue placeholder="Quality" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10 text-white">
                      {QUALITIES.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#555] uppercase ml-1">Industry Tag</label>
                  <Select 
                    onValueChange={val => {
                      const current = formData.genres || [];
                      setFormData({...formData, genres: [...new Set([...current, val])]});
                    }}
                  >
                    <SelectTrigger className="bg-black border-white/5 h-12 rounded-xl">
                      <SelectValue placeholder="Select Tag" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-white/10 text-white">
                      {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Input 
                placeholder="Watch Online URL" 
                value={formData.watchUrl} 
                onChange={e => setFormData({...formData, watchUrl: e.target.value})} 
                className="bg-black border-white/5 h-12 rounded-xl text-white font-bold"
              />
              <Input 
                placeholder="Direct Download Link" 
                value={formData.directDownloadUrl} 
                onChange={e => setFormData({...formData, directDownloadUrl: e.target.value})} 
                className="bg-black border-primary/30 h-12 rounded-xl text-white font-bold focus:border-primary shadow-[0_0_15px_rgba(0,229,255,0.05)]"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                   <Input 
                    placeholder="Year" 
                    type="number" 
                    value={formData.releaseYear} 
                    onChange={e => setFormData({...formData, releaseYear: parseInt(e.target.value)})} 
                    className="bg-black border-white/5 h-12 rounded-xl pl-9"
                    required
                  />
                </div>
                <Input 
                  placeholder="Rating" 
                  type="number" 
                  step="0.1" 
                  value={formData.rating} 
                  onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} 
                  className="bg-black border-white/5 h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#555] uppercase tracking-[1px] mb-2 block">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {[...AVAILABLE_GENRES, ...INDUSTRIES].map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        const current = formData.genres || [];
                        if (current.includes(genre)) {
                          setFormData({ ...formData, genres: current.filter(g => g !== genre) });
                        } else {
                          setFormData({ ...formData, genres: [...current, genre] });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                        formData.genres?.includes(genre)
                          ? "bg-primary text-black border-primary"
                          : "bg-black text-[#8b95a5] border-white/5"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <Input 
                placeholder="Audio (e.g. Hindi, Multi)" 
                value={formData.audio} 
                onChange={e => setFormData({...formData, audio: e.target.value})} 
                className="bg-black border-white/5 h-12 rounded-xl"
              />

              <Textarea 
                placeholder="Plot Synopsis" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="bg-black border-white/5 rounded-xl min-h-[100px]"
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 bg-primary text-black font-black rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-2" />} 
                {editingMovie ? 'SAVE CHANGES' : 'PUBLISH MEDIA'}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
