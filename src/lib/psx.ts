// Common PSX symbols
export const PSX_SYMBOLS = [
  "ENGRO", "TRG", "LUCK", "HBL", "UBL", "MCB", "OGDC", "PPL", "PSO", "FFC",
  "HUBC", "KEL", "EFERT", "MEBL", "BAFL", "NBP", "BAHL", "ABL", "AKBL", "FABL",
  "SNGP", "SSGC", "MARI", "POL", "ATRL", "NRL", "BYCO", "HASCOL", "SHEL", "APL",
  "DGKC", "MLCF", "FCCL", "CHCC", "PIOC", "KOHC", "ACPL", "GWLC", "BWCL", "POWER",
  "KAPCO", "NCPL", "PKGP", "JPGL", "NPL", "ISL", "COLG", "NESTLE", "UNILEVER", "ICI",
  "SEARL", "AGP", "GLAXO", "HINOON", "FEROZ", "SYS", "NETSOL", "AVN", "TPLP", "TPL",
  "PAEL", "CEPB", "EPCL", "LOTCHEM", "DCL", "FCEPL", "MTL", "MUGHAL", "ISL", "GATM",
  "INDU", "HCAR", "PSMC", "MTL", "AGTL", "DAWH", "THALL", "GHNI", "GADT", "UNITY",
].sort();

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-PK").format(value);
}
