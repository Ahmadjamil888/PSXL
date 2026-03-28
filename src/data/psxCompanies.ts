export interface PSXCompany {
  symbol: string;
  name: string;
  sector: string;
}

export const psxCompanies: PSXCompany[] = [
  // ── Banking ──────────────────────────────────────────────────────────────
  { symbol: "HBL",   name: "Habib Bank Limited",               sector: "Banking" },
  { symbol: "UBL",   name: "United Bank Limited",              sector: "Banking" },
  { symbol: "MCB",   name: "MCB Bank Limited",                 sector: "Banking" },
  { symbol: "ABL",   name: "Allied Bank Limited",              sector: "Banking" },
  { symbol: "BAFL",  name: "Bank Alfalah Limited",             sector: "Banking" },
  { symbol: "BAHL",  name: "Bank Al-Habib Limited",            sector: "Banking" },
  { symbol: "MEBL",  name: "Meezan Bank Limited",              sector: "Banking" },
  { symbol: "NBP",   name: "National Bank of Pakistan",        sector: "Banking" },
  { symbol: "AKBL",  name: "Askari Bank Limited",              sector: "Banking" },
  { symbol: "FABL",  name: "Faysal Bank Limited",              sector: "Banking" },
  { symbol: "BOP",   name: "Bank of Punjab",                   sector: "Banking" },
  { symbol: "JSBL",  name: "JS Bank Limited",                  sector: "Banking" },
  { symbol: "SNBL",  name: "Soneri Bank Limited",              sector: "Banking" },
  { symbol: "SILK",  name: "Silkbank Limited",                 sector: "Banking" },
  { symbol: "SMBL",  name: "Summit Bank Limited",              sector: "Banking" },
  { symbol: "BIPL",  name: "BankIslami Pakistan Limited",      sector: "Banking" },
  { symbol: "DUBL",  name: "Dubai Islamic Bank Pakistan",      sector: "Banking" },
  { symbol: "MSBL",  name: "Mobilink Microfinance Bank",       sector: "Banking" },

  // ── Oil & Gas ─────────────────────────────────────────────────────────────
  { symbol: "OGDC",   name: "Oil & Gas Development Company",   sector: "Oil & Gas" },
  { symbol: "PPL",    name: "Pakistan Petroleum Limited",      sector: "Oil & Gas" },
  { symbol: "MARI",   name: "Mari Petroleum Company",          sector: "Oil & Gas" },
  { symbol: "POL",    name: "Pakistan Oilfields Limited",      sector: "Oil & Gas" },
  { symbol: "PSO",    name: "Pakistan State Oil",              sector: "Oil & Gas" },
  { symbol: "SNGP",   name: "Sui Northern Gas Pipelines",      sector: "Oil & Gas" },
  { symbol: "SSGC",   name: "Sui Southern Gas Company",        sector: "Oil & Gas" },
  { symbol: "APL",    name: "Attock Petroleum Limited",        sector: "Oil & Gas" },
  { symbol: "SHEL",   name: "Shell Pakistan Limited",          sector: "Oil & Gas" },
  { symbol: "HASCOL", name: "Hascol Petroleum Limited",        sector: "Oil & Gas" },
  { symbol: "BYCO",   name: "Byco Petroleum Pakistan",         sector: "Oil & Gas" },
  { symbol: "ATRL",   name: "Attock Refinery Limited",         sector: "Oil & Gas" },
  { symbol: "NRL",    name: "National Refinery Limited",       sector: "Oil & Gas" },
  { symbol: "PRL",    name: "Pakistan Refinery Limited",       sector: "Oil & Gas" },

  // ── Cement ────────────────────────────────────────────────────────────────
  { symbol: "LUCK",  name: "Lucky Cement Limited",             sector: "Cement" },
  { symbol: "DGKC",  name: "DG Khan Cement Company",           sector: "Cement" },
  { symbol: "MLCF",  name: "Maple Leaf Cement Factory",        sector: "Cement" },
  { symbol: "FCCL",  name: "Fauji Cement Company",             sector: "Cement" },
  { symbol: "CHCC",  name: "Cherat Cement Company",            sector: "Cement" },
  { symbol: "KOHC",  name: "Kohat Cement Company",             sector: "Cement" },
  { symbol: "ACPL",  name: "Askari Cement Limited",            sector: "Cement" },
  { symbol: "PIOC",  name: "Pioneer Cement Limited",           sector: "Cement" },
  { symbol: "GWLC",  name: "Gharibwal Cement Limited",         sector: "Cement" },
  { symbol: "BWCL",  name: "Bestway Cement Limited",           sector: "Cement" },
  { symbol: "FECT",  name: "Fecto Cement Limited",             sector: "Cement" },
  { symbol: "POWER", name: "Power Cement Limited",             sector: "Cement" },
  { symbol: "THCCL", name: "Thatta Cement Company",            sector: "Cement" },

  // ── Fertilizer / Chemical ─────────────────────────────────────────────────
  { symbol: "FFC",   name: "Fauji Fertilizer Company",         sector: "Fertilizer" },
  { symbol: "FFBL",  name: "Fauji Fertilizer Bin Qasim",       sector: "Fertilizer" },
  { symbol: "EFERT", name: "Engro Fertilizers Limited",        sector: "Fertilizer" },
  { symbol: "DAWH",  name: "Dawood Hercules Corporation",      sector: "Fertilizer" },
  { symbol: "FATIMA",name: "Fatima Fertilizer Company",        sector: "Fertilizer" },
  { symbol: "ICI",   name: "ICI Pakistan Limited",             sector: "Chemical" },
  { symbol: "EPCL",  name: "Engro Polymer & Chemicals",        sector: "Chemical" },
  { symbol: "LOTCHEM",name:"Lotte Chemical Pakistan",          sector: "Chemical" },
  { symbol: "DCL",   name: "Descon Chemicals Limited",         sector: "Chemical" },

  // ── Power & Energy ────────────────────────────────────────────────────────
  { symbol: "HUBC",  name: "Hub Power Company",                sector: "Power" },
  { symbol: "KEL",   name: "K-Electric Limited",               sector: "Power" },
  { symbol: "KAPCO", name: "Kot Addu Power Company",           sector: "Power" },
  { symbol: "NPL",   name: "Nishat Power Limited",             sector: "Power" },
  { symbol: "NCPL",  name: "Nishat Chunian Power Limited",     sector: "Power" },
  { symbol: "PKGP",  name: "PakGen Power Limited",             sector: "Power" },
  { symbol: "JPGL",  name: "Jaffer Power Generation",          sector: "Power" },
  { symbol: "LPCL",  name: "Liberty Power Tech Limited",       sector: "Power" },
  { symbol: "TREET", name: "Treet Corporation Limited",        sector: "Power" },

  // ── Automobile ────────────────────────────────────────────────────────────
  { symbol: "INDU",  name: "Indus Motor Company",              sector: "Automobile" },
  { symbol: "PSMC",  name: "Pak Suzuki Motor Company",         sector: "Automobile" },
  { symbol: "HCAR",  name: "Honda Atlas Cars Pakistan",        sector: "Automobile" },
  { symbol: "GATM",  name: "Ghandhara Industries Limited",     sector: "Automobile" },
  { symbol: "AGTL",  name: "Al-Ghazi Tractors Limited",        sector: "Automobile" },
  { symbol: "MTL",   name: "Millat Tractors Limited",          sector: "Automobile" },
  { symbol: "GHNI",  name: "Ghandhara Nissan Limited",         sector: "Automobile" },

  // ── Technology ────────────────────────────────────────────────────────────
  { symbol: "SYS",    name: "Systems Limited",                 sector: "Technology" },
  { symbol: "TRG",    name: "TRG Pakistan Limited",            sector: "Technology" },
  { symbol: "NETSOL", name: "NetSol Technologies Limited",     sector: "Technology" },
  { symbol: "AVN",    name: "Avanceon Limited",                sector: "Technology" },
  { symbol: "TPLP",   name: "TPL Properties Limited",          sector: "Technology" },
  { symbol: "PAEL",   name: "Pak Elektron Limited",            sector: "Technology" },
  { symbol: "CEPB",   name: "Cnergyico PK Limited",            sector: "Technology" },

  // ── Pharmaceutical ────────────────────────────────────────────────────────
  { symbol: "SEARL",  name: "Searle Company Pakistan",         sector: "Pharmaceutical" },
  { symbol: "AGP",    name: "AGP Limited",                     sector: "Pharmaceutical" },
  { symbol: "GLAXO",  name: "GlaxoSmithKline Pakistan",        sector: "Pharmaceutical" },
  { symbol: "HINOON", name: "Highnoon Laboratories",           sector: "Pharmaceutical" },
  { symbol: "FEROZ",  name: "Ferozsons Laboratories",          sector: "Pharmaceutical" },
  { symbol: "ABBOTT", name: "Abbott Laboratories Pakistan",    sector: "Pharmaceutical" },
  { symbol: "SAMI",   name: "Sami Pharmaceuticals",            sector: "Pharmaceutical" },
  { symbol: "IBLHL",  name: "IBL HealthCare Limited",          sector: "Pharmaceutical" },

  // ── Textile ───────────────────────────────────────────────────────────────
  { symbol: "NML",   name: "Nishat Mills Limited",             sector: "Textile" },
  { symbol: "NCL",   name: "Nishat Chunian Limited",           sector: "Textile" },
  { symbol: "GADT",  name: "Gadoon Textile Mills",             sector: "Textile" },
  { symbol: "GHNI",  name: "Ghandhara Nissan Limited",         sector: "Textile" },
  { symbol: "UNITY", name: "Unity Foods Limited",              sector: "Textile" },
  { symbol: "THALL", name: "Thal Limited",                     sector: "Textile" },
  { symbol: "COLG",  name: "Colgate-Palmolive Pakistan",       sector: "Textile" },

  // ── Food & Consumer ───────────────────────────────────────────────────────
  { symbol: "NESTLE", name: "Nestle Pakistan Limited",         sector: "Food & Consumer" },
  { symbol: "ENGRO",  name: "Engro Corporation",               sector: "Food & Consumer" },
  { symbol: "UNIL",   name: "Unilever Pakistan Foods",         sector: "Food & Consumer" },
  { symbol: "PGLC",   name: "Packages Limited",                sector: "Food & Consumer" },
  { symbol: "QUICE",  name: "Quice Food Industries",           sector: "Food & Consumer" },
  { symbol: "NATF",   name: "National Foods Limited",          sector: "Food & Consumer" },

  // ── Steel & Engineering ───────────────────────────────────────────────────
  { symbol: "ISL",    name: "International Steel Limited",     sector: "Steel" },
  { symbol: "MUGHAL", name: "Mughal Iron & Steel Industries",  sector: "Steel" },
  { symbol: "ASTL",   name: "Aisha Steel Mills Limited",       sector: "Steel" },
  { symbol: "AMUL",   name: "Amreli Steels Limited",           sector: "Steel" },

  // ── Insurance ─────────────────────────────────────────────────────────────
  { symbol: "EFUG",  name: "EFU General Insurance",            sector: "Insurance" },
  { symbol: "ADAMS", name: "Adamjee Insurance",                sector: "Insurance" },
  { symbol: "JLICL", name: "Jubilee Life Insurance",           sector: "Insurance" },
  { symbol: "IGIIL", name: "IGI Insurance Limited",            sector: "Insurance" },
  { symbol: "AICL",  name: "Askari Insurance Company",         sector: "Insurance" },

  // ── Telecommunication ─────────────────────────────────────────────────────
  { symbol: "PTCL",  name: "Pakistan Telecommunication Co.",   sector: "Telecom" },
  { symbol: "WTL",   name: "WorldCall Telecom Limited",        sector: "Telecom" },
  { symbol: "TPL",   name: "Telecard Limited",                 sector: "Telecom" },

  // ── Real Estate ───────────────────────────────────────────────────────────
  { symbol: "ARSL",  name: "Arif Habib Corporation",           sector: "Real Estate" },
  { symbol: "JSCL",  name: "Jahangir Siddiqui & Co.",          sector: "Real Estate" },
  { symbol: "PACE",  name: "Pace (Pakistan) Limited",          sector: "Real Estate" },

  // ── Miscellaneous ─────────────────────────────────────────────────────────
  { symbol: "DAWH",  name: "Dawood Hercules Corporation",      sector: "Conglomerate" },
  { symbol: "LUCK",  name: "Lucky Core Industries",            sector: "Conglomerate" },
  { symbol: "ENGRO", name: "Engro Corporation",                sector: "Conglomerate" },
];

// Deduplicate by symbol
const seen = new Set<string>();
const deduped: PSXCompany[] = [];
for (const c of psxCompanies) {
  if (!seen.has(c.symbol)) { seen.add(c.symbol); deduped.push(c); }
}
export const PSX_COMPANIES = deduped;

export const getCompanyBySymbol = (symbol: string) =>
  PSX_COMPANIES.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());

export const getCompaniesBySector = (sector: string) =>
  PSX_COMPANIES.filter(c => c.sector.toLowerCase() === sector.toLowerCase());

export const getAllSectors = () =>
  [...new Set(PSX_COMPANIES.map(c => c.sector))].sort();
