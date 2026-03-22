import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, setInitialized } from './store/slices/authSlice';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MoodJournal from './pages/MoodJournal';
import Analytics from './pages/Analytics';
import Wellness from './pages/Wellness';
import Support from './pages/Support';
import Settings from './pages/Settings';
import CrisisHelp from './pages/CrisisHelp';
import NotFound from './pages/NotFound';

// Components
import Loader from './components/common/Loader';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Guest Route wrapper (redirect to dashboard if logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) return <Loader fullScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getMe());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  if (!isInitialized) return <Loader fullScreen />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/crisis-help" element={<CrisisHelp />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="journal" element={<MoodJournal />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="wellness" element={<Wellness />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;