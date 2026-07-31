import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { MovieCard } from '../components/MovieCard';
import { discoverMovies, searchMovies, getGenres, getWatchlist } from '../api/tmdb';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const Discover = () => {
  const [searchParams] = useSearchParams();
  const { sessionId, user } = useAuth();
  
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGenres()
      .then(data => setGenres(data.genres || []))
      .catch(err => console.error("Failed to load genres", err));
  }, []);

  useEffect(() => {
    if (sessionId && user?.id) {
      getWatchlist(user.id, sessionId)
        .then(data => {
          const ids = new Set(data.results.map(m => m.id));
          setWatchlistIds(ids);
        })
        .catch(err => console.error("Failed to load watchlist", err));
    } else {
      setWatchlistIds(new Set());
    }
  }, [sessionId, user]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = searchParams.get('search');
      const genre = searchParams.get('genre');
      const min_rating = searchParams.get('min_rating');
      const sort = searchParams.get('sort') || 'popularity.desc';

      let data;
      
      if (query) {
        data = await searchMovies(query, { include_adult: false, page: 1 });
        let results = data.results;
        
        if (genre) {
          const genreIds = genre.split(',').map(Number);
          results = results.filter(m => m.genre_ids.some(id => genreIds.includes(id)));
        }
        if (min_rating) {
          results = results.filter(m => m.vote_average >= parseFloat(min_rating));
        }
        
        if (sort === 'vote_average.desc') results.sort((a,b) => b.vote_average - a.vote_average);
        if (sort === 'vote_average.asc') results.sort((a,b) => a.vote_average - b.vote_average);
        
        setMovies(results);
      } else {
        const discoverParams = { sort_by: sort, include_adult: false, page: 1 };
        if (genre) discoverParams.with_genres = genre.replace(/,/g, '|');
        if (min_rating) discoverParams['vote_average.gte'] = min_rating;
        
        data = await discoverMovies(discoverParams);
        setMovies(data.results);
      }
    } catch (err) {
      setError("Failed to fetch movies.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Discover Movies</h1>
      <FilterBar genres={genres} />
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-8">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.length > 0 ? (
            movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} isWatchlistedInitially={watchlistIds.has(movie.id)} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              No movies found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
