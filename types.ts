
export enum Category {
  KOSHER = 'Кошерная еда',
  SYNAGOGUE = 'Синагоги',
  GRAVE = 'Могилы праведников',
  HERITAGE = 'Еврейское наследие',
  INFO = 'Совет гида'
}

export interface Site {
  id: string;
  name: string;
  category: Category;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  imageUrl?: string;
  uri?: string; 
  phone?: string;
  hours?: string;
  cuisine?: string; // Для ресторанов
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
