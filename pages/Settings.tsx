
import React, { useState, useEffect } from 'react';
import { ChevronRight, Shield, Bell, Map, User, Info, LogOut, Trash2, Check, Moon, Sun } from 'lucide-react';

interface AppSettings {
  kashrutLevel: string;
  notifications: boolean;
  darkMode: boolean;
  nusach: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    kashrutLevel: 'Глат',
    notifications: true,
    darkMode: false,
    nusach: 'Ашкеназ'
  });

  const [saveStatus, setSaveStatus] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mishkan_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('mishkan_settings', JSON.stringify(newSettings));
    
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Вы уверены, что хотите сбросить все данные приложения? Это удалит ваши маршруты и настройки.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const kashrutOptions = ['Стандарт', 'Глат', 'Бейт Йосеф', 'Меадрин'];
  const nusachOptions = ['Ашкеназ', 'Сефард', 'Хабад', 'Эдот а-Мизрах'];

  return (
    <div className="pb-32 pt-8 px-6 max-w-lg mx-auto min-h-screen bg-[#fdfbf7]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Настройки</h1>
        {saveStatus && (
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in slide-in-from-top-2 duration-300">
            <Check size={14} />
            <span className="text-[10px] font-bold uppercase">Сохранено</span>
          </div>
        )}
      </div>

      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 ml-2">Аккаунт</p>
        <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden">
          <button className="w-full flex items-center justify-between p-5 active:bg-slate-50 transition-colors border-b border-stone-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                <User size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Еврейский Путешественник</p>
                <p className="text-xs text-slate-400">Настроить профиль</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 ml-2">Религиозные предпочтения</p>
        <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/40 border border-stone-100 p-6 space-y-6">
          
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="text-sm font-bold text-slate-700">Уровень кошерности</label>
              <span className="text-blue-600 text-xs font-black uppercase">{settings.kashrutLevel}</span>
            </div>
            <div className="flex bg-stone-100 p-1 rounded-xl gap-1">
              {kashrutOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => updateSetting('kashrutLevel', opt)}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                    settings.kashrutLevel === opt 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Map size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Нусах молитвы</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{settings.nusach}</p>
              </div>
            </div>
            <select 
              value={settings.nusach}
              onChange={(e) => updateSetting('nusach', e.target.value)}
              className="bg-stone-50 border-none text-blue-600 text-sm font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            >
              {nusachOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 ml-2">Приложение</p>
        <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden">
          
          <div className="flex items-center justify-between p-5 border-b border-stone-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                <Bell size={20} />
              </div>
              <span className="font-bold text-slate-700">Время зажигания свечей</span>
            </div>
            <button 
              onClick={() => updateSetting('notifications', !settings.notifications)}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.notifications ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <span className="font-bold text-slate-700">Темная тема</span>
            </div>
            <button 
              onClick={() => updateSetting('darkMode', !settings.darkMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.darkMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleReset}
          className="w-full h-16 bg-white border border-red-100 text-red-500 rounded-[1.5rem] font-bold shadow-lg shadow-red-50 flex items-center justify-center gap-3 active:bg-red-50 active:scale-[0.98] transition-all"
        >
          <Trash2 size={20} />
          Сбросить все данные
        </button>
        
        <button className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-bold shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
          <LogOut size={20} />
          Выйти из аккаунта
        </button>
      </div>

      <div className="mt-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Info size={14} className="text-slate-400" />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Mishkan v1.0.8 • Beta
          </p>
        </div>
        <p className="text-[9px] text-slate-300 max-w-xs mx-auto leading-relaxed">
          Ваши предпочтения влияют на рекомендации ИИ и фильтрацию мест в разделе «Обзор».
        </p>
      </div>
    </div>
  );
};

export default Settings;
