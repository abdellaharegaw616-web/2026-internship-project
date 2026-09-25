import { Link } from 'react-router-dom';
import LogoMark from '../LogoMark';
import { COMPANY_INFO } from '../../constants/contactInfo';

export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LogoMark size={24} className="shrink-0" />
              <span className="text-lg font-semibold text-gray-900">TaskFlow</span>
            </div>
            <p className="text-sm text-gray-600">{COMPANY_INFO.tagline}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-gray-900 transition-colors">Home</Link></li>
              <li><a href="/#features" className="hover:text-gray-900 transition-colors">Features</a></li>
              <li><a href="/#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a></li>
              <li><Link to="/login" className="hover:text-gray-900 transition-colors">Login</Link></li>
            </ul>
          </div>


          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {COMPANY_INFO.year} {COMPANY_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
