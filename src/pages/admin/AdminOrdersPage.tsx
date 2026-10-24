import React, { useState } from 'react';
import { Package, Truck, Store, Check, ArrowRight, X, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';
import { OrderStatus } from '../../types/order';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => (filter === 'all' ? true : o.order_status === filter));

  const handleTransition = (orderId: string, nextStatus: OrderStatus) => {
    setActionError(null);
    const res = updateOrderStatus(orderId, nextStatus, `Status transitioned by Administrator.`);
    if (!res.success) {
      setActionError(res.error || 'Invalid transition.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
          Customer Orders & Dispatch Workflow
        </h1>
        <p style={{ color: 'var(--color-light-gray)' }}>
          Review orders, coordinate packing, and advance order fulfillment through authorized transitions.
        </p>
      </div>

      {actionError && (
        <div
          style={{
            backgroundColor: 'var(--color-red-light)',
            color: 'var(--color-red-danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'All Orders', val: 'all' },
          { label: 'Pending Confirmation', val: 'pending_confirmation' },
          { label: 'Confirmed', val: 'confirmed' },
          { label: 'Preparing', val: 'preparing' },
          { label: 'Out for Delivery / Ready', val: 'out_for_delivery' },
          { label: 'Delivered', val: 'delivered' },
          { label: 'Cancelled', val: 'cancelled' },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setFilter(tab.val as any)}
            className="btn btn-sm"
            style={{
              backgroundColor: filter === tab.val ? 'var(--color-milk-blue)' : 'var(--color-white)',
              color: filter === tab.val ? 'var(--color-white)' : 'var(--color-dark-gray)',
              border: filter === tab.val ? '1px solid var(--color-milk-blue)' : '1px solid var(--color-border)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table / List */}
      {filteredOrders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredOrders.map((ord) => (
            <div key={ord.id} className="card" style={{ padding: '1.75rem' }}>
              {/* Header Bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                      {ord.order_number}
                    </span>
                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
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
                      style={{ textTransform: 'capitalize' }}
                    >
                      Payment: {ord.payment_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.2rem' }}>
                    Placed: {new Date(ord.created_at).toLocaleString()} • Customer: <strong>{ord.customer_name}</strong> ({ord.customer_phone})
                  </div>
                </div>

                {/* Transition Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {ord.order_status === 'pending_confirmation' && (
                    <button
                      onClick={() => handleTransition(ord.id, 'confirmed')}
                      className="btn btn-primary btn-sm"
                    >
                      Confirm Order
                    </button>
                  )}

                  {ord.order_status === 'confirmed' && (
                    <button
                      onClick={() => handleTransition(ord.id, 'preparing')}
                      className="btn btn-gold btn-sm"
                    >
                      Start Bottling & Packing
                    </button>
                  )}

                  {ord.order_status === 'preparing' && (
                    <button
                      onClick={() =>
                        handleTransition(
                          ord.id,
                          ord.fulfillmentType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery'
                        )
                      }
                      className="btn btn-primary btn-sm"
                    >
                      {ord.fulfillmentType === 'pickup' ? 'Ready for Pickup' : 'Dispatch for Morning Delivery'}
                    </button>
                  )}

                  {(ord.order_status === 'out_for_delivery' || ord.order_status === 'ready_for_pickup') && (
                    <button
                      onClick={() => handleTransition(ord.id, 'delivered')}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: 'var(--color-fresh-green)', borderColor: 'var(--color-fresh-green)' }}
                    >
                      Mark Successfully Delivered
                    </button>
                  )}

                  {['pending_confirmation', 'confirmed', 'preparing'].includes(ord.order_status) && (
                    <button
                      onClick={() => handleTransition(ord.id, 'cancelled')}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--color-red-danger)', borderColor: 'var(--color-border)' }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Items & Address Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', fontSize: '0.875rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-light-gray)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Items Ordered ({ord.items.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {ord.items.map((it) => (
                      <div key={it.variant_id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                          {it.product_name} ({it.variant_name}) × <strong>{it.quantity}</strong>
                        </span>
                        <span style={{ fontWeight: 600 }}>₹{it.total_price}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.4rem', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Total Amount:</span>
                      <span style={{ color: 'var(--color-dark-blue)' }}>₹{ord.total_amount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-light-gray)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Fulfillment & Address
                  </h4>
                  <div style={{ color: 'var(--color-dark-gray)', lineHeight: 1.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {ord.fulfillmentType === 'delivery' ? <Truck size={15} /> : <Store size={15} />}
                      <span>{ord.fulfillmentType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}</span>
                    </div>
                    {ord.delivery_address ? (
                      <div>
                        {ord.delivery_address.recipient_name} ({ord.delivery_address.phone})<br />
                        {ord.delivery_address.address_line1}<br />
                        {ord.delivery_address.city} — <strong>{ord.delivery_address.postal_code}</strong>
                      </div>
                    ) : (
                      <div>Pick up at Central Dairy Depot</div>
                    )}
                    {ord.notes && (
                      <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--color-milk-blue)' }}>
                        Note: "{ord.notes}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-xl)' }}>
          <Package size={40} color="var(--color-light-gray)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders found</h3>
          <p style={{ color: 'var(--color-light-gray)' }}>There are no orders matching this filter.</p>
        </div>
      )}
    </div>
  );
};
