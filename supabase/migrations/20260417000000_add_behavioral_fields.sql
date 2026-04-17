-- Add behavioral fields to trades table
-- Migration for psychology and behavioral tracking features

ALTER TABLE public.trades
  ADD COLUMN IF NOT EXISTS emotion TEXT CHECK (emotion IN ('calm', 'fear', 'greedy', 'revenge')),
  ADD COLUMN IF NOT EXISTS reason TEXT CHECK (reason IN ('breakout', 'dip_buy', 'news', 'tip')),
  ADD COLUMN IF NOT EXISTS rule_followed BOOLEAN,
  ADD COLUMN IF NOT EXISTS mistake_tag TEXT CHECK (mistake_tag IN ('overtrading', 'late_entry', 'early_exit', 'revenge_trade')),
  ADD COLUMN IF NOT EXISTS stop_loss NUMERIC CHECK (stop_loss > 0),
  ADD COLUMN IF NOT EXISTS target NUMERIC CHECK (target > 0);

-- Add indexes for behavioral analytics
CREATE INDEX IF NOT EXISTS idx_trades_emotion ON public.trades(user_id, emotion);
CREATE INDEX IF NOT EXISTS idx_trades_mistake_tag ON public.trades(user_id, mistake_tag);
CREATE INDEX IF NOT EXISTS idx_trades_reason ON public.trades(user_id, reason);

-- Add comment to document the behavioral fields
COMMENT ON COLUMN public.trades.emotion IS 'Emotion before trade: calm, fear, greedy, or revenge';
COMMENT ON COLUMN public.trades.reason IS 'Reason for trade: breakout, dip_buy, news, or tip';
COMMENT ON COLUMN public.trades.rule_followed IS 'Whether the trading rule was followed (true/false)';
COMMENT ON COLUMN public.trades.mistake_tag IS 'Mistake category: overtrading, late_entry, early_exit, or revenge_trade';
COMMENT ON COLUMN public.trades.stop_loss IS 'Stop loss price for risk management';
COMMENT ON COLUMN public.trades.target IS 'Target price for profit taking';
