
import React, { memo } from 'react';
import { Site, Category } from '../types';
import { Star, MapPin, Navigation, Plus, Utensils } from 'lucide-react';

interface SiteCardProps {
  site: Site;
  onAdd?: (site: Site) => void;
  onOpenLink?: (url: string) => void;
  compact?: boolean;
}

const SiteCard: React.FC<SiteCardProps> = memo(({ site, onAdd, onOpenLink, compact }) => {
  const isKosher = site.category === Category.KOSHER;

  return (
    <div className={`group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100/60 flex flex-col transition-all active:scale-[0.97] mb-5`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={site.imageUrl} 
          alt={site.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">
            {site.category}
          </span>
        </div>
        {site.rating && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1 text-amber-500 font-bold text-xs">
            <Star size={12} fill="currentColor" />
            {site.rating}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">{site.name}</h3>
        <div className="flex items-start gap-1.5 text-slate-400 mb-4">
          <MapPin size={14} className="mt-0.5 text-blue-500" />
          <p className="text-[13px] font-medium truncate">{site.address}</p>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenLink?.(site.uri || '');
            }}
            className="flex-1 h-11 bg-blue-600 text-white rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 active:bg-blue-700 transition-all shadow-md shadow-blue-100"
          >
            <Navigation size={14} />
            Маршрут
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.(site);
            }}
            className="w-11 h-11 bg-slate-50 text-slate-900 rounded-2xl font-bold flex items-center justify-center active:bg-slate-100 transition-all border border-slate-100"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default SiteCard;
