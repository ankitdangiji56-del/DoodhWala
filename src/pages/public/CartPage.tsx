import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, Store } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';
import { FulfillmentType } from '../../types/order';
import { calculateOrderPricing, validateServicePostalCode } from '../../lib/orderLogic';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, clearCart, deliveryZones, settings } = useStore();
  const { t } = useLanguage();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [postalCode, setPostalCode] = useState('465674');
  const [postalCheckMessage, setPostalCheckMessage] = useState<string | null>(null);

  // Match zone for pricing
  const { isServiced, matchedZone } = validateServicePostalCode(postalCode, deliveryZones);

  const pricing = calculateOrderPricing(
    cart.map((i) => ({
      variantId: i.variant.id,
      productId: i.product.id,
      productName: i.product.name,
      variantName: i.variant.unit_name,
      unitPrice: i.variant.price,
      quantity: i.quantity,
    })),
    fulfillmentType,
    matchedZone
  );

  const handlePostalCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode.trim()) {
      setPostalCheckMessage('Please enter a PIN code.');
      return;
    }
    if (isServiced && matchedZone) {
      setPostalCheckMessage(`Great news! We deliver to ${matchedZone.area_name} (${matchedZone.postal_code}). Est: ${matchedZone.estimated_delivery_time}`);
    } else {
      setPostalCheckMessage(`PIN ${postalCode} is currently outside our local delivery zone. Hub pickup is available in Biaora!`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="section section-white">
        <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <ShoppingBag size={38} color="var(--color-light-gray)" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{t('cart_title')} {t('empty_cart_msg')}</h2>
          <p style={{ color: 'var(--color-light-gray)', marginBottom: '2rem', maxWidth: '440px', margin: '0 auto 2rem auto' }}>
            {t('farm_fresh_desc')}
          </p>
          <Link to="/products" className="btn btn-primary btn-lg" id="browse-dairy-button">
            {t('nav_products')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section section-white">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-dark-blue)' }}>{t('cart_title')}</h1>
          <button
            onClick={clearCart}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-red-danger)', borderColor: 'var(--color-red-danger)' }}
          >
            Clear Cart
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Cart Items List */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => (
                <div
                  key={item.variant.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flexGrow: 1 }}>
                    <Link to={`/products/${item.product.slug}`}>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--color-dark-blue)', marginBottom: '0.2rem' }}>
                        {item.product.name}
                      </h4>
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-light-gray)', marginBottom: '0.5rem' }}>
                      Pack: <strong style={{ color: 'var(--color-dark-gray)' }}>{item.variant.unit_name}</strong> • ₹{item.variant.price} each
                    </div>

                    {/* Quantity Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          height: '32px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.variant.id, item.quantity - 1)}
                          style={{
                            width: '28px',
                            height: '100%',
                            border: 'none',
                            background: '#F9FAFB',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          -
                        </button>
                        <span style={{ width: '30px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.variant.id, item.quantity + 1)}
                          style={{
                            width: '28px',
                            height: '100%',
                            border: 'none',
                            background: '#F9FAFB',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.variant.id)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.2rem 0.5rem', color: 'var(--color-light-gray)' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
                      ₹{item.variant.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Method Choice */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-dark-blue)' }}>
                Fulfillment Method
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <label
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border:
                      fulfillmentType === 'delivery'
                        ? '2px solid var(--color-milk-blue)'
                        : '1px solid var(--color-border)',
                    backgroundColor:
                      fulfillmentType === 'delivery' ? 'var(--color-milk-blue-light)' : 'var(--color-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    checked={fulfillmentType === 'delivery'}
                    onChange={() => setFulfillmentType('delivery')}
                    style={{ marginTop: '4px' }}
                    id="fulfillment-delivery-radio"
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--color-dark-blue)' }}>
                      <Truck size={17} />
                      <span>Home Delivery</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.25rem' }}>
                      Next morning slot (6:00 AM – 8:30 AM). Free on orders above ₹{matchedZone ? matchedZone.min_order_free_delivery : 300}.
                    </p>
                  </div>
                </label>

                <label
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border:
                      fulfillmentType === 'pickup'
                        ? '2px solid var(--color-milk-blue)'
                        : '1px solid var(--color-border)',
                    backgroundColor:
                      fulfillmentType === 'pickup' ? 'var(--color-milk-blue-light)' : 'var(--color-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    checked={fulfillmentType === 'pickup'}
                    onChange={() => setFulfillmentType('pickup')}
                    style={{ marginTop: '4px' }}
                    id="fulfillment-pickup-radio"
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--color-dark-blue)' }}>
                      <Store size={17} />
                      <span>Dairy Hub Pickup</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.25rem' }}>
                      Free pickup at our central dairy depot ({settings.pickup_timings}).
                    </p>
                  </div>
                </label>
              </div>

              {/* Service Area Check for Delivery */}
              {fulfillmentType === 'delivery' && (
                <form onSubmit={handlePostalCheck} style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Check Delivery Service for your PIN Code:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px' }}>
                    <input
                      type="text"
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                        setPostalCheckMessage(null);
                      }}
                      placeholder="e.g. 560001"
                      className="form-input"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.9rem' }}
                      id="pin-code-input"
                    />
                    <button type="submit" className="btn btn-outline btn-sm">
                      Check PIN
                    </button>
                  </div>
                  {postalCheckMessage && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.85rem',
                        color: isServiced ? 'var(--color-fresh-green)' : 'var(--color-red-danger)',
                        fontWeight: 500,
                      }}
                    >
                      {postalCheckMessage}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
              Order Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-light-gray)' }}>{t('order_subtotal')}</span>
                <span style={{ fontWeight: 600 }}>₹{pricing.subtotal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-light-gray)' }}>{t('order_delivery')}</span>
                <span>
                  {pricing.deliveryFee === 0 ? (
                    <strong style={{ color: 'var(--color-fresh-green)' }}>FREE</strong>
                  ) : (
                    `₹${pricing.deliveryFee}`
                  )}
                </span>
              </div>

              {fulfillmentType === 'delivery' && !pricing.isEligibleForFreeDelivery && (
                <div
                  style={{
                    backgroundColor: 'var(--color-ghee-gold-light)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: '#92400E',
                  }}
                >
                  Add ₹{pricing.freeDeliveryThreshold - pricing.subtotal} more to qualify for <strong>FREE Delivery</strong>!
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                  {t('order_total')}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
                  ₹{pricing.total}
                </span>
              </div>

              {pricing.subtotal < settings.minimum_order_amount && (
                <div style={{ color: 'var(--color-red-danger)', fontSize: '0.85rem', fontWeight: 500 }}>
                  Minimum order amount is ₹{settings.minimum_order_amount}.
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { fulfillmentType, postalCode } })}
              disabled={pricing.subtotal < settings.minimum_order_amount}
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: '1.5rem', gap: '0.5rem' }}
              id="proceed-checkout-button"
            >
              <span>{t('proceed_to_checkout')}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--color-light-gray)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} color="var(--color-fresh-green)" />
              <span>Cash on Delivery & Verified UPI accepted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
