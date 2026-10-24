import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, ArrowLeft, RefreshCw, ShieldCheck, Check, Info } from 'lucide-react';
import { useStore } from '../../lib/store';
import { ProductVariant } from '../../types/product';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, addToCart, wishlist, toggleWishlist } = useStore();

  const product = products.find((p) => p.slug === slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product ? product.variants[0] || null : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product || !selectedVariant) {
    return (
      <div className="section section-white">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2>Product Not Found</h2>
          <p style={{ color: 'var(--color-light-gray)', margin: '1rem 0 2rem 0' }}>
            The dairy product you are looking for does not exist or has been unpublished.
          </p>
          <Link to="/products" className="btn btn-primary">
            Back to Dairy Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = wishlist.includes(product.id);
  const isOutOfStock = !selectedVariant.is_available || selectedVariant.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="section section-white">
      <div className="container">
        {/* Breadcrumb / Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '2rem', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
          }}
        >
          {/* Product Image Gallery */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface-muted)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                aspectRatio: '1/1',
              }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)',
              }}
              aria-label="Toggle Wishlist"
            >
              <Heart size={20} color="#DC2626" fill={isFavorited ? '#DC2626' : 'none'} />
            </button>
          </div>

          {/* Product Details & Actions */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                {product.category}
              </span>
              {isOutOfStock ? (
                <span className="badge badge-danger">Out of Stock</span>
              ) : (
                <span className="badge badge-success">
                  In Stock ({selectedVariant.stock_quantity} units available)
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.1rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>
              {product.name}
            </h1>
            <p style={{ color: 'var(--color-light-gray)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              SKU: {selectedVariant.sku}
            </p>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-dark-blue)', fontFamily: 'var(--font-heading)' }}>
                ₹{selectedVariant.price}
              </span>
              {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                <span style={{ fontSize: '1.15rem', color: 'var(--color-light-gray)', textDecoration: 'line-through' }}>
                  ₹{selectedVariant.compare_at_price}
                </span>
              )}
              {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                  Save ₹{selectedVariant.compare_at_price - selectedVariant.price}
                </span>
              )}
            </div>

            {/* Variant Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Select Pack Size:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      setQuantity(1);
                    }}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border:
                        selectedVariant.id === v.id
                          ? '2px solid var(--color-milk-blue)'
                          : '1px solid var(--color-border)',
                      backgroundColor:
                        selectedVariant.id === v.id
                          ? 'var(--color-milk-blue-light)'
                          : 'var(--color-white)',
                      color:
                        selectedVariant.id === v.id
                          ? 'var(--color-dark-blue)'
                          : 'var(--color-dark-gray)',
                      fontWeight: selectedVariant.id === v.id ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                    }}
                  >
                    {v.unit_name} — ₹{v.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {!isOutOfStock && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    height: '46px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      width: '38px',
                      height: '100%',
                      border: 'none',
                      background: '#F9FAFB',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span
                    style={{
                      width: '42px',
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock_quantity, q + 1))}
                    style={{
                      width: '38px',
                      height: '100%',
                      border: 'none',
                      background: '#F9FAFB',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`btn ${addedAnimation ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                style={{ flexGrow: 1, minWidth: '200px', gap: '0.5rem' }}
                id="add-to-cart-button"
              >
                {addedAnimation ? (
                  <>
                    <Check size={20} />
                    <span>Added to Cart!</span>
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>Add to Cart • ₹{selectedVariant.price * quantity}</span>
                  </>
                )}
              </button>
            </div>

            {/* Recurring Subscription Shortcut */}
            <div
              style={{
                backgroundColor: 'var(--color-cream)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #F5E8C7',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-dark-blue)', fontSize: '0.95rem' }}>
                  Want this delivered every morning?
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--color-dark-gray)' }}>
                  Schedule daily, alternate days, or weekly recurring delivery.
                </div>
              </div>
              <Link
                to={`/subscriptions?product=${product.id}&variant=${selectedVariant.id}`}
                className="btn btn-gold btn-sm"
                style={{ gap: '0.4rem' }}
              >
                <RefreshCw size={15} />
                <span>Set Daily Schedule</span>
              </Link>
            </div>

            {/* Description & Purity Features */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.65rem' }}>Product Description</h3>
              <p style={{ color: 'var(--color-dark-gray)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {product.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <ShieldCheck size={18} color="var(--color-fresh-green)" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Storage Info */}
            {product.storage_info && (
              <div
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  fontSize: '0.875rem',
                }}
              >
                <Info size={18} color="var(--color-milk-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-dark-blue)' }}>Storage & Handling: </strong>
                  <span>{product.storage_info}</span>
                </div>
              </div>
            )}

            {/* Nutrition Facts */}
            {product.nutrition_facts && (
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.65rem' }}>Nutritional Information</h4>
                <div
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <tbody>
                      {Object.entries(product.nutrition_facts).map(([key, value], idx) => (
                        <tr
                          key={key}
                          style={{
                            backgroundColor: idx % 2 === 0 ? 'var(--color-white)' : 'var(--color-surface-muted)',
                            borderBottom: '1px solid var(--color-border)',
                          }}
                        >
                          <td style={{ padding: '0.6rem 1rem', fontWeight: 600, color: 'var(--color-dark-gray)' }}>
                            {key}
                          </td>
                          <td style={{ padding: '0.6rem 1rem', textAlign: 'right', color: 'var(--color-dark-blue)', fontWeight: 600 }}>
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
