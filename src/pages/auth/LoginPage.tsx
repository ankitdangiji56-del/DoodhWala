import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Phone, Lock, KeyRound, Shield, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/account';

  const { login } = useStore();
  const { t } = useLanguage();

  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 600);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const credential = authMethod === 'password' ? password : otpCode;
    const res = await login(identifier, credential, authMethod === 'otp');

    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Login failed.');
      return;
    }

    navigate(from);
  };

  return (
    <div className="section section-cream" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '2.25rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-milk-blue-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
              }}
            >
              🥛
            </div>
            <h1 style={{ fontSize: '1.65rem', color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
              {t('login_welcome')}
            </h1>
            <p style={{ color: 'var(--color-light-gray)', fontSize: '0.875rem' }}>
              {t('login_desc')}
            </p>
          </div>

          {/* Tab Selector */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-surface-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '0.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: authMethod === 'password' ? 'var(--color-white)' : 'transparent',
                fontWeight: authMethod === 'password' ? 600 : 500,
                color: authMethod === 'password' ? 'var(--color-dark-blue)' : 'var(--color-light-gray)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: authMethod === 'password' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: authMethod === 'otp' ? 'var(--color-white)' : 'transparent',
                fontWeight: authMethod === 'otp' ? 600 : 500,
                color: authMethod === 'otp' ? 'var(--color-dark-blue)' : 'var(--color-light-gray)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: authMethod === 'otp' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              Phone OTP
            </button>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'var(--color-red-light)',
                color: 'var(--color-red-danger)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={authMethod === 'otp' && !otpSent ? handleSendOtp : handleLogin}>
            {authMethod === 'password' ? (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Email or Username</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-light-gray)' }} />
                    <input
                      id="login-email"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                      placeholder="e.g. customer@example.local or admin"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-light-gray)' }} />
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-phone">Mobile Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-light-gray)' }} />
                    <input
                      id="login-phone"
                      type="tel"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.4rem' }}
                      placeholder="e.g. +91 98765 43210"
                      disabled={otpSent}
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="login-otp">Enter 6-Digit OTP</label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-light-gray)' }} />
                      <input
                        id="login-otp"
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '2.4rem' }}
                        placeholder="Enter 6-digit code"
                      />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)', marginTop: '0.35rem' }}>
                      * Production uses genuine configured SMS provider. Any 6 digits work in demo preview.
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem' }}
              id="login-submit-button"
            >
              {loading
                ? '...'
                : authMethod === 'otp' && !otpSent
                ? 'Send Verification OTP'
                : t('login_submit')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-light-gray)' }}>
            <Link to="/signup" style={{ color: 'var(--color-milk-blue)', fontWeight: 600 }}>
              {t('nav_signup')}
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.78rem' }}>
            <Link to="/admin/login" style={{ color: 'var(--color-light-gray)', textDecoration: 'none' }}>
              Staff / Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
