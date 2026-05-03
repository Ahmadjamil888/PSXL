ALTER TABLE public.trades
  ADD COLUMN IF NOT EXISTS entry_note TEXT,
  ADD COLUMN IF NOT EXISTS exit_note TEXT,
  ADD COLUMN IF NOT EXISTS entry_tags TEXT[],
  ADD COLUMN IF NOT EXISTS exit_tags TEXT[],
  ADD COLUMN IF NOT EXISTS entry_chart_image TEXT,
  ADD COLUMN IF NOT EXISTS exit_chart_image TEXT;

COMMENT ON COLUMN public.trades.entry_note IS 'Note captured at entry / buy time';
COMMENT ON COLUMN public.trades.exit_note IS 'Note captured at exit / sell time';
COMMENT ON COLUMN public.trades.entry_tags IS 'Tags captured at entry / buy time';
COMMENT ON COLUMN public.trades.exit_tags IS 'Tags captured at exit / sell time';
COMMENT ON COLUMN public.trades.entry_chart_image IS 'Entry chart image stored as a text data URL';
COMMENT ON COLUMN public.trades.exit_chart_image IS 'Exit chart image stored as a text data URL';
