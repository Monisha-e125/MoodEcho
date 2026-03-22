import { Link } from 'react-router-dom';
import { Heart, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="px-6 py-6 border-t border-dark-800 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Disclaimer */}
        <p className="text-xs text-dark-600 text-center md:text-left">
          ⚠️ MoodEcho is a wellness tool, not a substitute for professional mental health care.
        </p>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/crisis-help"
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <Phone className="w-3 h-3" />
            Crisis Help
          </Link>

          <span className="text-dark-700">|</span>

          <span className="flex items-center gap-1 text-xs text-dark-600">
            Built with <Heart className="w-3 h-3 text-red-500" /> for better mental wellness
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;