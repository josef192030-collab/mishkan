
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Compass, AlertCircle, Map as MapIcon, List, Navigation, Plus, Star, Sparkles } from 'lucide-react';
import L from 'leaflet';
import SiteCard from '../components/SiteCard';
import SiteModal from '../components/SiteModal';
import { searchJewishSites } from '../services/geminiService';
import { Site, Category } from '../types';

interface ExploreProps {
  onAddToPlanner: (site: Site) => void;
  onOpenLink: (url: string) => void;
}

const FEATURED_SITES: Site[] = [
  {
    id: 'feat-1',
    name: 'Центральная Синагога',
    category: Category.SYNAGOGUE,
    description: 'Величественное здание с богатой историей и активной общиной. Здесь проводятся ежедневные молитвы и уроки Торы.',
    address: 'Большая Бронная ул., 6',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1543790101-70068a739564?auto=format&fit=crop&w=600&q=80',
    hours: '08:00 - 21:00'
  },
  {
    id: 'feat-2',
    name: 'Кошерный Ресторан "Мишкан"',
    category: Category.KOSHER,
    description: 'Лучшее место для изысканного ужина. Строгий кашрут, авторская кухня и уютная атмосфера.',
    address: 'ул. Образцова, 19',
    rating: 4.8,
    cuisine: 'Еврейская, Мясная',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80',
    hours: '11:00 - 23:00'
  }
];

const Explore: React.FC<ExploreProps> = ({ onAddToPlanner, onOpenLink }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Site[]>(FEATURED_SITES);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setIsSearching(true);
    try {
      const res = await searchJewishSites(query, location?.lat, location?.lng);
      setResults(res.sites);
      if (res.sites.length === 0) {
        setError("Ничего не найдено. Попробуйте уточнить запрос.");
      }
    } catch (err) {
      setError("Ошибка сети. Проверьте соединение.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Location access denied")
      );
    }
  }, []);

  useEffect(() => {
    if (viewMode === 'map' && mapRef.current && !leafletMap.current) {
      const initialLat = location?.lat || 55.7558; 
      const initialLng = location?.lng || 37.6173;
      
      leafletMap.current = L.map(mapRef.current, { zoomControl: false }).setView([initialLat, initialLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap.current);
      
      results.forEach(site => {
        if (site.latitude && site.longitude) {
          const marker = L.marker([site.latitude, site.longitude], {
            icon: L.divIcon({ className: 'custom-marker', iconSize: [12, 12] })
          });
          marker.on('click', () => setSelectedSite(site));
          marker.addTo(leafletMap.current!);
        }
      });
    }
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, [viewMode, results, location]);

  return (
    <div className="pb-24 pt-4 max-w-lg mx-auto min-h-screen bg-[#fdfbf7] flex flex-col">
      <header className="px-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Мишкан</h1>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Sparkles size={20} />
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Поиск кошерных мест..."
            className="w-full h-14 bg-white rounded-2xl pl-12 pr-6 shadow-sm border border-stone-200 focus:ring-4 focus:ring-blue-100/50 transition-all outline-none text-base font-medium placeholder:text-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </header>

      {/* Categories Bar */}
      <div className="flex gap-2.5 mb-6 overflow-x-auto no-scrollbar px-6">
        <button 
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="px-5 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-sm border bg-slate-900 text-white flex items-center gap-2 active:scale-95"
        >
          {viewMode === 'list' ? <MapIcon size={14} /> : <List size={14} />}
          {viewMode === 'list' ? 'Карта' : 'Список'}
        </button>
        {['Синагоги', 'Еда', 'Музеи', 'Наследие'].map((cat) => (
          <button 
            key={cat}
            onClick={() => { setQuery(cat); handleSearch(); }}
            className="px-5 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-sm border bg-white text-stone-600 border-stone-200 hover:border-blue-200 active:scale-95"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        {viewMode === 'list' ? (
          <div className="px-6 space-y-1">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-black text-stone-400 uppercase tracking-widest">
                 {isSearching ? 'Результаты поиска' : 'Рекомендуемые места'}
               </h2>
               {loading && <div className="animate-spin text-blue-600"><Compass size={16} /></div>}
            </div>
            
            {error ? (
              <div className="bg-white p-8 rounded-3xl text-center border border-red-50">
                <AlertCircle size={32} className="mx-auto text-red-400 mb-3" />
                <p className="text-slate-500 text-sm">{error}</p>
              </div>
            ) : (
              results.map(site => (
                <div key={site.id} onClick={() => setSelectedSite(site)} className="cursor-pointer">
                  <SiteCard site={site} onAdd={onAddToPlanner} onOpenLink={onOpenLink} />
                </div>
              ))
            )}
          </div>
        ) : (
          <div ref={mapRef} className="absolute inset-0 z-0" />
        )}
      </div>

      {selectedSite && (
        <SiteModal 
          site={selectedSite} 
          onClose={() => setSelectedSite(null)} 
          onAdd={onAddToPlanner} 
          onOpenMap={onOpenLink} 
        />
      )}
    </div>
  );
};

export default Explore;
