import { useQuery } from "@tanstack/react-query";
import { fetchMarketChart } from "@/lib/market/fetchYahooChart";

export function useMarketChart(symbol: string | null) {
  return useQuery({
    queryKey: ["market-chart", symbol],
    queryFn: () => fetchMarketChart(symbol!),
    enabled: !!symbol && symbol.length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
