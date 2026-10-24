import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Shield } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, wishlist, currentUser, settings } = useStore();
  const { t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--color-white)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Announcement Banner */}
      {settings.announcement_banner_enabled && (
        <div
          style={{
            backgroundColor: 'var(--color-milk-blue)',
            color: 'var(--color-white)',
            fontSize: '0.85rem',
            padding: '0.45rem 1rem',
            textAlign: 'center',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <span>🥛 {t('announcementText')}</span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--navbar-height)' }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-milk-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 2px 8px rgba(30, 90, 168, 0.25)',
            }}
          >
            🥛
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: 'var(--color-dark-blue)',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              {t('appName')}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-light-gray)', fontWeight: 500 }}>
              {t('tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.925rem',
            fontWeight: 600,
          }}
          className="desktop-nav"
        >
          <Link
            to="/"
            style={{
              color: isActive('/') ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)',
              borderBottom: isActive('/') ? '2px solid var(--color-milk-blue)' : '2px solid transparent',
              paddingBottom: '0.2rem',
            }}
          >
            {t('navHome')}
          </Link>
          <Link
            to="/products"
            style={{
              color: isActive('/products') ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)',
              borderBottom: isActive('/products') ? '2px solid var(--color-milk-blue)' : '2px solid transparent',
              paddingBottom: '0.2rem',
            }}
          >
            {t('navProducts')}
          </Link>
          <Link
            to="/subscriptions"
            style={{
              color: isActive('/subscriptions') ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)',
              borderBottom: isActive('/subscriptions') ? '2px solid var(--color-milk-blue)' : '2px solid transparent',
              paddingBottom: '0.2rem',
            }}
          >
            {t('navSubscriptions')}
          </Link>
          <Link
            to="/contact"
            style={{
              color: isActive('/contact') ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)',
              borderBottom: isActive('/contact') ? '2px solid var(--color-milk-blue)' : '2px solid transparent',
              paddingBottom: '0.2rem',
            }}
          >
            {t('navContact')}
          </Link>
        </nav>

        {/* Action Controls & Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Prominent Language Selector (Desktop) */}
          <div className="desktop-lang-selector" style={{ display: 'none' }}>
            <LanguageSelector variant="header" />
          </div>

          {/* Admin shortcut ONLY when verified admin session is active */}
          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              className="btn btn-gold btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
              id="admin-dashboard-link"
            >
              <Shield size={14} />
              <span>{t('navAdmin')}</span>
            </Link>
          )}

          {/* Wishlist Link */}
          <Link
            to="/account/wishlist"
            className="btn btn-outline btn-icon"
            style={{ position: 'relative', width: '38px', height: '38px' }}
            aria-label={t('navWishlist')}
            id="nav-wishlist-button"
          >
            <Heart size={18} color="var(--color-dark-gray)" fill={wishlist.length > 0 ? '#DC2626' : 'none'} />
            {wishlist.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#DC2626',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 0.95rem' }}
            aria-label={t('navCart')}
            id="nav-cart-button"
          >
            <ShoppingBag size={18} />
            <span style={{ fontWeight: 700 }}>{cartCount}</span>
          </Link>

          {/* Account / Login Link */}
          <Link
            to={currentUser ? '/account' : '/login'}
            className="btn btn-outline btn-icon"
            style={{ width: '38px', height: '38px' }}
            aria-label={currentUser ? t('navAccount') : t('navLogin')}
            id="nav-account-button"
          >
            <User size={18} color={currentUser ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)'} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline btn-icon mobile-menu-toggle"
            style={{ width: '38px', height: '38px' }}
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-white)',
            borderTop: '1px solid var(--color-border)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)',
          }}
          className="mobile-drawer"
        >
          {/* Mobile Language Selector */}
          <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            <LanguageSelector variant="mobile" />
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.5rem 0',
              fontWeight: 600,
              color: isActive('/') ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)',
            }}
          >
            {t('navHome')}
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.5rem 0',
              fontWeight: 600,
              color: isActive('/products') ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)',
            }}
          >
            {t('navProducts')}
          </Link>
          <Link
            to="/subscriptions"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.5rem 0',
              fontWeight: 600,
              color: isActive('/subscriptions') ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)',
            }}
          >
            {t('navSubscriptions')}
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.5rem 0',
              fontWeight: 600,
              color: isActive('/contact') ? 'var(--color-milk-blue)' : 'var(--color-dark-gray)',
            }}
          >
            {t('navContact')}
          </Link>

          <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.25rem 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentUser ? (
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline btn-sm"
                style={{ textAlign: 'center' }}
              >
                {t('navAccount')} ({currentUser.name})
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  {t('navSignup')}
                </Link>
              </div>
            )}

            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-gold btn-sm"
                style={{ textAlign: 'center' }}
              >
                {t('navAdmin')}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Responsive helper */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-lang-selector { display: inline-block !important; }
          .mobile-menu-toggle { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-lang-selector { display: none !important; }
          .mobile-menu-toggle { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
};
