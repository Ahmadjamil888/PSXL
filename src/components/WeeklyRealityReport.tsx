import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingDown, AlertTriangle, Target, CheckCircle2, XCircle, Download, Share2 } from 'lucide-react';
import { generateMistakeReport, MistakeReport } from '@/lib/mistakeDetection';
import { Trade } from '@/lib/mistakeDetection';

interface WeeklyRealityReportProps {
  trades: Trade[];
  onClose: () => void;
}

export default function WeeklyRealityReport({ trades, onClose }: WeeklyRealityReportProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  
  // Filter trades for the selected week
  const getWeekTrades = (offset: number) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() - (offset * 7));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate >= startOfWeek && tradeDate <= endOfWeek;
    });
  };
  
  const weekTrades = getWeekTrades(weekOffset);
  const mistakeReport = generateMistakeReport(weekTrades);
  
  // Calculate weekly stats
  const calculateWeeklyStats = () => {
    const totalPnL = weekTrades.reduce((sum, trade) => {
      if (trade.side === 'sell' && trade.exit_price) {
        return sum + ((trade.exit_price - trade.entry_price) * trade.quantity - (trade.fees || 0));
      }
      return sum;
    }, 0);
    
    const wins = weekTrades.filter(trade => {
      if (trade.side === 'sell' && trade.exit_price) {
        return (trade.exit_price - trade.entry_price) * trade.quantity - (trade.fees || 0) > 0;
      }
      return false;
    }).length;
    
    const losses = weekTrades.filter(trade => {
      if (trade.side === 'sell' && trade.exit_price) {
        return (trade.exit_price - trade.entry_price) * trade.quantity - (trade.fees || 0) < 0;
      }
      return false;
    }).length;
    
    const winRate = weekTrades.length > 0 ? (wins / (wins + losses)) * 100 : 0;
    
    return { totalPnL, wins, losses, winRate };
  };
  
  const stats = calculateWeeklyStats();
  
  const getWeekLabel = () => {
    if (weekOffset === 0) return 'This Week';
    if (weekOffset === 1) return 'Last Week';
    return `${weekOffset} Weeks Ago`;
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#1a1a1a] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#2a2a2a] shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Weekly Reality Report</h2>
              <p className="text-white/80 text-sm">Uncomfortable truths about your trading week</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              disabled={weekOffset >= 4}
            >
              ← Previous
            </button>
            <span className="text-white font-medium">{getWeekLabel()}</span>
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              disabled={weekOffset === 0}
            >
              Next →
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Overall Score */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Overall Discipline Score</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-[#0a0a0a] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#2a2a2a"
                      strokeWidth="12"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke={getScoreColor(mistakeReport.overallScore)}
                      strokeWidth="12"
                      strokeDasharray={`${mistakeReport.overallScore * 3.52} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{mistakeReport.overallScore}</span>
                    <span className="text-xs text-gray-400">/ 100</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                    mistakeReport.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                    mistakeReport.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    mistakeReport.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    Risk Level: {mistakeReport.riskLevel.toUpperCase()}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{mistakeReport.summary}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total P&L', value: stats.totalPnL >= 0 ? `+₨${stats.totalPnL.toLocaleString()}` : `₨${stats.totalPnL.toLocaleString()}`, color: stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400' },
                { label: 'Win Rate', value: `${stats.winRate.toFixed(1)}%`, color: stats.winRate >= 50 ? 'text-green-400' : 'text-red-400' },
                { label: 'Wins', value: stats.wins.toString(), color: 'text-white' },
                { label: 'Losses', value: stats.losses.toString(), color: 'text-white' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a]">
                  <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Mistakes */}
          {mistakeReport.patterns.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Detected Behavioral Issues
              </h3>
              <div className="space-y-4">
                {mistakeReport.patterns.map((pattern, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-[#0a0a0a] rounded-xl p-4 border ${
                      pattern.severity === 'critical' ? 'border-red-500/50' :
                      pattern.severity === 'high' ? 'border-orange-500/50' :
                      pattern.severity === 'medium' ? 'border-yellow-500/50' :
                      'border-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        pattern.severity === 'critical' ? 'bg-red-500/20' :
                        pattern.severity === 'high' ? 'bg-orange-500/20' :
                        pattern.severity === 'medium' ? 'bg-yellow-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {pattern.type === 'revenge_trading' && <TrendingDown className="w-4 h-4 text-red-400" />}
                        {pattern.type === 'overtrading' && <Target className="w-4 h-4 text-orange-400" />}
                        {pattern.type === 'emotional_decision' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                        {pattern.type === 'no_stop_loss' && <XCircle className="w-4 h-4 text-red-400" />}
                        {pattern.type === 'overexposure' && <AlertTriangle className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white capitalize">
                            {pattern.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            pattern.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            pattern.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            pattern.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {pattern.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{pattern.description}</p>
                        <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#2a2a2a]">
                          <p className="text-xs text-gray-400 mb-1">Recommendation</p>
                          <p className="text-sm text-white">{pattern.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* No Issues */}
          {mistakeReport.patterns.length === 0 && (
            <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-white">Great Job!</h3>
              </div>
              <p className="text-gray-300 text-sm">
                No major behavioral issues detected this week. Keep up the disciplined trading and continue following your strategy.
              </p>
            </div>
          )}

          {/* Strategies to Improve */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Strategies to Improve
            </h3>
            <div className="space-y-3">
              {[
                'Set strict stop-loss levels before every trade',
                'Limit yourself to 3-5 quality trades per day',
                'Take a 15-minute break after every loss',
                'Review your trades at the end of each day',
                'Never risk more than 1-2% of your capital per trade',
              ].map((strategy, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#0a0a0a] rounded-lg p-3 border border-[#2a2a2a]">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{strategy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
