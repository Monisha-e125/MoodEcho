import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: '#020617',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🔍</span>
      <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#f1f5f9' }}>404</h1>
      <p style={{ color: '#64748b', fontSize: '16px', marginTop: '8px', marginBottom: '28px' }}>
        Page not found
      </p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button size="lg">
          <Home size={16} /> Go Home
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFound;