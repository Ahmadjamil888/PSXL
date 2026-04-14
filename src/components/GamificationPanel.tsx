import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Target, Award, TrendingUp, X, ChevronRight } from 'lucide-react';
import { getGamificationProfile, Badge, Streak } from '@/lib/gamification';
import { Trade } from '@/lib/mistakeDetection';

interface GamificationPanelProps {
  trades: Trade[];
  currentXP?: number;
  onClose: () => void;
}

export default function GamificationPanel({ trades, currentXP = 0, onClose }: GamificationPanelProps) {
  const [activeTab, setActiveTab] = useState<'badges' | 'streaks' | 'stats'>('badges');
  
  const profile = getGamificationProfile(trades, currentXP);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const getStreakIcon = (type: Streak['type']) => {
    switch (type) {
      case 'daily_login': return <Flame className="w-4 h-4" />;
      case 'winning_streak': return <Trophy className="w-4 h-4" />;
      case 'disciplined_trading': return <Target className="w-4 h-4" />;
      case 'no_revenge_trading': return <Award className="w-4 h-4" />;
      default: return <Flame className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#2a2a2a] shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Gamification</h2>
              <p className="text-white/80 text-sm">Track your trading discipline and achievements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Level and XP */}
          <div className="mb-6 bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Level {profile.level}</p>
                <p className="text-2xl font-bold text-white">{profile.xp} XP</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Discipline Score</p>
                <p className="text-2xl font-bold" style={{ color: getScoreColor(profile.disciplineScore) }}>
                  {profile.disciplineScore}
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((profile.xp - (Math.pow(profile.level - 1, 2) * 100)) / (profile.xpToNextLevel)) * 100}%` }}
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{profile.xpToNextLevel} XP to next level</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'badges', label: 'Badges', icon: <Award className="w-4 h-4" /> },
              { id: 'streaks', label: 'Streaks', icon: <Flame className="w-4 h-4" /> },
              { id: 'stats', label: 'Stats', icon: <TrendingUp className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-yellow-600 text-white'
                    : 'bg-[#0a0a0a] text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'badges' && (
              <motion.div
                key="badges"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {profile.badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl border ${
                      badge.unlocked
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-[#0a0a0a] border-[#2a2a2a] opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="text-sm font-medium text-white mb-1">{badge.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{badge.description}</p>
                    {badge.target && !badge.unlocked && (
                      <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${Math.min((badge.progress || 0) / badge.target * 100, 100)}%` }}
                        />
                      </div>
                    )}
                    {badge.unlocked && (
                      <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <Award className="w-3 h-3" />
                        Unlocked
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'streaks' && (
              <motion.div
                key="streaks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                {profile.streaks.map((streak) => (
                  <div
                    key={streak.type}
                    className="bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <span className="text-orange-400">{getStreakIcon(streak.type)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white capitalize">
                          {streak.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-400">Best: {streak.best}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">{streak.current}</p>
                      <p className="text-xs text-gray-400">current</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { label: 'Total Trades', value: profile.totalTrades, color: 'text-white' },
                  { label: 'Total Wins', value: profile.totalWins, color: 'text-green-400' },
                  { label: 'Total Losses', value: profile.totalLosses, color: 'text-red-400' },
                  { label: 'Win Rate', value: profile.totalWins + profile.totalLosses > 0 
                      ? `${((profile.totalWins / (profile.totalWins + profile.totalLosses)) * 100).toFixed(1)}%` 
                      : 'N/A', 
                    color: 'text-white' 
                  },
                  { label: 'Badges Unlocked', value: `${profile.badges.filter(b => b.unlocked).length}/${profile.badges.length}`, color: 'text-yellow-500' },
                  { label: 'Current Level', value: profile.level.toString(), color: 'text-purple-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a]">
                    <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
