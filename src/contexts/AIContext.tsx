import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AIMessage, 
  AIAnalysisRequest, 
  AIAnalysisResponse,
  getMorningBriefing,
  getRuleViolationGuidance,
  analyzeNewsImpact,
  getBehavioralAnalysis,
  analyzeWithAI
} from '@/lib/ai/gemini';

interface AIContextType {
  messages: AIMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  getMorningUpdate: () => Promise<void>;
  clearChat: () => void;
  lastUpdate: Date | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    
    // Add user message
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await analyzeWithAI({
        userMessage: content,
      });

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMorningUpdate = async () => {
    setIsLoading(true);
    
    try {
      const response = await getMorningBriefing();
      
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      setMessages(prev => [assistantMessage]);
      setLastUpdate(new Date());
    } catch (error) {
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: 'Good morning! I\'m having trouble connecting right now, but I\'ll be back shortly.',
        timestamp: new Date(),
      };
      setMessages(prev => [errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <AIContext.Provider 
      value={{ 
        messages, 
        isLoading, 
        sendMessage, 
        getMorningUpdate,
        clearChat,
        lastUpdate,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
