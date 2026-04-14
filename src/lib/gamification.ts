import { Trade } from '@/lib/mistakeDetection';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
}

export interface Streak {
  type: 'daily_login' | 'disciplined_trading' | 'no_revenge_trading' | 'winning_streak';
  current: number;
  best: number;
  lastUpdate: Date;
}

export interface GamificationProfile {
  disciplineScore: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: Badge[];
  streaks: Streak[];
  totalTrades: number;
  totalWins: number;
  totalLosses: number;
}

// Badge definitions
export const BADGE_DEFINITIONS: Omit<Badge, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Log your first trade',
    icon: '🎯',
  },
  {
    id: 'ten_trades',
    name: 'Getting Started',
    description: 'Log 10 trades',
    icon: '📊',
    target: 10,
  },
  {
    id: 'fifty_trades',
    name: 'Consistent Trader',
    description: 'Log 50 trades',
    icon: '📈',
    target: 50,
  },
  {
    id: 'hundred_trades',
    name: 'Experienced Trader',
    description: 'Log 100 trades',
    icon: '🏆',
    target: 100,
  },
  {
    id: 'first_profit',
    name: 'First Profit',
    description: 'Make your first profitable trade',
    icon: '💰',
  },
  {
    id: 'five_win_streak',
    name: 'Hot Streak',
    description: 'Win 5 trades in a row',
    icon: '🔥',
    target: 5,
  },
  {
    id: 'ten_win_streak',
    name: 'On Fire',
    description: 'Win 10 trades in a row',
    icon: '⚡',
    target: 10,
  },
  {
    id: 'disciplined_week',
    name: 'Disciplined Week',
    description: 'Go a week without revenge trading',
    icon: '🎖️',
  },
  {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: 'End a trading day with only wins',
    icon: '✨',
  },
  {
    id: 'risk_master',
    name: 'Risk Master',
    description: 'Maintain discipline score above 80 for 30 days',
    icon: '🛡️',
  },
  {
    id: 'loss_acceptor',
    name: 'Loss Acceptor',
    description: 'Accept a loss without revenge trading 10 times',
    icon: '🧘',
    target: 10,
  },
  {
    id: 'journal_keeper',
    name: 'Journal Keeper',
    description: 'Add notes to 50 trades',
    icon: '📝',
    target: 50,
  },
];

/**
 * Calculate discipline score based on trading behavior
 */
export function calculateDisciplineScore(trades: Trade[]): number {
  if (trades.length === 0) return 100;

  let score = 100;

  // Penalty for revenge trading (trades within 30 minutes of a loss)
  for (let i = 1; i < trades.length; i++) {
    const currentTrade = trades[i];
    const previousTrade = trades[i - 1];

    if (previousTrade.side === 'sell' && previousTrade.exit_price) {
      const prevPnL = (previousTrade.exit_price - previousTrade.entry_price) * previousTrade.quantity;
      
      if (prevPnL < 0) {
        const prevTime = new Date(previousTrade.date).getTime();
        const currTime = new Date(currentTrade.date).getTime();
        const timeDiff = currTime - prevTime;

        if (timeDiff < 1800000) { // Within 30 minutes
          score -= 5;
        }
      }
    }
  }

  // Penalty for overtrading (more than 10 trades in a day)
  const tradesByDate = new Map<string, Trade[]>();
  trades.forEach(trade => {
    const date = trade.date.split('T')[0];
    if (!tradesByDate.has(date)) {
      tradesByDate.set(date, []);
    }
    tradesByDate.get(date)!.push(trade);
  });

  tradesByDate.forEach(dayTrades => {
    if (dayTrades.length > 10) {
      score -= (dayTrades.length - 10) * 2;
    }
  });

  // Bonus for win rate above 50%
  const wins = trades.filter(t => t.side === 'sell' && t.exit_price && 
    (t.exit_price - t.entry_price) * t.quantity > 0).length;
  const closedTrades = trades.filter(t => t.side === 'sell' && t.exit_price).length;
  
  if (closedTrades > 0) {
    const winRate = (wins / closedTrades) * 100;
    if (winRate > 50) {
      score += Math.min((winRate - 50) / 5, 10);
    }
  }

  // Bonus for trade notes (shows discipline)
  const tradesWithNotes = trades.filter(t => t.note && t.note.trim().length > 0).length;
  if (tradesWithNotes > 0) {
    score += Math.min(tradesWithNotes / 10, 5);
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate level based on XP
 */
export function calculateLevel(xp: number): { level: number; xpToNextLevel: number } {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpToNextLevel = xpForNextLevel - xp;

  return { level, xpToNextLevel };
}

/**
 * Calculate XP for a trade
 */
export function calculateTradeXP(trade: Trade, previousTrades: Trade[]): number {
  let xp = 10; // Base XP for logging a trade

  // Bonus for profitable trade
  if (trade.side === 'sell' && trade.exit_price) {
    const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
    if (pnl > 0) {
      xp += 20;
    }
  }

  // Bonus for adding notes
  if (trade.note && trade.note.trim().length > 0) {
    xp += 5;
  }

  // Check for streak bonus
  const recentTrades = previousTrades.slice(-5);
  if (recentTrades.length >= 5) {
    const allWins = recentTrades.every(t => 
      t.side === 'sell' && t.exit_price && 
      (t.exit_price - t.entry_price) * t.quantity > 0
    );
    if (allWins) {
      xp += 15;
    }
  }

  return xp;
}

/**
 * Check and unlock badges
 */
export function checkBadges(trades: Trade[], currentBadges: Badge[]): Badge[] {
  const unlockedIds = new Set(currentBadges.filter(b => b.unlocked).map(b => b.id));
  const updatedBadges = [...currentBadges];

  BADGE_DEFINITIONS.forEach(definition => {
    if (unlockedIds.has(definition.id)) return;

    let unlocked = false;
    let progress = 0;

    switch (definition.id) {
      case 'first_trade':
        unlocked = trades.length >= 1;
        progress = Math.min(trades.length, 1);
        break;
      case 'ten_trades':
        unlocked = trades.length >= 10;
        progress = trades.length;
        break;
      case 'fifty_trades':
        unlocked = trades.length >= 50;
        progress = trades.length;
        break;
      case 'hundred_trades':
        unlocked = trades.length >= 100;
        progress = trades.length;
        break;
      case 'first_profit':
        unlocked = trades.some(t => 
          t.side === 'sell' && t.exit_price && 
          (t.exit_price - t.entry_price) * t.quantity > 0
        );
        break;
      case 'five_win_streak':
      case 'ten_win_streak':
        const target = definition.target || 5;
        let currentStreak = 0;
        let maxStreak = 0;
        
        for (const trade of trades) {
          if (trade.side === 'sell' && trade.exit_price) {
            const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
            if (pnl > 0) {
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else {
              currentStreak = 0;
            }
          }
        }
        
        unlocked = maxStreak >= target;
        progress = maxStreak;
        break;
      case 'loss_acceptor':
        let lossAcceptances = 0;
        for (let i = 1; i < trades.length; i++) {
          const prevTrade = trades[i - 1];
          if (prevTrade.side === 'sell' && prevTrade.exit_price) {
            const prevPnL = (prevTrade.exit_price - prevTrade.entry_price) * prevTrade.quantity;
            if (prevPnL < 0) {
              const prevTime = new Date(prevTrade.date).getTime();
              const currTime = new Date(trades[i].date).getTime();
              // If no revenge trading (waited more than 30 minutes)
              if (currTime - prevTime >= 1800000) {
                lossAcceptances++;
              }
            }
          }
        }
        unlocked = lossAcceptances >= (definition.target || 10);
        progress = lossAcceptances;
        break;
      case 'journal_keeper':
        const tradesWithNotes = trades.filter(t => t.note && t.note.trim().length > 0).length;
        unlocked = tradesWithNotes >= (definition.target || 50);
        progress = tradesWithNotes;
        break;
    }

    const existingBadge = updatedBadges.find(b => b.id === definition.id);
    if (existingBadge) {
      if (unlocked && !existingBadge.unlocked) {
        existingBadge.unlocked = true;
        existingBadge.unlockedAt = new Date();
      }
      existingBadge.progress = progress;
    } else {
      updatedBadges.push({
        ...definition,
        unlocked,
        unlockedAt: unlocked ? new Date() : undefined,
        progress,
      });
    }
  });

  return updatedBadges;
}

/**
 * Update streaks
 */
export function updateStreaks(
  trades: Trade[],
  currentStreaks: Streak[],
  today: Date = new Date()
): Streak[] {
  const updatedStreaks = [...currentStreaks];

  // Daily login streak
  const dailyLoginStreak = updatedStreaks.find(s => s.type === 'daily_login');
  if (dailyLoginStreak) {
    const lastUpdate = new Date(dailyLoginStreak.lastUpdate);
    const daysDiff = Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      dailyLoginStreak.current++;
      dailyLoginStreak.best = Math.max(dailyLoginStreak.best, dailyLoginStreak.current);
    } else if (daysDiff > 1) {
      dailyLoginStreak.current = 1;
    }
    dailyLoginStreak.lastUpdate = today;
  }

  // Winning streak
  const winningStreak = updatedStreaks.find(s => s.type === 'winning_streak');
  if (winningStreak) {
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (const trade of trades) {
      if (trade.side === 'sell' && trade.exit_price) {
        const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
        if (pnl > 0) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
    }
    
    winningStreak.current = currentStreak;
    winningStreak.best = Math.max(winningStreak.best, maxStreak);
    winningStreak.lastUpdate = today;
  }

  return updatedStreaks;
}

/**
 * Get complete gamification profile
 */
export function getGamificationProfile(
  trades: Trade[],
  currentXP: number = 0,
  currentBadges: Badge[] = [],
  currentStreaks: Streak[] = []
): GamificationProfile {
  const disciplineScore = calculateDisciplineScore(trades);
  const { level, xpToNextLevel } = calculateLevel(currentXP);
  const updatedBadges = checkBadges(trades, currentBadges);
  const updatedStreaks = updateStreaks(trades, currentStreaks);

  const totalWins = trades.filter(t => 
    t.side === 'sell' && t.exit_price && 
    (t.exit_price - t.entry_price) * t.quantity > 0
  ).length;

  const totalLosses = trades.filter(t => 
    t.side === 'sell' && t.exit_price && 
    (t.exit_price - t.entry_price) * t.quantity < 0
  ).length;

  return {
    disciplineScore,
    level,
    xp: currentXP,
    xpToNextLevel,
    badges: updatedBadges,
    streaks: updatedStreaks,
    totalTrades: trades.length,
    totalWins,
    totalLosses,
  };
}
