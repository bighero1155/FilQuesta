import React, { useState } from 'react';
import { Users, Package, FileText, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/Users/UserManagement';
import CosmeticsPage from '../components/Cosmetics/CosmeticsPage';
import AdminDashboardCSS from '../styles/AdminDashboardCSS';
import AdminReports from './AdminReports';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'cosmetics' | 'reports'>('users');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/intro', { replace: true });
  };

  const renderCosmeticsTab = () => (
    <div className="cosmetics-content">
      <CosmeticsPage />
    </div>
  );

  const renderReportsTab = () => (
    <div className="reports-content">
      <AdminReports />
    </div>
  );

  return (
    <div className="admin-dashboard">
      <AdminDashboardCSS />
      
      {/* Animated Background Elements */}
      <div className="science-bg-elements">
        <div className="molecule molecule-1">⚛️</div>
        <div className="molecule molecule-2">🧬</div>
        <div className="molecule molecule-3">🔬</div>
        <div className="molecule molecule-4">🧪</div>
        <div className="molecule molecule-5">⚗️</div>
        <div className="molecule molecule-6">🌡️</div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h4 className="mb-0 fw-bold">🔬 Admin Dashboard</h4>
          </div>
          <div className="nav-tabs-container">
            <button
              className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} className="tab-icon" />
              Users
            </button>
            <button
              className={`nav-tab ${activeTab === 'cosmetics' ? 'active' : ''}`}
              onClick={() => setActiveTab('cosmetics')}
            >
              <Package size={20} className="tab-icon" />
              Cosmetics
            </button>
            <button
              className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <FileText size={20} className="tab-icon" />
              Reports
            </button>
            <button
              className="nav-tab logout-tab"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} className="tab-icon" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="content-area">
        {activeTab === 'users' && (
          <div className="tab-content-wrapper">
            <UserManagement />
          </div>
        )}
        {activeTab === 'cosmetics' && renderCosmeticsTab()}
        {activeTab === 'reports' && renderReportsTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;