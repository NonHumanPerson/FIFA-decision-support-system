import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, MapPin, Loader2, Bot, User, ShieldAlert, Map } from "lucide-react";
import { ChatMessage } from "../types";
import { cn } from "../lib/utils";
import Markdown from "react-markdown";
import DOMPurify from "dompurify";
import StadiumMap from "./StadiumMap";

export default React.memo(function FanHub() {
  const [view, setView] = useState<'chat' | 'map'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Welcome to the official MatchDay Genie! I'm your AI assistant for the FIFA World Cup 2026. How can I help you today? Ask me about finding your seat, nearest restrooms, food options, or stadium rules."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("Section 120, Row 5");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // Format history for the API
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history,
          userLocation: location
        })
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "model", text: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "system", text: "Connection error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, location]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm transition-colors duration-300">
        
        {/* Chat Header */}
        <div className="bg-emerald-900 dark:bg-emerald-950 text-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 dark:bg-emerald-800/80 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h2 className="font-semibold text-lg leading-tight">MatchDay Genie</h2>
              <p className="text-emerald-200 text-xs flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online | Multilingual AI Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-emerald-800/50 p-1 rounded-lg border border-emerald-700/50">
              <button 
                onClick={() => setView('chat')} 
                aria-pressed={view === 'chat'}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2", 
                  view === 'chat' ? "bg-emerald-600 text-white" : "text-emerald-100 hover:bg-emerald-700"
                )}
              >
                <Bot className="w-4 h-4" />
                Chat
              </button>
              <button 
                onClick={() => setView('map')} 
                aria-pressed={view === 'map'}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2", 
                  view === 'map' ? "bg-emerald-600 text-white" : "text-emerald-100 hover:bg-emerald-700"
                )}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 bg-emerald-800/50 px-3 py-1.5 rounded-full text-sm text-emerald-100 border border-emerald-700/50">
              <MapPin className="w-4 h-4" />
              <span>Simulated Location: {location}</span>
            </div>
          </div>
        </div>

        {view === 'map' ? (
          <div className="flex-1 overflow-hidden">
            <StadiumMap />
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
              aria-live="polite"
              aria-atomic="false"
              role="log"
            >
              {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                msg.role === "user" ? "bg-emerald-600 text-white" : 
                msg.role === "system" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              )}>
                {msg.role === "user" ? <User className="w-5 h-5" /> : 
                 msg.role === "system" ? <ShieldAlert className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl",
                msg.role === "user" 
                  ? "bg-emerald-600 dark:bg-emerald-700 text-white rounded-tr-sm shadow-sm" 
                  : msg.role === "system"
                  ? "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-tl-sm"
                  : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 rounded-tl-sm shadow-sm"
              )}>
                <div className={cn(
                  "prose prose-sm max-w-none dark:prose-invert",
                  msg.role === "user" && "prose-invert"
                )}>
                  <Markdown>{DOMPurify.sanitize(msg.text)}</Markdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 rounded-2xl rounded-tl-sm shadow-sm p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-gray-500 dark:text-slate-400">Genie is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="bg-white dark:bg-slate-900 px-4 pt-4 pb-2 border-t border-gray-100 dark:border-slate-800 overflow-x-auto flex gap-2 no-scrollbar transition-colors duration-300">
            {["Where is the nearest halal food?", "How do I get to Gate C?", "Translate 'Where is my seat' to Spanish", "Are umbrellas allowed?"].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="whitespace-nowrap text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
              >
                {prompt}
              </button>
            ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 items-end relative"
            aria-label="Chat message form"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about the stadium..."
              aria-label="Message input"
              className="flex-1 resize-none bg-slate-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 min-h-[52px] max-h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm dark:text-slate-200 transition-colors duration-300"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white p-3 rounded-xl transition-colors h-[52px] w-[52px] flex items-center justify-center flex-shrink-0 shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400 dark:text-slate-500">AI responses may occasionally be inaccurate. Venue staff have the final say.</p>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
});
