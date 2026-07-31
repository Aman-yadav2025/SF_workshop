import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { sessionId } = useAuth();
  
  if (!sessionId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
