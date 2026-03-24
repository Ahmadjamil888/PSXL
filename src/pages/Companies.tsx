import { useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import CompanySearch from '@/components/CompanySearch';
import { PSXCompany } from '@/data/psxCompanies';

const Companies = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedCompany, setSelectedCompany] = useState<PSXCompany | null>(null);

  const handleCompanySelect = (company: PSXCompany) => {
    setSelectedCompany(company);
  };

  return (
    <div style={{ color: 'var(--text)' }}>
      <div style={{ marginBottom: '24px' }}>
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
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1px',
        background: 'var(--border)',
        marginBottom: '24px'
      }}>
        <div style={{
          background: isDark ? '#0a0a0a' : '#f7f7f7',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)' }}>Total Companies</span>
          <span style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--text)' }}>100+</span>
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 300 }}>Listed companies</span>
        </div>
        <div style={{
          background: isDark ? '#0a0a0a' : '#f7f7f7',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)' }}>Sectors</span>
          <span style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--text)' }}>15</span>
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 300 }}>Industry sectors</span>
        </div>
        <div style={{
          background: isDark ? '#0a0a0a' : '#f7f7f7',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)' }}>Market Cap</span>
          <span style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--text)' }}>$8.2T</span>
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 300 }}>Total market cap</span>
        </div>
        <div style={{
          background: isDark ? '#0a0a0a' : '#f7f7f7',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)' }}>Volume</span>
          <span style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--text)' }}>142M</span>
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 300 }}>Daily avg volume</span>
        </div>
      </div>

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
              const contents = document.querySelectorAll('.tab-content');
              contents.forEach(content => {
                const el = content as HTMLElement;
                el.style.display = content.id === `tab-${tab.value}` ? 'block' : 'none';
              });
              
              const buttons = document.querySelectorAll('.tab-button');
              buttons.forEach(btn => {
                const el = btn as HTMLElement;
                if (btn.getAttribute('data-value') === tab.value) {
                  el.style.color = 'var(--green)';
                  el.style.borderBottom = '2px solid var(--green)';
                } else {
                  el.style.color = 'var(--text2)';
                  el.style.borderBottom = 'none';
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
      <div id="tab-search" className="tab-content" style={{ display: 'block', marginBottom: '24px' }}>
        <CompanySearch onCompanySelect={handleCompanySelect} />
      </div>

      <div id="tab-sectors" className="tab-content" style={{ display: 'none', marginBottom: '24px' }}>
        <div style={{ background: isDark ? '#161616' : '#ebebeb', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: isDark ? '#161616' : '#ebebeb', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>Companies by Sector</span>
            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '2px' }}>Browse</span>
          </div>
          <div style={{ padding: '32px' }}>
            <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
              Sector-wise company listing coming soon...
            </p>
          </div>
        </div>
      </div>

      <div id="tab-watchlist" className="tab-content" style={{ display: 'none', marginBottom: '24px' }}>
        <div style={{ background: isDark ? '#161616' : '#ebebeb', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: isDark ? '#161616' : '#ebebeb', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>Your Watchlist</span>
            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '2px' }}>Track</span>
          </div>
          <div style={{ padding: '32px' }}>
            <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
              Your watchlist is empty. Add companies to track them here.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Company Detail */}
      {selectedCompany && (
        <div style={{ marginTop: '24px', background: isDark ? '#161616' : '#ebebeb', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: isDark ? '#161616' : '#ebebeb', borderBottom: '1px solid var(--border)' }}>
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
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
                  {selectedCompany.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
                  {selectedCompany.symbol} • {selectedCompany.sector}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '2px' }}>Live</span>
          </div>
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)' }}>
              <div style={{ background: isDark ? '#161616' : '#ebebeb', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px' }}>Current Price</div>
                <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)' }}>PKR 245.50</div>
              </div>
              <div style={{ background: isDark ? '#161616' : '#ebebeb', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px' }}>Change</div>
                <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', color: '#22c55e' }}>+2.35%</div>
              </div>
              <div style={{ background: isDark ? '#161616' : '#ebebeb', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px' }}>Volume</div>
                <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)' }}>1.2M</div>
              </div>
              <div style={{ background: isDark ? '#161616' : '#ebebeb', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px' }}>Market Cap</div>
                <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)' }}>PKR 82B</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
