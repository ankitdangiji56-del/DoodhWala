import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, X, Headphones, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';

export const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useStore();
  const { t } = useLanguage();

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('widgetOpenButton')}
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 990,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--color-milk-blue)',
          color: 'var(--color-white)',
          padding: '0.75rem 1.15rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid var(--color-white)',
          cursor: 'pointer',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
        }}
        id="support-widget-trigger"
      >
        <Headphones size={18} />
        <span>{isOpen ? t('cancel') : t('widgetOpenButton')}</span>
      </button>

      {/* Floating Support Modal / Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: 'clamp(300px, 92vw, 420px)',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            backgroundColor: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border)',
            zIndex: 991,
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-in-out',
          }}
          id="support-widget-panel"
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🥛</span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark-blue)', margin: 0 }}>
                  {t('widgetTitle')}
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.2rem' }}>
                {settings.store_name} — {settings.city}, {settings.state}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-light-gray)',
                padding: '0.2rem',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-dark-gray)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {t('widgetEmergencyNotice')}
          </p>

          {/* 4 Dedicated Support Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {settings.support_contacts.map((contact, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-dark-blue)' }}>
                    {contact.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-light-gray)' }}>
                    {contact.role}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-dark-gray)', marginTop: '0.15rem' }}>
                    {contact.phone}
                  </div>
                </div>

                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="btn btn-sm btn-primary"
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    gap: '0.3rem',
                  }}
                >
                  <Phone size={13} />
                  <span>{t('callContact')}</span>
                </a>
              </div>
            ))}
          </div>

          {/* Direct WhatsApp Action */}
          {settings.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=Hello%20Doodhwala,%20I%20have%20an%20enquiry%20regarding%20fresh%20dairy%20delivery.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-md"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-fresh-green)',
                color: '#fff',
                marginBottom: '1rem',
                gap: '0.5rem',
              }}
              id="support-widget-whatsapp"
            >
              <MessageSquare size={17} />
              <span>{t('chatWhatsAppButton')}</span>
            </a>
          )}

          {/* Business Coordinates & Email */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--color-dark-gray)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Mail size={15} color="var(--color-milk-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <a href={`mailto:${settings.contact_email}`} style={{ color: 'var(--color-milk-blue)', fontWeight: 600 }}>
                  {settings.contact_email}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={15} color="var(--color-milk-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>{settings.address_line}</strong>, {settings.city}, {settings.state} — PIN <strong>{settings.postal_code}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-light-gray)', fontSize: '0.75rem' }}>
              <Clock size={13} />
              <span>{settings.pickup_timings}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
