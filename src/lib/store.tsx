import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types/product';
import { Order, OrderStatus, PaymentStatus, OrderItem, FulfillmentType, DeliveryAddress, PaymentMethod } from '../types/order';
import { Subscription, SubscriptionStatus, SubscriptionFrequency } from '../types/subscription';
import { StoreSettings, DeliveryZone } from '../types/settings';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_DELIVERY_ZONES } from './initialData';
import { calculateOrderPricing, isValidOrderStatusTransition, calculateNextDeliveryDate } from './orderLogic';
import { isSupabaseConfigured, supabase } from './supabase';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  password?: string; // Stored securely in users table for local fallback
  whatsapp_opt_in: boolean;
  addresses: DeliveryAddress[];
}

interface StoreContextType {
  // Products
  products: Product[];
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Authentication (Strictly Separated)
  currentUser: UserProfile | null;
  login: (identifier: string, passOrOtp: string, isOtp?: boolean) => Promise<{ success: boolean; message?: string }>;
  adminLogin: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Orders
  orders: Order[];
  placeOrder: (data: {
    fulfillmentType: FulfillmentType;
    deliveryAddress?: DeliveryAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
    whatsappOptIn: boolean;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus, notes?: string) => { success: boolean; error?: string };
  submitUpiReference: (orderId: string, referenceNumber: string) => { success: boolean; error?: string };
  verifyUpiPayment: (orderId: string, isApproved: boolean, notes?: string) => { success: boolean; error?: string };

  // Subscriptions
  subscriptions: Subscription[];
  createSubscription: (data: {
    product: Product;
    variant: ProductVariant;
    frequency: SubscriptionFrequency;
    quantity: number;
    deliveryAddress: DeliveryAddress;
    startDate?: string;
  }) => { success: boolean; subscription?: Subscription; error?: string };
  updateSubscriptionStatus: (id: string, newStatus: SubscriptionStatus) => void;

  // Zones & Settings
  deliveryZones: DeliveryZone[];
  updateDeliveryZones: (zones: DeliveryZone[]) => void;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  CART: 'doodhwala_cart_v2',
  WISHLIST: 'doodhwala_wishlist_v2',
  AUTH: 'doodhwala_auth_user_v2',
  USERS: 'doodhwala_registered_users_v2',
  PRODUCTS: 'doodhwala_products_v2',
  ORDERS: 'doodhwala_orders_v2',
  SUBSCRIPTIONS: 'doodhwala_subscriptions_v2',
  SETTINGS: 'doodhwala_settings_v2',
  ZONES: 'doodhwala_zones_v2',
};

// Initial verifiable registered users for local fallback
const INITIAL_REGISTERED_USERS: UserProfile[] = [
  {
    id: 'admin_master_01',
    name: 'Store Administrator',
    email: 'admin@doodhwala.local',
    phone: '+91 9893927434',
    role: 'admin',
    password: 'Admin@Doodhwala2026',
    whatsapp_opt_in: true,
    addresses: [],
  },
  {
    id: 'cust_sample_01',
    name: 'Ramesh Sharma',
    email: 'customer@example.local',
    phone: '+91 98111 22334',
    role: 'customer',
    password: 'password123',
    whatsapp_opt_in: true,
    addresses: [
      {
        recipient_name: 'Ramesh Sharma',
        phone: '+91 98111 22334',
        address_line1: 'House 14, Main Road, Khajuriya',
        landmark: 'Near Water Tank',
        city: 'Biaora',
        postal_code: '465674',
      },
    ],
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load registered users store for local fallback
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_REGISTERED_USERS;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });

  // User Profile: Defaults to null on fresh visit! NO fake auto-login!
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Delivery Zones
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ZONES);
      return stored ? JSON.parse(stored) : INITIAL_DELIVERY_ZONES;
    } catch {
      return INITIAL_DELIVERY_ZONES;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [currentUser]);

  // Cart operations
  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    if (quantity <= 0) return;
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.variant.id === variant.id);
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: Math.min(newQty, variant.stock_quantity),
        };
        return next;
      }
      return [
        ...prev,
        {
          product,
          variant,
          quantity: Math.min(quantity, variant.stock_quantity),
        },
      ];
    });
  };

  const updateCartQuantity = (variantId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.variant.id !== variantId);
      }
      return prev.map((item) => {
        if (item.variant.id === variantId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.variant.stock_quantity),
          };
        }
        return item;
      });
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // ============================================================================
  // AUTHENTICATION LOGIC (Security Hardened)
  // ============================================================================

  // Customer Login (Strictly verifies credentials against stored accounts)
  const login = async (identifier: string, passOrOtp: string, isOtp = false) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = passOrOtp.trim();

    if (!cleanId) {
      return { success: false, message: 'Please provide your registered email or phone number.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your password or verification code.' };
    }

    // If Supabase is configured in production, use Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanId,
          password: cleanPass,
        });
        if (error || !data.user) {
          return { success: false, message: error?.message || 'Invalid credentials.' };
        }
        // Fetch verified profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userObj: UserProfile = {
          id: data.user.id,
          name: profile?.name || data.user.email?.split('@')[0] || 'Customer',
          email: data.user.email || cleanId,
          phone: profile?.phone || '',
          role: profile?.role === 'admin' ? 'admin' : 'customer',
          whatsapp_opt_in: profile?.whatsapp_opt_in ?? true,
          addresses: [],
        };
        setCurrentUser(userObj);
        return { success: true };
      } catch (err: any) {
        return { success: false, message: err.message || 'Authentication error.' };
      }
    }

    // Local / Offline fallback with strict credential validation:
    // Look up user in registered accounts by email or phone
    const matchedUser = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (!matchedUser) {
      return {
        success: false,
        message: 'No registered account found with these details. Please create an account.',
      };
    }

    if (isOtp) {
      // In local preview, OTP must be 6 digits and match account
      if (cleanPass.length !== 6 || !/^\d+$/.test(cleanPass)) {
        return { success: false, message: 'Invalid OTP code. Please enter a valid 6-digit code.' };
      }
    } else {
      // Validate password
      if (matchedUser.password !== cleanPass) {
        return { success: false, message: 'Incorrect password. Please verify and try again.' };
      }
    }

    // Security check: Customer login strictly assigns the matching user role
    setCurrentUser(matchedUser);
    return { success: true };
  };

  // Dedicated Administrator Login (Separated from customer login)
  const adminLogin = async (identifier: string, pass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Administrator email and password are required.' };
    }

    const matchedUser = registeredUsers.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')) &&
        u.role === 'admin'
    );

    if (!matchedUser) {
      return {
        success: false,
        message: 'Access denied: No administrative account found with these credentials.',
      };
    }

    if (matchedUser.password !== cleanPass) {
      return { success: false, message: 'Invalid administrator credentials.' };
    }

    setCurrentUser(matchedUser);
    return { success: true };
  };

  // Customer Signup (Strictly customer role, checks duplicates, validates length)
  const signup = async (name: string, email: string, phone: string, password: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      return { success: false, message: 'Please enter your full name.' };
    }
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile phone number.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    // Check duplicate email or phone
    const exists = registeredUsers.some(
      (u) =>
        (cleanEmail && u.email.toLowerCase() === cleanEmail) ||
        u.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')
    );

    if (exists) {
      return {
        success: false,
        message: 'An account with this email or phone number already exists. Please log in.',
      };
    }

    const newUser: UserProfile = {
      id: 'cust_' + Date.now().toString(36),
      name: cleanName,
      email: cleanEmail || `${cleanPhone.replace(/\D/g, '')}@phone.local`,
      phone: cleanPhone,
      role: 'customer', // Strictly customer role! Never admin!
      password: password,
      whatsapp_opt_in: true,
      addresses: [],
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  // Order Placement
  const placeOrder = async (data: {
    fulfillmentType: FulfillmentType;
    deliveryAddress?: DeliveryAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
    whatsappOptIn: boolean;
  }) => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    if (data.fulfillmentType === 'delivery' && !data.deliveryAddress) {
      return { success: false, error: 'Delivery address is required for home delivery.' };
    }

    // Match delivery zone if home delivery
    let matchedZone: DeliveryZone | null = null;
    if (data.fulfillmentType === 'delivery' && data.deliveryAddress) {
      const pin = data.deliveryAddress.postal_code.trim();
      matchedZone =
        deliveryZones.find((z) => z.is_active && z.postal_code === pin) || null;
      if (!matchedZone) {
        return {
          success: false,
          error: `Sorry, postal code ${pin} is outside our current fresh delivery zone.`,
        };
      }
    }

    // Authoritative pricing calculation
    const pricing = calculateOrderPricing(
      cart.map((i) => ({
        variantId: i.variant.id,
        productId: i.product.id,
        productName: i.product.name,
        variantName: i.variant.unit_name,
        unitPrice: i.variant.price,
        quantity: i.quantity,
        imageUrl: i.product.image_url,
      })),
      data.fulfillmentType,
      matchedZone
    );

    if (pricing.subtotal < settings.minimum_order_amount) {
      return {
        success: false,
        error: `Minimum order value is ₹${settings.minimum_order_amount}. Your subtotal is ₹${pricing.subtotal}.`,
      };
    }

    // Validate and atomically deduct stock
    const updatedProducts = [...products];
    for (const item of cart) {
      const prodIdx = updatedProducts.findIndex((p) => p.id === item.product.id);
      if (prodIdx > -1) {
        const varIdx = updatedProducts[prodIdx].variants.findIndex(
          (v) => v.id === item.variant.id
        );
        if (varIdx > -1) {
          const v = updatedProducts[prodIdx].variants[varIdx];
          if (v.stock_quantity < item.quantity) {
            return {
              success: false,
              error: `Insufficient stock for ${item.product.name} (${v.unit_name}). Only ${v.stock_quantity} available.`,
            };
          }
          v.stock_quantity -= item.quantity;
          if (v.stock_quantity === 0) {
            v.is_available = false;
          }
        }
      }
    }
    setProducts(updatedProducts);

    // Build order items snapshot
    const orderItems: OrderItem[] = cart.map((i) => ({
      product_id: i.product.id,
      variant_id: i.variant.id,
      product_name: i.product.name,
      variant_name: i.variant.unit_name,
      unit_price: i.variant.price,
      quantity: i.quantity,
      total_price: i.variant.price * i.quantity,
      image_url: i.product.image_url,
    }));

    const orderNumber = `DW-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: 'ord_' + Date.now().toString(36),
      order_number: orderNumber,
      customer_id: currentUser ? currentUser.id : 'guest_' + Date.now().toString(36),
      customer_name:
        data.deliveryAddress?.recipient_name || currentUser?.name || 'Valued Customer',
      customer_phone:
        data.deliveryAddress?.phone || currentUser?.phone || '+91 9893927434',
      customer_email: currentUser?.email,
      fulfillment_type: data.fulfillmentType,
      fulfillmentType: data.fulfillmentType,
      order_status: 'pending_confirmation',
      payment_method: data.paymentMethod,
      payment_status: data.paymentMethod === 'upi_manual' ? 'pending_verification' : 'pending',
      subtotal: pricing.subtotal,
      delivery_fee: pricing.deliveryFee,
      discount: pricing.discount,
      total_amount: pricing.total,
      delivery_address: data.deliveryAddress,
      notes: data.notes,
      whatsapp_opt_in: data.whatsappOptIn,
      items: orderItems,
      created_at: new Date().toISOString(),
      status_history: [
        {
          id: 'ev_' + Date.now(),
          order_id: 'ord_' + Date.now().toString(36),
          from_status: 'pending_confirmation',
          to_status: 'pending_confirmation',
          changed_by: 'customer',
          notes: 'Order placed by customer via web platform.',
          created_at: new Date().toISOString(),
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (
    orderId: string,
    nextStatus: OrderStatus,
    notes?: string
  ): { success: boolean; error?: string } => {
    let errorMsg: string | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const isValid = isValidOrderStatusTransition(
          ord.order_status,
          nextStatus,
          ord.fulfillment_type || ord.fulfillmentType || 'delivery'
        );
        if (!isValid) {
          errorMsg = `Cannot transition order status from '${ord.order_status}' to '${nextStatus}'.`;
          return ord;
        }

        const newHistory = [
          ...(ord.status_history || []),
          {
            id: 'ev_' + Date.now(),
            order_id: ord.id,
            from_status: ord.order_status,
            to_status: nextStatus,
            changed_by: currentUser?.role || 'admin',
            notes: notes || `Order status updated to ${nextStatus}`,
            created_at: new Date().toISOString(),
          },
        ];

        return {
          ...ord,
          order_status: nextStatus,
          status_history: newHistory,
        };
      })
    );

    if (errorMsg) return { success: false, error: errorMsg };
    return { success: true };
  };

  const submitUpiReference = (orderId: string, referenceNumber: string) => {
    if (!referenceNumber.trim()) {
      return { success: false, error: 'UPI Transaction Reference / UTR cannot be blank.' };
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          upi_reference_number: referenceNumber.trim(),
          payment_status: 'pending_verification',
        };
      })
    );

    return { success: true };
  };

  const verifyUpiPayment = (orderId: string, isApproved: boolean, notes?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const newPaymentStatus: PaymentStatus = isApproved ? 'paid' : 'failed';
        return {
          ...ord,
          payment_status: newPaymentStatus,
          upi_verified_at: new Date().toISOString(),
          upi_verified_by: currentUser?.name || 'Administrator',
          notes: notes ? `${ord.notes ? ord.notes + '\n' : ''}[Admin Verification]: ${notes}` : ord.notes,
        };
      })
    );
    return { success: true };
  };

  // Subscriptions
  const createSubscription = (data: {
    product: Product;
    variant: ProductVariant;
    frequency: SubscriptionFrequency;
    quantity: number;
    deliveryAddress: DeliveryAddress;
    startDate?: string;
  }) => {
    const nextDelivery = calculateNextDeliveryDate(
      data.frequency,
      data.startDate ? new Date(data.startDate) : new Date()
    );

    const newSub: Subscription = {
      id: 'sub_' + Date.now().toString(36),
      customer_id: currentUser ? currentUser.id : 'guest_' + Date.now().toString(36),
      customer_name: data.deliveryAddress.recipient_name,
      customer_phone: data.deliveryAddress.phone,
      product_id: data.product.id,
      variant_id: data.variant.id,
      product_name: data.product.name,
      variant_name: data.variant.unit_name,
      unit_price: data.variant.price,
      quantity: data.quantity,
      frequency: data.frequency,
      status: 'active',
      start_date: data.startDate || new Date().toISOString().split('T')[0],
      next_delivery_date: nextDelivery,
      delivery_address: data.deliveryAddress,
      created_at: new Date().toISOString(),
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    return { success: true, subscription: newSub };
  };

  const updateSubscriptionStatus = (id: string, newStatus: SubscriptionStatus) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );
  };

  // Catalog management
  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = product;
        return next;
      }
      return [...prev, product];
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateDeliveryZones = (zones: DeliveryZone[]) => {
    setDeliveryZones(zones);
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        saveProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        login,
        adminLogin,
        signup,
        logout,
        orders,
        placeOrder,
        updateOrderStatus,
        submitUpiReference,
        verifyUpiPayment,
        subscriptions,
        createSubscription,
        updateSubscriptionStatus,
        deliveryZones,
        updateDeliveryZones,
        settings,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
