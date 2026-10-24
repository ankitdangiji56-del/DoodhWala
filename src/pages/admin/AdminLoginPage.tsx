import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../lib/store';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin, currentUser } = useStore();

  const [identifier, setIdentifier] = useState('admin@doodhwala.local');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as admin, redirect to /admin
  if (currentUser?.role === 'admin') {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await adminLogin(identifier, password);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Administrative login failed.');
      return;
    }

    navigate('/admin', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Return to Storefront */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/"
            style={{
              color: '#94A3B8',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Doodhwala Storefront</span>
          </Link>
        </div>

        <div
          style={{
            backgroundColor: '#1E293B',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid #334155',
            color: '#F8FAFC',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 176, 65, 0.15)',
                color: 'var(--color-ghee-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                border: '1px solid rgba(245, 176, 65, 0.3)',
              }}
            >
              <Shield size={28} />
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '0.35rem' }}>
              Doodhwala Staff Portal
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              Authorized administration & fulfillment access only.
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                color: '#FCA5A5',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#CBD5E1' }} htmlFor="admin-email">
                Administrator Identifier (Email / Mobile)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  id="admin-email"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="form-input"
                  style={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    color: '#F8FAFC',
                    paddingLeft: '2.4rem',
                  }}
                  placeholder="admin@doodhwala.local"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: '#CBD5E1' }} htmlFor="admin-pass">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  id="admin-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    color: '#F8FAFC',
                    paddingLeft: '2.4rem',
                  }}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', fontWeight: 700 }}
              id="admin-login-submit"
            >
              {loading ? 'Verifying...' : 'Authenticate Staff Access'}
            </button>
          </form>

          {/* Secure Setup Note for Founder */}
          <div
            style={{
              marginTop: '2rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.75rem',
              color: '#94A3B8',
              lineHeight: 1.5,
            }}
          >
            <strong>Default Local Credentials:</strong><br />
            ID: <code>admin@doodhwala.local</code> | Pass: <code>Admin@Doodhwala2026</code><br />
            <span style={{ color: '#64748B' }}>
              Production administrators are promoted securely via Supabase SQL.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
