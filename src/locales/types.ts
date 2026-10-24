export type LanguageCode = 'hi' | 'en' | 'brx' | 'mwr';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'brx', label: 'Braj Bhasha', nativeLabel: 'ब्रज भाषा' },
  { code: 'mwr', label: 'Marwari', nativeLabel: 'मारवाड़ी' },
];

export interface TranslationDictionary {
  // General
  appName: string;
  tagline: string;
  loading: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  error: string;
  success: string;
  required: string;

  // Navigation
  navHome: string;
  navProducts: string;
  navSubscriptions: string;
  navContact: string;
  navCart: string;
  navWishlist: string;
  navAccount: string;
  navLogin: string;
  navSignup: string;
  navAdmin: string;
  navSignOut: string;

  // Banner & Hero
  announcementText: string;
  heroTag: string;
  heroTitle: string;
  heroDesc: string;
  heroOrderNow: string;
  heroStartSubscription: string;
  trustPure: string;
  trustZeroPreservatives: string;
  trustMorningDelivery: string;
  heroSlotTitle: string;
  heroSlotSubtitle: string;

  // Catalogue & Filters
  featuredTitle: string;
  featuredSubtitle: string;
  featuredDesc: string;
  viewAllVariants: string;
  productsTitle: string;
  productsDesc: string;
  searchPlaceholder: string;
  inStockOnly: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  catAll: string;
  catMilk: string;
  catGhee: string;
  catPaneer: string;
  catCurd: string;

  // Product Card & Detail
  packSize: string;
  inStock: string;
  outOfStock: string;
  saveAmount: string;
  addToCart: string;
  addedToCart: string;
  unavailable: string;
  sku: string;
  description: string;
  purityFeatures: string;
  storageHandling: string;
  nutritionFacts: string;
  subDailyPrompt: string;
  subDailyPromptSub: string;
  subDailyButton: string;
  backToProducts: string;
  productNotFound: string;
  noProductsMatch: string;
  resetFilters: string;

  // Why Us & Subscription Section
  whyUsSubtitle: string;
  whyUsTitle: string;
  whyUsDesc: string;
  whyZeroPreservativesTitle: string;
  whyZeroPreservativesDesc: string;
  whyTraditionalCraftTitle: string;
  whyTraditionalCraftDesc: string;
  whyDirectFulfillmentTitle: string;
  whyDirectFulfillmentDesc: string;
  subBannerTag: string;
  subBannerTitle: string;
  subBannerDesc: string;
  subBenefit1: string;
  subBenefit2: string;
  subBenefit3: string;

  // Cart
  cartTitle: string;
  cartEmptyTitle: string;
  cartEmptyDesc: string;
  browseDairyButton: string;
  clearCartButton: string;
  fulfillmentMethod: string;
  homeDelivery: string;
  homeDeliveryDesc: string;
  storePickup: string;
  storePickupDesc: string;
  checkPinLabel: string;
  checkPinButton: string;
  orderBreakdown: string;
  subtotal: string;
  deliveryFee: string;
  free: string;
  totalAmount: string;
  qualifyFreeDeliveryNotice: string;
  minimumOrderNotice: string;
  proceedToCheckout: string;

  // Checkout
  checkoutTitle: string;
  checkoutSubtitle: string;
  stepFulfillment: string;
  stepContactAddress: string;
  recipientFullName: string;
  mobileNumberLabel: string;
  streetAddressLabel: string;
  landmarkLabel: string;
  pinCodeLabel: string;
  deliveryInstructionsLabel: string;
  stepPaymentMethod: string;
  codLabel: string;
  codDesc: string;
  upiLabel: string;
  upiDesc: string;
  podLabel: string;
  podDesc: string;
  whatsappConsentText: string;
  orderSummaryTitle: string;
  placeOrderButton: string;
  processingOrderText: string;

  // Order Confirmation & Tracking
  orderPlacedSuccess: string;
  orderNumberLabel: string;
  placedOnLabel: string;
  timelineTitle: string;
  stepReceived: string;
  stepConfirmed: string;
  stepPreparing: string;
  stepOutForDelivery: string;
  stepReadyPickup: string;
  stepDelivered: string;
  upiTransferHeader: string;
  upiInstructionText: string;
  storeUpiIdLabel: string;
  payeeNameLabel: string;
  transferAmountLabel: string;
  enterUtrLabel: string;
  submitUtrButton: string;
  utrRecordedBadge: string;
  paymentStatusLabel: string;
  whatsappActiveNotice: string;
  orderItemsTitle: string;
  destinationTitle: string;
  continueShoppingButton: string;
  viewAllOrdersButton: string;

  // Subscriptions Page
  subPageTitle: string;
  subPageSubtitle: string;
  scheduleNewSubButton: string;
  subGuaranteeBox: string;
  noSubsYet: string;
  noSubsYetDesc: string;
  pauseVacationButton: string;
  resumeDeliveryButton: string;
  cancelSubButton: string;
  freqDaily: string;
  freqAlternate: string;
  freqWeekly: string;
  nextDeliveryDateLabel: string;
  estimatedCostPerMorning: string;
  confirmSubButton: string;

  // Customer Support
  supportTitle: string;
  supportSubtitle: string;
  hubInfoTitle: string;
  customerHelpline: string;
  helplineHours: string;
  emailSupportLabel: string;
  centralHubAddressLabel: string;
  operatingHoursLabel: string;
  operatingHoursDesc: string;
  chatWhatsAppButton: string;
  localityFormTitle: string;
  localityFormDesc: string;
  localityFormSuccessTitle: string;
  localityFormSuccessDesc: string;
  submitLocalityButton: string;
  widgetOpenButton: string;
  widgetTitle: string;
  widgetEmergencyNotice: string;
  callContact: string;

  // Auth & Account
  loginHeading: string;
  loginSubheading: string;
  signupHeading: string;
  signupSubheading: string;
  tabPassword: string;
  tabOtp: string;
  emailOrUsernameLabel: string;
  passwordLabel: string;
  enterOtpLabel: string;
  sendOtpButton: string;
  signInButton: string;
  createAccountButton: string;
  dontHaveAccountPrompt: string;
  alreadyHaveAccountPrompt: string;
  accountDashboardTitle: string;
  ordersPlacedStat: string;
  activeSubsStat: string;
  savedItemsStat: string;
  myProfileTitle: string;
  savedAddressTitle: string;
  adminPortalButton: string;

  // Policies
  policiesHeaderTitle: string;
  policiesHeaderDesc: string;
  founderReviewAlert: string;
  deliveryPolicyHeading: string;
  paymentPolicyHeading: string;
  subPolicyHeading: string;
  privacyPolicyHeading: string;
}
