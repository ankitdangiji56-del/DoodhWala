import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldAlert, Truck, CreditCard, RefreshCw, Lock, FileText } from 'lucide-react';
import { useStore } from '../../lib/store';

export const PoliciesPage: React.FC = () => {
  const { settings } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div className="section section-white">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Notice for Founder */}
        <div
          style={{
            backgroundColor: 'var(--color-ghee-gold-light)',
            border: '2px dashed var(--color-ghee-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <ShieldAlert size={24} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#B45309', marginBottom: '0.35rem' }}>
              Notice for Business Owner / First-Time Founder:
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#92400E', lineHeight: 1.5 }}>
              The policy templates below provide transparent, legally sound baseline rules for local dairy e-commerce.
              Clauses marked with <strong>[Owner Review]</strong> should be tailored to your final operational legal entity, FSSAI registration number, and GST details before commercial scaling.
            </p>
          </div>
        </div>

        <h1 style={{ fontSize: '2.25rem', color: 'var(--color-dark-blue)', marginBottom: '0.5rem' }}>
          Store Policies & Customer Commitments
        </h1>
        <p style={{ color: 'var(--color-light-gray)', fontSize: '1.05rem', marginBottom: '3rem' }}>
          Clear, honest, and unambiguous rules for deliveries, payments, recurring subscriptions, and customer privacy.
        </p>

        {/* Section 1: Delivery Policy */}
        <section id="delivery" className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--color-milk-blue-light)', color: 'var(--color-milk-blue)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <Truck size={22} />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>Delivery & Service Area Policy</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-dark-gray)' }}>
            <p>
              <strong>1. Morning Fulfillment Window:</strong> Because raw farm dairy is perishable and best enjoyed early, all home deliveries take place during our morning slot between <strong>6:00 AM and 8:30 AM</strong>.
            </p>
            <p>
              <strong>2. Configured Service Areas:</strong> Deliveries are strictly limited to postal codes actively listed by the administrator in our Delivery Zones database. Orders placed outside active PIN codes will be rejected or diverted to store pickup.
            </p>
            <p>
              <strong>3. Temperature Sensitive Handling:</strong> Customers are advised to store raw milk, paneer, and curd below 4°C immediately upon receipt. {settings.store_name} provides sanitized delivery crates and chilled transport bags during morning transit.
            </p>
            <p style={{ backgroundColor: 'var(--color-surface-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-milk-blue)' }}>
              <strong>[Owner Review]: Glass Bottle Exchange:</strong> If you use reusable glass bottles, specify bottle deposit amounts (e.g. ₹50 refundable deposit) and morning exchange mechanics here.
            </p>
          </div>
        </section>

        {/* Section 2: Payment Policy */}
        <section id="payment" className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--color-ghee-gold-light)', color: 'var(--color-ghee-gold)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <CreditCard size={22} />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>Payment & Manual UPI Verification Policy</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-dark-gray)' }}>
            <p>
              <strong>1. Cash on Delivery (COD):</strong> Customers may pay exact cash to our delivery executive upon arrival. Receipts are issued digitally via WhatsApp/SMS.
            </p>
            <p>
              <strong>2. Direct UPI / QR Transfers:</strong> Customers opting for UPI must transfer funds to <code>{settings.upi_id}</code> and submit their 12-digit UPI Reference (UTR) number through their order confirmation page.
            </p>
            <p>
              <strong>3. Strict Verification Rule:</strong> In strict compliance with financial security standards, submitting a UPI reference marks the payment as <em>Pending Verification</em>. An order is only stamped as <em>Paid</em> once our finance administrator reconciles the transaction with our bank statements.
            </p>
            <p style={{ backgroundColor: 'var(--color-surface-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-ghee-gold)' }}>
              <strong>[Owner Review]: Payment Gateway Integration:</strong> When ready, an automated gateway (e.g. Razorpay or Cashfree) can replace manual UPI reconciliation without changing your frontend catalog.
            </p>
          </div>
        </section>

        {/* Section 3: Subscriptions Policy */}
        <section id="cancellation" className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--color-fresh-green-light)', color: 'var(--color-fresh-green)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <RefreshCw size={22} />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>Daily Subscriptions & Modification Policy</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-dark-gray)' }}>
            <p>
              <strong>1. Recurring Convenience:</strong> Dairy subscriptions reserve your morning allocation of fresh milk, curd, or paneer automatically on your chosen schedule (Daily, Alternate Days, or Weekly).
            </p>
            <p>
              <strong>2. Pause & Vacation Mode:</strong> Going out of town? You can pause your subscription anytime directly from your customer account with zero penalties.
            </p>
            <p>
              <strong>3. Daily Cut-Off Time:</strong> Any pause, resume, or cancellation request must be submitted prior to <strong>8:00 PM</strong> on the evening preceding the scheduled morning delivery to prevent farm packaging waste.
            </p>
          </div>
        </section>

        {/* Section 4: Privacy & WhatsApp Notice */}
        <section id="privacy" className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--color-milk-blue-light)', color: 'var(--color-milk-blue)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <Lock size={22} />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>Privacy, Security & WhatsApp Notification Notice</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-dark-gray)' }}>
            <p>
              <strong>1. Zero Data Selling:</strong> We collect only necessary delivery coordinates (address, phone number, recipient name) required for dispatch and account access. We never sell, rent, or monetize customer data.
            </p>
            <p>
              <strong>2. Official WhatsApp Business Platform:</strong> Automated transactional notifications (order confirmation, morning dispatch alerts, and digital bills) are transmitted through Meta's official WhatsApp Business Cloud API only after explicit customer opt-in.
            </p>
            <p style={{ backgroundColor: 'var(--color-surface-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-milk-blue)' }}>
              <strong>[Owner Review]: FSSAI & Corporate Registration:</strong> Insert your registered entity name, FSSAI 14-digit license number, and customer grievance officer contact details here prior to commercial operation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
