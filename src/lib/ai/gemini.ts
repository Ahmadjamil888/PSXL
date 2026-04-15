/**
 * Gemini AI Service for PSX Ledger Pro
 * Provides decision intelligence and behavioral coaching for PSX traders
 *
 * IMPORTANT: This service does NOT provide trading signals.
 * It provides context, behavioral insights, and portfolio-aware analysis.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3-flash-preview";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  if (!GEMINI_API_KEY) {
    return null;
  }
  if (!client) {
    client = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return client;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Trade {
  id?: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  qty: number;
  rate: number;
  date: string;
  charges?: number;
  pl?: number | null;
}

export interface PortfolioHolding {
  symbol: string;
  qty: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPL: number;
}

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  date: string;
  sectors?: string[];
  companies?: string[];
}

export interface AIAnalysisRequest {
  userMessage?: string;
  trades?: Trade[];
  holdings?: PortfolioHolding[];
  news?: NewsItem[];
  behavioralPatterns?: {
    revengeTrading: boolean;
    overtrading: boolean;
    emotionalDecisions: boolean;
    riskManagement: 'good' | 'fair' | 'poor';
  };
  context?: 'morning' | 'during_market' | 'after_market' | 'rule_violation';
}

export interface AIAnalysisResponse {
  message: string;
  insights?: {
    portfolioImpact?: string;
    behavioralInsight?: string;
    riskFactors?: string[];
    recommendations?: string[];
  };
  warnings?: string[];
  isUrgent?: boolean;
}

/**
 * Call Gemini API for AI analysis
 */
async function callGemini(prompt: string): Promise<string> {
  const client = getClient();
  if (!client) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY environment variable.');
  }

  try {
    const model = client.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text() || '';
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

/**
 * Build system prompt for AI Co-Trader
 * This ensures the AI acts as a decision intelligence system, NOT a signal provider
 */
function buildSystemPrompt(request: AIAnalysisRequest): string {
  const { trades, holdings, news, behavioralPatterns, context, userMessage } = request;

  let prompt = `You are an AI Co-Trader for PSX. Role: DECISION INTELLIGENCE, NOT signals.
Rules: No buy/sell signals, no guarantees, cautious language only, focus on interpretation and behavioral correction.
`;

  // Add context
  if (context === 'morning') {
    prompt += `Context: Morning briefing. Today's risk factors.\n`;
  } else if (context === 'during_market') {
    prompt += `Context: Market hours. Alert to unusual activity.\n`;
  } else if (context === 'after_market') {
    prompt += `Context: After close. Review performance and patterns.\n`;
  } else if (context === 'rule_violation') {
    prompt += `Context: Rule violation. Provide behavioral correction.\n`;
  }

  // Add portfolio data (limit to top 5)
  if (holdings && holdings.length > 0) {
    prompt += `Portfolio: `;
    holdings.slice(0, 5).forEach(h => {
      prompt += `${h.symbol}(${h.qty}@${h.avgCost},P/L:${h.unrealizedPL.toFixed(0)}) `;
    });
    prompt += `\n`;
  }

  // Add recent trades (limit to 5)
  if (trades && trades.length > 0) {
    prompt += `Trades: `;
    trades.slice(-5).forEach(t => {
      prompt += `${t.type} ${t.qty} ${t.symbol} @ ${t.rate} `;
    });
    prompt += `\n`;
  }

  // Add behavioral patterns
  if (behavioralPatterns) {
    const patterns = [];
    if (behavioralPatterns.revengeTrading) patterns.push('revenge trading');
    if (behavioralPatterns.overtrading) patterns.push('overtrading');
    if (behavioralPatterns.emotionalDecisions) patterns.push('emotional');
    if (patterns.length > 0) prompt += `Patterns: ${patterns.join(', ')}. Risk: ${behavioralPatterns.riskManagement}\n`;
  }

  // Add news (limit to 2)
  if (news && news.length > 0) {
    prompt += `News: `;
    news.slice(0, 2).forEach(n => {
      prompt += `${n.title} `;
    });
    prompt += `\n`;
  }

  // Add user message
  if (userMessage) {
    prompt += `User: ${userMessage}\n`;
  }

  prompt += `Response: Concise (under 150 words), mentoring tone, cautious guidance.`;

  return prompt;
}

/**
 * Analyze trading situation with AI
 */
export async function analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  try {
    const prompt = buildSystemPrompt(request);
    const response = await callGemini(prompt);

    // Parse response for structured insights
    const insights = {
      portfolioImpact: extractSection(response, 'portfolio impact', 'your holdings'),
      behavioralInsight: extractSection(response, 'behavioral', 'pattern', 'mistake'),
      riskFactors: extractList(response, 'risk', 'factor', 'watch'),
      recommendations: extractList(response, 'recommend', 'suggest', 'consider'),
    };

    const warnings = extractWarnings(response);
    const isUrgent = response.toLowerCase().includes('urgent') || response.toLowerCase().includes('immediately');

    return {
      message: response,
      insights: Object.fromEntries(Object.entries(insights).filter(([_, v]) => v !== null)),
      warnings: warnings.length > 0 ? warnings : undefined,
      isUrgent,
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return {
      message: 'I apologize, but I\'m having trouble connecting to the Gemini AI service right now. Please try again in a moment.',
      isUrgent: false,
    };
  }
}

/**
 * Get morning briefing
 */
export async function getMorningBriefing(holdings?: PortfolioHolding[]): Promise<AIAnalysisResponse> {
  return analyzeWithAI({
    context: 'morning',
    holdings,
  });
}

/**
 * Get rule violation guidance
 */
export async function getRuleViolationGuidance(
  ruleType: 'max_trades' | 'stop_after_losses' | 'revenge_trading',
  behavioralPatterns: AIAnalysisRequest['behavioralPatterns']
): Promise<AIAnalysisResponse> {
  const contextMap = {
    max_trades: 'You\'ve exceeded your daily trade limit.',
    stop_after_losses: 'You\'ve hit your loss limit for the day.',
    revenge_trading: 'You\'re showing signs of revenge trading.',
  };

  return analyzeWithAI({
    context: 'rule_violation',
    behavioralPatterns,
    userMessage: contextMap[ruleType],
  });
}

/**
 * Analyze news impact on portfolio
 */
export async function analyzeNewsImpact(
  news: NewsItem[],
  holdings: PortfolioHolding[]
): Promise<AIAnalysisResponse> {
  return analyzeWithAI({
    context: 'during_market',
    news,
    holdings,
  });
}

/**
 * Get behavioral analysis
 */
export async function getBehavioralAnalysis(
  trades: Trade[],
  behavioralPatterns: AIAnalysisRequest['behavioralPatterns']
): Promise<AIAnalysisResponse> {
  return analyzeWithAI({
    context: 'after_market',
    trades,
    behavioralPatterns,
  });
}

// Helper functions for parsing AI responses
function extractSection(text: string, ...keywords: string[]): string | null {
  const lowerText = text.toLowerCase();
  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword.toLowerCase());
    if (index !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(text.length, index + 200);
      return text.slice(start, end).trim();
    }
  }
  return null;
}

function extractList(text: string, ...keywords: string[]): string[] {
  const items: string[] = [];
  const lines = text.split('\n');
  let inList = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (keywords.some(k => lowerLine.includes(k))) {
      inList = true;
    }
    if (inList && (line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))) {
      items.push(line.replace(/^[-•*]\s*/, '').trim());
    }
    if (inList && line.trim() === '') {
      inList = false;
    }
  }

  return items;
}

function extractWarnings(text: string): string[] {
  const warnings: string[] = [];
  const lowerText = text.toLowerCase();
  const warningKeywords = ['warning', 'caution', 'alert', 'be careful', 'risk'];

  const lines = text.split('\n');
  for (const line of lines) {
    if (warningKeywords.some(k => lowerText.includes(k))) {
      warnings.push(line.trim());
    }
  }

  return warnings;
}
