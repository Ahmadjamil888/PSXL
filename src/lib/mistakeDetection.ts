export interface Trade {
  id: string;
  user_id: string;
  account_id: string | null;
  date: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  fees: number | null;
  note: string | null;
}

export interface MistakePattern {
  type: 'revenge_trading' | 'overtrading' | 'emotional_decision' | 'no_stop_loss' | 'overexposure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  trades: Trade[];
  timestamp: Date;
  recommendation: string;
}

export interface MistakeReport {
  patterns: MistakePattern[];
  overallScore: number; // 0-100, lower is worse
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
}

/**
 * Detect revenge trading patterns
 * Revenge trading: Making trades immediately after losses to "make it back"
 */
function detectRevengeTrading(trades: Trade[]): MistakePattern | null {
  const revengeTrades: Trade[] = [];
  
  for (let i = 1; i < trades.length; i++) {
    const currentTrade = trades[i];
    const previousTrade = trades[i - 1];
    
    // Calculate P&L for previous trade
    const prevPnL = calculateTradePnL(previousTrade);
    
    // If previous trade was a loss and current trade is within 30 minutes
    if (prevPnL && prevPnL < 0) {
      const prevTime = new Date(previousTrade.date).getTime();
      const currTime = new Date(currentTrade.date).getTime();
      const timeDiff = currTime - prevTime;
      
      // Within 30 minutes (1800000 ms)
      if (timeDiff < 1800000) {
        revengeTrades.push(currentTrade);
      }
    }
  }
  
  if (revengeTrades.length === 0) return null;
  
  const severity = revengeTrades.length >= 5 ? 'critical' : 
                   revengeTrades.length >= 3 ? 'high' : 
                   revengeTrades.length >= 2 ? 'medium' : 'low';
  
  return {
    type: 'revenge_trading',
    severity,
    description: `Detected ${revengeTrades.length} instances of revenge trading - trading immediately after losses to recover money.`,
    trades: revengeTrades,
    timestamp: new Date(),
    recommendation: severity === 'critical' || severity === 'high' 
      ? 'STOP TRADING TODAY. You\'re emotional and will likely lose more. Take a break.'
      : 'Be aware of your emotions. Take a 15-minute break after each loss.'
  };
}

/**
 * Detect overtrading patterns
 * Overtrading: Excessive number of trades in a short period
 */
function detectOvertrading(trades: Trade[]): MistakePattern | null {
  // Group trades by date
  const tradesByDate = new Map<string, Trade[]>();
  
  trades.forEach(trade => {
    const date = trade.date.split('T')[0];
    if (!tradesByDate.has(date)) {
      tradesByDate.set(date, []);
    }
    tradesByDate.get(date)!.push(trade);
  });
  
  // Find days with excessive trading (more than 10 trades/day)
  const overtradingDays: { date: string; trades: Trade[] }[] = [];
  
  tradesByDate.forEach((dayTrades, date) => {
    if (dayTrades.length > 10) {
      overtradingDays.push({ date, trades: dayTrades });
    }
  });
  
  if (overtradingDays.length === 0) return null;
  
  const allOvertrades = overtradingDays.flatMap(d => d.trades);
  const severity = overtradingDays.length >= 3 ? 'critical' : 
                   overtradingDays.length >= 2 ? 'high' : 'medium';
  
  return {
    type: 'overtrading',
    severity,
    description: `Detected overtrading on ${overtradingDays.length} day(s) with ${allOvertrades.length} total trades. Excessive trading often leads to poor decisions.`,
    trades: allOvertrades,
    timestamp: new Date(),
    recommendation: 'Limit yourself to 3-5 quality trades per day. Quality over quantity.'
  };
}

/**
 * Detect emotional decisions
 * Emotional decisions: Large position sizes or frequent direction changes
 */
function detectEmotionalDecisions(trades: Trade[]): MistakePattern | null {
  const emotionalTrades: Trade[] = [];
  
  for (let i = 1; i < trades.length; i++) {
    const currentTrade = trades[i];
    const previousTrade = trades[i - 1];
    
    // Check for direction flip (buy after sell or sell after buy) within short time
    if (currentTrade.symbol === previousTrade.symbol && 
        currentTrade.side !== previousTrade.side) {
      const prevTime = new Date(previousTrade.date).getTime();
      const currTime = new Date(currentTrade.date).getTime();
      const timeDiff = currTime - prevTime;
      
      // Direction flip within 1 hour
      if (timeDiff < 3600000) {
        emotionalTrades.push(currentTrade);
      }
    }
    
    // Check for unusually large position (more than 2x average)
    const avgQty = trades.reduce((sum, t) => sum + t.quantity, 0) / trades.length;
    if (currentTrade.quantity > avgQty * 2) {
      emotionalTrades.push(currentTrade);
    }
  }
  
  if (emotionalTrades.length === 0) return null;
  
  const severity = emotionalTrades.length >= 5 ? 'high' : 'medium';
  
  return {
    type: 'emotional_decision',
    severity,
    description: `Detected ${emotionalTrades.length} potentially emotional trades - large positions or rapid direction changes.`,
    trades: emotionalTrades,
    timestamp: new Date(),
    recommendation: 'Stick to your position sizing rules. Never trade based on emotion.'
  };
}

/**
 * Detect missing stop losses
 * No stop loss: Trades without proper risk management
 */
function detectNoStopLoss(trades: Trade[]): MistakePattern | null {
  // This would require additional data about stop losses
  // For now, we'll flag trades with very large position sizes relative to portfolio
  const riskyTrades: Trade[] = [];
  
  trades.forEach(trade => {
    // Flag trades with very large quantities (potential overexposure)
    if (trade.quantity > 10000) { // Arbitrary threshold
      riskyTrades.push(trade);
    }
  });
  
  if (riskyTrades.length === 0) return null;
  
  const severity = riskyTrades.length >= 3 ? 'high' : 'medium';
  
  return {
    type: 'no_stop_loss',
    severity,
    description: `Detected ${riskyTrades.length} trades with potentially inadequate risk management.`,
    trades: riskyTrades,
    timestamp: new Date(),
    recommendation: 'Always use stop losses. Risk no more than 1-2% per trade.'
  };
}

/**
 * Detect overexposure
 * Overexposure: Too much capital in single position
 */
function detectOverexposure(trades: Trade[]): MistakePattern | null {
  // Calculate position sizes by symbol
  const positionSizes = new Map<string, { totalQty: number; totalValue: number }>();
  
  trades.forEach(trade => {
    const current = positionSizes.get(trade.symbol) || { totalQty: 0, totalValue: 0 };
    const tradeValue = trade.quantity * trade.entry_price;
    
    positionSizes.set(trade.symbol, {
      totalQty: current.totalQty + trade.quantity,
      totalValue: current.totalValue + tradeValue
    });
  });
  
  // Find positions with >30% of total value
  const totalValue = Array.from(positionSizes.values()).reduce((sum, p) => sum + p.totalValue, 0);
  const overexposedSymbols: { symbol: string; percentage: number; trades: Trade[] }[] = [];
  
  positionSizes.forEach((data, symbol) => {
    const percentage = (data.totalValue / totalValue) * 100;
    if (percentage > 30) {
      const symbolTrades = trades.filter(t => t.symbol === symbol);
      overexposedSymbols.push({ symbol, percentage, trades: symbolTrades });
    }
  });
  
  if (overexposedSymbols.length === 0) return null;
  
  const allOverexposedTrades = overexposedSymbols.flatMap(s => s.trades);
  const severity = overexposedSymbols.some(s => s.percentage > 50) ? 'critical' : 'high';
  
  return {
    type: 'overexposure',
    severity,
    description: `Detected overexposure in ${overexposedSymbols.length} position(s). Concentration risk is dangerously high.`,
    trades: allOverexposedTrades,
    timestamp: new Date(),
    recommendation: 'Diversify. Never put more than 20-25% of your capital in one position.'
  };
}

/**
 * Helper function to calculate trade P&L
 */
function calculateTradePnL(trade: Trade): number | null {
  if (trade.side === 'buy') return null; // Open position, no P&L yet
  if (!trade.exit_price) return null; // Not closed
  
  // Simplified P&L calculation
  const buyPrice = trade.entry_price;
  const sellPrice = trade.exit_price;
  const pnl = (sellPrice - buyPrice) * trade.quantity - (trade.fees || 0);
  
  return pnl;
}

/**
 * Generate comprehensive mistake report
 */
export function generateMistakeReport(trades: Trade[]): MistakeReport {
  if (trades.length === 0) {
    return {
      patterns: [],
      overallScore: 100,
      riskLevel: 'low',
      summary: 'No trades to analyze. Start logging your trades to get behavioral insights.'
    };
  }
  
  const patterns: MistakePattern[] = [];
  
  // Run all detection algorithms
  const revengeTrading = detectRevengeTrading(trades);
  const overtrading = detectOvertrading(trades);
  const emotionalDecisions = detectEmotionalDecisions(trades);
  const noStopLoss = detectNoStopLoss(trades);
  const overexposure = detectOverexposure(trades);
  
  if (revengeTrading) patterns.push(revengeTrading);
  if (overtrading) patterns.push(overtrading);
  if (emotionalDecisions) patterns.push(emotionalDecisions);
  if (noStopLoss) patterns.push(noStopLoss);
  if (overexposure) patterns.push(overexposure);
  
  // Calculate overall score
  let score = 100;
  patterns.forEach(pattern => {
    const severityScore = pattern.severity === 'critical' ? 30 :
                         pattern.severity === 'high' ? 20 :
                         pattern.severity === 'medium' ? 10 : 5;
    score -= severityScore;
  });
  
  score = Math.max(0, score);
  
  // Determine risk level
  const riskLevel = score >= 80 ? 'low' :
                   score >= 60 ? 'medium' :
                   score >= 40 ? 'high' : 'critical';
  
  // Generate summary
  let summary = '';
  if (patterns.length === 0) {
    summary = 'No major behavioral issues detected. Keep up the disciplined trading.';
  } else {
    const criticalCount = patterns.filter(p => p.severity === 'critical').length;
    const highCount = patterns.filter(p => p.severity === 'high').length;
    
    if (criticalCount > 0) {
      summary = `CRITICAL: ${criticalCount} critical behavioral issue(s) detected. Immediate action required.`;
    } else if (highCount > 0) {
      summary = `${highCount} serious behavioral issue(s) detected. Address them before they become critical.`;
    } else {
      summary = `${patterns.length} behavioral pattern(s) detected. Room for improvement in trading discipline.`;
    }
  }
  
  return {
    patterns,
    overallScore: score,
    riskLevel,
    summary
  };
}
