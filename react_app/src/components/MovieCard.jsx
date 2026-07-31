import { useState } from 'react';
import { Bookmark, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toggleWatchlist } from '../api/tmdb';
import { motion } from 'framer-motion';
import { useModal } from '../context/ModalContext';

export const MovieCard = ({ movie, isWatchlistedInitially = false }) => {
  const { sessionId, user } = useAuth();
  const { setSelectedMovie } = useModal();
  const [isWatchlisted, setIsWatchlisted] = useState(isWatchlistedInitially);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleWatchlist = async (e) => {
    e.stopPropagation(); // Prevent opening the modal when clicking bookmark
    e.preventDefault();
    
    if (!sessionId) {
      alert("Please log in to add to your watchlist.");
      return;
    }

    if (!user || !user.id) {
      alert("User profile not loaded yet. Please wait.");
      return;
    }

    // Optimistic UI update
    const previousState = isWatchlisted;
    setIsWatchlisted(!previousState);
    setIsUpdating(true);

    try {
      await toggleWatchlist(user.id, sessionId, movie.id, !previousState);
    } catch (error) {
      console.error("Failed to update watchlist", error);
      // Rollback UI
      setIsWatchlisted(previousState);
      alert("Failed to update watchlist. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardClick = () => {
    setSelectedMovie(movie);
  };

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <motion.div 
      layoutId={`movie-card-${movie.id}`}
      onClick={handleCardClick}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-300 relative group cursor-pointer"
    >
      <motion.img 
        layoutId={`movie-image-${movie.id}`}
        src={imageUrl} 
        alt={movie.title} 
        className="w-full h-[400px] object-cover" 
      />
      
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleToggleWatchlist}
          disabled={isUpdating}
          className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-colors ${
            isWatchlisted 
              ? 'bg-blue-600/90 text-white hover:bg-blue-700' 
              : 'bg-white/70 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-black/70 hover:text-black dark:hover:text-white'
          }`}
          title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <Bookmark className={`w-5 h-5 ${isWatchlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5">
        <motion.h3 
          layoutId={`movie-title-${movie.id}`}
          className="font-bold text-lg text-gray-900 dark:text-white truncate mb-2" 
          title={movie.title}
        >
          {movie.title}
        </motion.h3>
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
          <span>{movie.release_date ? movie.release_date.substring(0, 4) : ''}</span>
        </div>
      </div>
    </motion.div>
  );
};
