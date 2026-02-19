import { useState } from 'react';
import { useStore, Product, Variant } from './StoreContext';
import { useLocation } from 'wouter';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact }: ProductCardProps) {
  const { addToCart } = useStore();
  const [, navigate] = useLocation();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);

  const variant = product.variants[selectedVariant];
  const hasDiscount = variant?.compareAtPrice && parseFloat(variant.compareAtPrice) > parseFloat(variant.price);
  const discountPercent = hasDiscount ? Math.round((1 - parseFloat(variant.price) / parseFloat(variant.compareAtPrice!)) * 100) : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant) {
      addToCart(product, variant);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '0',
      overflow: 'hidden',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}
      onClick={() => navigate(`/store/product/${product.handle}`)}>
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '100%', background: '#fff' }}>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
        />
        {/* Badges - top right */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {product.isOffer && (
            <span style={{ background: '#333', color: 'white', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>عرض خاص</span>
          )}
          {product.isNew && (
            <span style={{ background: '#4CAF50', color: 'white', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>جديد</span>
          )}
        </div>
        {/* Discount badge - bottom left */}
        {hasDiscount && (
          <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: '#C41230', color: 'white', padding: '4px 8px', borderRadius: '50%', fontSize: '11px', fontWeight: 700, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            -{discountPercent}%
          </span>
        )}
        {/* Add to cart button */}
        <button onClick={handleAdd}
          style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: added ? '#C41230' : 'white',
            color: added ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '50%', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            fontSize: '18px', fontWeight: 300,
          }}>
          {added ? '✓' : '+'}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column', direction: 'rtl', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.vendor}</div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '8px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
          {product.title}
        </div>

        <div style={{ marginTop: 'auto' }}>
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {product.variants.length > 1 && <span style={{ fontSize: '12px', color: '#999' }}>من</span>}
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#333' }}>
              KD {variant?.price}
            </span>
          </div>
          {hasDiscount && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ fontSize: '13px', color: '#C41230', textDecoration: 'line-through', fontWeight: 500 }}>
                KD {variant.compareAtPrice}
              </span>
            </div>
          )}

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {product.variants.map((v, i) => (
                <button key={v.id} onClick={e => { e.stopPropagation(); setSelectedVariant(i); }}
                  style={{
                    padding: '4px 10px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer',
                    background: selectedVariant === i ? '#333' : '#f5f5f5',
                    color: selectedVariant === i ? 'white' : '#666',
                    border: 'none',
                    fontWeight: selectedVariant === i ? 600 : 400,
                  }}>
                  {v.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
