import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Store, QrCode, Banknote, CreditCard, MessageSquare, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';
import { FulfillmentType, PaymentMethod, DeliveryAddress } from '../../types/order';
import { calculateOrderPricing, validateServicePostalCode } from '../../lib/orderLogic';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { fulfillmentType?: FulfillmentType; postalCode?: string }) || {};

  const { cart, currentUser, placeOrder, deliveryZones, settings } = useStore();
  const { t } = useLanguage();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>(
    state.fulfillmentType || 'delivery'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Address fields
  const defaultAddress = currentUser?.addresses[0];
  const [recipientName, setRecipientName] = useState(defaultAddress?.recipient_name || currentUser?.name || '');
  const [phone, setPhone] = useState(defaultAddress?.phone || currentUser?.phone || '');
  const [addressLine1, setAddressLine1] = useState(defaultAddress?.address_line1 || '');
  const [addressLine2, setAddressLine2] = useState(defaultAddress?.address_line2 || '');
  const [landmark, setLandmark] = useState(defaultAddress?.landmark || '');
  const [postalCode, setPostalCode] = useState(state.postalCode || defaultAddress?.postal_code || '465674');
  const [city, setCity] = useState(defaultAddress?.city || 'Biaora, Rajgarh');
  const [notes, setNotes] = useState('');

  // Zone service check
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

  if (cart.length === 0) {
    return (
      <div className="section section-white">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2>Your Cart is Empty</h2>
          <p style={{ color: 'var(--color-light-gray)', margin: '1rem 0 2rem 0' }}>
            Please add dairy items before checking out.
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Dairy
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!recipientName.trim()) {
      setErrorMessage('Please enter the recipient name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    let deliveryAddress: DeliveryAddress | undefined;

    if (fulfillmentType === 'delivery') {
      if (!addressLine1.trim()) {
        setErrorMessage('Street address or apartment name is required for delivery.');
        return;
      }
      if (!isServiced) {
        setErrorMessage(
          `PIN Code ${postalCode} is currently outside our fresh morning delivery routes. Please choose Store Pickup or adjust your PIN.`
        );
        return;
      }
      deliveryAddress = {
        recipient_name: recipientName.trim(),
        phone: phone.trim(),
        address_line1: addressLine1.trim(),
        address_line2: addressLine2.trim() || undefined,
        landmark: landmark.trim() || undefined,
        city: matchedZone ? matchedZone.city : city.trim(),
        postal_code: postalCode.trim(),
        instructions: notes.trim() || undefined,
      };
    }

    setIsSubmitting(true);

    try {
      const res = await placeOrder({
        fulfillmentType,
        deliveryAddress,
        paymentMethod,
        notes: notes.trim() || undefined,
        whatsappOptIn,
      });

      if (!res.success || !res.order) {
        setErrorMessage(res.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success! Navigate to confirmation page
      navigate(`/order-confirmation/${res.order.id}`, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section section-white">
      <div className="container">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>
          Secure Checkout
        </h1>
        <p style={{ color: 'var(--color-light-gray)', marginBottom: '2.5rem' }}>
          Provide your delivery details and choose your preferred payment option.
        </p>

        {errorMessage && (
          <div
            style={{
              backgroundColor: 'var(--color-red-light)',
              color: 'var(--color-red-danger)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              border: '1px solid #FECACA',
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Delivery & Payment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Step 1: Fulfillment Option */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--color-dark-blue)' }}>
                  1. Fulfillment Method
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
                      name="checkoutFulfillment"
                      checked={fulfillmentType === 'delivery'}
                      onChange={() => setFulfillmentType('delivery')}
                      style={{ marginTop: '4px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--color-dark-blue)' }}>
                        <Truck size={17} />
                        <span>Home Delivery</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.25rem' }}>
                        Early morning doorstep drop (6:00 AM – 8:30 AM).
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
                      name="checkoutFulfillment"
                      checked={fulfillmentType === 'pickup'}
                      onChange={() => setFulfillmentType('pickup')}
                      style={{ marginTop: '4px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--color-dark-blue)' }}>
                        <Store size={17} />
                        <span>Store Pickup</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.25rem' }}>
                        Free pickup at Central Hub ({settings.pickup_timings}).
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 2: Contact & Address */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
                  2. {fulfillmentType === 'delivery' ? 'Delivery Address & Contact' : 'Customer Contact Details'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="recipient-name">Recipient Full Name *</label>
                    <input
                      id="recipient-name"
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="form-input"
                      placeholder="e.g. Ramesh Sharma"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="recipient-phone">Mobile Phone (for delivery SMS/WhatsApp) *</label>
                    <input
                      id="recipient-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                      placeholder="e.g. 98111 22334"
                    />
                  </div>
                </div>

                {fulfillmentType === 'delivery' && (
                  <>
                    <div className="form-group">
                      <label className="form-label" htmlFor="address-line1">House / Flat / Apartment & Street *</label>
                      <input
                        id="address-line1"
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="form-input"
                        placeholder="e.g. Flat 402, Green Meadows Apartment, 14th Cross"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="landmark">Landmark (Optional)</label>
                        <input
                          id="landmark"
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          className="form-input"
                          placeholder="e.g. Near Water Tank"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="postal-code">Delivery PIN Code *</label>
                        <input
                          id="postal-code"
                          type="text"
                          required
                          maxLength={6}
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="form-input"
                          placeholder="e.g. 560001"
                        />
                      </div>
                    </div>

                    {isServiced && matchedZone ? (
                      <div
                        style={{
                          backgroundColor: 'var(--color-fresh-green-light)',
                          color: 'var(--color-fresh-green)',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          marginBottom: '1rem',
                        }}
                      >
                        ✓ Serviceable Area: {matchedZone.area_name} ({matchedZone.city}). Delivery slot: {matchedZone.estimated_delivery_time}.
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: 'var(--color-red-light)',
                          color: 'var(--color-red-danger)',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          marginBottom: '1rem',
                        }}
                      >
                        ⚠ Postal code {postalCode} is currently outside our morning delivery route. You may switch to Store Pickup!
                      </div>
                    )}
                  </>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="order-notes">Special Delivery Instructions</label>
                  <input
                    id="order-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Please leave milk bottle inside the insulated door crate"
                  />
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
                  3. Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Option 1: Cash on Delivery */}
                  <label
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border:
                        paymentMethod === 'cod'
                          ? '2px solid var(--color-milk-blue)'
                          : '1px solid var(--color-border)',
                      backgroundColor:
                        paymentMethod === 'cod' ? 'var(--color-milk-blue-light)' : 'var(--color-white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      id="payment-cod-radio"
                    />
                    <Banknote size={20} color="var(--color-milk-blue)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>
                        Cash on Delivery (COD)
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                        Pay cash directly to our delivery personnel upon morning delivery.
                      </div>
                    </div>
                  </label>

                  {/* Option 2: UPI / QR Manual Payment */}
                  <label
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border:
                        paymentMethod === 'upi_manual'
                          ? '2px solid var(--color-milk-blue)'
                          : '1px solid var(--color-border)',
                      backgroundColor:
                        paymentMethod === 'upi_manual' ? 'var(--color-milk-blue-light)' : 'var(--color-white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi_manual'}
                      onChange={() => setPaymentMethod('upi_manual')}
                      id="payment-upi-radio"
                    />
                    <QrCode size={20} color="var(--color-milk-blue)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>
                        UPI / QR Code Transfer (Manual Verification)
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                        Transfer via GPay/PhonePe/Paytm to <strong>{settings.upi_id}</strong> and submit your transaction UTR reference.
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Payment on Delivery */}
                  <label
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border:
                        paymentMethod === 'payment_on_delivery'
                          ? '2px solid var(--color-milk-blue)'
                          : '1px solid var(--color-border)',
                      backgroundColor:
                        paymentMethod === 'payment_on_delivery'
                          ? 'var(--color-milk-blue-light)'
                          : 'var(--color-white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'payment_on_delivery'}
                      onChange={() => setPaymentMethod('payment_on_delivery')}
                      id="payment-pod-radio"
                    />
                    <CreditCard size={20} color="var(--color-milk-blue)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>
                        Scan & Pay on Delivery
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                        Scan delivery driver's physical QR or UPI on their arrival.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* WhatsApp Notification Consent */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <input
                  type="checkbox"
                  id="whatsapp-opt-in"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                />
                <label htmlFor="whatsapp-opt-in" style={{ fontSize: '0.85rem', color: 'var(--color-dark-gray)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={16} color="var(--color-fresh-green)" />
                  <span>Receive instant order tracking, delivery dispatch alerts, and digital receipts on WhatsApp.</span>
                </label>
              </div>
            </div>

            {/* Right Column: Order Review & Placement */}
            <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {cart.map((item) => (
                  <div key={item.variant.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>{item.product.name}</div>
                      <div style={{ color: 'var(--color-light-gray)', fontSize: '0.78rem' }}>
                        {item.variant.unit_name} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600 }}>₹{item.variant.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-light-gray)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{pricing.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-light-gray)' }}>Delivery Fee</span>
                  <span>
                    {pricing.deliveryFee === 0 ? (
                      <strong style={{ color: 'var(--color-fresh-green)' }}>FREE</strong>
                    ) : (
                      `₹${pricing.deliveryFee}`
                    )}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', margin: '0.4rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                    Total to Pay
                  </span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
                    ₹{pricing.total}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || (fulfillmentType === 'delivery' && !isServiced)}
                className="btn btn-gold btn-lg"
                style={{ width: '100%', marginTop: '1.5rem', gap: '0.5rem' }}
                id="place-order-button"
              >
                {isSubmitting ? 'Processing Order...' : `Place Order • ₹${pricing.total}`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', marginTop: '1rem', color: 'var(--color-light-gray)', fontSize: '0.78rem' }}>
                <ShieldCheck size={15} color="var(--color-fresh-green)" />
                <span>Safe & verified dairy fulfillment guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
