import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { psxCompanies, getAllSectors, PSXCompany } from "@/data/psxCompanies";
import CompanyCard from "@/components/CompanyCard";

interface CompanySearchProps {
  onCompanySelect?: (company: PSXCompany) => void;
}

const CompanySearch = ({ onCompanySelect }: CompanySearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);

  const sectors = getAllSectors();

  const filteredCompanies = psxCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "all" || company.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <div className="space-y-6" style={{ color: 'var(--text)' }}>
      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text3)' }} />
          <input
            type="text"
            placeholder="Search companies by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ 
              paddingLeft: '40px',
              width: '100%'
            }}
          />
        </div>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="input-field"
          style={{ width: '100%', maxWidth: '200px' }}
        >
          <option value="all">All Sectors</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
        <button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text)'
          }}>
            {isSearching ? "Searching..." : `Results (${filteredCompanies.length})`}
          </h3>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSector("all");
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text2)',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = 'var(--text2)';
              }}
            >
              Clear
            </button>
          )}
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.symbol}
                company={company}
                onClick={onCompanySelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text2)' }}>
              {searchTerm || selectedSector !== "all" 
                ? "No companies found matching your criteria." 
                : "No companies available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySearch;
