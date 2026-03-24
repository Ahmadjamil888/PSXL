export interface PSXCompany {
  symbol: string;
  name: string;
  sector: string;
  logo?: string;
}

export const psxCompanies: PSXCompany[] = [
  // Banking Sector
  { symbol: "HBL", name: "Habib Bank Limited", sector: "Banking", logo: "/logos/hbl.png" },
  { symbol: "UBL", name: "United Bank Limited", sector: "Banking", logo: "/logos/ubl.png" },
  { symbol: "MCB", name: "Muslim Commercial Bank", sector: "Banking", logo: "/logos/mcb.png" },
  { symbol: "ABL", name: "Allied Bank Limited", sector: "Banking", logo: "/logos/abl.png" },
  { symbol: "BAFL", name: "Bank Alfalah Limited", sector: "Banking", logo: "/logos/bafl.png" },
  { symbol: "BAHL", name: "Bank Al-Habib Limited", sector: "Banking", logo: "/logos/bahl.png" },
  { symbol: "MEBL", name: "Meezan Bank Limited", sector: "Banking", logo: "/logos/mebl.png" },
  { symbol: "NBP", name: "National Bank of Pakistan", sector: "Banking", logo: "/logos/nbp.png" },
  { symbol: "AKBL", name: "Askari Bank Limited", sector: "Banking", logo: "/logos/akbl.png" },
  { symbol: "FABL", name: "Faysal Bank Limited", sector: "Banking", logo: "/logos/fabl.png" },
  { symbol: "SILK", name: "Silkbank Limited", sector: "Banking", logo: "/logos/silk.png" },
  { symbol: "BOP", name: "Bank of Punjab", sector: "Banking", logo: "/logos/bop.png" },
  { symbol: "JSBL", name: "JS Bank Limited", sector: "Banking", logo: "/logos/jsbl.png" },
  { symbol: "SUMB", name: "Soneri Bank Limited", sector: "Banking", logo: "/logos/sumb.png" },
  { symbol: "KASB", name: "KASB Bank Limited", sector: "Banking", logo: "/logos/kasb.png" },

  // Oil & Gas Sector
  { symbol: "OGDC", name: "Oil & Gas Development Company", sector: "Oil & Gas", logo: "/logos/ogdc.png" },
  { symbol: "PPL", name: "Pakistan Petroleum Limited", sector: "Oil & Gas", logo: "/logos/ppl.png" },
  { symbol: "SNGP", name: "Sui Northern Gas Pipelines", sector: "Oil & Gas", logo: "/logos/sngp.png" },
  { symbol: "SSGC", name: "Sui Southern Gas Company", sector: "Oil & Gas", logo: "/logos/ssgc.png" },
  { symbol: "POL", name: "Pakistan Oilfields Limited", sector: "Oil & Gas", logo: "/logos/pol.png" },
  { symbol: "MARI", name: "Mari Petroleum Company", sector: "Oil & Gas", logo: "/logos/mari.png" },
  { symbol: "PSO", name: "Pakistan State Oil", sector: "Oil & Gas", logo: "/logos/pso.png" },
  { symbol: "SHEL", name: "Shell Pakistan Limited", sector: "Oil & Gas", logo: "/logos/shel.png" },
  { symbol: "APL", name: "Attock Petroleum Limited", sector: "Oil & Gas", logo: "/logos/apl.png" },
  { symbol: "HASCOL", name: "Hascol Petroleum Limited", sector: "Oil & Gas", logo: "/logos/hascol.png" },

  // Cement Sector
  { symbol: "DGKC", name: "DG Khan Cement Company", sector: "Cement", logo: "/logos/dgkc.png" },
  { symbol: "LUCK", name: "Lucky Cement Limited", sector: "Cement", logo: "/logos/luck.png" },
  { symbol: "CHCC", name: "Cherat Cement Company", sector: "Cement", logo: "/logos/chcc.png" },
  { symbol: "FCCL", name: "Fauji Cement Company", sector: "Cement", logo: "/logos/fccl.png" },
  { symbol: "MLCF", name: "Maple Leaf Cement Factory", sector: "Cement", logo: "/logos/mlcf.png" },
  { symbol: "ACPL", name: "Askari Cement Limited", sector: "Cement", logo: "/logos/acpl.png" },
  { symbol: "KOHC", name: "Kohat Cement Company", sector: "Cement", logo: "/logos/kohc.png" },
  { symbol: "DEEW", name: "Dandot Cement Company", sector: "Cement", logo: "/logos/deew.png" },
  { symbol: "FECT", name: "Fecto Cement Limited", sector: "Cement", logo: "/logos/fect.png" },
  { symbol: "GWOP", name: "Gharibwal Cement Limited", sector: "Cement", logo: "/logos/gwop.png" },

  // Automobile Sector
  { symbol: "INDU", name: "Indus Motor Company", sector: "Automobile", logo: "/logos/indu.png" },
  { symbol: "HONCP", name: "Honda Atlas Cars Pakistan", sector: "Automobile", logo: "/logos/honcp.png" },
  { symbol: "PSMC", name: "Pak Suzuki Motor Company", sector: "Automobile", logo: "/logos/psmc.png" },
  { symbol: "HCAR", name: "Honda Atlas Cars Pakistan", sector: "Automobile", logo: "/logos/hcar.png" },
  { symbol: "GATM", name: "Ghandhara Industries Limited", sector: "Automobile", logo: "/logos/gatm.png" },
  { symbol: "ALF", name: "Alfalah Cables", sector: "Automobile", logo: "/logos/alf.png" },

  // Pharmaceutical Sector
  { symbol: "GLAXO", name: "GlaxoSmithKline Pakistan", sector: "Pharmaceutical", logo: "/logos/glaxo.png" },
  { symbol: "SAMI", name: "Sammi Pharmaceutical", sector: "Pharmaceutical", logo: "/logos/sami.png" },
  { symbol: "ABBOTT", name: "Abbott Laboratories Pakistan", sector: "Pharmaceutical", logo: "/logos/abbott.png" },
  { symbol: "GSK", name: "GSK Pakistan Limited", sector: "Pharmaceutical", logo: "/logos/gsk.png" },
  { symbol: "SEARL", name: "Searle Company Pakistan", sector: "Pharmaceutical", logo: "/logos/searl.png" },
  { symbol: "HINOON", name: "Highnoon Laboratories", sector: "Pharmaceutical", logo: "/logos/hinoon.png" },
  { symbol: "FEROZ", name: "Ferozsons Laboratories", sector: "Pharmaceutical", logo: "/logos/feroz.png" },

  // Textile Sector
  { symbol: "NCL", name: "Nishat Chunian Limited", sector: "Textile", logo: "/logos/ncl.png" },
  { symbol: "GULF", name: "Gul Ahmed Textile Mills", sector: "Textile", logo: "/logos/gulf.png" },
  { symbol: "SILK", name: "Silkbank Limited", sector: "Textile", logo: "/logos/silk.png" },
  { symbol: "NML", name: "Nishat Mills Limited", sector: "Textile", logo: "/logos/nml.png" },
  { symbol: "INTERCO", name: "Interco Industries", sector: "Textile", logo: "/logos/interco.png" },
  { symbol: "ECL", name: "Eastern Cables Limited", sector: "Textile", logo: "/logos/ecl.png" },
  { symbol: "CINE", name: "Cinepax Limited", sector: "Textile", logo: "/logos/cine.png" },

  // Chemical Sector
  { symbol: "FFBL", name: "Fauji Fertilizer Bin Qasim", sector: "Chemical", logo: "/logos/ffbl.png" },
  { symbol: "FFC", name: "Fauji Fertilizer Company", sector: "Chemical", logo: "/logos/ffc.png" },
  { symbol: "EFERT", name: "Engro Fertilizer Limited", sector: "Chemical", logo: "/logos/efert.png" },
  { symbol: "DAWH", name: "Dawood Hercules Corporation", sector: "Chemical", logo: "/logos/dawh.png" },
  { symbol: "ICI", name: "ICI Pakistan Limited", sector: "Chemical", logo: "/logos/ici.png" },
  { symbol: "LUX", name: "Luxor Pakistan", sector: "Chemical", logo: "/logos/lux.png" },

  // Power & Energy Sector
  { symbol: "KEL", name: "K-Electric Limited", sector: "Power", logo: "/logos/kel.png" },
  { symbol: "HUBC", name: "Hub Power Company", sector: "Power", logo: "/logos/hubc.png" },
  { symbol: "NPL", name: "Nishat Power Limited", sector: "Power", logo: "/logos/npl.png" },
  { symbol: "KAPCO", name: "Kot Addu Power Company", sector: "Power", logo: "/logos/kapco.png" },
  { symbol: "GENCO", name: "Genco Holding Limited", sector: "Power", logo: "/logos/genco.png" },

  // Telecommunication Sector
  { symbol: "TPL", name: "Telecard Limited", sector: "Telecommunication", logo: "/logos/tpl.png" },
  { symbol: "FONE", name: "Fiberlink Limited", sector: "Telecommunication", logo: "/logos/fone.png" },
  { symbol: "WTL", name: "WorldCall Telecom Limited", sector: "Telecommunication", logo: "/logos/wtl.png" },
  { symbol: "PTCL", name: "Pakistan Telecommunication Company", sector: "Telecommunication", logo: "/logos/ptcl.png" },

  // Technology Sector
  { symbol: "SYS", name: "Systems Limited", sector: "Technology", logo: "/logos/sys.png" },
  { symbol: "AVN", name: "Avanceon Limited", sector: "Technology", logo: "/logos/avn.png" },
  { symbol: "CTY", name: "Cnergyico PK Limited", sector: "Technology", logo: "/logos/cty.png" },
  { symbol: "NETSOL", name: "NetSol Technologies Limited", sector: "Technology", logo: "/logos/netsol.png" },

  // Steel & Engineering
  { symbol: "ISL", name: "International Steel Limited", sector: "Steel", logo: "/logos/isl.png" },
  { symbol: "MUGHAL", name: "Mughal Iron & Steel", sector: "Steel", logo: "/logos/mughal.png" },
  { symbol: "AMUL", name: "Amreli Steels Limited", sector: "Steel", logo: "/logos/amul.png" },
  { symbol: "ASTL", name: "Aisha Steel Mills Limited", sector: "Steel", logo: "/logos/astl.png" },

  // Food & Consumer Goods
  { symbol: "Nestle", name: "Nestle Pakistan Limited", sector: "Food", logo: "/logos/nestle.png" },
  { symbol: "ENGRO", name: "Engro Corporation", sector: "Food", logo: "/logos/engro.png" },
  { symbol: "COLG", name: "Colgate-Palmolive Pakistan", sector: "Food", logo: "/logos/colg.png" },
  { symbol: "PGLC", name: "Packages Limited", sector: "Food", logo: "/logos/pglc.png" },
  { symbol: "UNIL", name: "Unilever Pakistan Foods", sector: "Food", logo: "/logos/unil.png" },
  { symbol: "EPCL", name: "Exxon Pakistan Chemicals", sector: "Food", logo: "/logos/epcl.png" },

  // Insurance Sector
  { symbol: "EFUG", name: "EFU General Insurance", sector: "Insurance", logo: "/logos/efug.png" },
  { symbol: "ADAMS", name: "Adamjee Insurance", sector: "Insurance", logo: "/logos/adams.png" },
  { symbol: "PIC", name: "Pakistan Insurance Company", sector: "Insurance", logo: "/logos/pic.png" },
  { symbol: "SEGPL", name: "Security General Insurance", sector: "Insurance", logo: "/logos/segpl.png" },

  // Real Estate & Construction
  { symbol: "BAHL", name: "Bahria Town", sector: "Real Estate", logo: "/logos/bahl.png" },
  { symbol: "DAWN", name: "Dawn Foods Limited", sector: "Real Estate", logo: "/logos/dawn.png" },
  { symbol: "ARSL", name: "Arif Habib Corporation", sector: "Real Estate", logo: "/logos/arsl.png" },

  // Aviation & Transport
  { symbol: "PIA", name: "Pakistan International Airlines", sector: "Aviation", logo: "/logos/pia.png" },
  { symbol: "MARI", name: "Mari Petroleum", sector: "Aviation", logo: "/logos/mari.png" },
  { symbol: "GULF", name: "Gulf International Airlines", sector: "Aviation", logo: "/logos/gulf.png" }
];

export const getCompanyBySymbol = (symbol: string): PSXCompany | undefined => {
  return psxCompanies.find(company => company.symbol.toUpperCase() === symbol.toUpperCase());
};

export const getCompaniesBySector = (sector: string): PSXCompany[] => {
  return psxCompanies.filter(company => company.sector.toLowerCase() === sector.toLowerCase());
};

export const getAllSectors = (): string[] => {
  return [...new Set(psxCompanies.map(company => company.sector))];
};
