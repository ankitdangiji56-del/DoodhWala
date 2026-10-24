import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';
import { OrderStatus } from '../../types/order';

export const OrderHistoryPage: React.FC = () => {
  const { orders } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'pending') {
      return ['pending_confirmation', 'confirmed', 'preparing', 'out_for_delivery', 'ready_for_pickup'].includes(o.order_status);
    }
    if (filter === 'delivered') {
      return o.order_status === 'delivered';
    }
    return true;
  });

  return (
    <div className="section section-white">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-dark-blue)' }}>Order History</h1>
            <p style={{ color: 'var(--color-light-gray)' }}>Track all your dairy purchases and fulfillment statuses.</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            Order More Dairy
          </Link>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          >
            In-Progress ({orders.filter((o) => ['pending_confirmation', 'confirmed', 'preparing', 'out_for_delivery', 'ready_for_pickup'].includes(o.order_status)).length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`btn btn-sm ${filter === 'delivered' ? 'btn-primary' : 'btn-outline'}`}
          >
            Completed ({orders.filter((o) => o.order_status === 'delivered').length})
          </button>
        </div>

        {filteredOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', textTransform: 'uppercase' }}>Order Ref</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>{ord.order_number}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                      Placed on: {new Date(ord.created_at).toLocaleDateString()} at {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                    <span
                      className={`badge ${
                        ord.order_status === 'delivered'
                          ? 'badge-success'
                          : ord.order_status === 'cancelled'
                          ? 'badge-danger'
                          : 'badge-info'
                      }`}
                      style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}
                    >
                      {ord.order_status.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`badge ${
                        ord.payment_status === 'paid'
                          ? 'badge-success'
                          : ord.payment_status === 'pending_verification'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`}
                      style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}
                    >
                      {ord.payment_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {ord.items.map((it) => (
                    <div key={it.variant_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--color-dark-gray)' }}>
                        <strong>{it.product_name}</strong> ({it.variant_name}) × {it.quantity}
                      </span>
                      <span style={{ fontWeight: 600 }}>₹{it.total_price}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-light-gray)' }}>Total: </span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
                      ₹{ord.total_amount}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginLeft: '0.5rem' }}>
                      via {ord.payment_method.toUpperCase()} ({ord.fulfillmentType === 'delivery' ? 'Home Delivery' : 'Pickup'})
                    </span>
                  </div>

                  <Link to={`/order-confirmation/${ord.id}`} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
                    <span>Track Order Status</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-xl)' }}>
            <Package size={40} color="var(--color-light-gray)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders found</h3>
            <p style={{ color: 'var(--color-light-gray)', marginBottom: '1.5rem' }}>
              You haven't placed any dairy orders under this filter yet.
            </p>
            <Link to="/products" className="btn btn-primary btn-sm">
              Explore Fresh Dairy
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
