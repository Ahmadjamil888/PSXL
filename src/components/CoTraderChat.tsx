import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Send, X, Minimize2, Maximize2, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoTraderChat() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        style={{ boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)' }}
      >
        <Bot className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#2a2a2a] overflow-hidden"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <span className="text-white font-semibold">AI Co-Trader</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4 text-white" /> : <Minimize2 className="w-4 h-4 text-white" />}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              clearChat();
            }}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="flex flex-col"
          >
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#141414]">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-2">Hi, I'm your AI Co-Trader</p>
                  <p className="text-gray-500 text-xs">Ask me about your portfolio, trading patterns, or get behavioral coaching.</p>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#2a2a2a] text-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#2a2a2a] rounded-2xl px-4 py-3">
                    <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-[#1a1a1a] border-t border-[#2a2a2a]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your trading..."
                  disabled={isLoading}
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
