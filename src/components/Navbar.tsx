
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CustomButton } from './ui/custom-button';

const Navbar: React.FC = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold transition-all duration-300 hover:opacity-80"
          >
            <span className="text-primary">Job</span>Hub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium hover:text-primary transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center font-medium hover:text-primary transition-colors">
                  Admin <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link 
                    to="/admin/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/jobs" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Manage Jobs
                  </Link>
                  <Link 
                    to="/admin/applications" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Applications
                  </Link>
                </div>
              </div>
            )}
            {currentUser ? (
              <CustomButton 
                variant="secondary" 
                onClick={logout}
                className="font-medium"
              >
                Sign Out
              </CustomButton>
            ) : (
              <Link to="/login">
                <CustomButton 
                  variant="default" 
                  className="font-medium flex items-center"
                >
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </CustomButton>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden ${
          isOpen ? 'max-h-64 shadow-md' : 'max-h-0'
        } overflow-hidden transition-all duration-300 bg-white`}
      >
        <div className="container mx-auto px-4 py-3">
          <Link 
            to="/" 
            className={`block py-2 font-medium hover:text-primary transition-colors ${
              location.pathname === '/' ? 'text-primary' : 'text-foreground'
            }`}
          >
            Home
          </Link>
          {isAdmin && (
            <>
              <Link 
                to="/admin/dashboard" 
                className="block py-2 font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/jobs" 
                className="block py-2 font-medium hover:text-primary transition-colors"
              >
                Manage Jobs
              </Link>
              <Link 
                to="/admin/applications" 
                className="block py-2 font-medium hover:text-primary transition-colors"
              >
                Applications
              </Link>
            </>
          )}
          {currentUser ? (
            <button 
              onClick={logout}
              className="block w-full text-left py-2 font-medium hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link 
              to="/login" 
              className="block py-2 font-medium hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
