import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">Company Registry</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
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

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none focus:text-blue-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="flex items-center hover:text-blue-200 transition py-2"
                onClick={closeMenu}
              >
                <FaHome className="mr-2" /> Home
              </Link>
              <Link 
                to="/register" 
                className="flex items-center hover:text-blue-200 transition py-2"
                onClick={closeMenu}
              >
                <FaUserPlus className="mr-2" /> Register
              </Link>
              <Link 
                to="/search" 
                className="flex items-center hover:text-blue-200 transition py-2"
                onClick={closeMenu}
              >
                <FaSearch className="mr-2" /> Search
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;