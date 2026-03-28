import { useQuery } from "@tanstack/react-query";

export interface PSXCompany {
  symbol: string;
  name: string;
  sector: string;
  isETF: boolean;
  isDebt: boolean;
  isGEM: boolean;
}

interface RawSymbol {
  symbol: string;
  name: string;
  sectorName: string;
  isETF: boolean;
  isDebt: boolean;
  isGEM?: boolean;
}

// PSX public API — no auth required, CORS-open
const PSX_SYMBOLS_URL = "https://dps.psx.com.pk/symbols";

async function fetchPSXCompanies(): Promise<PSXCompany[]> {
  const res = await fetch(PSX_SYMBOLS_URL, { credentials: "omit" });
  if (!res.ok) throw new Error(`PSX API ${res.status}`);
  const raw: RawSymbol[] = await res.json();

  return raw
    .filter(r => !r.isDebt) // exclude bonds/TFCs/T-bills
    .map(r => ({
      symbol: r.symbol,
      name: r.name || r.symbol,
      sector: r.sectorName || "Miscellaneous",
      isETF: r.isETF,
      isDebt: r.isDebt,
      isGEM: r.isGEM ?? false,
    }))
    .filter(r => r.name.trim() !== ""); // drop blank-name entries
}

export function usePSXCompanies() {
  return useQuery({
    queryKey: ["psx-companies"],
    queryFn: fetchPSXCompanies,
    staleTime: 1000 * 60 * 60, // 1 hour — list doesn't change often
    gcTime: 1000 * 60 * 60 * 24,
    retry: 2,
  });
}
