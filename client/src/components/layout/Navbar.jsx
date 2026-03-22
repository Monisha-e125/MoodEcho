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

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 bg-dark-900/80 backdrop-blur-md
        border-b border-dark-800 z-30 flex items-center px-4 lg:px-6
        transition-all duration-300
        ${sidebarOpen ? 'left-0 lg:left-64' : 'left-0 lg:left-20'}
      `}
    >
      {/* Mobile menu button */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Greeting */}
      <div className="ml-2 lg:ml-0">
        <h2 className="text-sm font-medium text-dark-200">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h2>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Streak */}
        {user?.moodStreak?.current > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-medium text-orange-400">
              {user.moodStreak.current} day streak
            </span>
          </div>
        )}

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 relative">
          <Bell className="w-5 h-5" />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"
        >
          <User className="w-5 h-5" />
        </button>

        {/* Logout */}
        <button
          onClick={() => dispatch(logoutUser())}
          className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-red-400"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default Navbar;