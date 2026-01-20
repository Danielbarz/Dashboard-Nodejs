import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaRobot, FaTimes, FaPaperPlane, FaRedo, FaLightbulb, FaCommentDots } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';

const SUGGESTIONS = {
  '/hsi': [
    'Total Order HSI bulan ini?',
    'Top 5 Witel HSI?',
    'Berapa yang Completed (PS)?',
    'Berapa persen Completion Rate?'
  ],
  '/datin': [
    'Total Revenue Datin?',
    'Berapa order yang In Progress?',
    'Top 5 Produk Datin?',
    'Sebaran order per Segmen?'
  ],
  '/tambahan': [
    'Berapa total LOP Jaringan Tambahan?',
    'Berapa proyek yang Belum Go-Live?',
    'Tampilkan Top 3 PO dengan order terbanyak',
    'Status LOP per Witel?'
  ],
  '/dashboard': [
    'Total Revenue Digital Product?',
    'Berapa pencapaian target revenue?',
    'Produk dengan revenue tertinggi?',
    'Trend order bulan ini?'
  ],
  'default': [
    'Halo, apa yang bisa kamu bantu?',
    'Tampilkan performansi HSI',
    'Berapa total revenue Datin?',
    'Cek status Jaringan Tambahan'
  ]
};

const ChatBot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Halo! Saya **Telkom AI Assistant**. 

Saya bisa membantu Anda mencari data dashboard secara instan tanpa perlu klik sana-sini. Coba tanyakan sesuatu!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const currentPath = location.pathname;
  const currentSuggestions = SUGGESTIONS[currentPath] || SUGGESTIONS['default'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { 
        message: userMessage,
        context: currentPath // Send context to backend
      });
      
      const answer = response.data.answer || "Maaf, saya tidak menemukan data tersebut.";
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Maaf, terjadi kesalahan koneksi server. Silakan coba lagi." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center bg-gradient-to-r from-red-600 to-red-500 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          title="Tanya AI Assistant"
        >
          <FaRobot size={26} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Butuh bantuan data?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[400px] flex flex-col h-[500px] max-h-[80vh] border border-gray-200 animate-fade-in-up overflow-hidden fixed bottom-24 right-6 md:bottom-24 md:right-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaRobot className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Telkom AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-red-100">Online & Ready</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${ 
                    msg.role === 'user'
                      ? 'bg-red-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                          p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                          table: ({node, ...props}) => <div className="overflow-x-auto my-2"><table className="min-w-full text-xs border-collapse" {...props} /></div>,
                          th: ({node, ...props}) => <th className="border px-2 py-1 bg-gray-100 font-bold" {...props} />,
                          td: ({node, ...props}) => <td className="border px-2 py-1" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white p-4 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                  <FaCommentDots className="text-gray-400 animate-pulse" size={20} />
                  <span className="text-xs text-gray-500 font-medium">Sedang menganalisis data...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {!isLoading && messages.length < 10 && (
            <div className="px-4 pb-2 bg-gray-50 overflow-x-auto flex gap-2 no-scrollbar">
              {currentSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="flex-shrink-0 bg-white border border-red-100 text-red-600 text-xs px-3 py-1.5 rounded-full hover:bg-red-50 hover:border-red-200 transition-colors whitespace-nowrap shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 bg-gray-100 text-gray-800 border-0 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-red-100 focus:bg-white transition-all placeholder-gray-400 outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {isLoading ? <FaRedo className="animate-spin" size={14} /> : <FaPaperPlane size={14} />}
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-400 mt-2 flex justify-center items-center gap-1">
              <FaLightbulb className="text-yellow-400" />
              <span>AI dapat membuat kesalahan. Cek kembali data di dashboard.</span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;