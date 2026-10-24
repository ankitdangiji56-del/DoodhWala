import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, RefreshCw, Heart, LogOut, MapPin, Shield, CheckCircle } from 'lucide-react';
import { useStore } from '../../lib/store';

export const AccountDashboardPage: React.FC = () => {
  const { currentUser, logout, orders, subscriptions, wishlist } = useStore();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="section section-white">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.5rem',
            gap: '1rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-dark-blue)' }}>
              My Account
            </h1>
            <p style={{ color: 'var(--color-light-gray)' }}>
              Welcome back, <strong>{currentUser.name}</strong> ({currentUser.phone})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {currentUser.role === 'admin' && (
              <Link to="/admin" className="btn btn-gold btn-sm" style={{ gap: '0.35rem' }}>
                <Shield size={15} />
                <span>Open Admin Portal</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              style={{ gap: '0.35rem', color: 'var(--color-red-danger)', borderColor: 'var(--color-border-dark)' }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <Link to="/account/orders" className="card" style={{ padding: '1.5rem', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--color-milk-blue-light)', color: 'var(--color-milk-blue)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
                <Package size={22} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Orders Placed</span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
              {orders.length}
            </div>
          </Link>

          <Link to="/subscriptions" className="card" style={{ padding: '1.5rem', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--color-fresh-green-light)', color: 'var(--color-fresh-green)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
                <RefreshCw size={22} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Subscriptions</span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
              {subscriptions.filter((s) => s.status === 'active').length} Active
            </div>
          </Link>

          <Link to="/account/wishlist" className="card" style={{ padding: '1.5rem', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
                <Heart size={22} />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Saved Items</span>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
              {wishlist.length}
            </div>
          </Link>
        </div>

        {/* Profile & Addresses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Profile Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
              Customer Profile
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ color: 'var(--color-light-gray)', fontSize: '0.8rem' }}>Full Name</div>
                <div style={{ fontWeight: 600, color: 'var(--color-dark-gray)' }}>{currentUser.name}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-light-gray)', fontSize: '0.8rem' }}>Mobile Phone</div>
                <div style={{ fontWeight: 600, color: 'var(--color-dark-gray)' }}>{currentUser.phone}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-light-gray)', fontSize: '0.8rem' }}>Email</div>
                <div style={{ fontWeight: 600, color: 'var(--color-dark-gray)' }}>{currentUser.email}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-light-gray)', fontSize: '0.8rem' }}>Account Role</div>
                <div style={{ display: 'inline-flex' }}>
                  <span className={`badge ${currentUser.role === 'admin' ? 'badge-warning' : 'badge-neutral'}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-fresh-green)', fontSize: '0.85rem' }}>
                <CheckCircle size={16} />
                <span>WhatsApp Notification Updates Active</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
              Primary Delivery Address
            </h3>
            {currentUser.addresses.length > 0 ? (
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-dark-gray)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <MapPin size={18} color="var(--color-milk-blue)" />
                  <span>{currentUser.addresses[0].recipient_name}</span>
                </div>
                <p>
                  {currentUser.addresses[0].address_line1}<br />
                  {currentUser.addresses[0].address_line2 ? `${currentUser.addresses[0].address_line2}, ` : ''}
                  {currentUser.addresses[0].landmark ? `Near ${currentUser.addresses[0].landmark}, ` : ''}<br />
                  {currentUser.addresses[0].city} — <strong>{currentUser.addresses[0].postal_code}</strong>
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-light-gray)' }}>
                  Phone: {currentUser.addresses[0].phone}
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--color-light-gray)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  No saved address yet. Your address will be saved upon your first checkout.
                </p>
                <Link to="/products" className="btn btn-outline btn-sm">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
