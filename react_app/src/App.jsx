import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider, useModal } from './context/ModalContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Discover } from './pages/Discover';
import { Login } from './pages/Login';
import { Watchlist } from './pages/Watchlist';
import { ProtectedRoute } from './components/ProtectedRoute';
import { InteractiveBackground } from './components/InteractiveBackground';
import { MovieDetailsModal } from './components/MovieDetailsModal';

const AppContent = () => {
  const { selectedMovie, setSelectedMovie } = useModal();

  return (
    <Router>
      <InteractiveBackground>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/watchlist" 
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <AnimatePresence>
          {selectedMovie && (
            <MovieDetailsModal 
              movie={selectedMovie} 
              onClose={() => setSelectedMovie(null)} 
            />
          )}
        </AnimatePresence>
      </InteractiveBackground>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
