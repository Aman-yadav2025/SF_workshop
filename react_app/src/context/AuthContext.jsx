import { createContext, useContext, useState, useEffect } from 'react';
import { createSession, validateToken, requestToken, getAccountDetails } from '../api/tmdb';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(localStorage.getItem('tmdb_session_id'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data on initial load if session exists
  useEffect(() => {
    const fetchUser = async () => {
      if (sessionId && !user) {
        try {
          const userData = await getAccountDetails(sessionId);
          setUser(userData);
        } catch (err) {
          console.error("Failed to fetch user details", err);
          // If session is invalid, we should ideally log them out
        }
      }
    };
    fetchUser();
  }, [sessionId, user]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Create request token
      const token = await requestToken();
      // Step 2: Validate token with login
      await validateToken(username, password, token);
      // Step 3: Create session
      const session = await createSession(token);
      
      // Step 4: Fetch user details
      const userData = await getAccountDetails(session);
      
      setUser(userData);
      setSessionId(session);
      localStorage.setItem('tmdb_session_id', session);
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSessionId(null);
    setUser(null);
    localStorage.removeItem('tmdb_session_id');
  };

  return (
    <AuthContext.Provider value={{ sessionId, user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
