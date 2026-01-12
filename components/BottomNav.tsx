
import React from 'react';
import { Compass, Calendar, MessageCircle, Settings } from 'lucide-react';

interface BottomNavProps {
  currentPath: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPath }) => {
  // Helper to determine if a route is active based on the current hash path
  const isActive = (path: string) => {
    return currentPath === path || (currentPath === '' && path === '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-100 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {/* Using standard anchor tags with hashes to circumvent broken react-router-dom exports in this environment */}
        <a 
          href="#/" 
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <Compass size={22} />
          <span className="text-[9px] font-black uppercase tracking-widest">Обзор</span>
        </a>
        
        <a 
          href="#/planner" 
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/planner') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <Calendar size={22} />
          <span className="text-[9px] font-black uppercase tracking-widest">План</span>
        </a>
        
        <a 
          href="#/chat" 
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/chat') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <MessageCircle size={22} />
          <span className="text-[9px] font-black uppercase tracking-widest">Чат</span>
        </a>
        
        <a 
          href="#/settings" 
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/settings') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <Settings size={22} />
          <span className="text-[9px] font-black uppercase tracking-widest">Опции</span>
        </a>
      </div>
    </nav>
  );
};

export default BottomNav;
