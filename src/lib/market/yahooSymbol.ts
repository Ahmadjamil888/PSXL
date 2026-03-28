/** Yahoo Finance suffix for Pakistan Stock Exchange listings */
export function toYahooPsxSymbol(psxSymbol: string): string {
  const s = psxSymbol.trim().toUpperCase();
  if (s.endsWith(".PSX")) return s;
  return `${s}.PSX`;
}
