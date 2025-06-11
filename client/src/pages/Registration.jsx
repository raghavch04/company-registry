import React, { useState, useEffect } from 'react';
import { useUser, SignInButton, useSignIn } from '@clerk/clerk-react';
import { FaClock, FaMapMarkedAlt, FaSave, FaUndo } from 'react-icons/fa';
import AddressMap from '../components/AddressMap';
import { companyApi, geocodeApi, formatCoordinates } from '../utils/api';
import Swal from 'sweetalert2';
import 'animate.css';

const Registration = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn } = useSignIn();

  // Wait for Clerk to load before rendering anything
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      Swal.fire({
        title: 'You must sign in!',
        text: 'Please sign in to register your company.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sign In',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed && openSignIn) {
          openSignIn();
        }
      });
    }
  }, [isLoaded, isSignedIn, openSignIn]);

  // Show SweetAlert2 popup if not signed in
  if (!isSignedIn) {
    Swal.fire({
      title: 'You must sign in!',
      text: 'Please sign in to register your company.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sign In',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed && openSignIn) {
        openSignIn();
      }
    });

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate__animated animate__pulse">
        <div className="text-center">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW9yZ3l3b3V2cW9tZ3F3Z3R4eGJ0d2J2a2JjZGZxZzV6eW1wZ3B4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMHxhOfscxPfIfm/giphy.gif" 
            alt="Sign In Required" 
            className="w-48 mx-auto mb-6 rounded-lg"
          />
          <h2 className="text-2xl font-bold mb-4">Please Sign In First! 🔐</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to register your company.</p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center mx-auto animate__animated animate__bounceIn">
              <span className="mr-2">🔑</span> Sign In Now
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    companyName: '',
    address: '',
    openingHours: '09:00',
    closingHours: '17:00',
    coordinates: null
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    companyName: false,
    address: false,
    coordinates: false,
    time: false
  });

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now());

  const validateTime = (opening, closing) => {
    const openingTime = new Date(`2000-01-01T${opening}`);
    const closingTime = new Date(`2000-01-01T${closing}`);
    return closingTime > openingTime;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false, time: false }));

    if (name === 'address' && value.length > 2) {
      fetchAddressSuggestions(value);
    } else if (name === 'address') {
      setAddressSuggestions([]);
    }
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      const suggestions = await geocodeApi.forward(query);
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
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
    setErrors(prev => ({ ...prev, address: false, coordinates: false }));
    setShowSuggestions(false);
    setIsMapInteractive(true);
    setMapKey(Date.now());
  };

  const handleMapClick = async (coordinates) => {
    setFormData(prev => ({
      ...prev,
      coordinates
    }));
    setErrors(prev => ({ ...prev, coordinates: false }));
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Company registered successfully!',
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__bounceIn'
      },
      hideClass: {
        popup: 'animate__animated animate__bounceOut'
      }
    });
  };

  const showValidationError = (message) => {
    Swal.fire({
      title: 'Validation Error!',
      text: message,
      icon: 'error',
      showClass: {
        popup: 'animate__animated animate__headShake'
      }
    });
  };

  const showDuplicateError = () => {
    Swal.fire({
      title: 'Duplicate Entry!',
      text: 'Company/email is already registered with us!',
      icon: 'error',
      showClass: {
        popup: 'animate__animated animate__shakeX'
      }
    });
  };

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      email: !formData.email,
      companyName: !formData.companyName,
      address: !formData.address,
      coordinates: !formData.coordinates,
      time: !validateTime(formData.openingHours, formData.closingHours)
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Time validation before anything else
    const opening = new Date(`2000-01-01T${formData.openingHours}`);
    const closing = new Date(`2000-01-01T${formData.closingHours}`);
    if (closing <= opening) {
      setErrors(prev => ({ ...prev, time: true }));
      showValidationError('Closing time must be after opening time!');
      return;
    }

    if (!validateForm()) {
      showValidationError('Please fill in all required fields correctly!');
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
      showSuccessAlert();
    } catch (error) {
      const msg = error.response?.data?.message || '';
      if (
        msg.toLowerCase().includes('email') &&
        (msg.toLowerCase().includes('exists') ||
          msg.toLowerCase().includes('duplicate') ||
          msg.toLowerCase().includes('unique'))
      ) {
        showDuplicateError();
      } else {
        showValidationError(msg || 'Failed to register company');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: user?.primaryEmailAddress?.emailAddress || '',
      companyName: '',
      address: '',
      openingHours: '09:00',
      closingHours: '17:00',
      coordinates: null
    });
    setErrors({
      firstName: false,
      lastName: false,
      email: false,
      companyName: false,
      address: false,
      coordinates: false,
      time: false
    });
    setAddressSuggestions([]);
    setIsMapInteractive(false);
    setMapKey(Date.now());
  };

  // Helper function to determine input border color
  const getInputBorder = (fieldName) => {
    return errors[fieldName] 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  };

  return (
    <div className="container mx-auto px-4 py-8 animate__animated animate__fadeIn">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Company Registration 🏢</h1>

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
                className={`w-full px-4 py-2 border rounded-lg ${getInputBorder('firstName')}`}
                required
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 animate__animated animate__fadeIn">Please enter your first name</p>
              )}
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
                className={`w-full px-4 py-2 border rounded-lg ${getInputBorder('lastName')}`}
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 animate__animated animate__fadeIn">Please enter your last name</p>
              )}
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
              className={`w-full px-4 py-2 border rounded-lg ${getInputBorder('email')}`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 animate__animated animate__fadeIn">Please enter a valid email</p>
            )}
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
              className={`w-full px-4 py-2 border rounded-lg ${getInputBorder('companyName')}`}
              required
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600 animate__animated animate__fadeIn">Please enter your company name</p>
            )}
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
                className={`w-full px-4 py-2 border rounded-lg ${getInputBorder('address')}`}
                required
                autoComplete="off"
              />
              {showSuggestions && addressSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto animate__animated animate__fadeIn">
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
            {errors.address && (
              <p className="mt-1 text-sm text-red-600 animate__animated animate__fadeIn">Please enter a valid address</p>
            )}
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <FaMapMarkedAlt className="mr-1" />
              {formData.coordinates ? (
                <span>{formatCoordinates(formData.coordinates)} 📍</span>
              ) : (
                <span className={errors.coordinates ? 'text-red-600 animate__animated animate__fadeIn' : ''}>
                  {errors.coordinates ? 'Please select a location' : 'No location selected'}
                </span>
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
                  <div className="bg-white p-4 rounded-lg text-center animate__animated animate__pulse">
                    <p className="font-medium">Click to enable map interaction 🗺️</p>
                    <p className="text-sm text-gray-600">You can click on the map to set location</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="openingHours" className="text-gray-700 font-medium mb-2 flex items-center">
                <FaClock className="mr-2" /> Opening Hours ⏰
              </label>
              <input
                type="time"
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg ${errors.time ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                required
              />
            </div>
            <div>
              <label htmlFor="closingHours" className="text-gray-700 font-medium mb-2 flex items-center">
                <FaClock className="mr-2" /> Closing Hours ⏰
              </label>
              <input
                type="time"
                id="closingHours"
                name="closingHours"
                value={formData.closingHours}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg ${errors.time ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                required
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600 animate__animated animate__fadeIn">Closing time must be after opening time</p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition animate__animated animate__fadeIn"
            >
              <FaUndo className="mr-2" /> Reset 🔄
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 animate__animated animate__fadeIn"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting... ⏳
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Submit 🚀
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