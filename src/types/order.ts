export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'ready_for_pickup'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'upi_manual' | 'payment_on_delivery';

export type PaymentStatus =
  | 'pending'
  | 'pending_verification'
  | 'paid'
  | 'failed'
  | 'refunded';

export type FulfillmentType = 'delivery' | 'pickup';

export interface DeliveryAddress {
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  postal_code: string;
  instructions?: string;
}

export interface OrderItem {
  id?: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export interface OrderStatusEvent {
  id: string;
  order_id: string;
  from_status: OrderStatus;
  to_status: OrderStatus;
  changed_by: string; // 'customer' | 'admin' | 'system'
  notes?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  fulfillment_type: FulfillmentType;
  fulfillmentType?: FulfillmentType;
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  delivery_address?: DeliveryAddress;
  upi_reference_number?: string;
  upi_verified_at?: string;
  upi_verified_by?: string;
  notes?: string;
  whatsapp_opt_in: boolean;
  items: OrderItem[];
  created_at: string;
  status_history?: OrderStatusEvent[];
}
