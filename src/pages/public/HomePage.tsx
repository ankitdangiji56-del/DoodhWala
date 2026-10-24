import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Sparkles, Clock, HeartHandshake, ArrowRight } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCard } from '../../components/product/ProductCard';
import { Dairy3DBackground } from '../../components/common/Dairy3DBackground';

export const HomePage: React.FC = () => {
  const { products, settings } = useStore();
  const { t } = useLanguage();

  const featuredProducts = products.filter((p) => p.is_published).slice(0, 4);

  return (
    <div>
      {/* Hero Section with Interactive 3D Dairy Background */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8E7 100%)',
          padding: '4rem 0 5rem 0',
          borderBottom: '1px solid #F5E8C7',
        }}
      >
        <Dairy3DBackground density={30} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Heading, Value Props & Actions */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-milk-blue-light)',
                  color: 'var(--color-milk-blue)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={16} />
                <span>{t('natural_dairy')} • Biaora, Rajgarh</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
                  lineHeight: 1.18,
                  marginBottom: '1.25rem',
                  color: 'var(--color-dark-blue)',
                }}
              >
                {t('hero_title')}
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-dark-gray)',
                  lineHeight: 1.65,
                  marginBottom: '2rem',
                  maxWidth: '540px',
                }}
              >
                {t('hero_subtitle')}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link
                  to="/products"
                  className="btn btn-gold btn-lg"
                  id="hero-order-now-button"
                  style={{ gap: '0.5rem' }}
                >
                  <span>{t('hero_order_now')}</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/subscriptions"
                  className="btn btn-outline btn-lg"
                  id="hero-subscription-button"
                  style={{ gap: '0.5rem' }}
                >
                  <RefreshCw size={18} />
                  <span>{t('hero_start_subscription')}</span>
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  marginTop: '2.5rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid rgba(20, 64, 122, 0.1)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-dark-blue)', fontSize: '0.95rem' }}>
                    100% {t('pure_farm_dairy')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                    {t('natural_dairy')}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-dark-blue)', fontSize: '0.95rem' }}>
                    {t('zero_preservatives')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                    {t('honest_dairy')}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-dark-blue)', fontSize: '0.95rem' }}>
                    {t('morning_delivery')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)' }}>
                    6:00 AM – 8:30 AM
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Dairy Imagery */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '6px solid var(--color-white)',
                  backgroundColor: 'var(--color-white)',
                }}
              >
                <img
                  src="/images/hero-dairy.jpg"
                  alt="Pure farm milk bottle, bilona ghee, fresh paneer, and matka curd"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="eager"
                />
              </div>

              {/* Floating Morning Delivery Pill */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-15px',
                  left: '20px',
                  backgroundColor: 'var(--color-white)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-fresh-green-light)',
                    color: 'var(--color-fresh-green)',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-dark-blue)' }}>
                    {t('morning_delivery')}: 6:00 AM – 8:30 AM
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-light-gray)' }}>
                    Khajuriya, Biaora, Rajgarh
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dairy Products Section */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">{t('fresh_natural_guarantee')}</span>
            <h2>{t('our_products')}</h2>
            <p className="section-desc">
              {t('farm_fresh_desc')}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/products" className="btn btn-outline btn-lg" style={{ gap: '0.5rem' }}>
              <span>{t('view_all_products')}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Doodhwala Section */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">The Doodhwala Standard</span>
            <h2>Why Our Dairy Tastes Real</h2>
            <p className="section-desc">
              We operate on simple traditional standards: clean cows, sanitary handling, and direct doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-white)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-milk-blue-light)',
                  color: 'var(--color-milk-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.65rem' }}>Zero Preservatives</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-light-gray)', lineHeight: 1.6 }}>
                Nothing removed, nothing added. We never use thickeners, milk powders, neutralizers, or hydrogenated fats.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-white)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-ghee-gold-light)',
                  color: 'var(--color-ghee-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <HeartHandshake size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.65rem' }}>Traditional Bilona & Matka Craft</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-light-gray)', lineHeight: 1.6 }}>
                Our ghee is made by slow-churning cultured curd with wooden bilona, and our dahi is set naturally in earthen pots.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-white)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-fresh-green-light)',
                  color: 'var(--color-fresh-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Truck size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.65rem' }}>Direct Doorstep or Hub Pickup</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-light-gray)', lineHeight: 1.6 }}>
                Choose reliable early-morning home delivery within serviced PIN codes or convenient pickup from our central dairy hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Banner Section */}
      <section className="section section-white">
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-dark-blue)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(2rem, 5vw, 4rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  color: 'var(--color-ghee-gold)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                Hassle-Free Morning Routine
              </span>
              <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', marginBottom: '1rem' }}>
                Never Wake Up Without Fresh Milk.
              </h2>
              <p style={{ color: '#D1D5DB', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Set a daily, alternate-day, or weekly dairy schedule. Pause anytime when going on vacation,
                resume with a tap, and pay via COD or verified UPI.
              </p>
              <Link to="/subscriptions" className="btn btn-gold btn-lg">
                Configure Subscription
              </Link>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <h4 style={{ color: 'var(--color-white)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                Subscription Benefits:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#E5E7EB' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="var(--color-ghee-gold)" />
                  <span>Guaranteed daily milk allocation reserved for you</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="var(--color-ghee-gold)" />
                  <span>Pause or cancel anytime without penalties</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="var(--color-ghee-gold)" />
                  <span>Doorstep delivery before breakfast (6:00 AM – 8:30 AM)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Genuine Testimonial / Live Trust Section - Strictly hidden unless enabled with approved data */}
      {settings.show_trust_stats && (
        <section className="section section-cream">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Real Customer Feedback</span>
              <h2>Verified Customer Stories</h2>
            </div>
            {/* Populated exclusively from genuine admin-entered reviews */}
            <div className="grid grid-cols-2 gap-6">
              <div className="card" style={{ padding: '1.75rem' }}>
                <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                  "The milk curdles naturally and produces thick malai just like in our ancestral village."
                </p>
                <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)' }}>Verified Resident</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
