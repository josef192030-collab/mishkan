
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Site } from "../types";

const getUserPreferences = () => {
  try {
    const saved = localStorage.getItem('mishkan_settings');
    return saved ? JSON.parse(saved) : { kashrutLevel: 'Глат', nusach: 'Ашкеназ' };
  } catch (e) {
    return { kashrutLevel: 'Глат', nusach: 'Ашкеназ' };
  }
};

/**
 * Searches for Jewish sites using Gemini with Google Maps grounding.
 * gemini-2.5-flash is required for Google Maps grounding functionality.
 */
export const searchJewishSites = async (query: string, latitude?: number, longitude?: number): Promise<{ sites: Site[] }> => {
  const prefs = getUserPreferences();
  
  try {
    // CRITICAL: Initialize GoogleGenAI inside the function using process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Найди ${query}. Учитывай: ${prefs.kashrutLevel} кашрут.
      Верни ТОЛЬКО JSON массив объектов.
      Поля: name, category, description (кратко), address, rating (число), latitude, longitude, phone, hours, cuisine.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: latitude && longitude ? {
          retrievalConfig: {
            latLng: { latitude, longitude }
          }
        } : undefined,
        temperature: 0.1,
      },
    });

    // Access the generated text directly using the .text property getter
    const text = response.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return { sites: [] };

    let parsedResults = [];
    try {
      parsedResults = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse sites JSON from model output", e);
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsUris = groundingChunks
      .filter((chunk: any) => chunk.maps?.uri)
      .map((chunk: any) => chunk.maps.uri);

    return {
      sites: (Array.isArray(parsedResults) ? parsedResults : []).map((item: any, index: number) => ({
        id: `site-${Date.now()}-${index}`,
        name: item.name || "Место",
        category: (item.category as Category) || Category.HERITAGE,
        description: item.description || "Описание уточняется",
        address: item.address || "Адрес в поиске",
        rating: item.rating || 4.5,
        latitude: item.latitude,
        longitude: item.longitude,
        phone: item.phone,
        hours: item.hours,
        cuisine: item.cuisine,
        uri: mapsUris[index] || `https://www.google.com/maps/search/${encodeURIComponent(item.name + " " + (item.address || ""))}`,
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + (index * 100)}?auto=format&fit=crop&w=400&q=60`
      }))
    };
  } catch (error) {
    console.error("Search Jewish sites failed:", error);
    return { sites: [] };
  }
};

/**
 * Communicates with Rabbi AI using the idiomatic Chat API for state management.
 * Uses gemini-3-pro-preview for advanced reasoning and cultural context.
 */
export const chatWithRabbiAI = async (message: string, history: { role: 'user' | 'assistant', content: string }[]) => {
  const prefs = getUserPreferences();
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Map existing history to the format expected by the SDK
    const chatHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // Utilize ai.chats.create for managed conversational state
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `Вы — Мишкан AI, еврейский гид-ассистент. Кашрут: ${prefs.kashrutLevel}. Нусах: ${prefs.nusach}. Краткость - приоритет. Отвечайте мудро и лаконично.`,
      },
      history: chatHistory
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Rabbi AI Chat error:", error);
    return "Извините, сейчас я не могу подключиться. Попробуйте позже.";
  }
};
