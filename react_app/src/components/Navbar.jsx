import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Film, User, LogOut, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { sessionId, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/80 dark:bg-black/30 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-lg sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Film className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl tracking-tight">MoviePlatform</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Discover
              </Link>
              {sessionId && (
                <Link to="/watchlist" className="hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  My Watchlist
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-gray-300 hover:text-white" /> : <Moon className="w-5 h-5 text-gray-600 hover:text-black" />}
            </button>
            
            {sessionId ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-800 dark:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors text-white"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
