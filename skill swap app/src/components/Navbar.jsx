import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, User, MessageSquare, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white">
            <span className="text-primary-400">🔄</span>
            <span>Skill Swap</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            {isLoggedIn && (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/requests" 
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                >
                  <MessageSquare size={18} />
                  <span>Requests</span>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-300 text-sm hidden sm:block">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 btn-secondary"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1 btn-primary"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden py-4 border-t border-gray-700">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            {isLoggedIn && (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/requests" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <MessageSquare size={18} />
                  <span>Requests</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 btn-secondary w-full justify-start"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 