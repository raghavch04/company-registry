import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const SearchFilter = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    openingTime: '',
    closingTime: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      location: '',
      openingTime: '',
      closingTime: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FaFilter className="mr-2" /> Filters
        </h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 hover:text-blue-800"
        >
          {showFilters ? <FaTimes /> : <FaFilter />}
        </button>
      </div>
      
      {showFilters && (
        <div className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              placeholder="Filter by location..."
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="openingTime" className="block text-gray-700 mb-1">Opens After</label>
              <input
                type="time"
                id="openingTime"
                name="openingTime"
                value={filters.openingTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="closingTime" className="block text-gray-700 mb-1">Closes Before</label>
              <input
                type="time"
                id="closingTime"
                name="closingTime"
                value={filters.closingTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;