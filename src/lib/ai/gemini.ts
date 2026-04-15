/**
 * Gemini AI Service for PSX Ledger Pro
 * Provides decision intelligence and behavioral coaching for PSX traders
 *
 * IMPORTANT: This service does NOT provide trading signals.
 * It provides context, behavioral insights, and portfolio-aware analysis.
 */

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3-flash-preview";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  if (!GEMINI_API_KEY) {
    return null;
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
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
 * Call Gemini API for AI analysis with streaming support
 */
async function callGemini(prompt: string, onChunk?: (chunk: string) => void): Promise<string> {
  const client = getClient();
  if (!client) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY environment variable.');
  }

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    const text = response.text || '';
    if (onChunk) {
      onChunk(text);
    }
    return text;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

/**
 * Call Gemini API with streaming
 */
export async function analyzeWithAIStreaming(
  request: AIAnalysisRequest,
  onChunk: (chunk: string) => void
): Promise<AIAnalysisResponse> {
  try {
    const prompt = buildSystemPrompt(request);
    const response = await callGemini(prompt, onChunk);

    // Strip markdown formatting
    const cleanResponse = stripMarkdown(response);

    // Parse response for structured insights
    const insights = {
      portfolioImpact: extractSection(cleanResponse, 'portfolio impact', 'your holdings'),
      behavioralInsight: extractSection(cleanResponse, 'behavioral', 'pattern', 'mistake'),
      riskFactors: extractList(cleanResponse, 'risk', 'factor', 'watch'),
      recommendations: extractList(cleanResponse, 'recommend', 'suggest', 'consider'),
    };

    const warnings = extractWarnings(cleanResponse);
    const isUrgent = cleanResponse.toLowerCase().includes('urgent') || cleanResponse.toLowerCase().includes('immediately');

    return {
      message: cleanResponse,
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

  prompt += `Response: Ultra-concise (under 100 words), plain text (no markdown), mentoring tone, cautious guidance. No bold formatting.`;

  return prompt;
}

/**
 * Strip markdown formatting from text
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/__/g, '')
    .replace(/_/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}/g, '')
    .trim();
}

/**
 * Data Context Manager - maintains cached user data for AI
 */
class DataContextManager {
  private cachedTrades: Trade[] = [];
  private cachedHoldings: PortfolioHolding[] = [];
  private lastSync: Date | null = null;
  private syncInterval: number = 60000; // 1 minute
  private syncTimer: NodeJS.Timeout | null = null;

  /**
   * Update cached data
   */
  updateData(trades: Trade[], holdings: PortfolioHolding[]) {
    this.cachedTrades = trades;
    this.cachedHoldings = holdings;
    this.lastSync = new Date();
  }

  /**
   * Get cached data
   */
  getData() {
    return {
      trades: this.cachedTrades,
      holdings: this.cachedHoldings,
      lastSync: this.lastSync,
    };
  }

  /**
   * Start automatic sync (for future implementation with data fetchers)
   */
  startAutoSync(fetchData: () => Promise<{ trades: Trade[]; holdings: PortfolioHolding[] }>) {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(async () => {
      try {
        const data = await fetchData();
        this.updateData(data.trades, data.holdings);
      } catch (error) {
        console.error('Auto sync failed:', error);
      }
    }, this.syncInterval);
  }

  /**
   * Stop auto sync
   */
  stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
}

// Global data context instance
export const dataContext = new DataContextManager();

/**
 * Analyze trading situation with AI
 */
export async function analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  try {
    const prompt = buildSystemPrompt(request);
    const response = await callGemini(prompt);

    // Strip markdown formatting
    const cleanResponse = stripMarkdown(response);

    // Parse response for structured insights
    const insights = {
      portfolioImpact: extractSection(cleanResponse, 'portfolio impact', 'your holdings'),
      behavioralInsight: extractSection(cleanResponse, 'behavioral', 'pattern', 'mistake'),
      riskFactors: extractList(cleanResponse, 'risk', 'factor', 'watch'),
      recommendations: extractList(cleanResponse, 'recommend', 'suggest', 'consider'),
    };

    const warnings = extractWarnings(cleanResponse);
    const isUrgent = cleanResponse.toLowerCase().includes('urgent') || cleanResponse.toLowerCase().includes('immediately');

    return {
      message: cleanResponse,
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
 * Analyze news impact on portfolio with automatic recommendations
 */
export async function analyzeNewsImpact(
  news: NewsItem[],
  holdings: PortfolioHolding[]
): Promise<AIAnalysisResponse> {
  // Check if news is relevant to user's holdings
  const userSymbols = holdings.map(h => h.symbol.toLowerCase());

  // Build prompt with emphasis on actionability
  const prompt = `You are an AI Co-Trader for PSX. Analyze news and provide actionable insights.

User Holdings: ${holdings.map(h => `${h.symbol}(${h.qty} shares)`).join(', ')}

Recent News:
${news.slice(0, 3).map(n => `- ${n.title}: ${n.summary}`).join('\n')}

Analyze if any news affects user's holdings. If news is negative for a holding, suggest reviewing position. If positive, note potential opportunity. Be specific about which companies are affected and why.

Response: Ultra-concise (under 100 words), plain text (no markdown), actionable, specific to user's holdings.`;

  try {
    const response = await callGemini(prompt);
    const cleanResponse = stripMarkdown(response);

    // Extract action items
    const actionItems = extractList(cleanResponse, 'sell', 'buy', 'review', 'consider', 'action');

    const isUrgent = cleanResponse.toLowerCase().includes('urgent') ||
                     cleanResponse.toLowerCase().includes('immediately') ||
                     cleanResponse.toLowerCase().includes('sell');

    return {
      message: cleanResponse,
      insights: {
        recommendations: actionItems.length > 0 ? actionItems : undefined,
      },
      warnings: isUrgent ? [cleanResponse] : undefined,
      isUrgent,
    };
  } catch (error) {
    console.error('News analysis failed:', error);
    return {
      message: 'Unable to analyze news impact at this time.',
      isUrgent: false,
    };
  }
}

/**
 * Get automatic news alert for breaking news
 */
export async function getNewsAlert(
  news: NewsItem[],
  holdings: PortfolioHolding[]
): Promise<{ message: string; isUrgent: boolean; affectedSymbols: string[] }> {
  const userSymbols = holdings.map(h => h.symbol.toLowerCase());

  const prompt = `Breaking news analysis for PSX trader.

User Holdings: ${holdings.map(h => `${h.symbol}`).join(', ')}

Breaking News:
${news.slice(0, 2).map(n => `- ${n.title}: ${n.summary}`).join('\n')}

Determine if this news is URGENT for the user. If news affects any of their holdings significantly, mark as urgent. Identify which specific companies are affected.

Response: Ultra-concise (under 80 words), plain text. Start with URGENT: if urgent, INFO: if not.`;

  try {
    const response = await callGemini(prompt);
    const cleanResponse = stripMarkdown(response);

    const isUrgent = cleanResponse.toLowerCase().startsWith('urgent:');
    const affectedSymbols = holdings
      .filter(h => cleanResponse.toLowerCase().includes(h.symbol.toLowerCase()))
      .map(h => h.symbol);

    return {
      message: cleanResponse,
      isUrgent,
      affectedSymbols,
    };
  } catch (error) {
    console.error('News alert failed:', error);
    return {
      message: 'Unable to generate news alert.',
      isUrgent: false,
      affectedSymbols: [],
    };
  }
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
