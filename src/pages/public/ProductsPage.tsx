import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCategory } from '../../types/product';
import { ProductCard } from '../../components/product/ProductCard';

export const ProductsPage: React.FC = () => {
  const { products } = useStore();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = (searchParams.get('category') as ProductCategory | 'all') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories: { label: string; value: ProductCategory | 'all' }[] = [
    { label: t('cat_all'), value: 'all' },
    { label: t('cat_milk'), value: 'milk' },
    { label: t('cat_ghee'), value: 'ghee' },
    { label: t('cat_paneer'), value: 'paneer' },
    { label: t('cat_curd'), value: 'curd' },
  ];

  const handleCategoryChange = (cat: ProductCategory | 'all') => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.is_published)
      .filter((p) => {
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchVariants = p.variants.some((v) => v.unit_name.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchVariants) return false;
        }
        if (onlyInStock) {
          const hasStock = p.variants.some((v) => v.is_available && v.stock_quantity > 0);
          if (!hasStock) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const minPriceA = Math.min(...a.variants.map((v) => v.price));
        const minPriceB = Math.min(...b.variants.map((v) => v.price));
        if (sortBy === 'price-asc') return minPriceA - minPriceB;
        if (sortBy === 'price-desc') return minPriceB - minPriceA;
        return 0;
      });
  }, [products, activeCategory, searchQuery, onlyInStock, sortBy]);

  return (
    <div className="section section-white">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>
            {t('nav_products')}
          </h1>
          <p style={{ color: 'var(--color-light-gray)', fontSize: '1.05rem' }}>
            {t('fresh_natural_guarantee')} • Khajuriya, Biaora, Rajgarh
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-muted)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            marginBottom: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Search & Sort Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-light-gray)' }}
              />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                id="product-search-input"
              />
            </div>

            {/* In-Stock Toggle & Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  id="in-stock-filter-checkbox"
                />
                <span>{t('filter_in_stock')}</span>
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <SlidersHorizontal size={16} color="var(--color-light-gray)" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-select"
                  style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  id="product-sort-select"
                >
                  <option value="featured">{t('sort_featured')}</option>
                  <option value="price-asc">{t('sort_price_low_high')}</option>
                  <option value="price-desc">{t('sort_price_high_low')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className="btn btn-sm"
                style={{
                  backgroundColor:
                    activeCategory === cat.value
                      ? 'var(--color-milk-blue)'
                      : 'var(--color-white)',
                  color:
                    activeCategory === cat.value
                      ? 'var(--color-white)'
                      : 'var(--color-dark-gray)',
                  borderColor:
                    activeCategory === cat.value
                      ? 'var(--color-milk-blue)'
                      : 'var(--color-border)',
                }}
                id={`category-tab-${cat.value}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: 'var(--color-surface-muted)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--color-border-dark)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🥛</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('no_products_found')}</h3>
            <p style={{ color: 'var(--color-light-gray)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              {t('empty_cart_msg')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setOnlyInStock(false);
                handleCategoryChange('all');
              }}
              className="btn btn-primary btn-sm"
            >
              {t('reset_filters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
