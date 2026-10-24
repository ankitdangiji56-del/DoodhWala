import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();
  const { t } = useLanguage();

  return (
    <footer style={{ backgroundColor: 'var(--color-dark-gray)', color: '#D1D5DB', marginTop: 'auto' }}>
      <div className="container section" style={{ paddingBottom: '2.5rem' }}>
        <div
          className="grid grid-cols-4 gap-8"
          style={{ marginBottom: '3rem' }}
        >
          {/* Column 1: Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-milk-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-white)',
                fontSize: '1.1rem',
              }}
            >
              🥛
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--color-white)',
              }}
            >
              {settings.store_name}
            </span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {t('nav_products')} • {t('fresh_natural_guarantee')}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ghee-gold)', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} />
            <span>{t('natural_dairy')} • {t('zero_preservatives')}</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ color: 'var(--color-white)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>
            {t('nav_products')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <li>
              <Link to="/products?category=milk" style={{ color: '#9CA3AF' }}>{t('cat_milk')}</Link>
            </li>
            <li>
              <Link to="/products?category=ghee" style={{ color: '#9CA3AF' }}>{t('cat_ghee')}</Link>
            </li>
            <li>
              <Link to="/products?category=paneer" style={{ color: '#9CA3AF' }}>{t('cat_paneer')}</Link>
            </li>
            <li>
              <Link to="/products?category=curd" style={{ color: '#9CA3AF' }}>{t('cat_curd')}</Link>
            </li>
            <li>
              <Link to="/subscriptions" style={{ color: 'var(--color-ghee-gold)', fontWeight: 600 }}>{t('nav_subscriptions')}</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Policies & Customer Trust */}
        <div>
          <h4 style={{ color: 'var(--color-white)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>
            {t('footer_policies')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <li>
              <Link to="/policies#delivery" style={{ color: '#9CA3AF' }}>{t('nav_delivery_areas')}</Link>
            </li>
            <li>
              <Link to="/policies#payment" style={{ color: '#9CA3AF' }}>{t('checkout_payment')}</Link>
            </li>
            <li>
              <Link to="/policies#cancellation" style={{ color: '#9CA3AF' }}>{t('account_subscriptions')}</Link>
            </li>
            <li>
              <Link to="/contact" style={{ color: '#9CA3AF' }}>{t('nav_contact')}</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Support */}
        <div>
          <h4 style={{ color: 'var(--color-white)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>
            {t('support_title')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#9CA3AF' }}>
              <MapPin size={16} style={{ marginTop: '3px', flexShrink: 0, color: 'var(--color-ghee-gold)' }} />
              <span>Khajuriya, Biaora, Rajgarh, MP, India — 465674</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#9CA3AF' }}>
              <Mail size={16} style={{ marginTop: '3px', flexShrink: 0, color: 'var(--color-ghee-gold)' }} />
              <a href="mailto:doodhwala@gmail.com" style={{ color: '#CBD5E1', textDecoration: 'none' }}>doodhwala@gmail.com</a>
            </div>

            {/* Support Contacts */}
            <div style={{ marginTop: '0.5rem', borderTop: '1px solid #374151', paddingTop: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-ghee-gold)', marginBottom: '0.35rem', fontWeight: 600 }}>
                {t('support_contacts_heading')}:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                <a href="tel:+919893927434" style={{ color: '#E2E8F0', textDecoration: 'none' }}>📞 Lakshmichand: +91 9893927434</a>
                <a href="tel:+919981758282" style={{ color: '#E2E8F0', textDecoration: 'none' }}>📞 Jagdish: +91 9981758282</a>
                <a href="tel:+919926035537" style={{ color: '#E2E8F0', textDecoration: 'none' }}>📞 Dinesh: +91 9926035537</a>
                <a href="tel:+919425016514" style={{ color: '#E2E8F0', textDecoration: 'none' }}>📞 Omprakash: +91 9425016514</a>
              </div>
            </div>

            <a
              href="https://wa.me/919893927434?text=Hello%20Doodhwala,%20I%20have%20an%20enquiry%20regarding%20fresh%20dairy%20delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
              style={{
                backgroundColor: 'var(--color-fresh-green)',
                color: '#fff',
                marginTop: '0.5rem',
                gap: '0.45rem',
                alignSelf: 'flex-start',
              }}
              id="footer-whatsapp-button"
            >
              <MessageSquare size={16} />
              <span>{t('whatsapp_chat')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div
        style={{
          borderTop: '1px solid #374151',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.825rem',
          color: '#9CA3AF',
          gap: '1rem',
        }}
      >
        <div>
          © {new Date().getFullYear()} Doodhwala. {t('pure_farm_dairy')}.
        </div>
        <div>
          <span>{t('honest_dairy')} • Biaora, Rajgarh (MP)</span>
        </div>
      </div>
    </div>
  </footer>
);
};
