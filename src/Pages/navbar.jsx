import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { logOut } from '@/Api/authApi';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { role, setRole } = useContext(UserContext);

  if (!role) {
    setRole(localStorage.getItem('role'));
  }

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      setRole(null);
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.log('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-[#030609] py-4 px-6 md:px-12 flex items-center justify-between shadow-md">
      {/* Left: Logo */}
      <div className="text-2xl font-bold text-yellow-600">eKit</div>

      {/* Middle: Links */}
      <div className="flex-grow flex justify-center space-x-4 md:space-x-6">
        <Link
          to="/"
          className="text-white hover:text-blue-600 font-semibold transition-colors duration-300"
        >
          Home
        </Link>

        {role === 'operator' && (
          <>
            <Link
              to="/scheduler"
              className="text-white hover:text-blue-600 font-semibold transition-colors duration-300"
            >
              Schedule a Bus
            </Link>
           
          </>
        )}

        {role === 'user' && (
          <Link
            to="/search"
            className="text-white hover:text-blue-600 font-semibold transition-colors duration-300"
          >
            Search
          </Link>
        )}
      </div>

      {/* Right: Button */}
      <div>
        {role ? (
          <Button
            onClick={handleLogout}
            className="bg-transparent  text-white font-semibold px-4 py-2 rounded-md"
          >
            Logout
          </Button>
        ) : (
          <Link to="/login">
            <Button className=" text-white font-semibold px-4 py-2 rounded-md">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
