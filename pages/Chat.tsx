
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, User } from 'lucide-react';
import { chatWithRabbiAI } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatProps {
  onOpenLink: (url: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onOpenLink }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Шалом! Я Мишкан AI. Спросите меня о галахе в путешествии, помогите найти миньян или узнайте больше о праведниках, которых планируете посетить.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <button 
            key={i} 
            onClick={() => onOpenLink(part)}
            className="underline font-bold break-all text-left hover:text-blue-200 transition-colors"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await chatWithRabbiAI(input, history);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'Извините, сейчас я не могу подключиться.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdfbf7] max-w-lg mx-auto">
      <header className="glass p-4 border-b border-stone-200 sticky top-0 z-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-inner">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">Мишкан AI</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ассистент онлайн</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100 shadow-lg' 
                : 'bg-white text-slate-800 border border-stone-200 rounded-tl-none'
            }`}>
              {renderContent(msg.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={16} />
              <span className="text-xs font-medium text-slate-500">Советуюсь с источниками...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-100 safe-area-bottom pb-20">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text"
            placeholder="Спросите о чем угодно..."
            className="w-full h-12 bg-stone-100 rounded-2xl pl-4 pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-slate-400"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
