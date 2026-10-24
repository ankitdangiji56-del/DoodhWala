import React from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, CheckSquare, MapPin, RefreshCw, Settings, LogOut, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useStore } from '../../lib/store';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { label: 'Analytics Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products & Variants', path: '/admin/products', icon: Package },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingCart },
    { label: 'UPI Payment Queue', path: '/admin/payments', icon: CheckSquare },
    { label: 'Delivery Zones & Areas', path: '/admin/delivery-zones', icon: MapPin },
    { label: 'Daily Subscriptions', path: '/admin/subscriptions', icon: RefreshCw },
    { label: 'Storefront & Content', path: '/admin/settings', icon: Settings },
  ];

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleAdminSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--color-dark-blue)',
          color: '#E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🥛</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-white)' }}>
              Doodhwala Admin
            </span>
          </div>
          <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
            Staff Operations Portal
          </span>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.5rem' }}>
            Logged in: <strong>{currentUser.name}</strong>
          </div>
        </div>

        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flexGrow: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--color-white)' : '#9CA3AF',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--color-ghee-gold)' : '#9CA3AF'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#D1D5DB',
              fontSize: '0.85rem',
              padding: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>Storefront View</span>
          </Link>

          <button
            onClick={handleAdminSignOut}
            className="btn btn-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#E5E7EB', border: 'none', justifyContent: 'flex-start', gap: '0.5rem' }}
          >
            <LogOut size={15} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main style={{ flexGrow: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};
