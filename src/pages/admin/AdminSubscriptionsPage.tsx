import React from 'react';
import { RefreshCw, Calendar, Truck, Clock } from 'lucide-react';
import { useStore } from '../../lib/store';

export const AdminSubscriptionsPage: React.FC = () => {
  const { subscriptions } = useStore();

  const activeSubs = subscriptions.filter((s) => s.status === 'active');

  // Calculate tomorrow's projected milk requirement
  const tomorrowRequirement: Record<string, number> = {};
  activeSubs.forEach((sub) => {
    const key = `${sub.product_name} (${sub.variant_name})`;
    tomorrowRequirement[key] = (tomorrowRequirement[key] || 0) + sub.quantity;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
          Recurring Subscriptions & Morning Packing Sheet
        </h1>
        <p style={{ color: 'var(--color-light-gray)' }}>
          Review scheduled dairy deliveries and plan morning procurement from your dairy farm.
        </p>
      </div>

      {/* Morning Packing Sheet Summary */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          marginBottom: '2.5rem',
          backgroundColor: 'var(--color-milk-blue-light)',
          border: '1px solid #BFDBFE',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <Clock size={22} color="var(--color-milk-blue)" />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-blue)' }}>
            Tomorrow Morning Dispatch Requirements (Active Subscriptions)
          </h3>
        </div>

        {Object.keys(tomorrowRequirement).length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(tomorrowRequirement).map(([item, qty]) => (
              <div
                key={item}
                style={{
                  backgroundColor: 'var(--color-white)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--color-light-gray)' }}>Product Item</div>
                <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', margin: '0.2rem 0' }}>{item}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-milk-blue)', fontFamily: 'var(--font-heading)' }}>
                  {qty} Units
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-dark-gray)', fontSize: '0.875rem' }}>
            No active subscriptions scheduled for tomorrow morning yet.
          </p>
        )}
      </div>

      {/* All Subscriptions Table */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-dark-blue)', marginBottom: '1.25rem' }}>
          All Customer Subscriptions ({subscriptions.length})
        </h3>

        {subscriptions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-muted)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Product & Pack</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Daily Qty</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Frequency</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Next Delivery</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Address PIN</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                      {sub.customer_name}<br />
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)', fontWeight: 400 }}>{sub.customer_phone}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <strong>{sub.product_name}</strong><br />
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)' }}>{sub.variant_name}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                      {sub.quantity}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textTransform: 'capitalize' }}>
                      {sub.frequency.replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        className={`badge ${
                          sub.status === 'active'
                            ? 'badge-success'
                            : sub.status === 'paused'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{sub.next_delivery_date}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{sub.delivery_address.postal_code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-light-gray)' }}>
            No subscriptions on record.
          </div>
        )}
      </div>
    </div>
  );
};
