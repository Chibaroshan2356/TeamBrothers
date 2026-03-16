import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bus, Shield, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/fleet', label: 'Our Fleet' },
  { href: '/booking', label: 'Book Now' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/65 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center gap-2 font-heading font-bold text-xl group text-black"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">Team Brother's</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all duration-200 relative",
                    location.pathname === link.href
                      ? "bg-primary text-black"
                      : "text-gray-800 hover:text-black hover:bg-gray-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons & Mobile Menu */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button variant="gradient" size="sm" onClick={() => navigate('/signup')}>
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium transition-all",
                    location.pathname === link.href
                      ? "bg-primary text-black"
                      : "text-foreground/70 hover:bg-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-border pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-black">
                    {user?.name || 'User'}{isAdmin ? ' (Admin)' : ''}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-lg font-medium transition-all text-foreground/70 hover:bg-accent flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-lg font-medium transition-all text-foreground/70 hover:bg-accent flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all text-foreground/70 hover:bg-accent flex items-center gap-2 text-left"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg font-medium transition-all text-foreground/70 hover:bg-accent flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-lg font-medium transition-all text-foreground/70 hover:bg-accent"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-lg font-medium transition-all text-foreground/70 hover:bg-accent"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
