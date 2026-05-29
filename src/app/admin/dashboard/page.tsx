
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit3, LogOut, Film, Check, X, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type Movie } from '@/components/movie/MovieCard';
import Link from 'next/link';

const AVAILABLE_GENRES = ['Action', 'Horror', 'Anime', 'Sci-Fi', 'Thriller'];

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    const auth = localStorage.getItem('lumina_auth');
    if (auth !== 'true') router.push('/admin/login');

    const stored = localStorage.getItem('lumina_movies');
    if (stored) setMovies(JSON.parse(stored));
  }, [router]);

  const saveMovies = (newMovies: Movie[]) => {
    setMovies(newMovies);
    localStorage.setItem('lumina_movies', JSON.stringify(newMovies));
  };

  const handleLogout = () => {
    localStorage.removeItem('lumina_auth');
    router.push('/admin/login');
  };

  const toggleGenre = (genre: string) => {
    const currentGenres = formData.genres || [];
    if (currentGenres.includes(genre)) {
      setFormData({ ...formData, genres: currentGenres.filter(g => g !== genre) });
    } else {
      setFormData({ ...formData, genres: [...currentGenres, genre] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMovie) {
      const updated = movies.map(m => m.id === editingMovie.id ? { ...m, ...formData } as Movie : m);
      saveMovies(updated);
      setEditingMovie(null);
    } else {
      const newMovie = { ...formData, id: Date.now().toString() } as Movie;
      saveMovies([newMovie, ...movies]);
      setIsAdding(false);
    }
    setFormData({ 
      title: '', 
      posterUrl: '', 
      rating: 0, 
      quality: 'HD', 
      releaseYear: 2026, 
      audio: 'Hindi', 
      genres: [], 
      description: '',
      watchUrl: '',
      directDownloadUrl: ''
    });
  };

  const deleteMovie = (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      saveMovies(movies.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white max-w-[420px] mx-auto border-x border-white/5 pb-20 shadow-2xl">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl p-5 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#8b95a5]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-black tracking-tight">Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="text-[#ff3b30] p-2 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="p-5">
        {!isAdding && !editingMovie ? (
          <div className="space-y-6">
            <Button 
              onClick={() => setIsAdding(true)}
              className="w-full h-14 bg-primary text-black font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(0,229,255,0.2)]"
            >
              <Plus className="w-5 h-5" /> ADD NEW MOVIE
            </Button>

            <div className="space-y-3">
              <h3 className="text-[12px] font-black text-[#555] uppercase tracking-[2px] mb-4">Manage Library</h3>
              {movies.map(movie => (
                <div key={movie.id} className="flex gap-4 p-3 rounded-2xl bg-[#121212] border border-white/5 group hover:border-primary/30 transition-all">
                  <div className="w-16 h-20 bg-black rounded-xl overflow-hidden flex-shrink-0">
                    <img src={movie.posterUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="text-[14px] font-bold truncate">{movie.title}</h4>
                    <p className="text-[10px] text-[#8b95a5] font-bold uppercase mt-1">{movie.quality} • {movie.releaseYear}</p>
                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingMovie(movie); setFormData(movie); }} 
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteMovie(movie.id)} 
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#121212] p-6 rounded-[32px] border border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-primary">{editingMovie ? 'Edit Movie' : 'New Movie'}</h2>
              <button onClick={() => { setIsAdding(false); setEditingMovie(null); }} className="p-2 text-[#555] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                placeholder="Movie Title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="bg-black border-white/5 h-12 rounded-xl text-white font-bold"
                required 
              />
              <Input 
                placeholder="Poster URL" 
                value={formData.posterUrl} 
                onChange={e => setFormData({...formData, posterUrl: e.target.value})} 
                className="bg-black border-white/5 h-12 rounded-xl text-white font-bold"
                required 
              />
              <Input 
                placeholder="Watch/Stream Preview Link" 
                value={formData.watchUrl} 
                onChange={e => setFormData({...formData, watchUrl: e.target.value})} 
                className="bg-black border-white/5 h-12 rounded-xl text-white font-bold"
                required 
              />
              <Input 
                placeholder="Final Direct Download Link" 
                value={formData.directDownloadUrl} 
                onChange={e => setFormData({...formData, directDownloadUrl: e.target.value})} 
                className="bg-black border-primary/30 h-12 rounded-xl text-white font-bold focus:border-primary"
                required 
              />
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  placeholder="Year" 
                  type="number" 
                  value={formData.releaseYear} 
                  onChange={e => setFormData({...formData, releaseYear: parseInt(e.target.value)})} 
                  className="bg-black border-white/5 h-12 rounded-xl"
                />
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
                <label className="text-[10px] font-black text-[#555] uppercase tracking-[1px] mb-2 block">Genres / Categories</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_GENRES.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
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

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  placeholder="Quality (HD/4K)" 
                  value={formData.quality} 
                  onChange={e => setFormData({...formData, quality: e.target.value as any})} 
                  className="bg-black border-white/5 h-12 rounded-xl"
                />
                <Input 
                  placeholder="Audio" 
                  value={formData.audio} 
                  onChange={e => setFormData({...formData, audio: e.target.value})} 
                  className="bg-black border-white/5 h-12 rounded-xl"
                />
              </div>
              <Textarea 
                placeholder="Description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="bg-black border-white/5 rounded-xl min-h-[100px]"
              />
              <Button type="submit" className="w-full h-14 bg-primary text-black font-black rounded-2xl shadow-lg">
                <Check className="w-5 h-5 mr-2" /> {editingMovie ? 'UPDATE CHANGES' : 'PUBLISH NOW'}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
