
import React, { useState, useEffect } from 'react';
import Explore from './pages/Explore';
import Planner from './pages/Planner';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import { Site } from './types';
import { X, Globe, RefreshCw, Share, WifiOff } from 'lucide-react';

const InAppBrowser: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in slide-in-from-bottom duration-500">
      <header className="bg-[#1a1a1a] p-4 safe-area-top flex items-center justify-between text-white border-b border-white/5">
        <button onClick={onClose} className="p-2 -ml-2 active:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
        <div className="flex-1 px-4 text-center">
          <p className="text-[10px] uppercase tracking-widest font-black text-blue-400 mb-0.5">Mishkan Web View</p>
          <p className="text-xs truncate max-w-[200px] mx-auto opacity-40">{url}</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 -mr-2 active:bg-white/10 rounded-full transition-colors">
          <Globe size={20} />
        </a>
      </header>
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="In-App Content"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50 -z-10">
          <RefreshCw size={40} className="text-slate-200 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Загрузка сайта...</h3>
          <p className="text-sm text-slate-500 max-w-xs mb-8">Некоторые сайты блокируют встроенный просмотр.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-bold shadow-xl">
            Открыть напрямую
          </a>
        </div>
      </div>
    </div>
  );
};

const InstallGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed bottom-20 left-4 right-4 z-[100] bg-white rounded-3xl shadow-2xl p-6 border border-blue-50 animate-in slide-in-from-bottom-10 duration-500">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-100">
        <Share size={24} />
      </div>
      <div>
        <h3 className="font-black text-slate-900 mb-1">Установите Mishkan</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">Нажмите «Поделиться», затем <span className="font-bold text-slate-900">«На экран «Домой»»</span> для полноценного использования на iPhone.</p>
        <button onClick={onClose} className="text-blue-600 font-black text-xs uppercase tracking-widest">Хорошо</button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Site[]>([]);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  
  // Custom routing state to bypass issues with react-router-dom module exports
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Check if should show PWA guide
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      const guideShown = localStorage.getItem('mishkan_guide_shown');
      if (!guideShown) {
        setShowInstallGuide(true);
      }
    }

    // Handle connection status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const saved = localStorage.getItem('mishkan_planner');
    if (saved) {
      try { setItinerary(JSON.parse(saved)); } catch (e) { console.error(e); }
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('mishkan_planner', JSON.stringify(itinerary));
  }, [itinerary]);

  const addToPlanner = (site: Site) => {
    if (itinerary.find(s => s.id === site.id)) return;
    setItinerary(prev => [...prev, site]);
    if ('vibrate' in navigator) navigator.vibrate([10, 30, 10]);
  };

  const removeFromPlanner = (id: string) => {
    setItinerary(prev => prev.filter(s => s.id !== id));
  };

  const closeGuide = () => {
    setShowInstallGuide(false);
    localStorage.setItem('mishkan_guide_shown', 'true');
  };

  // Simple conditional rendering for routing without external router libraries
  const renderRoute = () => {
    switch (currentPath) {
      case '/':
        return <Explore onAddToPlanner={addToPlanner} onOpenLink={setBrowserUrl} />;
      case '/planner':
        return (
          <Planner 
            itinerary={itinerary} 
            onRemove={removeFromPlanner} 
            onClear={() => setItinerary([])}
            onOpenLink={setBrowserUrl}
          />
        );
      case '/chat':
        return <Chat onOpenLink={setBrowserUrl} />;
      case '/settings':
        return <Settings />;
      default:
        return <Explore onAddToPlanner={addToPlanner} onOpenLink={setBrowserUrl} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] safe-area-top selection:bg-blue-100">
      {!isOnline && (
        <div className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center animate-pulse sticky top-0 z-[300]">
          <div className="flex items-center justify-center gap-2">
            <WifiOff size={10} /> Нет соединения с интернетом
          </div>
        </div>
      )}
      
      <main className="max-w-lg mx-auto bg-[#f8f9fc] min-h-screen shadow-2xl shadow-slate-200/50">
        {renderRoute()}
      </main>

      {/* Passing currentPath to BottomNav for active state styling */}
      <BottomNav currentPath={currentPath} />
      {showInstallGuide && <InstallGuide onClose={closeGuide} />}
      {browserUrl && <InAppBrowser url={browserUrl} onClose={() => setBrowserUrl(null)} />}
    </div>
  );
};

export default App;
