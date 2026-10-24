import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, RefreshCw, AlertTriangle, CheckSquare, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../../lib/store';

export const AdminDashboardPage: React.FC = () => {
  const { orders, subscriptions, products } = useStore();

  // Genuine analytics derived from records
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid' || o.order_status === 'delivered')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingUpiVerifications = orders.filter(
    (o) => o.payment_method === 'upi_manual' && o.payment_status === 'pending_verification'
  );

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');

  // Low stock alert: variants with stock <= 15
  const lowStockItems: { productName: string; variantName: string; stock: number }[] = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock_quantity <= 15) {
        lowStockItems.push({
          productName: p.name,
          variantName: v.unit_name,
          stock: v.stock_quantity,
        });
      }
    });
  });

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
          Operations & Business Analytics
        </h1>
        <p style={{ color: 'var(--color-light-gray)', fontSize: '0.95rem' }}>
          Real-time metrics derived exclusively from database records. No synthetic figures.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-milk-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-light-gray)' }}>Total Revenue</span>
            <TrendingUp size={20} color="var(--color-milk-blue)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
            ₹{totalRevenue}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)', marginTop: '0.25rem' }}>
            From paid and delivered orders
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-ghee-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-light-gray)' }}>Total Orders</span>
            <ShoppingBag size={20} color="var(--color-ghee-gold)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
            {orders.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)', marginTop: '0.25rem' }}>
            Across all fulfillment modes
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-fresh-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-light-gray)' }}>Active Subscriptions</span>
            <RefreshCw size={20} color="var(--color-fresh-green)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
            {activeSubscriptions.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)', marginTop: '0.25rem' }}>
            Daily morning delivery schedules
          </div>
        </div>

        <Link
          to="/admin/payments"
          className="card"
          style={{ padding: '1.5rem', borderLeft: '4px solid #DC2626', textDecoration: 'none' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#DC2626' }}>Pending UPI Audit</span>
            <CheckSquare size={20} color="#DC2626" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#DC2626', fontFamily: 'var(--font-heading)' }}>
            {pendingUpiVerifications.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)', marginTop: '0.25rem' }}>
            UTR references awaiting approval
          </div>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Recent Orders Overview */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark-blue)' }}>Recent Store Orders</h3>
            <Link to="/admin/orders" className="btn btn-outline btn-sm" style={{ gap: '0.35rem' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-surface-muted)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', fontSize: '0.9rem' }}>
                      {ord.order_number} • {ord.customer_name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)' }}>
                      ₹{ord.total_amount} via {ord.payment_method.toUpperCase()} ({ord.items.length} items)
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      ord.order_status === 'delivered'
                        ? 'badge-success'
                        : ord.order_status === 'cancelled'
                        ? 'badge-danger'
                        : 'badge-info'
                    }`}
                    style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}
                  >
                    {ord.order_status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--color-light-gray)', fontSize: '0.875rem' }}>
              No orders placed yet.
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertTriangle size={20} color="#B45309" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark-blue)' }}>Inventory Alerts</h3>
          </div>

          {lowStockItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lowStockItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-ghee-gold-light)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #F5E8C7',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--color-dark-gray)' }}>
                    {item.productName} ({item.variantName})
                  </span>
                  <span className="badge badge-warning">
                    {item.stock} left
                  </span>
                </div>
              ))}
              <Link to="/admin/products" className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
                Restock Inventory
              </Link>
            </div>
          ) : (
            <p style={{ color: 'var(--color-fresh-green)', fontSize: '0.875rem' }}>
              ✓ All product variants are sufficiently stocked.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
