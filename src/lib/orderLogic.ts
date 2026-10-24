import { OrderStatus, FulfillmentType, PaymentStatus, PaymentMethod } from '../types/order';
import { ProductVariant } from '../types/product';
import { DeliveryZone } from '../types/settings';
import { SubscriptionFrequency } from '../types/subscription';

export interface CartLineItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface PricingResult {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  isEligibleForFreeDelivery: boolean;
  freeDeliveryThreshold: number;
}

/**
 * Calculates authoritative subtotal, delivery fee, and final total.
 * Pure function - never relies on client totals.
 */
export function calculateOrderPricing(
  items: CartLineItem[],
  fulfillmentType: FulfillmentType,
  deliveryZone: DeliveryZone | null
): PricingResult {
  const subtotal = items.reduce((sum, item) => {
    return sum + Math.max(0, item.unitPrice) * Math.max(0, item.quantity);
  }, 0);

  if (fulfillmentType === 'pickup') {
    return {
      subtotal,
      deliveryFee: 0,
      discount: 0,
      total: subtotal,
      isEligibleForFreeDelivery: true,
      freeDeliveryThreshold: 0,
    };
  }

  const deliveryFee = deliveryZone ? deliveryZone.delivery_fee : 30;
  const threshold = deliveryZone ? deliveryZone.min_order_free_delivery : 300;
  const isFree = subtotal >= threshold;
  const finalDeliveryFee = isFree ? 0 : deliveryFee;

  return {
    subtotal,
    deliveryFee: finalDeliveryFee,
    discount: 0,
    total: subtotal + finalDeliveryFee,
    isEligibleForFreeDelivery: isFree,
    freeDeliveryThreshold: threshold,
  };
}

/**
 * Validates whether a given PIN / Postal code is actively serviced.
 */
export function validateServicePostalCode(
  postalCode: string,
  zones: DeliveryZone[]
): { isServiced: boolean; matchedZone: DeliveryZone | null } {
  const trimmed = postalCode.trim();
  const matched = zones.find(
    (z) => z.is_active && z.postal_code.trim().toLowerCase() === trimmed.toLowerCase()
  );

  return {
    isServiced: !!matched,
    matchedZone: matched || null,
  };
}

/**
 * Enforces valid order status state transitions.
 * Delivery flow:
 * pending_confirmation -> confirmed -> preparing -> out_for_delivery -> delivered
 * Pickup flow:
 * pending_confirmation -> confirmed -> preparing -> ready_for_pickup -> delivered
 * Cancellation is allowed before dispatch.
 */
export function isValidOrderStatusTransition(
  current: OrderStatus,
  target: OrderStatus,
  fulfillmentType: FulfillmentType
): boolean {
  if (current === target) return true;

  // Once delivered or cancelled, order cannot transition further
  if (current === 'delivered' || current === 'cancelled') {
    return false;
  }

  // Cancellation paths: allowed from pending_confirmation, confirmed, or preparing
  if (target === 'cancelled') {
    return ['pending_confirmation', 'confirmed', 'preparing'].includes(current);
  }

  if (fulfillmentType === 'pickup') {
    const validPickupNext: Record<OrderStatus, OrderStatus[]> = {
      pending_confirmation: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready_for_pickup', 'cancelled'],
      ready_for_pickup: ['delivered', 'cancelled'],
      out_for_delivery: [], // not applicable for pickup
      delivered: [],
      cancelled: [],
    };
    return validPickupNext[current]?.includes(target) ?? false;
  }

  // Delivery Flow
  const validDeliveryNext: Record<OrderStatus, OrderStatus[]> = {
    pending_confirmation: ['confirmed', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['out_for_delivery', 'cancelled'],
    out_for_delivery: ['delivered', 'cancelled'],
    ready_for_pickup: [], // not applicable for delivery
    delivered: [],
    cancelled: [],
  };
  return validDeliveryNext[current]?.includes(target) ?? false;
}

/**
 * Validates and updates payment status transitions.
 * UPI must remain pending_verification until an authorized admin explicitly verifies it.
 */
export function isValidPaymentTransition(
  currentPaymentStatus: PaymentStatus,
  nextPaymentStatus: PaymentStatus,
  method: PaymentMethod
): boolean {
  if (currentPaymentStatus === nextPaymentStatus) return true;

  if (method === 'upi_manual') {
    // Cannot jump straight to 'paid' without verification
    if (currentPaymentStatus === 'pending' && nextPaymentStatus === 'paid') {
      return false; // must be verified through pending_verification
    }
  }

  if (currentPaymentStatus === 'paid' && nextPaymentStatus !== 'refunded') {
    return false; // A paid order can only transition to refunded
  }

  return true;
}

/**
 * Calculates the next recurring delivery date based on frequency.
 */
export function calculateNextDeliveryDate(
  frequency: SubscriptionFrequency,
  fromDate: Date = new Date()
): string {
  const next = new Date(fromDate);
  // Default to next day morning
  next.setDate(next.getDate() + 1);

  if (frequency === 'alternate_days') {
    next.setDate(next.getDate() + 1);
  } else if (frequency === 'weekly') {
    next.setDate(next.getDate() + 6);
  }

  return next.toISOString().split('T')[0];
}

/**
 * Verifies that stock is sufficient before checkout.
 */
export function validateInventoryAvailability(
  requestedQuantity: number,
  variant: ProductVariant
): { isAvailable: boolean; message?: string } {
  if (!variant.is_available) {
    return { isAvailable: false, message: `${variant.unit_name} is currently marked out of stock.` };
  }
  if (variant.stock_quantity < requestedQuantity) {
    return {
      isAvailable: false,
      message: `Only ${variant.stock_quantity} left in stock for ${variant.unit_name}.`,
    };
  }
  return { isAvailable: true };
}
