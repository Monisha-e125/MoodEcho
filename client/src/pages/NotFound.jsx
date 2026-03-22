import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
    <div className="text-center">
      <span className="text-6xl mb-4 block">🔍</span>
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-dark-400 mb-6">Page not found</p>
      <Link to="/">
        <Button><Home className="w-4 h-4" /> Go Home</Button>
      </Link>
    </div>
  </div>
);

export default NotFound;