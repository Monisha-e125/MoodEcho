import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import CrisisBanner from '../common/CrisisBanner';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { sidebarOpen } = useSelector((s) => s.ui);

  return (
    <div className="min-h-screen bg-dark-950">
      <CrisisBanner />
      <Sidebar />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        <Navbar />
        <main className="p-4 lg:p-6 mt-16">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;