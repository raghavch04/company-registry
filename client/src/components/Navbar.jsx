import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">Company Registry</span>
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className="flex items-center hover:text-blue-200 transition">
              <FaHome className="mr-1" /> Home
            </Link>
            <Link to="/register" className="flex items-center hover:text-blue-200 transition">
              <FaUserPlus className="mr-1" /> Register
            </Link>
            <Link to="/search" className="flex items-center hover:text-blue-200 transition">
              <FaSearch className="mr-1" /> Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;