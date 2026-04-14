import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AIMessage, analyzeWithAI, AIAnalysisRequest } from '@/lib/ai/gemini';

interface ChatContextType {
  messages: AIMessage[];
  isLoading: boolean;
  sendMessage: (content: string, context?: Partial<AIAnalysisRequest>) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string, context?: Partial<AIAnalysisRequest>) => {
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await analyzeWithAI({
        userMessage: content,
        ...context,
      });

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
