import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types/product';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const { t } = useLanguage();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      product_id: product.id,
      unit_name: 'Standard',
      sku: 'SKU-0',
      price: 0,
      stock_quantity: 0,
      is_available: false,
    }
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = wishlist.includes(product.id);
  const isOutOfStock = !selectedVariant.is_available || selectedVariant.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* Product Image & Badges */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: 'var(--color-surface-muted)' }}>
        <Link to={`/products/${product.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-normal)',
            }}
            loading="lazy"
            onMouseOver={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
            onMouseOut={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.0)')}
          />
        </Link>

        {/* Category Pill */}
        <span
          className="badge badge-info"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            textTransform: 'capitalize',
            fontSize: '0.72rem',
          }}
        >
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Heart size={16} color="#DC2626" fill={isFavorited ? '#DC2626' : 'none'} />
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Link to={`/products/${product.slug}`}>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--color-dark-blue)',
              marginBottom: '0.4rem',
            }}
          >
            {product.name}
          </h3>
        </Link>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-light-gray)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>

        {/* Variant Pack Selector */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-dark-gray)', marginBottom: '0.35rem' }}>
            {t('pack_size')}:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => {
                  setSelectedVariant(variant);
                  setQuantity(1);
                }}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border:
                    selectedVariant.id === variant.id
                      ? '2px solid var(--color-milk-blue)'
                      : '1px solid var(--color-border)',
                  backgroundColor:
                    selectedVariant.id === variant.id
                      ? 'var(--color-milk-blue-light)'
                      : 'var(--color-white)',
                  color:
                    selectedVariant.id === variant.id
                      ? 'var(--color-dark-blue)'
                      : 'var(--color-dark-gray)',
                  fontWeight: selectedVariant.id === variant.id ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                {variant.unit_name}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Stock info */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
              ₹{selectedVariant.price}
            </span>
            {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
              <span style={{ fontSize: '0.9rem', color: 'var(--color-light-gray)', textDecoration: 'line-through' }}>
                ₹{selectedVariant.compare_at_price}
              </span>
            )}
            {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
              <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                {t('save_amount')} ₹{selectedVariant.compare_at_price - selectedVariant.price}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            {isOutOfStock ? (
              <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                {t('out_of_stock')}
              </span>
            ) : (
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                {t('in_stock')} ({selectedVariant.stock_quantity})
              </span>
            )}
          </div>

          {/* Add to Cart with Quantity */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isOutOfStock && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  height: '38px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: '30px',
                    height: '100%',
                    border: 'none',
                    background: '#F9FAFB',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span
                  style={{
                    width: '32px',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(selectedVariant.stock_quantity, q + 1))}
                  style={{
                    width: '30px',
                    height: '100%',
                    border: 'none',
                    background: '#F9FAFB',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn ${addedAnimation ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              style={{
                flexGrow: 1,
                height: '38px',
                gap: '0.35rem',
              }}
            >
              {addedAnimation ? (
                <>
                  <Check size={16} /> {t('added_to_cart')}
                </>
              ) : isOutOfStock ? (
                t('out_of_stock')
              ) : (
                <>
                  <ShoppingBag size={16} /> {t('add_to_cart')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
