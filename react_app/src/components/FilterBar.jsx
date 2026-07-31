import { useSearchParams } from 'react-router-dom';
import { Search, Star } from 'lucide-react';

export const FilterBar = ({ genres }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('search', value);
    else newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleGenreToggle = (genreId) => {
    const newParams = new URLSearchParams(searchParams);
    const currentGenres = newParams.get('genre') ? newParams.get('genre').split(',') : [];
    
    if (currentGenres.includes(genreId)) {
      const updated = currentGenres.filter(g => g !== genreId);
      if (updated.length > 0) newParams.set('genre', updated.join(','));
      else newParams.delete('genre');
    } else {
      currentGenres.push(genreId);
      newParams.set('genre', currentGenres.join(','));
    }
    setSearchParams(newParams);
  };

  const handleRatingChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== '0') newParams.set('min_rating', value);
    else newParams.delete('min_rating');
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('sort', value);
    else newParams.delete('sort');
    setSearchParams(newParams);
  };

  const currentSearch = searchParams.get('search') || '';
  const currentGenres = searchParams.get('genre') ? searchParams.get('genre').split(',') : [];
  const currentMinRating = searchParams.get('min_rating') || '0';
  const currentSort = searchParams.get('sort') || 'popularity.desc';

  return (
    <div className="bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 md:p-6 rounded-3xl shadow-xl mb-8 flex flex-col gap-6 transition-colors">
      
      {/* Top Row: Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1 relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={currentSearch}
              onChange={handleSearchChange}
              placeholder="Search movies..."
              className="w-full bg-white dark:bg-black/40 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="w-full md:w-64">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="w-full bg-white dark:bg-black/40 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm cursor-pointer [&>option]:bg-white dark:[&>option]:bg-gray-900"
          >
            <option value="popularity.desc">Popularity (High to Low)</option>
            <option value="popularity.asc">Popularity (Low to High)</option>
            <option value="primary_release_date.desc">Newest Releases</option>
            <option value="primary_release_date.asc">Oldest Releases</option>
            <option value="vote_average.desc">Rating (High to Low)</option>
            <option value="vote_average.asc">Rating (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Middle Row: Genres (Scrollable Pills) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Genres</label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 md:mx-0 md:px-0">
          {genres.map(genre => {
            const isSelected = currentGenres.includes(genre.id.toString());
            return (
              <button
                key={genre.id}
                onClick={() => handleGenreToggle(genre.id.toString())}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isSelected 
                    ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/30' 
                    : 'bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Rating Slider */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Minimum Rating
          </label>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-blue-200 dark:border-blue-500/30">
            {currentMinRating} <Star className="w-3.5 h-3.5 fill-current" />
          </span>
        </div>
        <div className="relative pt-1">
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={currentMinRating}
            onChange={handleRatingChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 accent-blue-500 hover:accent-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-inner"
          />
        </div>
      </div>

    </div>
  );
};
