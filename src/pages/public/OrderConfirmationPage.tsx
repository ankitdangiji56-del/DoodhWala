import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Truck, QrCode, ShieldCheck, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';
import { OrderStatus } from '../../types/order';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, submitUpiReference, settings } = useStore();

  const [upiReference, setUpiReference] = useState('');
  const [upiFeedback, setUpiFeedback] = useState<string | null>(null);

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="section section-white">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2>Order Not Found</h2>
          <p style={{ color: 'var(--color-light-gray)', margin: '1rem 0 2rem 0' }}>
            We could not locate this order record.
          </p>
          <Link to="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiReference.trim()) {
      setUpiFeedback('Please enter your 12-digit UPI Reference / UTR Number.');
      return;
    }
    const res = submitUpiReference(order.id, upiReference.trim());
    if (res.success) {
      setUpiFeedback('UTR Reference recorded successfully. Awaiting administrator verification.');
      setUpiReference('');
    } else {
      setUpiFeedback(res.error || 'Failed to submit reference.');
    }
  };

  const deliverySteps: { status: OrderStatus; label: string }[] =
    order.fulfillmentType === 'pickup'
      ? [
          { status: 'pending_confirmation', label: 'Order Placed' },
          { status: 'confirmed', label: 'Confirmed' },
          { status: 'preparing', label: 'Preparing at Hub' },
          { status: 'ready_for_pickup', label: 'Ready for Pickup' },
          { status: 'delivered', label: 'Picked Up' },
        ]
      : [
          { status: 'pending_confirmation', label: 'Order Placed' },
          { status: 'confirmed', label: 'Confirmed' },
          { status: 'preparing', label: 'Bottling & Chilling' },
          { status: 'out_for_delivery', label: 'Out for Delivery' },
          { status: 'delivered', label: 'Delivered' },
        ];

  const currentStepIndex = deliverySteps.findIndex((s) => s.status === order.order_status);

  return (
    <div className="section section-white">
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Success Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2.5rem',
            backgroundColor: 'var(--color-surface-muted)',
            padding: '2.5rem 1.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-fresh-green-light)',
              color: 'var(--color-fresh-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
            Order Successfully Placed
          </span>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-dark-blue)', marginBottom: '0.4rem' }}>
            Thank You for Choosing Pure Dairy!
          </h1>
          <p style={{ color: 'var(--color-light-gray)', fontSize: '1.05rem' }}>
            Order Reference: <strong style={{ color: 'var(--color-dark-blue)' }}>{order.order_number}</strong>
          </p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-light-gray)' }}>
            Placed on: {new Date(order.created_at).toLocaleString()}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark-blue)' }}>
              Order Fulfillment Timeline
            </h3>
            <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
              {order.order_status.replace(/_/g, ' ')}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              margin: '1.5rem 0 1rem 0',
            }}
          >
            {deliverySteps.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.status}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isPassed
                        ? 'var(--color-milk-blue)'
                        : 'var(--color-surface-muted)',
                      color: isPassed ? 'var(--color-white)' : 'var(--color-light-gray)',
                      border: isPassed ? '2px solid var(--color-milk-blue)' : '2px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      zIndex: 2,
                      marginBottom: '0.5rem',
                      boxShadow: isCurrent ? '0 0 0 4px var(--color-milk-blue-light)' : 'none',
                    }}
                  >
                    {isPassed ? <Check size={16} /> : idx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isPassed ? 'var(--color-dark-blue)' : 'var(--color-light-gray)',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* UPI Payment Instructions & Reference Submission Form */}
        {order.payment_method === 'upi_manual' && (
          <div
            className="card"
            style={{
              padding: '1.75rem',
              marginBottom: '2rem',
              backgroundColor: 'var(--color-cream)',
              border: '1px solid #F5E8C7',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <QrCode size={24} color="var(--color-dark-blue)" />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-blue)' }}>
                Complete Your UPI Transfer
              </h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-gray)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Please transfer exactly <strong>₹{order.total_amount}</strong> using any UPI app (GPay, PhonePe, Paytm, BHIM) to:
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-white)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>Store UPI ID:</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-milk-blue)' }}>
                  {settings.upi_id}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                  Payee: {settings.upi_payee_name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>Amount to Transfer:</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-dark-blue)' }}>
                  ₹{order.total_amount}
                </div>
              </div>
            </div>

            {/* Submission / Verification Status */}
            {order.upi_reference_number ? (
              <div
                style={{
                  backgroundColor: 'var(--color-white)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <ShieldCheck size={18} color="var(--color-milk-blue)" />
                  <strong style={{ color: 'var(--color-dark-blue)' }}>UPI Reference Submitted:</strong>
                  <code>{order.upi_reference_number}</code>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-light-gray)' }}>
                  Payment Status:{' '}
                  <span
                    className={`badge ${
                      order.payment_status === 'paid'
                        ? 'badge-success'
                        : order.payment_status === 'failed'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {order.payment_status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.5rem' }}>
                  * As per security policy, orders are verified against bank records before dispatch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpiSubmit}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-dark-blue)' }}>
                  Enter 12-digit UPI Transaction ID / UTR Number:
                </label>
                <div style={{ display: 'flex', gap: '0.65rem', maxWidth: '420px' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 329182749102"
                    value={upiReference}
                    onChange={(e) => setUpiReference(e.target.value)}
                    className="form-input"
                    id="upi-ref-input"
                  />
                  <button type="submit" className="btn btn-primary btn-sm" id="submit-upi-ref-button">
                    Submit Reference
                  </button>
                </div>
                {upiFeedback && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-milk-blue)', fontWeight: 500 }}>
                    {upiFeedback}
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* WhatsApp Notification Notice */}
        {order.whatsapp_opt_in && (
          <div
            style={{
              backgroundColor: 'var(--color-fresh-green-light)',
              border: '1px solid #A7F3D0',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#065F46',
            }}
          >
            <ShieldCheck size={20} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.875rem' }}>
              <strong>WhatsApp Alerts Active:</strong> Order confirmations, morning delivery notifications, and payment receipts will be delivered to <strong>{order.customer_phone}</strong>.
            </div>
          </div>
        )}

        {/* Order Details & Items Card */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
            Items in this Order
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {order.items.map((item) => (
              <div
                key={item.variant_id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>{item.product_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                    Pack: {item.variant_name} × {item.quantity} (₹{item.unit_price} each)
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                  ₹{item.total_price}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-light-gray)' }}>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-light-gray)' }}>Delivery Fee</span>
              <span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-dark-blue)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
              <span>Total Amount</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>

          {order.delivery_address && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--color-dark-blue)' }}>
                Delivery Destination:
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-dark-gray)', lineHeight: 1.5 }}>
                {order.delivery_address.recipient_name} ({order.delivery_address.phone})<br />
                {order.delivery_address.address_line1}
                {order.delivery_address.address_line2 ? `, ${order.delivery_address.address_line2}` : ''}<br />
                {order.delivery_address.landmark ? `Landmark: ${order.delivery_address.landmark}, ` : ''}
                {order.delivery_address.city} — {order.delivery_address.postal_code}
              </p>
            </div>
          )}
        </div>

        {/* Next Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/products" className="btn btn-outline" style={{ gap: '0.45rem' }}>
            <span>Continue Shopping</span>
          </Link>
          <Link to="/account/orders" className="btn btn-primary" style={{ gap: '0.45rem' }}>
            <span>View All My Orders</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
