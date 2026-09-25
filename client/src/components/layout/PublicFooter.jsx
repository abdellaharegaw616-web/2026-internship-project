import { Link } from 'react-router-dom';
import LogoMark from '../LogoMark';
import { COMPANY_INFO } from '../../constants/contactInfo';

export default function PublicFooter() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LogoMark size={24} className="shrink-0" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">TaskFlow</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400">{COMPANY_INFO.tagline}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-[#2563EB] dark:hover:text-blue-400 dark:text-white transition-colors">Home</Link></li>
              <li><a href="/#features" className="hover:text-[#2563EB] dark:hover:text-blue-400 dark:text-white transition-colors">Features</a></li>
              <li><a href="/#how-it-works" className="hover:text-[#2563EB] dark:hover:text-blue-400 dark:text-white transition-colors">How It Works</a></li>
              <li><Link to="/login" className="hover:text-[#2563EB] dark:hover:text-blue-400 dark:text-white transition-colors">Login</Link></li>
            </ul>
          </div>


          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-[#2563EB] dark:hover:text-blue-400 dark:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-[#2563EB] dark:hover:text-blue-400 dark:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
          <p className="text-center text-sm text-gray-600 dark:text-slate-400">
            © {COMPANY_INFO.year} {COMPANY_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
