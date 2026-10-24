import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SupportWidget } from './components/common/SupportWidget';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProductsPage } from './pages/public/ProductsPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { CartPage } from './pages/public/CartPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { OrderConfirmationPage } from './pages/public/OrderConfirmationPage';
import { ContactPage } from './pages/public/ContactPage';
import { PoliciesPage } from './pages/public/PoliciesPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Account Pages
import { AccountDashboardPage } from './pages/account/AccountDashboardPage';
import { OrderHistoryPage } from './pages/account/OrderHistoryPage';
import { SubscriptionsPage } from './pages/account/SubscriptionsPage';
import { WishlistPage } from './pages/account/WishlistPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminDeliveryZonesPage } from './pages/admin/AdminDeliveryZonesPage';
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Admin Login (Must precede /admin layout) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="delivery-zones" element={<AdminDeliveryZonesPage />} />
              <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Public & Customer Routes with Navbar, Footer & SupportWidget */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main style={{ flexGrow: 1 }}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/:slug" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/policies" element={<PoliciesPage />} />
                      <Route path="/subscriptions" element={<SubscriptionsPage />} />

                      {/* Auth */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />

                      {/* Customer Account */}
                      <Route path="/account" element={<AccountDashboardPage />} />
                      <Route path="/account/orders" element={<OrderHistoryPage />} />
                      <Route path="/account/subscriptions" element={<SubscriptionsPage />} />
                      <Route path="/account/wishlist" element={<WishlistPage />} />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                  <SupportWidget />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </StoreProvider>
  );
};

export default App;
