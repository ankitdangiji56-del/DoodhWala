import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2, UserCheck } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('465674');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="section section-white">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <span className="section-subtitle">{t('support_title')}</span>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--color-dark-blue)', marginBottom: '0.75rem' }}>
            {t('nav_contact')}
          </h1>
          <p style={{ color: 'var(--color-light-gray)', fontSize: '1.05rem' }}>
            {t('support_desc')}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Contact Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
                {t('support_contacts_heading')}
              </h3>

              {/* 4 Official Contacts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Lakshmichand Dangi</div>
                  <a href="tel:+919893927434" style={{ color: 'var(--color-milk-blue)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                    📞 +91 9893927434
                  </a>
                </div>

                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Jagdish Dangi</div>
                  <a href="tel:+919981758282" style={{ color: 'var(--color-milk-blue)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                    📞 +91 9981758282
                  </a>
                </div>

                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Dinesh Dangi</div>
                  <a href="tel:+919926035537" style={{ color: 'var(--color-milk-blue)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                    📞 +91 9926035537
                  </a>
                </div>

                <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Omprakash Dangi</div>
                  <a href="tel:+919425016514" style={{ color: 'var(--color-milk-blue)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                    📞 +91 9425016514
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      backgroundColor: 'var(--color-milk-blue-light)',
                      color: 'var(--color-milk-blue)',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Email Support</div>
                    <a href="mailto:doodhwala@gmail.com" style={{ color: 'var(--color-dark-gray)', textDecoration: 'none' }}>
                      doodhwala@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      backgroundColor: 'var(--color-milk-blue-light)',
                      color: 'var(--color-milk-blue)',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Dairy Farm & Pickup Address</div>
                    <div style={{ color: 'var(--color-dark-gray)' }}>
                      Khajuriya, Biaora, Rajgarh, Madhya Pradesh, India — 465674
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      backgroundColor: 'var(--color-ghee-gold-light)',
                      color: 'var(--color-ghee-gold)',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Hub Operating Hours</div>
                    <div style={{ color: 'var(--color-dark-gray)' }}>6:00 AM – 8:30 AM & 5:00 PM – 7:30 PM</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>Fresh morning milking arrives at 5:30 AM daily</div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                <a
                  href="https://wa.me/919893927434?text=Hello%20Doodhwala,%20I%20have%20an%20enquiry%20regarding%20fresh%20dairy%20delivery."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: 'var(--color-fresh-green)',
                    color: '#fff',
                    width: '100%',
                    gap: '0.5rem',
                  }}
                  id="contact-whatsapp-button"
                >
                  <MessageSquare size={20} />
                  <span>{t('whatsapp_chat')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Service Area Enquiry Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>
              Locality Delivery Enquiry
            </h3>
            <p style={{ color: 'var(--color-light-gray)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Want us to deliver to your apartment or colony? Drop your PIN code and we will contact you as soon as our dairy route opens in your area.
            </p>

            {submitted ? (
              <div
                style={{
                  backgroundColor: 'var(--color-fresh-green-light)',
                  color: 'var(--color-fresh-green)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={36} style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ color: 'var(--color-dark-blue)', marginBottom: '0.4rem' }}>
                  Enquiry Received!
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-dark-gray)' }}>
                  Thank you, {name}. Our operations team will notify you regarding morning delivery schedules for PIN {pincode}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-name">Your Full Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Anjali Verma"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-phone">Mobile Phone Number *</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 98765 43210"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-pin">Delivery PIN Code *</label>
                  <input
                    id="contact-pin"
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 560001"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="contact-msg">Colony / Apartment / Specific Requirement</label>
                  <textarea
                    id="contact-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea"
                    placeholder="e.g. Looking for 2 litres of daily fresh cow milk for our gated society."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem', gap: '0.4rem' }}>
                  <Send size={18} />
                  <span>Submit Locality Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
