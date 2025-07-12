import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, User, MessageSquare, LogIn, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const handleMobileToggle = () => setMobileOpen((open) => !open);

  return (
    <nav className="glass-effect border-b border-white/20 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center text-xl font-bold text-white text-glow">
            Skill Swap
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
              <div className="hidden md:flex items-center space-x-3">
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
                className="hidden md:flex items-center space-x-1 btn-primary"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}
            {/* Hamburger Button */}
            <button
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
              onClick={handleMobileToggle}
              aria-label="Open menu"
            >
              <Menu size={28} className="text-white" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-200 ${mobileOpen ? 'block' : 'hidden'}`}>
          <div className="py-4 border-t border-white/20 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            {isLoggedIn && (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/requests" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
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
            {!isLoggedIn && (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 btn-primary w-full justify-center"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 