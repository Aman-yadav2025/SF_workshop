import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const InteractiveBackground = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const { isDark } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-500/30 transition-colors duration-300">
      {/* Interactive Ambient Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, ${isDark ? 'rgba(29, 78, 216, 0.15)' : 'rgba(59, 130, 246, 0.15)'}, transparent 80%)`,
        }}
      />
      
      {/* Subtle dotted texture overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] dark:opacity-[0.15]" 
        style={{ backgroundImage: `radial-gradient(circle at center, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} 
      />

      {/* Main Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
