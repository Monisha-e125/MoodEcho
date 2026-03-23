import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import {
  LayoutDashboard, BookOpen, BarChart3, Sparkles,
  MessageCircle, Settings, ChevronLeft, Phone
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/journal', icon: BookOpen, label: 'Mood Journal' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/wellness', icon: Sparkles, label: 'Wellness' },
  { to: '/support', icon: MessageCircle, label: 'Support' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const { sidebarOpen } = useSelector((s) => s.ui);
  const dispatch = useDispatch();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => dispatch(toggleSidebar())}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 40,
          }}
          className="lg:hidden"
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: sidebarOpen ? '256px' : '72px',
          backgroundColor: '#0f172a',
          borderRight: '1px solid #1e293b',
          zIndex: 50,
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🧠
            </div>
            {sidebarOpen && (
              <span style={{ fontSize: '17px', fontWeight: '800', color: '#f1f5f9' }}>
                Mood<span style={{ color: '#818cf8' }}>Echo</span>
              </span>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              style={{
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
              }}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => {
                if (window.innerWidth < 1024) dispatch(toggleSidebar());
              }}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: sidebarOpen ? '10px 14px' : '10px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#818cf8' : '#94a3b8',
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                transition: 'all 0.2s ease',
              })}
            >
              <Icon size={20} />
              {sidebarOpen && label}
            </NavLink>
          ))}
        </nav>

        {/* Crisis Link */}
        {sidebarOpen && (
          <div style={{ padding: '12px' }}>
            <NavLink
              to="/crisis-help"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600',
                color: '#f87171',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              <Phone size={16} />
              Crisis Helplines
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;