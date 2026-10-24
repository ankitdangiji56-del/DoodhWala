import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { ProductCard } from '../../components/product/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="section section-white">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-dark-blue)' }}>Saved Dairy Products</h1>
            <p style={{ color: 'var(--color-light-gray)' }}>Your personal wishlist for quick re-ordering.</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            Explore All Products
          </Link>
        </div>

        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {savedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-xl)' }}>
            <Heart size={40} color="var(--color-light-gray)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h3>
            <p style={{ color: 'var(--color-light-gray)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              Save your favorite fresh milk, bilona ghee, or paneer by clicking the heart icon on any product.
            </p>
            <Link to="/products" className="btn btn-primary btn-sm">
              Discover Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
