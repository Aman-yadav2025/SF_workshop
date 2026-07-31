import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Star, Calendar } from 'lucide-react';
import { getMovieDetails } from '../api/tmdb';

export const MovieDetailsModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movie) {
      setLoading(true);
      getMovieDetails(movie.id)
        .then(data => setDetails(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [movie]);

  if (!movie) return null;

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : 'https://via.placeholder.com/780x1170?text=No+Image';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
      />
      
      {/* Modal Content */}
      <motion.div 
        layoutId={`movie-card-${movie.id}`}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 text-gray-900 dark:text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <motion.div 
          layoutId={`movie-image-${movie.id}`}
          className="w-full md:w-2/5 shrink-0"
        >
          <img 
            src={imageUrl} 
            alt={movie.title} 
            className="w-full h-64 md:h-full object-cover"
          />
        </motion.div>

        {/* Details Section */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.h2 
            layoutId={`movie-title-${movie.id}`}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {movie.title}
          </motion.h2>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {movie.release_date || 'Unknown'}
            </span>
            {details && details.runtime > 0 && (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Clock className="w-4 h-4" />
                {details.runtime} min
              </span>
            )}
          </div>

          {details && details.genres && (
            <div className="flex flex-wrap gap-2 mb-6">
              {details.genres.map(g => (
                <span key={g.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Overview</h3>
            <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
              {movie.overview || "No overview available."}
            </p>
          </div>
          
          {loading && (
            <div className="mt-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
