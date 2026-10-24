import { describe, it, expect } from 'vitest';
import {
  calculateOrderPricing,
  validateServicePostalCode,
  isValidOrderStatusTransition,
  isValidPaymentTransition,
  calculateNextDeliveryDate,
  validateInventoryAvailability,
  CartLineItem,
} from '../lib/orderLogic';
import { DeliveryZone } from '../types/settings';
import { ProductVariant } from '../types/product';

describe('Doodhwala Core Business Logic & State Machines', () => {
  const sampleZone: DeliveryZone = {
    id: 'zone_01',
    postal_code: '560001',
    city: 'Bengaluru Central',
    area_name: 'Central Dairy Delivery Belt',
    delivery_fee: 30,
    min_order_free_delivery: 300,
    is_active: true,
    estimated_delivery_time: 'Next Morning 6:00 AM – 8:00 AM',
  };

  const sampleItems: CartLineItem[] = [
    {
      variantId: 'var_milk_1l',
      productId: 'prod_milk_01',
      productName: 'Farm-Fresh Whole Milk',
      variantName: '1 Litre',
      unitPrice: 72,
      quantity: 2, // 144
    },
    {
      variantId: 'var_paneer_200g',
      productId: 'prod_paneer_03',
      productName: 'Fresh Malai Paneer',
      variantName: '200 g',
      unitPrice: 95,
      quantity: 1, // 95
    },
  ]; // Total subtotal = 144 + 95 = 239

  describe('calculateOrderPricing', () => {
    it('applies standard delivery fee when subtotal is below free delivery threshold', () => {
      const result = calculateOrderPricing(sampleItems, 'delivery', sampleZone);
      expect(result.subtotal).toBe(239);
      expect(result.deliveryFee).toBe(30);
      expect(result.total).toBe(269);
      expect(result.isEligibleForFreeDelivery).toBe(false);
    });

    it('waives delivery fee when subtotal reaches or exceeds free delivery threshold', () => {
      const largeItems: CartLineItem[] = [
        ...sampleItems,
        {
          variantId: 'var_ghee_500ml',
          productId: 'prod_ghee_02',
          productName: 'Traditional Bilona Ghee',
          variantName: '500 ml',
          unitPrice: 580,
          quantity: 1,
        },
      ]; // subtotal = 239 + 580 = 819 >= 300

      const result = calculateOrderPricing(largeItems, 'delivery', sampleZone);
      expect(result.subtotal).toBe(819);
      expect(result.deliveryFee).toBe(0);
      expect(result.total).toBe(819);
      expect(result.isEligibleForFreeDelivery).toBe(true);
    });

    it('always charges zero delivery fee for Store Pickup regardless of order amount', () => {
      const result = calculateOrderPricing(sampleItems, 'pickup', sampleZone);
      expect(result.subtotal).toBe(239);
      expect(result.deliveryFee).toBe(0);
      expect(result.total).toBe(239);
    });
  });

  describe('validateServicePostalCode', () => {
    const zones: DeliveryZone[] = [
      sampleZone,
      {
        id: 'zone_02',
        postal_code: '560034',
        city: 'Koramangala',
        area_name: 'East Sub-Hub',
        delivery_fee: 25,
        min_order_free_delivery: 350,
        is_active: false, // inactive zone
        estimated_delivery_time: 'Next Morning',
      },
    ];

    it('matches actively serviced postal codes cleanly', () => {
      const { isServiced, matchedZone } = validateServicePostalCode('560001', zones);
      expect(isServiced).toBe(true);
      expect(matchedZone?.area_name).toBe('Central Dairy Delivery Belt');
    });

    it('rejects inactive or unconfigured postal codes', () => {
      const inactive = validateServicePostalCode('560034', zones);
      expect(inactive.isServiced).toBe(false);

      const unconfigured = validateServicePostalCode('999999', zones);
      expect(unconfigured.isServiced).toBe(false);
    });
  });

  describe('isValidOrderStatusTransition', () => {
    it('allows valid linear progression for home delivery', () => {
      expect(isValidOrderStatusTransition('pending_confirmation', 'confirmed', 'delivery')).toBe(true);
      expect(isValidOrderStatusTransition('confirmed', 'preparing', 'delivery')).toBe(true);
      expect(isValidOrderStatusTransition('preparing', 'out_for_delivery', 'delivery')).toBe(true);
      expect(isValidOrderStatusTransition('out_for_delivery', 'delivered', 'delivery')).toBe(true);
    });

    it('allows valid progression for store pickup', () => {
      expect(isValidOrderStatusTransition('confirmed', 'preparing', 'pickup')).toBe(true);
      expect(isValidOrderStatusTransition('preparing', 'ready_for_pickup', 'pickup')).toBe(true);
      expect(isValidOrderStatusTransition('ready_for_pickup', 'delivered', 'pickup')).toBe(true);
    });

    it('strictly forbids skipping states or reverse transitions', () => {
      expect(isValidOrderStatusTransition('pending_confirmation', 'delivered', 'delivery')).toBe(false);
      expect(isValidOrderStatusTransition('delivered', 'preparing', 'delivery')).toBe(false);
      expect(isValidOrderStatusTransition('cancelled', 'confirmed', 'delivery')).toBe(false);
    });

    it('permits cancellation only before dispatch', () => {
      expect(isValidOrderStatusTransition('pending_confirmation', 'cancelled', 'delivery')).toBe(true);
      expect(isValidOrderStatusTransition('confirmed', 'cancelled', 'delivery')).toBe(true);
      expect(isValidOrderStatusTransition('preparing', 'cancelled', 'delivery')).toBe(true);
      expect(isValidOrderStatusTransition('out_for_delivery', 'cancelled', 'delivery')).toBe(false);
      expect(isValidOrderStatusTransition('delivered', 'cancelled', 'delivery')).toBe(false);
    });
  });

  describe('isValidPaymentTransition', () => {
    it('disallows jumping directly from pending to paid without manual verification for UPI', () => {
      expect(isValidPaymentTransition('pending', 'paid', 'upi_manual')).toBe(false);
      expect(isValidPaymentTransition('pending_verification', 'paid', 'upi_manual')).toBe(true);
    });

    it('allows COD to remain pending until delivery is completed', () => {
      expect(isValidPaymentTransition('pending', 'paid', 'cod')).toBe(true);
    });
  });

  describe('calculateNextDeliveryDate', () => {
    it('calculates the next morning delivery date', () => {
      const fixedBase = new Date('2026-10-24T12:00:00Z');
      const dailyNext = calculateNextDeliveryDate('daily', fixedBase);
      expect(dailyNext).toBe('2026-10-25');

      const alternateNext = calculateNextDeliveryDate('alternate_days', fixedBase);
      expect(alternateNext).toBe('2026-10-26');

      const weeklyNext = calculateNextDeliveryDate('weekly', fixedBase);
      expect(weeklyNext).toBe('2026-10-31');
    });
  });

  describe('validateInventoryAvailability', () => {
    const variant: ProductVariant = {
      id: 'var_01',
      product_id: 'prod_01',
      unit_name: '1 Litre',
      sku: 'SKU-1',
      price: 72,
      stock_quantity: 10,
      is_available: true,
    };

    it('approves when requested quantity is within stock', () => {
      expect(validateInventoryAvailability(5, variant).isAvailable).toBe(true);
      expect(validateInventoryAvailability(10, variant).isAvailable).toBe(true);
    });

    it('rejects when requested quantity exceeds available stock', () => {
      const check = validateInventoryAvailability(15, variant);
      expect(check.isAvailable).toBe(false);
      expect(check.message).toContain('Only 10 left in stock');
    });

    it('rejects when variant is marked unavailable', () => {
      const unavailable = { ...variant, is_available: false };
      expect(validateInventoryAvailability(1, unavailable).isAvailable).toBe(false);
    });
  });
});
