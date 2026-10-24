import React, { useState } from 'react';
import { CheckSquare, CheckCircle, XCircle, ShieldCheck, AlertCircle, Search } from 'lucide-react';
import { useStore } from '../../lib/store';

export const AdminPaymentsPage: React.FC = () => {
  const { orders, verifyUpiPayment } = useStore();
  const [verificationNotes, setVerificationNotes] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filter UPI orders
  const upiOrders = orders.filter((o) => o.payment_method === 'upi_manual');

  const handleVerify = (orderId: string, isApproved: boolean) => {
    const notes = verificationNotes[orderId] || '';
    const res = verifyUpiPayment(orderId, isApproved, notes);
    if (res.success) {
      setFeedback(
        isApproved
          ? `Order payment verified and stamped as PAID.`
          : `Payment reference rejected and marked as FAILED.`
      );
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
          UPI Payment Verification Queue & Audit Trail
        </h1>
        <p style={{ color: 'var(--color-light-gray)' }}>
          Reconcile customer-submitted UTR references against bank deposits before dispatching fresh dairy.
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
          <CheckCircle size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Security Rule Callout */}
      <div
        style={{
          backgroundColor: 'var(--color-milk-blue-light)',
          border: '1px solid #BFDBFE',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          fontSize: '0.875rem',
          color: 'var(--color-dark-blue)',
        }}
      >
        <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Financial Security Control:</strong> In accordance with financial compliance rules, submitting a UPI reference never auto-confirms payment. Staff must cross-check the 12-digit UTR against your current account or UPI business merchant app before clicking approve.
        </div>
      </div>

      {/* UPI Orders List */}
      {upiOrders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {upiOrders.map((ord) => (
            <div key={ord.id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                      {ord.order_number}
                    </span>
                    <span
                      className={`badge ${
                        ord.payment_status === 'paid'
                          ? 'badge-success'
                          : ord.payment_status === 'failed'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {ord.payment_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.2rem' }}>
                    Customer: <strong>{ord.customer_name}</strong> ({ord.customer_phone}) • Amount: <strong style={{ color: 'var(--color-dark-blue)' }}>₹{ord.total_amount}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-light-gray)' }}>Customer Submitted UTR:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: ord.upi_reference_number ? 'var(--color-milk-blue)' : 'var(--color-red-danger)' }}>
                    {ord.upi_reference_number || 'Awaiting Customer Input'}
                  </div>
                </div>
              </div>

              {/* Audit Trail & Verification Controls */}
              {ord.payment_status === 'pending_verification' && ord.upi_reference_number ? (
                <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--color-dark-blue)', marginBottom: '0.65rem' }}>
                    Reconciliation Action:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Audit note (e.g. Verified with bank statement at 08:30 AM)"
                      value={verificationNotes[ord.id] || ''}
                      onChange={(e) =>
                        setVerificationNotes({ ...verificationNotes, [ord.id]: e.target.value })
                      }
                      className="form-input"
                      style={{ flexGrow: 1, minWidth: '240px', fontSize: '0.85rem' }}
                    />
                    <button
                      onClick={() => handleVerify(ord.id, true)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: 'var(--color-fresh-green)', borderColor: 'var(--color-fresh-green)', gap: '0.35rem' }}
                    >
                      <CheckCircle size={15} />
                      <span>Approve & Stamp Paid</span>
                    </button>
                    <button
                      onClick={() => handleVerify(ord.id, false)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--color-red-danger)', borderColor: 'var(--color-red-danger)', gap: '0.35rem' }}
                    >
                      <XCircle size={15} />
                      <span>Reject Reference</span>
                    </button>
                  </div>
                </div>
              ) : ord.payment_status === 'paid' ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-fresh-green)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={16} />
                  <span>Verified by {ord.upi_verified_by || 'Staff'} on {ord.upi_verified_at ? new Date(ord.upi_verified_at).toLocaleString() : 'N/A'}.</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-light-gray)' }}>
                  Customer has not submitted a transaction reference yet.
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-xl)' }}>
          <CheckSquare size={40} color="var(--color-light-gray)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No UPI Orders in Queue</h3>
          <p style={{ color: 'var(--color-light-gray)' }}>
            All UPI transaction references are reconciled or no manual UPI orders have been placed yet.
          </p>
        </div>
      )}
    </div>
  );
};
