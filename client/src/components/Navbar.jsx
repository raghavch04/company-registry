import { useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, SignInButton, SignOutButton, UserButton, useSignIn } from '@clerk/clerk-react';
import { 
  FaHome, 
  FaSearch, 
  FaUserPlus, 
  FaBars, 
  FaTimes, 
  FaSignInAlt, 
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  //const { isSignedIn, user } = useUser();
  const { openSignIn } = useSignIn();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // const handleRegisterClick = (e) => {
  //   if (!isSignedIn) {
  //     e.preventDefault();
  //     Swal.fire({
  //       title: 'Sign In Required',
  //       text: 'Please sign in to register your company',
  //       icon: 'info',
  //       confirmButtonText: 'Sign In',
  //       showCancelButton: true,
  //       cancelButtonText: 'Cancel'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         document.querySelector('.cl-signIn-button')?.click();
  //       }
  //     });
  //   }
  // };

  const handleRegisterClick = (e) => {
  if (!isSignedIn) {
    e.preventDefault();
    Swal.fire({
      title: 'Sign In Required',
      text: 'Please sign in to register your company',
      icon: 'info',
      confirmButtonText: 'Sign In',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && openSignIn) {
        openSignIn();
      }
    });
  }
};

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">Company Registry</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="flex items-center hover:text-blue-200 transition">
              <FaHome className="mr-1" /> Home
            </Link>
            <Link
              to={isSignedIn ? "/register" : "#"}
              className="flex items-center hover:text-blue-200 transition"
              onClick={handleRegisterClick}
            >
              <FaUserPlus className="mr-1" /> Register
            </Link>
            <Link to="/search" className="flex items-center hover:text-blue-200 transition">
              <FaSearch className="mr-1" /> Search
            </Link>
            
            {isSignedIn ? (
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center">
                  <UserButton afterSignOutUrl="/" />
                  <span className="ml-2 text-sm">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
                <SignOutButton>
                  <button className="flex items-center hover:text-blue-200 transition">
                    <FaSignOutAlt className="mr-1" /> Sign Out
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="flex items-center hover:text-blue-200 transition ml-4">
                  <FaSignInAlt className="mr-1" /> Sign In
                </button>
              </SignInButton>
            )}
          </div>
          
          {/* Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            {isSignedIn && (
              <div className="mr-4 flex items-center">
                <UserButton afterSignOutUrl="/" />
                <span className="ml-1 text-sm hidden sm:inline">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="focus:outline-none focus:text-blue-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="flex items-center hover:text-blue-200 transition py-2" onClick={closeMenu}>
                <FaHome className="mr-2" /> Home
              </Link>
              <Link
                to={isSignedIn ? "/register" : "#"}
                className="flex items-center hover:text-blue-200 transition py-2"
                onClick={(e) => { handleRegisterClick(e); closeMenu(); }}
              >
                <FaUserPlus className="mr-2" /> Register
              </Link>
              <Link to="/search" className="flex items-center hover:text-blue-200 transition py-2" onClick={closeMenu}>
                <FaSearch className="mr-2" /> Search
              </Link>
              
              {isSignedIn ? (
                <>
                  <div className="flex items-center py-2">
                    <FaUserCircle className="mr-2" />
                    <span className="text-sm">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <SignOutButton>
                    <button className="flex items-center hover:text-blue-200 transition py-2">
                      <FaSignOutAlt className="mr-2" /> Sign Out
                    </button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="flex items-center hover:text-blue-200 transition py-2">
                    <FaSignInAlt className="mr-2" /> Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;