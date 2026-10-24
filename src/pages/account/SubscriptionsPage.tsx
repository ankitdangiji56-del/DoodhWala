import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { RefreshCw, Pause, Play, XCircle, Calendar, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { SubscriptionFrequency } from '../../types/subscription';

export const SubscriptionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { products, subscriptions, createSubscription, updateSubscriptionStatus, currentUser } = useStore();

  const preselectedProductId = searchParams.get('product');
  const preselectedVariantId = searchParams.get('variant');

  const [isModalOpen, setIsModalOpen] = useState(Boolean(preselectedProductId));
  const [selectedProductId, setSelectedProductId] = useState(preselectedProductId || products[0]?.id || '');
  
  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const [selectedVariantId, setSelectedVariantId] = useState(
    preselectedVariantId || currentProduct?.variants[0]?.id || ''
  );
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('daily');
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedVariant = currentProduct?.variants.find((v) => v.id === selectedVariantId) || currentProduct?.variants[0];

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setFeedback('Please sign in to start a recurring subscription.');
      return;
    }

    const defaultAddress = currentUser.addresses[0] || {
      recipient_name: currentUser.name,
      phone: currentUser.phone,
      address_line1: 'Flat 402, Green Meadows Apartment',
      city: 'Launch Area Zone 1',
      postal_code: '560001',
    };

    const res = createSubscription({
      product: currentProduct,
      variant: selectedVariant,
      frequency,
      quantity,
      deliveryAddress: defaultAddress,
      startDate,
    });

    if (res.success) {
      setFeedback('Recurring subscription scheduled successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback(res.error || 'Failed to create subscription.');
    }
  };

  return (
    <div className="section section-white">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-dark-blue)' }}>
              Daily Dairy Subscriptions
            </h1>
            <p style={{ color: 'var(--color-light-gray)' }}>
              Enjoy automated morning deliveries. Pause for vacations, resume anytime.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-gold btn-md"
            style={{ gap: '0.45rem' }}
            id="new-subscription-button"
          >
            <Plus size={18} />
            <span>Schedule New Subscription</span>
          </button>
        </div>

        {/* Informational Guidance Box */}
        <div
          style={{
            backgroundColor: 'var(--color-cream)',
            border: '1px solid #F5E8C7',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <ShieldCheck size={28} color="var(--color-dark-blue)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--color-dark-gray)', lineHeight: 1.5 }}>
            <strong>Morning Freshness Guarantee:</strong> Subscriptions are packed fresh before 5:00 AM and delivered between <strong>6:00 AM – 8:30 AM</strong>. Pause or adjust schedules by <strong>8:00 PM</strong> on the preceding evening.
          </div>
        </div>

        {/* Subscriptions List */}
        {subscriptions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {subscriptions.map((sub) => (
              <div key={sub.id} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.25rem', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-blue)', marginBottom: '0.25rem' }}>
                      {sub.product_name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-light-gray)' }}>
                      Pack: <strong style={{ color: 'var(--color-dark-gray)' }}>{sub.variant_name}</strong> • Qty: <strong>{sub.quantity}</strong> (₹{sub.unit_price * sub.quantity} / delivery)
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      className={`badge ${
                        sub.status === 'active'
                          ? 'badge-success'
                          : sub.status === 'paused'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                      style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}
                    >
                      {sub.status}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
                      {sub.frequency.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-light-gray)', display: 'block', marginBottom: '0.2rem' }}>Next Delivery Date:</span>
                    <strong style={{ color: 'var(--color-dark-blue)', fontSize: '0.95rem' }}>
                      {sub.status === 'active' ? sub.next_delivery_date : 'Paused (No deliveries scheduled)'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-light-gray)', display: 'block', marginBottom: '0.2rem' }}>Delivery Destination:</span>
                    <span>{sub.delivery_address.recipient_name}, {sub.delivery_address.city} ({sub.delivery_address.postal_code})</span>
                  </div>
                </div>

                {/* Subscription Actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  {sub.status === 'active' && (
                    <button
                      onClick={() => updateSubscriptionStatus(sub.id, 'paused')}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '0.35rem', color: '#B45309', borderColor: '#F59E0B' }}
                    >
                      <Pause size={15} />
                      <span>Pause for Vacations</span>
                    </button>
                  )}

                  {sub.status === 'paused' && (
                    <button
                      onClick={() => updateSubscriptionStatus(sub.id, 'active')}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <Play size={15} />
                      <span>Resume Morning Deliveries</span>
                    </button>
                  )}

                  {sub.status !== 'cancelled' && (
                    <button
                      onClick={() => updateSubscriptionStatus(sub.id, 'cancelled')}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '0.35rem', color: 'var(--color-red-danger)', borderColor: 'var(--color-border)' }}
                    >
                      <XCircle size={15} />
                      <span>Cancel Subscription</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-xl)' }}>
            <RefreshCw size={40} color="var(--color-light-gray)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Active Subscriptions Yet</h3>
            <p style={{ color: 'var(--color-light-gray)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              Set up a daily morning schedule for Milk, Curd, or Paneer so you never have to place daily orders manually.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-md">
              Start Your First Subscription
            </button>
          </div>
        )}

        {/* Create Subscription Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-dark-blue)' }}>
                  Configure Morning Subscription
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline btn-icon"
                  style={{ width: '32px', height: '32px' }}
                >
                  ✕
                </button>
              </div>

              {feedback && (
                <div
                  style={{
                    backgroundColor: 'var(--color-fresh-green-light)',
                    color: 'var(--color-fresh-green)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{feedback}</span>
                </div>
              )}

              <form onSubmit={handleCreateSubscription} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Product Choice */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Select Dairy Product:</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      const prod = products.find((p) => p.id === e.target.value);
                      if (prod && prod.variants[0]) {
                        setSelectedVariantId(prod.variants[0].id);
                      }
                    }}
                    className="form-select"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variant Choice */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pack Size:</label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="form-select"
                  >
                    {currentProduct?.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.unit_name} — ₹{v.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Frequency */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Delivery Schedule:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {(['daily', 'alternate_days', 'weekly'] as SubscriptionFrequency[]).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFrequency(freq)}
                        style={{
                          padding: '0.6rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          border:
                            frequency === freq
                              ? '2px solid var(--color-milk-blue)'
                              : '1px solid var(--color-border)',
                          backgroundColor:
                            frequency === freq ? 'var(--color-milk-blue-light)' : 'var(--color-white)',
                          color:
                            frequency === freq ? 'var(--color-dark-blue)' : 'var(--color-dark-gray)',
                          fontWeight: frequency === freq ? 700 : 500,
                          fontSize: '0.8rem',
                          textTransform: 'capitalize',
                          cursor: 'pointer',
                        }}
                      >
                        {freq.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Daily Quantity:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-input"
                  />
                </div>

                {/* Start Date */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">First Delivery Date:</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface-muted)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Estimated cost per morning delivery:</span>
                  <strong style={{ color: 'var(--color-dark-blue)' }}>
                    ₹{(selectedVariant?.price || 0) * quantity}
                  </strong>
                </div>

                <button type="submit" className="btn btn-gold btn-lg" style={{ marginTop: '0.5rem' }}>
                  Confirm Subscription Schedule
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
