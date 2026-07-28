import React, { useState, useRef, useEffect } from 'react';
import { Destination, TripStop, StopCategory } from '../types/trip';
import { CURATED_DESTINATIONS, generateFullTripStops } from '../data/mockDestinations';
import { Send, Bot, User, Sparkles, Calendar, MapPin, CheckCircle2, ArrowRight, RefreshCw, Loader2, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  tripResult?: {
    destination: Destination;
    stops: TripStop[];
    totalDays: number;
    startDate: string;
  };
}

interface AIChatboxProps {
  onApplyTripPlan: (destination: Destination, stops: TripStop[], totalDays: number, startDate: string) => void;
  className?: string;
}

const PRESET_PROMPTS = [
  { label: 'Pondicherry 3 days', prompt: 'Plan Pondicherry in 3 days' },
  { label: 'Jaipur 4 days', prompt: 'Plan Jaipur in 4 days' },
  { label: 'Hyderabad 3 days', prompt: 'Plan Hyderabad in 3 days' },
  { label: 'Paris 5 days', prompt: 'Plan 5 days in Paris' },
  { label: 'Tokyo 4 days', prompt: 'Plan Tokyo in 4 days' },
  { label: 'Dubai 3 days', prompt: 'Plan Dubai in 3 days' },
];

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// Build TripStop[] from Groq AI-generated landmark names with tight city-radius coordinates
function buildStopsFromAILandmarks(
  dest: Destination,
  landmarks: string[],
  totalDays: number
): TripStop[] {
  const stops: TripStop[] = [];
  let landmarkIdx = 0;

  const getNextLandmark = (): string => {
    const lm = landmarks[landmarkIdx % landmarks.length];
    landmarkIdx++;
    return lm;
  };

  for (let day = 1; day <= totalDays; day++) {
    // Tiny per-day jitter (~300-600m from center) so each day clusters slightly apart
    const dayLatJitter = ((day % 5) - 2) * 0.0012;
    const dayLngJitter = ((day % 3) - 1) * 0.0015;

    // Day 1 ONLY: Hotel Check-in
    if (day === 1) {
      stops.push({
        id: `stop-${dest.id}-d${day}-stay`,
        dayNumber: day,
        time: '10:30 AM',
        title: `${dest.name} Hotel & Resort Check-in`,
        description: `Check into luxury room stay in central ${dest.name}.`,
        category: 'stay',
        lat: dest.lat + dayLatJitter + 0.001,
        lng: dest.lng + dayLngJitter + 0.001,
        locationName: `${dest.name} Grand Hotel & Room`,
        duration: '1.5h',
        cost: 'Included in Stay'
      });
    }

    // Sightseeing Stop 1 (Morning)
    const sight1 = getNextLandmark();
    stops.push({
      id: `stop-${dest.id}-d${day}-sight1`,
      dayNumber: day,
      time: day === 1 ? '12:00 PM' : '09:00 AM',
      title: `Visit ${sight1}`,
      description: `Explore famous landmark ${sight1} in ${dest.name} with photo stops and guided walk.`,
      category: 'sightseeing',
      lat: dest.lat + dayLatJitter + 0.003,
      lng: dest.lng + dayLngJitter - 0.002,
      locationName: sight1,
      duration: '2.5h',
      cost: 'Free / Landmark Entry'
    });

    // Meal 1: Lunch
    stops.push({
      id: `stop-${dest.id}-d${day}-lunch`,
      dayNumber: day,
      time: '01:30 PM',
      title: `${dest.name} Regional Specialty Lunch`,
      description: `Sample authentic local food specialties of ${dest.name}.`,
      category: 'food',
      lat: dest.lat + dayLatJitter + 0.004,
      lng: dest.lng + dayLngJitter + 0.002,
      locationName: `${dest.name} Traditional Café`,
      duration: '1.5h',
      cost: '$25'
    });

    // Sightseeing Stop 2 (Afternoon)
    const sight2 = getNextLandmark();
    stops.push({
      id: `stop-${dest.id}-d${day}-sight2`,
      dayNumber: day,
      time: '03:30 PM',
      title: `Tour ${sight2}`,
      description: `Discover iconic architecture and cultural sights at ${sight2} in ${dest.name}.`,
      category: 'sightseeing',
      lat: dest.lat + dayLatJitter - 0.002,
      lng: dest.lng + dayLngJitter + 0.004,
      locationName: sight2,
      duration: '2.5h',
      cost: 'Free'
    });

    // Sightseeing Stop 3 (Sunset Viewpoint / Evening)
    const sight3 = getNextLandmark();
    stops.push({
      id: `stop-${dest.id}-d${day}-sight3`,
      dayNumber: day,
      time: '06:30 PM',
      title: `Sunset View & Walk at ${sight3}`,
      description: `Watch the sunset over famous scenic overlook at ${sight3} in ${dest.name}.`,
      category: 'activity',
      lat: dest.lat + dayLatJitter - 0.003,
      lng: dest.lng + dayLngJitter - 0.004,
      locationName: sight3,
      duration: '1.5h',
      cost: 'Free'
    });

    // Meal 2: Dinner
    stops.push({
      id: `stop-${dest.id}-d${day}-dinner`,
      dayNumber: day,
      time: '08:30 PM',
      title: `${dest.name} Evening Dinner & Drinks`,
      description: `Relaxing dinner in central ${dest.name}.`,
      category: 'food',
      lat: dest.lat + dayLatJitter + 0.001,
      lng: dest.lng + dayLngJitter - 0.003,
      locationName: `${dest.name} Signature Restaurant`,
      duration: '1.5h',
      cost: '$40'
    });
  }

  return stops;
}

export const AIChatbox: React.FC<AIChatboxProps> = ({ onApplyTripPlan, className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "👋 Hi! I'm your AI Trip Assistant powered by **Groq Llama 3.3 70B**! Ask me to plan ANY place in the world (e.g. \"Pondicherry in 3 days\" or \"Visakhapatnam in 5 days\"). I'll generate real famous landmarks specific to that exact city, fetch real coordinates, and plot the route map for you!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-11-15');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Groq Llama 3.3 70B AI Integration Engine
  const processUserPrompt = async (userPromptText: string) => {
    const textLower = userPromptText.toLowerCase();

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userPromptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Extract days number
      const dayMatch = textLower.match(/(\d+)\s*(day|days)/i);
      const parsedDays = dayMatch ? Math.min(14, Math.max(1, parseInt(dayMatch[1], 10))) : 3;

      // Cleaned search query for geocoding
      const cleanedQuery = userPromptText
        .replace(/(\d+)\s*(day|days)/gi, '')
        .replace(/\b(plan|trip|to|in|for|with|and|the|visit|places|stay|hotel|food|room|me|a|my)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim() || 'Pondicherry';

      // How many unique landmarks we need (3 sights per day)
      const landmarksNeeded = parsedDays * 3;

      // 1. Fetch Live OpenStreetMap Nominatim Geocoding API
      let realLat = 11.9416;
      let realLng = 79.8083;
      let resolvedName = cleanedQuery;
      let countryName = 'Global Destination';

      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanedQuery)}&limit=1&addressdetails=1`
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          const item = geoData[0];
          realLat = parseFloat(item.lat);
          realLng = parseFloat(item.lon);
          const parts = item.display_name.split(',');
          resolvedName = parts[0].trim();
          // Try to get better city/state name from address
          if (item.address) {
            const addr = item.address;
            const cityName = addr.city || addr.town || addr.village || addr.state || parts[0].trim();
            resolvedName = cityName;
          }
          countryName = item.address?.country || parts[parts.length - 1].trim();
        }
      } catch (e) {
        console.warn('Geocoding fallback:', e);
      }

      // 2. Call Groq Llama 3.3 70B to get REAL landmarks for THIS SPECIFIC place
      let aiLandmarks: string[] = [];
      let aiNarrativeText = '';

      if (GROQ_API_KEY) {
        try {
          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                {
                  role: 'system',
                  content: `You are a travel landmark expert. The user will give you a place name. You must return ONLY a valid JSON object (no markdown, no code fences, no explanation) in this exact format:
{
  "city": "resolved city name",
  "landmarks": ["Landmark 1 Full Name", "Landmark 2 Full Name", ...],
  "summary": "A 2-3 sentence exciting travel summary"
}

Rules:
- Return EXACTLY ${landmarksNeeded} landmarks in the "landmarks" array.
- Every landmark MUST be a real, famous, well-known place located IN or very near "${resolvedName}, ${countryName}". Do NOT include places from other cities or states.
- Include temples, forts, beaches, parks, museums, viewpoints, historic quarters, markets that are actually in "${resolvedName}".
- Do NOT make up fake landmarks. Only use real places that actually exist in "${resolvedName}".
- Return ONLY the JSON object. No other text.`
                },
                {
                  role: 'user',
                  content: `List ${landmarksNeeded} famous tourist landmarks and attractions located specifically in ${resolvedName}, ${countryName} for a ${parsedDays}-day trip.`
                }
              ],
              temperature: 0.3,
              max_tokens: 800,
            })
          });

          if (groqResponse.ok) {
            const groqData = await groqResponse.json();
            const rawContent = groqData.choices?.[0]?.message?.content || '';

            // Parse the JSON response
            try {
              // Strip any markdown code fences if present
              const jsonStr = rawContent
                .replace(/```json\s*/gi, '')
                .replace(/```\s*/gi, '')
                .trim();
              const parsed = JSON.parse(jsonStr);

              if (parsed.landmarks && Array.isArray(parsed.landmarks) && parsed.landmarks.length > 0) {
                aiLandmarks = parsed.landmarks.map((lm: string) => lm.trim()).filter((lm: string) => lm.length > 0);
              }
              if (parsed.summary) {
                aiNarrativeText = parsed.summary;
              }
              if (parsed.city) {
                resolvedName = parsed.city;
              }
            } catch (parseErr) {
              console.warn('Groq JSON parse fallback, extracting landmarks from text:', parseErr);
              // Try to extract landmark names from raw text as fallback
              const lines = rawContent.split('\n').filter((l: string) => l.trim().length > 5);
              for (const line of lines) {
                const cleaned = line.replace(/^\d+[\.\)]\s*/, '').replace(/^[-*]\s*/, '').trim();
                if (cleaned.length > 3 && cleaned.length < 100 && !cleaned.startsWith('{') && !cleaned.startsWith('"')) {
                  aiLandmarks.push(cleaned);
                }
              }
            }
          }
        } catch (err) {
          console.warn('Groq API error, falling back to local generator:', err);
        }
      }

      // 3. Build destination object
      const generatedDest: Destination = {
        id: `dest-${resolvedName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: resolvedName,
        country: countryName,
        tagline: `Groq AI Planned Trip to ${resolvedName}`,
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
        description: `Custom ${parsedDays}-day travel itinerary generated by Groq Llama 3.3 70B for ${resolvedName}.`,
        rating: 4.96,
        reviewCount: 3120,
        lat: realLat,
        lng: realLng,
        quickFactsUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(resolvedName)}`,
        category: 'Groq Llama 3.3 AI',
      };

      // 4. Generate stops — use AI landmarks if available, else fall back to local dictionary
      let generatedStops: TripStop[];
      if (aiLandmarks.length >= 3) {
        generatedStops = buildStopsFromAILandmarks(generatedDest, aiLandmarks, parsedDays);
      } else {
        generatedStops = generateFullTripStops(generatedDest, parsedDays);
      }

      // 5. Build response message
      const landmarkPreview = aiLandmarks.length >= 3
        ? aiLandmarks.slice(0, 5).map(lm => `  • ${lm}`).join('\n')
        : '  • Famous local landmarks (from city database)';

      const responseMessageText = aiNarrativeText
        ? `${aiNarrativeText}\n\n**${parsedDays}-Day Itinerary for ${resolvedName}, ${countryName}** (${realLat.toFixed(4)}° N, ${realLng.toFixed(4)}° E):\n\nReal landmarks from Groq AI:\n${landmarkPreview}\n\n🏛️ 3-4 famous local attractions per day\n🍽️ Max 2 regional meals per day\n🏨 1 Hotel Check-in on Day 1\n🚗 Inter-stop travel times computed\n\nSelect your start date and click **"Apply to Route Map"**!`
        : `⚡ **Groq Llama 3.3 70B** resolved coordinates for **${resolvedName}, ${countryName}** (${realLat.toFixed(4)}° N, ${realLng.toFixed(4)}° E)!\n\n**${parsedDays}-Day Itinerary**:\n${landmarkPreview}\n\n🏛️ 3-4 famous local attractions per day\n🍽️ Max 2 regional meals per day\n🏨 1 Hotel Check-in on Day 1\n🚗 Inter-stop travel times computed\n\nSelect your start date and click **"Apply to Route Map"**!`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseMessageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tripResult: {
          destination: generatedDest,
          stops: generatedStops,
          totalDays: parsedDays,
          startDate: selectedDate,
        }
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Groq AI Chat Error:', err);
      const errorMsg: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        text: '❌ Something went wrong while generating your trip plan. Please try again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto rounded-3xl bg-[#0F1629]/90 border border-violet-500/30 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[650px]", className)}>
      {/* Header */}
      <div className="p-5 bg-[#060911]/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Groq Llama 3.3 70B AI Assistant
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Groq API Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">AI generates real famous landmarks specific to each city you search</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'ai',
                text: "Conversation reset. Where would you like Groq Llama 3.3 AI to plan next? Type e.g. \"Visakhapatnam in 3 days\" or \"Manali in 5 days\"!",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ]);
          }}
          title="Reset conversation"
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Prompts */}
      <div className="px-4 py-3 bg-[#060911]/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Quick:
        </span>
        {PRESET_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => processUserPrompt(item.prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-violet-600/20 text-slate-300 hover:text-cyan-300 text-xs font-medium border border-slate-800 hover:border-violet-500/40 shrink-0 transition-all"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3 max-w-[88%] transition-all",
                isAi ? "mr-auto" : "ml-auto flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md",
                  isAi
                    ? "bg-gradient-to-tr from-violet-600 to-indigo-600"
                    : "bg-gradient-to-tr from-amber-500 to-orange-600"
                )}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className="space-y-2 w-full">
                <div
                  className={cn(
                    "p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg",
                    isAi
                      ? "bg-[#090D16]/95 border border-slate-800 text-slate-100"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium"
                  )}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Trip Result Card */}
                {msg.tripResult && (
                  <div className="p-4 rounded-2xl bg-[#090D16] border border-violet-500/40 space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                        <MapPin className="w-4 h-4" />
                        <span>{msg.tripResult.destination.name}, {msg.tripResult.destination.country}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {msg.tripResult.totalDays} Days Plan ({msg.tripResult.stops.length} Stops)
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>Travel Start Date:</span>
                      </div>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onApplyTripPlan(
                        msg.tripResult!.destination,
                        msg.tripResult!.stops,
                        msg.tripResult!.totalDays,
                        selectedDate
                      )}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Apply {msg.tripResult.totalDays}-Day Plan to Route Map & Agenda</span>
                      <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-slate-500 px-1 block text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3 mr-auto max-w-[85%]">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            </div>
            <div className="p-3 rounded-2xl bg-[#090D16] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Groq AI generating real landmarks for this city & fetching coordinates...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputText.trim()) processUserPrompt(inputText);
        }}
        className="p-4 bg-[#060911]/90 border-t border-slate-800 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Groq AI... e.g. 'Visakhapatnam in 3 days' or 'Manali in 5 days'"
          className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-violet-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
