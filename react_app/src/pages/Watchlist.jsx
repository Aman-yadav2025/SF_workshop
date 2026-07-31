import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWatchlist } from '../api/tmdb';
import { MovieCard } from '../components/MovieCard';
import { Loader2, Film } from 'lucide-react';

export const Watchlist = () => {
  const { sessionId, user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id && sessionId) {
      setLoading(true);
      getWatchlist(user.id, sessionId)
        .then(data => setMovies(data.results))
        .catch(err => setError("Failed to fetch watchlist. " + err.message))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, sessionId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Film className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
      </div>

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
              <MovieCard key={movie.id} movie={movie} isWatchlistedInitially={true} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
              <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">Your watchlist is empty</h2>
              <p className="text-gray-400">
                Explore the discovery dashboard and click the bookmark icon to add movies here!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
