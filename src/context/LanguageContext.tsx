import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, TranslationDictionary, SUPPORTED_LANGUAGES, LanguageOption } from '../locales/types';
import { hi } from '../locales/hi';
import { en } from '../locales/en';
import { brx } from '../locales/brx';
import { mwr } from '../locales/mwr';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof TranslationDictionary | string, fallback?: string) => string;
  languages: LanguageOption[];
}

const DICTIONARIES: Record<LanguageCode, TranslationDictionary> = {
  hi,
  en,
  brx,
  mwr,
};

const KEY_ALIASES: Record<string, string> = {
  nav_products: 'navProducts',
  fresh_natural_guarantee: 'featuredSubtitle',
  natural_dairy: 'heroTag',
  zero_preservatives: 'trustZeroPreservatives',
  cat_milk: 'catMilk',
  cat_ghee: 'catGhee',
  cat_paneer: 'catPaneer',
  cat_curd: 'catCurd',
  cat_all: 'catAll',
  nav_subscriptions: 'navSubscriptions',
  footer_policies: 'policiesHeaderTitle',
  nav_delivery_areas: 'deliveryPolicyHeading',
  checkout_payment: 'stepPaymentMethod',
  account_subscriptions: 'navSubscriptions',
  nav_contact: 'navContact',
  support_title: 'supportTitle',
  support_contacts_heading: 'hubInfoTitle',
  whatsapp_chat: 'chatWhatsAppButton',
  pure_farm_dairy: 'trustPure',
  honest_dairy: 'appName',
  support_desc: 'supportSubtitle',
  search_placeholder: 'searchPlaceholder',
  filter_in_stock: 'inStockOnly',
  sort_featured: 'sortFeatured',
  sort_price_low_high: 'sortPriceAsc',
  sort_price_high_low: 'sortPriceDesc',
  no_products_found: 'noProductsMatch',
  empty_cart_msg: 'cartEmptyDesc',
  reset_filters: 'resetFilters',
  pack_size: 'packSize',
  save_amount: 'saveAmount',
  out_of_stock: 'outOfStock',
  in_stock: 'inStock',
  add_to_cart: 'addToCart',
  added_to_cart: 'addedToCart',
  hero_title: 'heroTitle',
  hero_subtitle: 'heroDesc',
  hero_order_now: 'heroOrderNow',
  hero_start_subscription: 'heroStartSubscription',
  morning_delivery: 'trustMorningDelivery',
  our_products: 'featuredTitle',
  farm_fresh_desc: 'featuredDesc',
  view_all_products: 'viewAllVariants',
  why_doodhwala: 'whyUsTitle',
  cart_title: 'cartTitle',
  order_subtotal: 'subtotal',
  order_delivery: 'deliveryFee',
  order_total: 'totalAmount',
  proceed_to_checkout: 'proceedToCheckout',
  login_welcome: 'loginHeading',
  login_desc: 'loginSubheading',
  login_submit: 'signInButton',
  nav_signup: 'signupHeading',
  nav_login: 'navLogin',
  account_orders: 'ordersPlacedStat',
};

const STORAGE_KEY = 'doodhwala_lang_v1';

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // First visit MUST open in Hindi ('hi') by default
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === 'hi' || stored === 'en' || stored === 'brx' || stored === 'mwr')) {
        return stored as LanguageCode;
      }
      return 'hi'; // Hindi is the explicit default
    } catch {
      return 'hi';
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Unable to persist language choice to localStorage', e);
    }
  };

  useEffect(() => {
    // Set document lang attribute for accessibility and screen readers
    document.documentElement.lang = language === 'en' ? 'en' : 'hi';
  }, [language]);

  const t = (key: keyof TranslationDictionary | string, fallback?: string): string => {
    const currentDict = DICTIONARIES[language] as any;
    
    // 1. Direct match on current language dictionary
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }

    // 2. Lookup alias
    const resolvedKey = KEY_ALIASES[key] || (key as keyof TranslationDictionary);
    if (currentDict && currentDict[resolvedKey]) {
      return currentDict[resolvedKey];
    }

    // 3. Fallback to Hindi default
    const hiDict = DICTIONARIES.hi as any;
    if (hiDict && hiDict[resolvedKey]) {
      return hiDict[resolvedKey];
    }
    if (hiDict && hiDict[key]) {
      return hiDict[key];
    }

    return fallback || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
