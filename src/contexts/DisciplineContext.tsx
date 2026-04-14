import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DisciplineRule {
  id: string;
  type: 'max_trades_per_day' | 'stop_after_losses' | 'no_revenge_trading' | 'trading_hours' | 'max_loss_per_day';
  value: number;
  enabled: boolean;
}

interface DisciplineState {
  tradesToday: number;
  lossesToday: number;
  lastLossTime: Date | null;
  isLocked: boolean;
  lockReason: string | null;
  consecutiveLosses: number;
  currentStreak: number;
  disciplineScore: number;
  badges: string[];
}

interface DisciplineContextType {
  rules: DisciplineRule[];
  state: DisciplineState;
  updateRule: (ruleId: string, updates: Partial<DisciplineRule>) => void;
  addRule: (rule: Omit<DisciplineRule, 'id'>) => void;
  removeRule: (ruleId: string) => void;
  checkTradeAllowed: () => { allowed: boolean; reason?: string };
  recordTrade: (isLoss: boolean) => void;
  resetDailyStats: () => void;
  unlockTrading: () => void;
}

const DEFAULT_RULES: DisciplineRule[] = [
  {
    id: 'max_trades',
    type: 'max_trades_per_day',
    value: 3,
    enabled: true,
  },
  {
    id: 'stop_losses',
    type: 'stop_after_losses',
    value: 2,
    enabled: true,
  },
  {
    id: 'no_revenge',
    type: 'no_revenge_trading',
    value: 30, // minutes after loss
    enabled: true,
  },
];

const INITIAL_STATE: DisciplineState = {
  tradesToday: 0,
  lossesToday: 0,
  lastLossTime: null,
  isLocked: false,
  lockReason: null,
  consecutiveLosses: 0,
  currentStreak: 0,
  disciplineScore: 50,
  badges: [],
};

const DisciplineContext = createContext<DisciplineContextType | undefined>(undefined);

export function DisciplineProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<DisciplineRule[]>(DEFAULT_RULES);
  const [state, setState] = useState<DisciplineState>(INITIAL_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    const savedRules = localStorage.getItem('disciplineRules');
    const savedState = localStorage.getItem('disciplineState');
    
    if (savedRules) setRules(JSON.parse(savedRules));
    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Reset daily stats if it's a new day
      const today = new Date().toDateString();
      const lastDate = parsed.lastUpdate ? new Date(parsed.lastUpdate).toDateString() : today;
      
      if (today !== lastDate) {
        setState({
          ...INITIAL_STATE,
          disciplineScore: parsed.disciplineScore || 50,
          badges: parsed.badges || [],
        });
      } else {
        setState(parsed);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('disciplineRules', JSON.stringify(rules));
    localStorage.setItem('disciplineState', JSON.stringify({
      ...state,
      lastUpdate: new Date().toISOString(),
    }));
  }, [rules, state]);

  const updateRule = (ruleId: string, updates: Partial<DisciplineRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const addRule = (rule: Omit<DisciplineRule, 'id'>) => {
    setRules(prev => [...prev, { ...rule, id: `rule_${Date.now()}` }]);
  };

  const removeRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const checkTradeAllowed = (): { allowed: boolean; reason?: string } => {
    // Check if already locked
    if (state.isLocked) {
      return { allowed: false, reason: state.lockReason || 'Trading is currently locked' };
    }

    // Check max trades per day
    const maxTradesRule = rules.find(r => r.type === 'max_trades_per_day' && r.enabled);
    if (maxTradesRule && state.tradesToday >= maxTradesRule.value) {
      return { 
        allowed: false, 
        reason: `You've reached your daily limit of ${maxTradesRule.value} trades. Stop overtrading.` 
      };
    }

    // Check stop after losses
    const stopLossesRule = rules.find(r => r.type === 'stop_after_losses' && r.enabled);
    if (stopLossesRule && state.lossesToday >= stopLossesRule.value) {
      return { 
        allowed: false, 
        reason: `You've hit ${stopLossesRule.value} losses today. Stop trading to prevent further damage.` 
      };
    }

    // Check revenge trading
    const noRevengeRule = rules.find(r => r.type === 'no_revenge_trading' && r.enabled);
    if (noRevengeRule && state.lastLossTime) {
      const minutesSinceLoss = (Date.now() - new Date(state.lastLossTime).getTime()) / (1000 * 60);
      if (minutesSinceLoss < noRevengeRule.value) {
        return { 
          allowed: false, 
          reason: `You're entering revenge mode. Wait ${Math.ceil(noRevengeRule.value - minutesSinceLoss)} minutes before trading again.` 
        };
      }
    }

    return { allowed: true };
  };

  const recordTrade = (isLoss: boolean) => {
    setState(prev => {
      const newState = {
        ...prev,
        tradesToday: prev.tradesToday + 1,
        currentStreak: isLoss ? 0 : prev.currentStreak + 1,
      };

      if (isLoss) {
        newState.lossesToday = prev.lossesToday + 1;
        newState.consecutiveLosses = prev.consecutiveLosses + 1;
        newState.lastLossTime = new Date();
        newState.disciplineScore = Math.max(0, prev.disciplineScore - 5);
      } else {
        newState.consecutiveLosses = 0;
        newState.disciplineScore = Math.min(100, prev.disciplineScore + 2);
      }

      // Check for badges
      const newBadges = [...prev.badges];
      
      if (newState.currentStreak === 5 && !newBadges.includes('5_win_streak')) {
        newBadges.push('5_win_streak');
      }
      
      if (newState.currentStreak === 10 && !newBadges.includes('10_win_streak')) {
        newBadges.push('10_win_streak');
      }
      
      if (newState.disciplineScore >= 80 && !newBadges.includes('discipline_master')) {
        newBadges.push('discipline_master');
      }

      newState.badges = newBadges;

      return newState;
    });
  };

  const resetDailyStats = () => {
    setState(prev => ({
      ...INITIAL_STATE,
      disciplineScore: prev.disciplineScore,
      badges: prev.badges,
      currentStreak: prev.currentStreak,
    }));
  };

  const unlockTrading = () => {
    setState(prev => ({
      ...prev,
      isLocked: false,
      lockReason: null,
    }));
  };

  return (
    <DisciplineContext.Provider
      value={{
        rules,
        state,
        updateRule,
        addRule,
        removeRule,
        checkTradeAllowed,
        recordTrade,
        resetDailyStats,
        unlockTrading,
      }}
    >
      {children}
    </DisciplineContext.Provider>
  );
}

export function useDiscipline() {
  const context = useContext(DisciplineContext);
  if (context === undefined) {
    throw new Error('useDiscipline must be used within a DisciplineProvider');
  }
  return context;
}
