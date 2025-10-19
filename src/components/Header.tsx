import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Pill, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from './ui';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md'
          : 'bg-background/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 dark:shadow-cyan-500/20" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)' }}>
                <Pill className="w-6 h-6 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                  Pharma Discount Finder
                </span>
                <span className="text-xs text-muted-foreground font-medium dark:text-cyan-400/80">
                  Medication Made Affordable
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-primary dark:hover:text-cyan-400 transition-colors duration-200 font-medium relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 dark:from-cyan-400 dark:to-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-foreground hover:text-primary dark:hover:text-cyan-400 transition-colors duration-200 font-medium relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 dark:from-cyan-400 dark:to-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent/50 dark:hover:bg-accent/20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-cyan-400 dark:to-emerald-400 flex items-center justify-center shadow-lg dark:shadow-cyan-500/30">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:inline dark:text-cyan-100">{user.email}</span>
                  </Button>
                }
              >
                <DropdownMenuLabel className="dark:text-cyan-100">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  icon={<LayoutDashboard className="w-4 h-4 dark:text-cyan-400" />}
                  onClick={() => navigate('/dashboard')}
                  className="dark:hover:bg-accent/30"
                >
                  Dashboard
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    icon={<Shield className="w-4 h-4 dark:text-emerald-400" />}
                    onClick={() => navigate('/admin')}
                    className="dark:hover:bg-accent/30"
                  >
                    Admin Portal
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  icon={<LogOut className="w-4 h-4 dark:text-red-400" />}
                  onClick={handleSignOut}
                  className="dark:hover:bg-accent/30"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="default" size="sm" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent dark:hover:bg-accent/30 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground dark:text-cyan-400" />
            ) : (
              <Menu className="w-6 h-6 text-foreground dark:text-cyan-400" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </nav>
            
            {/* Mobile Theme Toggle and Auth Buttons */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-border">
              <div className="flex justify-center mb-2">
                <ThemeToggle />
              </div>
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => { navigate(isAdmin ? '/admin' : '/dashboard'); setIsMenuOpen(false); }}>
                    <User className="w-4 h-4 mr-2" />
                    {isAdmin ? 'Admin' : 'Dashboard'}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                    Login
                  </Button>
                  <Button variant="default" size="sm" className="w-full" onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};