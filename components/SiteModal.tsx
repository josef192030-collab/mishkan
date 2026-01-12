
import React from 'react';
import { Site, Category } from '../types';
import { X, MapPin, Phone, Clock, Utensils, Star, Plus, Navigation, Globe } from 'lucide-react';

interface SiteModalProps {
  site: Site;
  onClose: () => void;
  onAdd: (site: Site) => void;
  onOpenMap: (url: string) => void;
}

const SiteModal: React.FC<SiteModalProps> = ({ site, onClose, onAdd, onOpenMap }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div onClick={onClose} className="absolute inset-0" />
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-400 max-h-[92vh] flex flex-col relative z-[120]">
        
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 flex-shrink-0" />

        <div className="relative h-64 flex-shrink-0">
          <img src={site.imageUrl} alt={site.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 backdrop-blur-lg text-white p-2.5 rounded-full active:scale-90 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto no-scrollbar space-y-8">
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">
              {site.category}
            </span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{site.name}</h2>
            <div className="flex items-center gap-1 text-amber-500 font-black">
              <Star size={16} fill="currentColor" />
              <span>{site.rating || '4.8'}</span>
              <span className="text-slate-300 font-medium text-xs ml-1 tracking-tight">на основе отзывов</span>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed text-[15px] font-medium italic">
            "{site.description}"
          </p>

          <div className="grid grid-cols-1 gap-5">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Локация</p>
                <p className="text-sm font-bold text-slate-900">{site.address}</p>
              </div>
            </div>

            {site.hours && (
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">График</p>
                  <p className="text-sm font-bold text-slate-900">{site.hours}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-white border-t border-slate-50 flex gap-4 safe-area-bottom">
          <button 
            onClick={() => { onAdd(site); onClose(); }}
            className="flex-1 bg-slate-100 text-slate-900 h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:bg-slate-200 transition-colors"
          >
            <Plus size={20} />
            Добавить
          </button>
          <button 
            onClick={() => onOpenMap(site.uri || '')}
            className="flex-1 bg-blue-600 text-white h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            <Navigation size={20} />
            Поехать
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteModal;
