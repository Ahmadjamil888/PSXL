import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface OnboardingData {
  totalLosses: string;
  biggestLoss: string;
  revengeTrading: boolean;
  overtrading: boolean;
  emotionalDecisions: boolean;
  stopLoss: boolean;
  riskPerTrade: string;
  tradingGoal: string;
}

interface EmotionalOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export default function EmotionalOnboarding({ onComplete, onSkip }: EmotionalOnboardingProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    totalLosses: '',
    biggestLoss: '',
    revengeTrading: false,
    overtrading: false,
    emotionalDecisions: false,
    stopLoss: false,
    riskPerTrade: '',
    tradingGoal: '',
  });

  const questions = [
    {
      id: 'totalLosses',
      title: 'Let\'s be honest about losses',
      subtitle: '90% of traders lose money. You\'re not alone.',
      icon: <TrendingDown className="w-8 h-8 text-red-500" />,
      type: 'input',
      placeholder: 'e.g., Rs 500,000',
      label: 'How much have you lost trading in the past year?',
    },
    {
      id: 'biggestLoss',
      title: 'Your biggest mistake',
      subtitle: 'Everyone has one. What\'s yours?',
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      type: 'input',
      placeholder: 'e.g., Rs 200,000 on OGDC in one day',
      label: 'What was your single biggest loss?',
    },
    {
      id: 'revengeTrading',
      title: 'Revenge trading',
      subtitle: 'Trading after a loss to "make it back"',
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      type: 'boolean',
      label: 'Have you ever traded immediately after a loss to recover it?',
    },
    {
      id: 'overtrading',
      title: 'Overtrading',
      subtitle: 'Trading too frequently, often without clear reason',
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      type: 'boolean',
      label: 'Do you find yourself making too many trades in a day?',
    },
    {
      id: 'emotionalDecisions',
      title: 'Emotional trading',
      subtitle: 'Making decisions based on fear, greed, or FOMO',
      icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
      type: 'boolean',
      label: 'Have emotions ever caused you to make a bad trading decision?',
    },
    {
      id: 'stopLoss',
      title: 'Stop loss discipline',
      subtitle: 'The most important rule in trading',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
      type: 'boolean',
      label: 'Do you always use a stop loss?',
    },
    {
      id: 'riskPerTrade',
      title: 'Risk management',
      subtitle: 'How much do you risk on each trade?',
      icon: <AlertTriangle className="w-8 h-8 text-blue-500" />,
      type: 'input',
      placeholder: 'e.g., 2% or Rs 10,000',
      label: 'What percentage or amount of your capital do you risk per trade?',
    },
    {
      id: 'tradingGoal',
      title: 'Your real goal',
      subtitle: 'Be honest with yourself',
      icon: <TrendingDown className="w-8 h-8 text-purple-500" />,
      type: 'input',
      placeholder: 'e.g., Stop losing money, Build consistent income, Replace my job',
      label: 'What is your actual goal for trading?',
    },
  ];

  const currentQuestion = questions[step];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (value: string | boolean) => {
    setData(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const isCurrentAnswerValid = () => {
    const value = data[currentQuestion.id as keyof OnboardingData];
    if (currentQuestion.type === 'boolean') {
      return typeof value === 'boolean';
    }
    return typeof value === 'string' && value.trim().length > 0;
  };

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg border border-[#2a2a2a] shadow-2xl overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-[#2a2a2a]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
          />
        </div>

        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-400 text-sm transition-colors"
        >
          Skip for now
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-[#2a2a2a] rounded-full">
                  {currentQuestion.icon}
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">{currentQuestion.title}</h2>
                <p className="text-gray-400 text-sm">{currentQuestion.subtitle}</p>
              </div>

              {/* Question */}
              <div className="space-y-3">
                <label className="text-gray-300 text-sm font-medium">{currentQuestion.label}</label>

                {currentQuestion.type === 'input' ? (
                  <input
                    type="text"
                    value={data[currentQuestion.id as keyof OnboardingData] as string}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    autoFocus
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleInputChange(true)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        data[currentQuestion.id as keyof OnboardingData] === true
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        <span className="text-white text-sm font-medium">Yes</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleInputChange(false)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        data[currentQuestion.id as keyof OnboardingData] === false
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <XCircle className="w-6 h-6 text-red-500" />
                        <span className="text-white text-sm font-medium">No</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                >
                  Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isCurrentAnswerValid()}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {step === questions.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex justify-center gap-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === step ? 'bg-emerald-500' : i < step ? 'bg-emerald-500/50' : 'bg-[#2a2a2a]'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
