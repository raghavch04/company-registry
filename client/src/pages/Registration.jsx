import { useState, useEffect } from 'react';
import { FaCheck, FaClock, FaMapMarkedAlt, FaSave, FaUndo } from 'react-icons/fa';
import AddressMap from '../components/AddressMap';
import { companyApi, geocodeApi, formatCoordinates } from '../utils/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    address: '',
    openingHours: '09:00',
    closingHours: '17:00',
    coordinates: null
  });

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => setSubmitSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'address' && value.length > 2) {
      fetchAddressSuggestions(value);
    } else {
      setAddressSuggestions([]);
    }
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      const suggestions = await geocodeApi.forward(query);
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([
        { display: `${query}, New Delhi, India`, lat: 28.6139, lng: 77.2090 },
        { display: `${query}, Delhi, India`, lat: 28.7041, lng: 77.1025 }
      ]);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.display,
      coordinates: {
        lat: suggestion.lat,
        lng: suggestion.lng
      }
    }));
    setShowSuggestions(false);
    setIsMapInteractive(true);
    setMapKey(Date.now());
  };

  const handleMapClick = async (coordinates) => {
    setFormData(prev => ({
      ...prev,
      coordinates
    }));
    // Optionally, implement reverse geocoding here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.companyName ||
      !formData.address ||
      !formData.coordinates
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const companyData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyName: formData.companyName,
        address: formData.address,
        openingHours: formData.openingHours,
        closingHours: formData.closingHours,
        location: {
          type: 'Point',
          coordinates: [formData.coordinates.lng, formData.coordinates.lat]
        }
      };

      await companyApi.register(companyData);
      resetForm();
      // SweetAlert2 popup
      Swal.fire({
        icon: 'success',
        title: 'Company Registered!',
        text: 'Company registered successfully!',
        confirmButtonColor: '#2563eb'
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      companyName: '',
      address: '',
      openingHours: '09:00',
      closingHours: '17:00',
      coordinates: null
    });
    setAddressSuggestions([]);
    setIsMapInteractive(false);
    setMapKey(Date.now());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Company Registration</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="companyName" className="block text-gray-700 font-medium mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
              Address <span className="text-red-500">*</span> <span className="text-gray-500 text-sm font-normal">(Start typing to see suggestions)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                autoComplete="off"
              />
              {showSuggestions && addressSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {addressSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.display}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <FaMapMarkedAlt className="mr-1" />
              {formData.coordinates ? (
                <span>{formatCoordinates(formData.coordinates)}</span>
              ) : (
                <span>No location selected</span>
              )}
            </div>
          </div>

          {formData.address && (
            <div className="mb-6 h-64 rounded-lg overflow-hidden border border-gray-300 relative">
              <AddressMap
                key={mapKey}
                coordinates={formData.coordinates}
                address={formData.address}
                onMapClick={isMapInteractive ? handleMapClick : null}
              />
              {!isMapInteractive && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsMapInteractive(true)}
                >
                  <div className="bg-white p-4 rounded-lg text-center">
                    <p className="font-medium">Click to enable map interaction</p>
                    <p className="text-sm text-gray-600">You can click on the map to set location</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="openingHours" className=" text-gray-700 font-medium mb-2 flex items-center">
                <FaClock className="mr-2" /> Opening Hours
              </label>
              <input
                type="time"
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="closingHours" className=" text-gray-700 font-medium mb-2 flex items-center">
                <FaClock className="mr-2" /> Closing Hours
              </label>
              <input
                type="time"
                id="closingHours"
                name="closingHours"
                value={formData.closingHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              <FaUndo className="mr-2" /> Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <FaSave className="mr-2" /> Submit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;