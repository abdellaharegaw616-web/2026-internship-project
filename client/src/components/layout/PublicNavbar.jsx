import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LogoMark from '../LogoMark';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark size={32} className="shrink-0" />
            <span className="text-xl font-semibold text-gray-900">TaskFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
            <a href="/#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="/#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition-colors">
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <Link to="/" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <a href="/#features" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="/#how-it-works" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <Link to="/about" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Link to="/login" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium text-center hover:bg-[#1D4ED8] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
