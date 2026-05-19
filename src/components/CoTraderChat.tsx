import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Send, X, Minimize2, Maximize2, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AIAnalysisRequest } from '@/lib/ai/gemini';

const QUICK_PROMPTS = [
  "What is the biggest problem in my account?",
  "Which habit is hurting my results most?",
  "What should I review before my next trade?",
];

export default function CoTraderChat({ context }: { context?: Partial<AIAnalysisRequest> }) {
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
    await sendMessage(message, context);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold transition-all"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)", borderColor: "var(--accent)", boxShadow: 'var(--shadow-soft)' }}
      >
        <Bot className="w-6 h-6" />
        <span>Toggle AI Chat</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">AI Co-Trader</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-1.5 transition-colors hover:bg-black/10"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              clearChat();
            }}
            className="rounded-lg p-1.5 transition-colors hover:bg-black/10"
          >
            <X className="w-4 h-4" />
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
            <div className="h-80 space-y-4 overflow-y-auto p-4" style={{ background: "var(--bg-card-hover)" }}>
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="mx-auto mb-3 h-12 w-12 text-[var(--brand)]" />
                  <p className="mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>Hi, I'm your AI Co-Trader</p>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>I can read your trades, holdings, and behavior tags to surface account-level analysis.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt, context)}
                        disabled={isLoading}
                        className="rounded-full border px-3 py-2 text-[11px] transition-colors disabled:opacity-60"
                        style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)" }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
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
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: message.role === 'user' ? "var(--info)" : "var(--brand)" }}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className="max-w-[75%] rounded-2xl px-4 py-2"
                    style={{
                      background: message.role === 'user' ? "var(--info)" : "var(--bg-card)",
                      color: message.role === 'user' ? "#ffffff" : "var(--text)",
                      border: message.role === 'user' ? "none" : "1px solid var(--border)",
                    }}
                  >
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
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--brand)" }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="rounded-2xl px-4 py-3" style={{ background: "var(--bg-card)" }}>
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--brand)]" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t p-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your trading..."
                  disabled={isLoading}
                  className="input-field flex-1 rounded-xl px-4 py-2 text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl p-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: "var(--brand)" }}
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
