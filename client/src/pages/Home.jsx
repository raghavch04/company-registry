import { Link } from 'react-router-dom';
import { FaArrowRight, FaBuilding, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import homeImage from '../assets/map-preview.jpg'; // Make sure this image exists

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="hero bg-blue-50 rounded-lg p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Company Registration Platform</h1>
            <p className="text-lg text-gray-600 mb-6">
              Register your business and make it discoverable on our interactive map. 
              Find companies near you with our advanced search features.
            </p>
            <div className="flex space-x-4">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center">
                Register Now <FaArrowRight className="ml-2" />
              </Link>
              <Link to="/search" className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition flex items-center">
                Search Companies <FaSearch className="ml-2" />
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src={homeImage} 
              alt="Map Preview" 
              className="rounded-lg shadow-lg w-full h-auto max-w-md mx-auto"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/600x400?text=Map+Preview';
              }}
            />
          </div>
        </div>
      </section>

      <section className="features mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Register With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 mb-4">
              <FaBuilding className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Business Visibility</h3>
            <p className="text-gray-600">Increase your company's visibility to potential customers searching in your area.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 mb-4">
              <FaMapMarkerAlt className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Precise Location</h3>
            <p className="text-gray-600">Show your exact location with interactive maps and detailed address information.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 mb-4">
              <FaSearch className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
            <p className="text-gray-600">Help customers find you with our powerful search and filtering options.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;