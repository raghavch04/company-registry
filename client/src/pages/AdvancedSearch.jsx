import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaClock, FaBuilding } from 'react-icons/fa';
import AddressMap from '../components/AddressMap';
import CompanyCard from '../components/CompanyCard';
import SearchFilter from '../components/SearchFilter';
import { companyApi } from '../utils/api';

const AdvancedSearch = () => {
 // const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    openingTime: '',
    closingTime: ''
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await companyApi.getAll();
        // Ensure companies is always an array
        setCompanies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = Array.isArray(companies)
    ? companies.filter(company => {
        const matchesSearch = searchTerm 
          ? company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            company.address?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
          
        const matchesLocation = filters.location
          ? company.address?.toLowerCase().includes(filters.location.toLowerCase())
          : true;

        const matchesOpening = filters.openingTime
          ? company.openingHours >= filters.openingTime
          : true;

        const matchesClosing = filters.closingTime
          ? company.closingHours <= filters.closingTime
          : true;

        return matchesSearch && matchesLocation && matchesOpening && matchesClosing;
      })
    : [];

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Advanced Company Search</h1>
      
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by company name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <SearchFilter onFilterChange={setFilters} />
          
          <div className="bg-white rounded-lg shadow-md p-4 mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBuilding className="mr-2" /> Companies ({filteredCompanies.length})
            </h2>
            
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No companies found matching your criteria
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredCompanies.map(company => (
                  <CompanyCard 
                    key={company._id}
                    company={company} 
                    isSelected={selectedCompany?._id === company._id}
                    onClick={() => setSelectedCompany(company)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Map View
            </h2>
            
            <div className="h-[600px] rounded-lg overflow-hidden border border-gray-300">
              <AddressMap 
                coordinates={selectedCompany?.location?.coordinates || null} 
                address={selectedCompany?.address || 'Select a company to view location'} 
              />
            </div>
            
            {selectedCompany && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{selectedCompany.companyName}</h3>
                <p className="text-gray-700 mb-1">{selectedCompany.address}</p>
                <p className="text-gray-600 flex items-center">
                  <FaClock className="mr-2" /> 
                  Open: {selectedCompany.openingHours} - Close: {selectedCompany.closingHours}
                </p>
                <p className="text-blue-600 mt-2">{selectedCompany.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;