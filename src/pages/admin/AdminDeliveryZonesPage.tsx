import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit, Save, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { DeliveryZone } from '../../types/settings';

export const AdminDeliveryZonesPage: React.FC = () => {
  const { deliveryZones, updateDeliveryZones, settings, updateSettings } = useStore();

  const [newZone, setNewZone] = useState<Omit<DeliveryZone, 'id'>>({
    postal_code: '',
    city: '',
    area_name: '',
    delivery_fee: 30,
    min_order_free_delivery: 300,
    is_active: true,
    estimated_delivery_time: 'Next Morning 6:00 AM – 8:30 AM',
  });

  const [pickupAddress, setPickupAddress] = useState(settings.pickup_address);
  const [pickupTimings, setPickupTimings] = useState(settings.pickup_timings);
  const [pickupEnabled, setPickupEnabled] = useState(settings.pickup_enabled);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZone.postal_code.trim()) return;

    const created: DeliveryZone = {
      ...newZone,
      id: 'zone_' + Date.now().toString(36),
      postal_code: newZone.postal_code.trim(),
    };

    updateDeliveryZones([...deliveryZones, created]);
    setNewZone({
      postal_code: '',
      city: '',
      area_name: '',
      delivery_fee: 30,
      min_order_free_delivery: 300,
      is_active: true,
      estimated_delivery_time: 'Next Morning 6:00 AM – 8:30 AM',
    });
    setFeedback(`Zone ${created.postal_code} added successfully.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleZone = (id: string) => {
    const updated = deliveryZones.map((z) => (z.id === id ? { ...z, is_active: !z.is_active } : z));
    updateDeliveryZones(updated);
  };

  const handleDeleteZone = (id: string) => {
    updateDeliveryZones(deliveryZones.filter((z) => z.id !== id));
  };

  const handleSavePickupSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      pickup_address: pickupAddress,
      pickup_timings: pickupTimings,
      pickup_enabled: pickupEnabled,
    });
    setFeedback('Pickup hub settings saved successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-dark-blue)', marginBottom: '0.35rem' }}>
          Delivery Zones & Service Area Settings
        </h1>
        <p style={{ color: 'var(--color-light-gray)' }}>
          Configure exact serviceable PIN codes, delivery rates, and central dairy pickup hub coordinates.
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
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Active Delivery Zones List */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-dark-blue)', marginBottom: '1.25rem' }}>
            Configured Serviceable PIN Codes ({deliveryZones.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {deliveryZones.map((zone) => (
              <div
                key={zone.id}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: zone.is_active ? 'var(--color-white)' : 'var(--color-surface-muted)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>
                      PIN: {zone.postal_code}
                    </span>
                    <span className={`badge ${zone.is_active ? 'badge-success' : 'badge-neutral'}`}>
                      {zone.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-dark-gray)', marginTop: '0.2rem' }}>
                    {zone.area_name} ({zone.city})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.2rem' }}>
                    Delivery Fee: ₹{zone.delivery_fee} • Free above: ₹{zone.min_order_free_delivery}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleToggleZone(zone.id)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.78rem' }}
                  >
                    {zone.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDeleteZone(zone.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--color-red-danger)', borderColor: 'var(--color-border)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Zone Form */}
          <form onSubmit={handleAddZone} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-dark-blue)' }}>
              Add New Service Area
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 560002"
                  value={newZone.postal_code}
                  onChange={(e) => setNewZone({ ...newZone, postal_code: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru"
                  value={newZone.city}
                  onChange={(e) => setNewZone({ ...newZone, city: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Colony / Area Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Indiranagar & Domlur Extension"
                value={newZone.area_name}
                onChange={(e) => setNewZone({ ...newZone, area_name: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={newZone.delivery_fee}
                  onChange={(e) =>
                    setNewZone({ ...newZone, delivery_fee: parseInt(e.target.value) || 0 })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Free Delivery Above (₹)</label>
                <input
                  type="number"
                  value={newZone.min_order_free_delivery}
                  onChange={(e) =>
                    setNewZone({ ...newZone, min_order_free_delivery: parseInt(e.target.value) || 0 })
                  }
                  className="form-input"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%', gap: '0.4rem' }}>
              <Plus size={16} />
              <span>Add Service PIN Code</span>
            </button>
          </form>
        </div>

        {/* Store Pickup Hub Configuration */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-dark-blue)', marginBottom: '1.25rem' }}>
            Store Pickup Depot Settings
          </h3>

          <form onSubmit={handleSavePickupSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={pickupEnabled}
                onChange={(e) => setPickupEnabled(e.target.checked)}
              />
              <span>Enable Customer Store Pickup Option at Checkout</span>
            </label>

            <div className="form-group">
              <label className="form-label">Pickup Hub Address</label>
              <textarea
                rows={3}
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="form-textarea"
                placeholder="Enter complete physical address of your dairy processing or pickup hub..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pickup Hours & Days</label>
              <input
                type="text"
                value={pickupTimings}
                onChange={(e) => setPickupTimings(e.target.value)}
                className="form-input"
                placeholder="e.g. 6:30 AM – 11:30 AM & 4:30 PM – 8:00 PM (Daily)"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-md" style={{ gap: '0.4rem', alignSelf: 'flex-start' }}>
              <Save size={16} />
              <span>Save Pickup Settings</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
