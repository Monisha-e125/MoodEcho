import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CrisisBanner from '../common/CrisisBanner';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { sidebarOpen } = useSelector((s) => s.ui);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617' }}>
      <CrisisBanner />
      <Sidebar />

      <div
        style={{
          marginLeft: sidebarOpen ? '256px' : '72px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Navbar />
        <main
          style={{
            padding: '24px',
            marginTop: '64px',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <div
            style={{ maxWidth: '1200px', margin: '0 auto' }}
            className="animate-fade-in"
          >
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            padding: '16px 24px',
            textAlign: 'center',
            borderTop: '1px solid #1e293b',
          }}
        >
          <p style={{ fontSize: '11px', color: '#475569' }}>
            ⚠️ MoodEcho is a wellness tool, not a substitute for professional mental health care.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;