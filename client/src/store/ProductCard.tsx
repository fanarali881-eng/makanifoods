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
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const variant = product.variants[0];
  const hasDiscount = variant?.compareAtPrice && parseFloat(variant.compareAtPrice) > parseFloat(variant.price);
  const discountPercent = hasDiscount ? Math.round((1 - parseFloat(variant.price) / parseFloat(variant.compareAtPrice!)) * 100) : 0;
  const isCatchWeight = product.tags?.includes('catch_weight_item');
  const hasMultipleVariants = product.variants.length > 1;

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
      overflow: 'hidden',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
            <span style={{ background: '#333', color: 'white', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>جديد</span>
          )}
        </div>
        {/* Weight icon for catch_weight items - top left area */}
        {isCatchWeight && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#333">
              <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-1 5v1H8.5L4 20h16l-4.5-11H13V8h-2z"/>
            </svg>
          </div>
        )}
        {/* Discount badge - bottom left */}
        {hasDiscount && (
          <span style={{
            position: 'absolute', bottom: '8px', left: '8px',
            background: '#C41230', color: 'white',
            borderRadius: '50%', fontSize: '11px', fontWeight: 700,
            width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            -{discountPercent}%
          </span>
        )}
        {/* Add to cart button - bottom right, only visible on hover */}
        <button onClick={handleAdd}
          style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: added ? '#333' : 'white',
            color: added ? 'white' : '#333',
            border: '1px solid #ddd',
            borderRadius: '50%', width: '38px', height: '38px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.3s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            fontSize: '20px', fontWeight: 300, lineHeight: 1,
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
          }}>
          {added ? '✓' : '+'}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column', direction: 'rtl', textAlign: 'center' }}>
        {/* Product title - larger */}
        <div style={{
          fontSize: '15px', fontWeight: 500, color: '#333', marginBottom: '4px',
          lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any,
        }}>
          {product.titleAr || product.title}
        </div>
        {/* Vendor */}
        <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {product.vendor}
        </div>

        <div style={{ marginTop: 'auto' }}>
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
            {!isCatchWeight && hasMultipleVariants && <span style={{ fontSize: '12px', color: '#999' }}>من</span>}
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#333' }}>
              {isCatchWeight ? `KG/KD${variant?.price}` : `KD ${variant?.price}`}
            </span>
          </div>
          {/* Old price */}
          {hasDiscount && (
            <div style={{ textAlign: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '13px', color: '#C41230', textDecoration: 'line-through', fontWeight: 500 }}>
                {isCatchWeight ? `KG/KD${variant.compareAtPrice}` : `KD ${variant.compareAtPrice}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
