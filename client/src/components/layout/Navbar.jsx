import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { Menu, Bell, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const { sidebarOpen } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const iconBtn = {
    padding: '8px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: sidebarOpen ? '256px' : '72px',
        height: '64px',
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e293b',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        transition: 'left 0.3s ease',
      }}
    >
      {/* Mobile menu */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        style={{ ...iconBtn, marginRight: '8px' }}
        className="lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Greeting */}
      <div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </p>
      </div>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Streak */}
        {user?.moodStreak?.current > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid rgba(249, 115, 22, 0.2)',
              marginRight: '8px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🔥</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#fb923c' }}>
              {user.moodStreak.current} day streak
            </span>
          </div>
        )}

        <button
          onClick={() => navigate('/settings')}
          style={iconBtn}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#1e293b'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
        >
          <Bell size={18} />
        </button>

        <button
          onClick={() => navigate('/settings')}
          style={iconBtn}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#1e293b'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
        >
          <User size={18} />
        </button>

        <button
          onClick={() => dispatch(logoutUser())}
          title="Logout"
          style={iconBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1e293b';
            e.target.style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#94a3b8';
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;