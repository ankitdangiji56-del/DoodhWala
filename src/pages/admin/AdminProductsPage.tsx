import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Save } from 'lucide-react';
import { useStore } from '../../lib/store';
import { Product, ProductVariant, ProductCategory } from '../../types/product';

export const AdminProductsPage: React.FC = () => {
  const { products, saveProduct, deleteProduct } = useStore();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEdit = (prod: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(prod)));
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    const newProd: Product = {
      id: 'prod_' + Date.now().toString(36),
      name: '',
      slug: '',
      category: 'milk',
      description: '',
      image_url: '/images/milk.jpg',
      is_published: true,
      features: ['100% Pure farm origin', 'Zero preservatives'],
      variants: [
        {
          id: 'var_' + Date.now().toString(36),
          product_id: '',
          unit_name: '500 ml',
          sku: 'SKU-NEW',
          price: 40,
          compare_at_price: 45,
          stock_quantity: 50,
          is_available: true,
        },
      ],
    };
    setEditingProduct(newProd);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    saveProduct(editingProduct);
    setIsModalOpen(false);
    setSuccessMsg(`Successfully saved product "${editingProduct.name}"!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleStockChange = (productId: string, variantId: string, newStock: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const updatedVariants = prod.variants.map((v) =>
      v.id === variantId
        ? { ...v, stock_quantity: Math.max(0, newStock), is_available: newStock > 0 }
        : v
    );
    saveProduct({ ...prod, variants: updatedVariants });
  };

  const handleTogglePublish = (product: Product) => {
    saveProduct({ ...product, is_published: !product.is_published });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--color-dark-blue)' }}>Products & Variant Inventory</h1>
          <p style={{ color: 'var(--color-light-gray)' }}>Manage prices, pack sizes, stock counts, and visibility.</p>
        </div>
        <button onClick={handleAddNew} className="btn btn-gold btn-md" style={{ gap: '0.4rem' }}>
          <Plus size={18} />
          <span>Add New Dairy Product</span>
        </button>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: 'var(--color-fresh-green-light)',
            color: 'var(--color-fresh-green)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Products List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {products.map((prod) => (
          <div key={prod.id} className="card" style={{ padding: '1.75rem' }}>
            {/* Product Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={prod.image_url}
                  alt={prod.name}
                  style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-dark-blue)' }}>{prod.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                      {prod.category}
                    </span>
                    <span
                      className={`badge ${prod.is_published ? 'badge-success' : 'badge-neutral'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTogglePublish(prod)}
                      title="Click to toggle publish"
                    >
                      {prod.is_published ? 'Published' : 'Unpublished (Draft)'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(prod)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Edit size={15} />
                  <span>Edit Product</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                      deleteProduct(prod.id);
                    }
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--color-red-danger)', borderColor: 'var(--color-border)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Variants & Stock Table */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--color-dark-gray)', marginBottom: '0.75rem' }}>
                Pack Sizes & Real-Time Stock
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-muted)', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '0.65rem 1rem' }}>Pack Size / Unit</th>
                      <th style={{ padding: '0.65rem 1rem' }}>SKU</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Price (₹)</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Compare Price (₹)</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Current Stock</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prod.variants.map((v) => (
                      <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{v.unit_name}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-light-gray)' }}>{v.sku}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-blue)' }}>₹{v.price}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-light-gray)' }}>
                          {v.compare_at_price ? `₹${v.compare_at_price}` : '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <input
                            type="number"
                            min={0}
                            value={v.stock_quantity}
                            onChange={(e) =>
                              handleStockChange(prod.id, v.id, parseInt(e.target.value) || 0)
                            }
                            className="form-input"
                            style={{ width: '80px', padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className={`badge ${v.is_available && v.stock_quantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                            {v.is_available && v.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingProduct && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--color-dark-blue)' }}>
              {editingProduct.id.includes('new') ? 'Add New Product' : `Edit: ${editingProduct.name}`}
            </h3>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    })
                  }
                  className="form-input"
                  placeholder="e.g. Farm-Fresh Whole Milk"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="form-select"
                  >
                    <option value="milk">Milk</option>
                    <option value="ghee">Ghee</option>
                    <option value="paneer">Paneer</option>
                    <option value="curd">Curd</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Image Path / URL</label>
                  <input
                    type="text"
                    value={editingProduct.image_url}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image_url: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="form-textarea"
                />
              </div>

              {/* Variants Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label">Variants (Pack Sizes & Prices):</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newVar: ProductVariant = {
                        id: 'var_' + Date.now().toString(36),
                        product_id: editingProduct.id,
                        unit_name: '1 Pack',
                        sku: 'SKU-' + Date.now().toString().slice(-4),
                        price: 50,
                        stock_quantity: 20,
                        is_available: true,
                      };
                      setEditingProduct({
                        ...editingProduct,
                        variants: [...editingProduct.variants, newVar],
                      });
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    + Add Pack Variant
                  </button>
                </div>

                {editingProduct.variants.map((v, idx) => (
                  <div
                    key={v.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
                      gap: '0.5rem',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Size (e.g. 1 Litre)"
                      value={v.unit_name}
                      onChange={(e) => {
                        const next = [...editingProduct.variants];
                        next[idx].unit_name = e.target.value;
                        setEditingProduct({ ...editingProduct, variants: next });
                      }}
                      className="form-input"
                      style={{ fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => {
                        const next = [...editingProduct.variants];
                        next[idx].sku = e.target.value;
                        setEditingProduct({ ...editingProduct, variants: next });
                      }}
                      className="form-input"
                      style={{ fontSize: '0.85rem' }}
                    />
                    <input
                      type="number"
                      placeholder="Price ₹"
                      value={v.price}
                      onChange={(e) => {
                        const next = [...editingProduct.variants];
                        next[idx].price = parseInt(e.target.value) || 0;
                        setEditingProduct({ ...editingProduct, variants: next });
                      }}
                      className="form-input"
                      style={{ fontSize: '0.85rem' }}
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock_quantity}
                      onChange={(e) => {
                        const next = [...editingProduct.variants];
                        next[idx].stock_quantity = parseInt(e.target.value) || 0;
                        next[idx].is_available = next[idx].stock_quantity > 0;
                        setEditingProduct({ ...editingProduct, variants: next });
                      }}
                      className="form-input"
                      style={{ fontSize: '0.85rem' }}
                    />
                    {editingProduct.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = editingProduct.variants.filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, variants: next });
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-red-danger)', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline btn-md"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-md" style={{ gap: '0.35rem' }}>
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
