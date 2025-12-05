import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2, User, Bot } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { DocPage, ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

interface AskAIProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: DocPage;
}

export const AskAI: React.FC<AskAIProps> = ({ isOpen, onClose, currentDoc }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Reset chat when opened/closed or doc changes, effectively starting a fresh session relevant to context
  useEffect(() => {
    if (isOpen) {
      setMessages([
        { 
          id: 'welcome', 
          role: 'model', 
          text: `Hi! I'm Nebula AI. I can help you with questions about "${currentDoc?.title || 'the documentation'}".` 
        }
      ]);
      setQuery('');
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentDoc]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const chatSession = createChatSession(currentDoc);
      
      // Create a placeholder for streaming response
      const responseId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: responseId, role: 'model', text: '', isStreaming: true }]);

      const resultStream = await chatSession.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === responseId 
            ? { ...msg, text: fullText } 
            : msg
        ));
      }

      // Finalize the message
      setMessages(prev => prev.map(msg => 
        msg.id === responseId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm sorry, I encountered an error connecting to the AI service. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles size={18} />
            <h2 className="font-semibold text-slate-900 dark:text-white">Ask Nebula AI</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${msg.role === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300'}
                `}
              >
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div 
                className={`
                  max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 rounded-tl-none'
                  }
                `}
              >
                 {msg.role === 'model' ? (
                   <div className="prose prose-sm max-w-none dark:text-slate-300">
                     {/* We can simple-render text or use markdown here. 
                         For simplicity in chat, we just display text but handle newlines */}
                     {msg.text.split('\n').map((line, i) => (
                       <p key={i} className="min-h-[1em] mb-1">{line}</p>
                     ))}
                   </div>
                 ) : (
                   <p>{msg.text}</p>
                 )}
                 {msg.isStreaming && <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse align-middle"></span>}
              </div>
            </div>
          ))}
          {isLoading && !messages.find(m => m.isStreaming) && (
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
                 <Bot size={16} />
               </div>
               <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                 <Loader2 size={14} className="animate-spin" />
                 <span>Thinking...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
           <div className="relative flex items-center">
             <input
               ref={inputRef}
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Ask a question about the docs..."
               className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
             />
             <button 
               onClick={handleSend}
               disabled={!query.trim() || isLoading}
               className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <Send size={16} />
             </button>
           </div>
           <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
             AI-generated answers may be incorrect. Always check the official documentation.
           </p>
        </div>

      </div>
    </div>
  );
};