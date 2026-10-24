import { DeliveryAddress } from './order';

export type SubscriptionFrequency = 'daily' | 'alternate_days' | 'weekly';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  unit_price: number;
  quantity: number;
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  start_date: string;
  next_delivery_date: string;
  delivery_address: DeliveryAddress;
  special_instructions?: string;
  created_at: string;
}
