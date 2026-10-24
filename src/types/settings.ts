export interface DeliveryZone {
  id: string;
  postal_code: string;
  city: string;
  area_name: string;
  delivery_fee: number;
  min_order_free_delivery: number;
  is_active: boolean;
  estimated_delivery_time: string;
}

export interface SupportContactPerson {
  name: string;
  phone: string;
  role?: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  contact_phone: string;
  contact_email: string;
  whatsapp_number: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  support_contacts: SupportContactPerson[];
  upi_id: string;
  upi_payee_name: string;
  pickup_enabled: boolean;
  pickup_address: string;
  pickup_timings: string;
  announcement_banner_enabled: boolean;
  announcement_banner_text: string;
  show_trust_stats: boolean; // Must remain false unless genuine approved data is configured
  show_testimonials: boolean; // Must remain false unless genuine approved data is configured
  minimum_order_amount: number;
}
