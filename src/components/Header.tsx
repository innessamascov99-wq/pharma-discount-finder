import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Search className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-slate-800">Pharma Discount Finder</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`transition-colors font-medium ${
                location.pathname === '/' 
                  ? 'text-blue-600' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors font-medium ${
                location.pathname === '/about' 
                  ? 'text-blue-600' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              About
            </Link>
            <Link 
              to="/faq" 
              className={`transition-colors font-medium ${
                location.pathname === '/faq' 
                  ? 'text-blue-600' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors font-medium ${
                location.pathname === '/contact' 
                  ? 'text-blue-600' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Login/Sign Up */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login"
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}