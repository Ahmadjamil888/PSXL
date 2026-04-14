import { PortfolioHolding, NewsItem, analyzeNewsImpact } from '@/lib/ai/gemini';

export interface NewsImpact {
  newsId: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedHoldings: string[];
  summary: string;
  actionableInsights: string[];
  timestamp: Date;
}

export interface NewsImpactReport {
  impacts: NewsImpact[];
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  recommendations: string[];
}

/**
 * Categorize news by sector
 */
export function categorizeNewsBySector(news: NewsItem[]): Map<string, NewsItem[]> {
  const categorized = new Map<string, NewsItem[]>();
  
  news.forEach(item => {
    if (item.sectors) {
      item.sectors.forEach(sector => {
        if (!categorized.has(sector)) {
          categorized.set(sector, []);
        }
        categorized.get(sector)!.push(item);
      });
    }
  });
  
  return categorized;
}

/**
 * Filter news relevant to user's holdings
 */
export function filterRelevantNews(news: NewsItem[], holdings: PortfolioHolding[]): NewsItem[] {
  if (holdings.length === 0) return news;
  
  const userSymbols = new Set(holdings.map(h => h.symbol.toUpperCase()));
  const userSectors = new Set(holdings.map(h => h.symbol.toUpperCase())); // In a real app, you'd have sector data
  
  return news.filter(item => {
    // Check if news mentions user's symbols
    if (item.companies) {
      const hasCompany = item.companies.some(company => 
        userSymbols.has(company.toUpperCase())
      );
      if (hasCompany) return true;
    }
    
    // Check if news mentions user's sectors
    if (item.sectors) {
      const hasSector = item.sectors.some(sector => 
        userSectors.has(sector.toUpperCase())
      );
      if (hasSector) return true;
    }
    
    return false;
  });
}

/**
 * Calculate impact level based on AI analysis
 */
export function determineImpactLevel(aiResponse: string): 'low' | 'medium' | 'high' | 'critical' {
  const lower = aiResponse.toLowerCase();
  
  if (lower.includes('critical') || lower.includes('severe') || lower.includes('major') || lower.includes('significant')) {
    return 'critical';
  }
  if (lower.includes('high') || lower.includes('important') || lower.includes('notable')) {
    return 'high';
  }
  if (lower.includes('moderate') || lower.includes('some') || lower.includes('minor')) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Generate news impact report
 */
export async function generateNewsImpactReport(
  news: NewsItem[],
  holdings: PortfolioHolding[]
): Promise<NewsImpactReport> {
  const relevantNews = filterRelevantNews(news, holdings);
  
  if (relevantNews.length === 0) {
    return {
      impacts: [],
      overallRiskLevel: 'low',
      summary: 'No news items directly relevant to your current holdings.',
      recommendations: ['Continue monitoring market news for any developments affecting your positions.'],
    };
  }
  
  const impacts: NewsImpact[] = [];
  
  for (const newsItem of relevantNews) {
    try {
      const analysis = await analyzeNewsImpact([newsItem], holdings);
      
      const impactLevel = determineImpactLevel(analysis.message);
      const affectedHoldings = newsItem.companies || [];
      
      const actionableInsights = analysis.insights?.recommendations || [];
      
      impacts.push({
        newsId: newsItem.title, // Using title as ID for now
        impactLevel,
        affectedHoldings,
        summary: analysis.message,
        actionableInsights,
        timestamp: new Date(newsItem.date),
      });
    } catch (error) {
      console.error('Failed to analyze news impact:', error);
    }
  }
  
  // Calculate overall risk level
  const riskLevels = impacts.map(i => i.impactLevel);
  const overallRiskLevel = riskLevels.includes('critical') ? 'critical' :
                           riskLevels.includes('high') ? 'high' :
                           riskLevels.includes('medium') ? 'medium' : 'low';
  
  // Generate summary
  const criticalCount = impacts.filter(i => i.impactLevel === 'critical').length;
  const highCount = impacts.filter(i => i.impactLevel === 'high').length;
  
  let summary = '';
  if (criticalCount > 0) {
    summary = `${criticalCount} critical news item(s) detected that may significantly impact your portfolio.`;
  } else if (highCount > 0) {
    summary = `${highCount} high-impact news item(s) detected. Review your positions carefully.`;
  } else {
    summary = `${impacts.length} news item(s) relevant to your holdings with low to moderate impact.`;
  }
  
  // Aggregate recommendations
  const allRecommendations = impacts.flatMap(i => i.actionableInsights);
  const uniqueRecommendations = Array.from(new Set(allRecommendations));
  
  return {
    impacts,
    overallRiskLevel,
    summary,
    recommendations: uniqueRecommendations,
  };
}

/**
 * Get news sentiment (simplified version)
 */
export function getNewsSentiment(news: NewsItem): 'positive' | 'negative' | 'neutral' {
  const positiveKeywords = ['growth', 'profit', 'increase', 'rise', 'gain', 'expansion', 'success'];
  const negativeKeywords = ['loss', 'decline', 'fall', 'drop', 'cut', 'reduction', 'crisis', 'risk'];
  
  const text = (news.title + ' ' + news.summary).toLowerCase();
  
  const positiveCount = positiveKeywords.filter(kw => text.includes(kw)).length;
  const negativeCount = negativeKeywords.filter(kw => text.includes(kw)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

/**
 * Group news by impact level
 */
export function groupNewsByImpact(impacts: NewsImpact[]): Map<string, NewsImpact[]> {
  const grouped = new Map<string, NewsImpact[]>();
  
  impacts.forEach(impact => {
    if (!grouped.has(impact.impactLevel)) {
      grouped.set(impact.impactLevel, []);
    }
    grouped.get(impact.impactLevel)!.push(impact);
  });
  
  return grouped;
}
