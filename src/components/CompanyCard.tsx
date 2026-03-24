import { PSXCompany } from '@/data/psxCompanies';

interface CompanyCardProps {
  company: PSXCompany;
  onClick?: (company: PSXCompany) => void;
}

const CompanyCard = ({ company, onClick }: CompanyCardProps) => {
  return (
    <div 
      className="table-container"
      style={{ padding: '20px', cursor: 'pointer' }}
      onClick={() => onClick?.(company)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--green)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div className="flex items-center gap-3">
        <div style={{
          width: '48px',
          height: '48px',
          background: 'var(--surface)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border)'
        }}>
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={company.name}
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className="hidden" style={{
            color: 'var(--green)',
            fontWeight: '700',
            fontSize: '12px'
          }}>
            {company.symbol.slice(0, 2)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 style={{
            fontWeight: '600',
            fontSize: '14px',
            color: 'var(--text)',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {company.name}
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--text3)'
          }}>
            {company.symbol} • {company.sector}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
