
import React from 'react';
import { Site } from '../types';
import SiteCard from '../components/SiteCard';
import { Trash2, Send, Clock, Share2 } from 'lucide-react';

interface PlannerProps {
  itinerary: Site[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenLink: (url: string) => void;
}

const Planner: React.FC<PlannerProps> = ({ itinerary, onRemove, onClear, onOpenLink }) => {
  const handleShare = async () => {
    if (itinerary.length === 0) return;

    const shareText = `Мой еврейский маршрут в Mishkan:\n\n` + 
      itinerary.map((s, i) => `${i+1}. ${s.name} (${s.category})`).join('\n') + 
      `\n\nСоздано в приложении Mishkan.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Мой еврейский маршрут',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Маршрут скопирован в буфер обмена!');
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Маршрут</h1>
        {itinerary.length > 0 && (
          <button 
            onClick={onClear}
            className="text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 active:bg-red-50 rounded-lg transition-colors"
          >
            Очистить
          </button>
        )}
      </div>

      {itinerary.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6 text-slate-200 rotate-6 border border-slate-50">
            <Clock size={40} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">План пуст</h2>
          <p className="text-slate-400 text-sm max-w-[220px] leading-relaxed">Добавьте места из вкладки «Обзор», чтобы ваш ИИ-помощник составил путь.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="bg-white p-5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Аналитика пути</span>
              <span className="bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-black uppercase">{itinerary.length} ЛОКАЦИЙ</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Ваш маршрут синхронизирован. Не забудьте проверить время зажигания свечей в настройках.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-8 pb-8">
            {itinerary.map((site, index) => (
              <div key={site.id} className="relative">
                <div className="absolute -left-12 top-2 w-8 h-8 bg-white border-2 border-blue-600 text-blue-600 rounded-full flex items-center justify-center font-black text-xs shadow-md z-10">
                  {index + 1}
                </div>
                <div className="relative group">
                  <SiteCard site={site} compact onOpenLink={onOpenLink} />
                  <button 
                    onClick={() => onRemove(site.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleShare}
            className="w-full bg-blue-600 text-white h-16 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active-scale transition-all mt-4 mb-10"
          >
            <Share2 size={20} />
            Поделиться планом
          </button>
        </div>
      )}
    </div>
  );
};

export default Planner;
