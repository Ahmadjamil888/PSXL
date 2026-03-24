import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanySearch from '@/components/CompanySearch';
import { PSXCompany } from '@/data/psxCompanies';
import { TrendingUp, Building, DollarSign, BarChart3 } from 'lucide-react';

const Companies = () => {
  const [selectedCompany, setSelectedCompany] = useState<PSXCompany | null>(null);

  const handleCompanySelect = (company: PSXCompany) => {
    setSelectedCompany(company);
  };

  return (
    <div className="space-y-6" style={{ color: 'var(--text)' }}>
      <div>
        <h1 style={{ 
          fontSize: 'clamp(36px, 4vw, 60px)',
          fontWeight: '700',
          letterSpacing: '-2px',
          lineHeight: '1.0',
          color: 'var(--text)',
          marginBottom: '8px'
        }}>
          PSX Companies
        </h1>
        <p style={{ 
          fontSize: '15px',
          fontWeight: '300',
          lineHeight: '1.7',
          color: 'var(--text2)'
        }}>
          Browse and search through all listed companies on Pakistan Stock Exchange
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1" style={{ background: 'var(--border)' }}>
        <div className="stat-card">
          <span className="stat-label">Total Companies</span>
          <span className="stat-val">100+</span>
          <span className="stat-sub">Listed companies</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sectors</span>
          <span className="stat-val">15</span>
          <span className="stat-sub">Industry sectors</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Market Cap</span>
          <span className="stat-val">$8.2T</span>
          <span className="stat-sub">Total market cap</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Volume</span>
          <span className="stat-val">142M</span>
          <span className="stat-sub">Daily avg volume</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Custom Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border)',
          marginBottom: '24px'
        }}>
          {[
            { value: 'search', label: 'Search Companies' },
            { value: 'sectors', label: 'By Sector' },
            { value: 'watchlist', label: 'Watchlist' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                // Simple tab switching - in real app would use state
                const contents = document.querySelectorAll('.tab-content');
                contents.forEach(content => {
                  content.style.display = content.id === `tab-${tab.value}` ? 'block' : 'none';
                });
                
                // Update active tab styling
                const buttons = document.querySelectorAll('.tab-button');
                buttons.forEach(btn => {
                  if (btn.getAttribute('data-value') === tab.value) {
                    btn.style.color = 'var(--green)';
                    btn.style.borderBottom = '2px solid var(--green)';
                  } else {
                    btn.style.color = 'var(--text2)';
                    btn.style.borderBottom = 'none';
                  }
                });
              }}
              className="tab-button"
              data-value={tab.value}
              style={{
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '400',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: tab.value === 'search' ? 'var(--green)' : 'var(--text2)',
                background: 'none',
                border: 'none',
                borderBottom: tab.value === 'search' ? '2px solid var(--green)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div id="tab-search" className="tab-content" style={{ display: 'block' }}>
          <CompanySearch onCompanySelect={handleCompanySelect} />
        </div>

        <div id="tab-sectors" className="tab-content" style={{ display: 'none' }}>
          <div className="table-container">
            <div className="table-header">
              <span className="table-header-title">Companies by Sector</span>
              <span className="table-badge">Browse</span>
            </div>
            <div style={{ padding: '32px' }}>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
                Sector-wise company listing coming soon...
              </p>
            </div>
          </div>
        </div>

        <div id="tab-watchlist" className="tab-content" style={{ display: 'none' }}>
          <div className="table-container">
            <div className="table-header">
              <span className="table-header-title">Your Watchlist</span>
              <span className="table-badge">Track</span>
            </div>
            <div style={{ padding: '32px' }}>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
                Your watchlist is empty. Add companies to track them here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Company Detail */}
      {selectedCompany && (
        <div className="table-container" style={{ marginTop: '24px' }}>
          <div className="table-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {selectedCompany.logo && (
                <img 
                  src={selectedCompany.logo} 
                  alt={selectedCompany.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <div>
                <div style={{ 
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text)'
                }}>
                  {selectedCompany.name}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: 'var(--text3)',
                  marginTop: '2px'
                }}>
                  {selectedCompany.symbol} • {selectedCompany.sector}
                </div>
              </div>
            </div>
            <span className="table-badge">Live</span>
          </div>
          <div style={{ padding: '32px' }}>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">Current Price</div>
                <div className="metric-val">PKR 245.50</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Change</div>
                <div className="metric-val pos">+2.35%</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Volume</div>
                <div className="metric-val">1.2M</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Market Cap</div>
                <div className="metric-val">PKR 82B</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
