import React, { useState } from 'react';
import { Settings, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { StoreSettings } from '../../types/settings';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setFeedback('Store settings and content updated successfully!');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
          Storefront Settings & Content Controls
        </h1>
        <p style={{ color: 'var(--color-light-gray)' }}>
          Update store contacts, payment UPI details, announcement banners, and section visibility.
        </p>
      </div>

      {feedback && (
        <div
          style={{
            backgroundColor: 'var(--color-fresh-green-light)',
            color: 'var(--color-fresh-green)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Brand & Store Identity */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-blue)', marginBottom: '1.25rem' }}>
            Store Identity & Contact Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Store Brand Name *</label>
              <input
                type="text"
                required
                value={form.store_name}
                onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Brand Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Customer Helpline Phone *</label>
              <input
                type="text"
                required
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Customer Support Email *</label>
              <input
                type="email"
                required
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">WhatsApp Business Number (with country code) *</label>
              <input
                type="text"
                required
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                className="form-input"
                placeholder="e.g. 919876543210"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={form.minimum_order_amount}
                onChange={(e) =>
                  setForm({ ...form, minimum_order_amount: parseInt(e.target.value) || 0 })
                }
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* UPI Payment Configuration */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-blue)', marginBottom: '1.25rem' }}>
            UPI Payment Receiver Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Store UPI ID *</label>
              <input
                type="text"
                required
                value={form.upi_id}
                onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
                className="form-input"
                placeholder="e.g. doodhwala@bank"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Payee Legal Name (Displayed on QR)</label>
              <input
                type="text"
                value={form.upi_payee_name}
                onChange={(e) => setForm({ ...form, upi_payee_name: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-blue)', marginBottom: '1.25rem' }}>
            Top Announcement Bar
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={form.announcement_banner_enabled}
                onChange={(e) =>
                  setForm({ ...form, announcement_banner_enabled: e.target.checked })
                }
              />
              <span>Enable Announcement Bar across public storefront</span>
            </label>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Banner Text</label>
              <input
                type="text"
                value={form.announcement_banner_text}
                onChange={(e) => setForm({ ...form, announcement_banner_text: e.target.value })}
                className="form-input"
                placeholder="e.g. Fresh morning delivery straight from ethical local farms."
              />
            </div>
          </div>
        </div>

        {/* Section Visibility & Truth-in-Advertising Rules */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-blue)', marginBottom: '0.5rem' }}>
            Public Section Visibility & Ethical Guardrails
          </h3>

          <div
            style={{
              backgroundColor: 'var(--color-ghee-gold-light)',
              border: '1px solid #F5E8C7',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              fontSize: '0.85rem',
              color: '#92400E',
            }}
          >
            <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Strict Trust Policy:</strong> Per business requirements, live counters, sales figures, and testimonials remain disabled until genuine, verified customer reviews and certified data exist. Never activate placeholder or simulated reviews.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.show_trust_stats}
                onChange={(e) => setForm({ ...form, show_trust_stats: e.target.checked })}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-dark-gray)' }}>
                Show Verified Customer Reviews on Homepage (Enable only after authentic reviews exist)
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.show_testimonials}
                onChange={(e) => setForm({ ...form, show_testimonials: e.target.checked })}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-dark-gray)' }}>
                Show Real Certified Trust Statistics on Homepage
              </span>
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-gold btn-lg" style={{ alignSelf: 'flex-start', gap: '0.5rem' }}>
          <Save size={18} />
          <span>Save All Settings</span>
        </button>
      </form>
    </div>
  );
};
