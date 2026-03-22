import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import {
  LayoutDashboard, BookOpen, BarChart3, Sparkles,
  MessageCircle, Settings, ChevronLeft, Heart, Phone
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/journal', icon: BookOpen, label: 'Mood Journal' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/wellness', icon: Sparkles, label: 'Wellness' },
  { to: '/support', icon: MessageCircle, label: 'Support' },
  { to: '/settings', icon: Settings, label: 'Settings' }
];

const Sidebar = () => {
  const { sidebarOpen } = useSelector((s) => s.ui);
  const dispatch = useDispatch();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-dark-900 border-r border-dark-800
          z-50 transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-lg">🧠</span>
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold text-white">
                Mood<span className="text-primary-400">Echo</span>
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 hidden lg:block"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-primary-600/15 text-primary-400 border border-primary-500/20'
                  : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
                }
                ${!sidebarOpen ? 'justify-center' : ''}`
              }
              onClick={() => {
                if (window.innerWidth < 1024) dispatch(toggleSidebar());
              }}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Crisis Help Link */}
        {sidebarOpen && (
          <div className="absolute bottom-4 left-3 right-3">
            <NavLink
              to="/crisis-help"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Crisis Helplines</span>
              <Heart className="w-3.5 h-3.5 ml-auto" />
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;