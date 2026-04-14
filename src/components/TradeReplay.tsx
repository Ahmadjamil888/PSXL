import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Play, Pause, RotateCcw, Download, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Trade } from '@/lib/mistakeDetection';

interface TradeReplayProps {
  trade?: Trade;
  onClose: () => void;
}

export default function TradeReplay({ trade, onClose }: TradeReplayProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [learnings, setLearnings] = useState<string[]>([]);
  const [newMistake, setNewMistake] = useState('');
  const [newLearning, setNewLearning] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMistake = () => {
    if (newMistake.trim()) {
      setMistakes([...mistakes, newMistake.trim()]);
      setNewMistake('');
    }
  };

  const addLearning = () => {
    if (newLearning.trim()) {
      setLearnings([...learnings, newLearning.trim()]);
      setNewLearning('');
    }
  };

  const removeMistake = (index: number) => {
    setMistakes(mistakes.filter((_, i) => i !== index));
  };

  const removeLearning = (index: number) => {
    setLearnings(learnings.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // TODO: Save replay data to database
    console.log('Saving replay:', { trade, screenshot, notes, mistakes, learnings });
    onClose();
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
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Trade Replay</h2>
              <p className="text-white/80 text-sm">
                {trade ? `Analyze ${trade.symbol} trade` : 'Upload chart screenshot to analyze trade'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Screenshot Upload */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Chart Screenshot</h3>
            
            {!screenshot ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-12 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Click to upload chart screenshot</p>
                <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={screenshot}
                  alt="Chart screenshot"
                  className="w-full rounded-lg border border-[#2a2a2a]"
                />
                <button
                  onClick={() => setScreenshot(null)}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                
                {/* Playback controls overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 bg-black/50 rounded-lg p-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                  </button>
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <div className="flex-1 h-1 bg-white/20 rounded-full">
                    <div className="h-full bg-purple-500 w-1/3 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trade Details */}
          {trade && (
            <div className="mb-6 bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a]">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Trade Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Symbol</p>
                  <p className="text-white font-medium">{trade.symbol}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Side</p>
                  <p className={`font-medium ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.side.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="text-white font-medium">{trade.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Entry Price</p>
                  <p className="text-white font-medium">₨{trade.entry_price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Mistakes */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Mistakes Made
              </h3>
              
              <div className="space-y-2 mb-3">
                <AnimatePresence>
                  {mistakes.map((mistake, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-start gap-2 bg-red-500/10 rounded-lg p-3 border border-red-500/30"
                    >
                      <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300 flex-1">{mistake}</p>
                      <button
                        onClick={() => removeMistake(i)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMistake}
                  onChange={(e) => setNewMistake(e.target.value)}
                  placeholder="What went wrong?"
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  onKeyPress={(e) => e.key === 'Enter' && addMistake()}
                />
                <button
                  onClick={addMistake}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Learnings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Key Learnings
              </h3>
              
              <div className="space-y-2 mb-3">
                <AnimatePresence>
                  {learnings.map((learning, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-start gap-2 bg-green-500/10 rounded-lg p-3 border border-green-500/30"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300 flex-1">{learning}</p>
                      <button
                        onClick={() => removeLearning(i)}
                        className="p-1 hover:bg-green-500/20 rounded transition-colors"
                      >
                        <X className="w-3 h-3 text-green-400" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLearning}
                  onChange={(e) => setNewLearning(e.target.value)}
                  placeholder="What did you learn?"
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  onKeyPress={(e) => e.key === 'Enter' && addLearning()}
                />
                <button
                  onClick={addLearning}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional thoughts about this trade..."
              rows={4}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 rounded-lg text-white text-sm font-medium transition-opacity"
            >
              Save Replay
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
