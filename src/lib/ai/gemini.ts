/**
 * Gemini AI Service for PSX Ledger Pro
 * Provides decision intelligence and behavioral coaching for PSX traders
 * 
 * IMPORTANT: This service does NOT provide trading signals.
 * It provides context, behavioral insights, and portfolio-aware analysis.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

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
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY environment variable.');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
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

  let prompt = `You are an AI Co-Trader for PSX (Pakistan Stock Exchange). Your role is DECISION INTELLIGENCE, NOT trading signals.

CRITICAL RULES:
1. NEVER give direct buy/sell signals like "Buy XYZ now" or "Sell ABC immediately"
2. NEVER guarantee outcomes or profits
3. ALWAYS use cautious language: "This may impact...", "Historically, this leads to...", "Consider reviewing..."
4. Focus on interpretation, personalization, and behavioral correction
5. You are a smart analyst + disciplined mentor + news interpreter

Your expertise:
- PSX-specific market dynamics
- Pakistani economic factors
- Behavioral finance patterns
- Risk management principles
- Market impact analysis

`;

  // Add context
  if (context === 'morning') {
    prompt += `CURRENT CONTEXT: Morning briefing. Provide today's risk factors and what to watch for.\n\n`;
  } else if (context === 'during_market') {
    prompt += `CURRENT CONTEXT: During market hours. Alert to unusual activity or breaking news.\n\n`;
  } else if (context === 'after_market') {
    prompt += `CURRENT CONTEXT: After market close. Review performance and behavioral patterns.\n\n`;
  } else if (context === 'rule_violation') {
    prompt += `CURRENT CONTEXT: Rule violation detected. Provide behavioral correction and guidance.\n\n`;
  }

  // Add portfolio data
  if (holdings && holdings.length > 0) {
    prompt += `USER'S CURRENT PORTFOLIO:\n`;
    holdings.forEach(h => {
      prompt += `- ${h.symbol}: ${h.qty} shares @ avg ${h.avgCost}, current ${h.currentPrice}, P/L: ${h.unrealizedPL > 0 ? '+' : ''}${h.unrealizedPL.toFixed(2)}\n`;
    });
    prompt += `\n`;
  }

  // Add recent trades
  if (trades && trades.length > 0) {
    prompt += `RECENT TRADES (last 10):\n`;
    trades.slice(-10).forEach(t => {
      prompt += `- ${t.date}: ${t.type} ${t.qty} ${t.symbol} @ ${t.rate}`;
      if (t.pl !== null) prompt += ` (P/L: ${t.pl > 0 ? '+' : ''}${t.pl})`;
      prompt += `\n`;
    });
    prompt += `\n`;
  }

  // Add behavioral patterns
  if (behavioralPatterns) {
    prompt += `BEHAVIORAL PATTERNS DETECTED:\n`;
    if (behavioralPatterns.revengeTrading) prompt += `- Revenge trading: YES (trading after losses)\n`;
    if (behavioralPatterns.overtrading) prompt += `- Overtrading: YES (excessive trading frequency)\n`;
    if (behavioralPatterns.emotionalDecisions) prompt += `- Emotional decisions: YES\n`;
    prompt += `- Risk management: ${behavioralPatterns.riskManagement.toUpperCase()}\n`;
    prompt += `\n`;
  }

  // Add news
  if (news && news.length > 0) {
    prompt += `RELEVANT NEWS:\n`;
    news.forEach(n => {
      prompt += `- ${n.title}\n  ${n.summary}\n  Source: ${n.source}, Date: ${n.date}\n`;
      if (n.sectors) prompt += `  Sectors: ${n.sectors.join(', ')}\n`;
      if (n.companies) prompt += `  Companies: ${n.companies.join(', ')}\n`;
    });
    prompt += `\n`;
  }

  // Add user message
  if (userMessage) {
    prompt += `USER MESSAGE: ${userMessage}\n\n`;
  }

  prompt += `Provide a helpful, personalized response that:
1. Interprets the situation clearly
2. Connects news/market events to their portfolio if relevant
3. Addresses behavioral patterns if they exist
4. Offers actionable but cautious guidance
5. Uses the "Why this matters to YOU" approach

Keep responses concise (under 200 words), direct, and mentoring in tone. Avoid jargon where possible.`;

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
      message: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
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
