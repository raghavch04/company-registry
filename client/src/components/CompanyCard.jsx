import { FaBuilding, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const CompanyCard = ({ company, isSelected, onClick }) => {
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
      onClick={onClick}
    >
      <h3 className="font-bold text-lg flex items-center">
        <FaBuilding className="mr-2 text-blue-600" /> {company.name}
      </h3>
      <p className="text-gray-700 mt-1 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-red-500" /> {company.address}
      </p>
      <p className="text-gray-600 mt-2 flex items-center">
        <FaClock className="mr-2 text-green-500" /> 
        Open: {company.openingHours} - Close: {company.closingHours}
      </p>
      <p className="text-blue-600 mt-2 text-sm">{company.email}</p>
    </div>
  );
};

export default CompanyCard;