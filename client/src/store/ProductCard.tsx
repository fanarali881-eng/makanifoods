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
  const saveTag = product.tags?.find(t => t.startsWith('Save '));
  const savePercent = saveTag ? saveTag.replace('Save ', '') : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variant) {
      addToCart(product, variant);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const hasBadges = product.isOffer || product.isNew || isCatchWeight || !!savePercent;

  return (
    <div style={{
      background: 'white',
      overflow: 'visible',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/store/product/${product.handle}`)}>

      {/* Badges row - ABOVE the image, outside */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '6px',
        padding: '0 4px',
        minHeight: '32px',
        direction: 'rtl',
      }}>
        {product.isNew && (
          <span style={{
            background: 'white',
            color: '#333',
            padding: '4px 14px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1.5px solid #e0e0e0',
            borderRadius: '2px',
          }}>جديد</span>
        )}
        {product.isOffer && (
          <span style={{
            background: 'white',
            color: '#333',
            padding: '4px 14px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1.5px solid #e0e0e0',
            borderRadius: '2px',
          }}>عرض خاص</span>
        )}
        {/* Save X% Discount in Cart badge for box products */}
        {savePercent && (
          <span style={{
            background: 'white',
            color: '#333',
            padding: '4px 14px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1.5px solid #e0e0e0',
            borderRadius: '2px',
          }}>{savePercent} Discount in Cart</span>
        )}
        {/* Weight icon for catch_weight items - on the left side */}
        {isCatchWeight && (
          <div style={{ marginRight: 'auto', marginLeft: '0' }}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#333">
              <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-1 5v1H8.5L4 20h16l-4.5-11H13V8h-2z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '100%', background: '#fff' }}>
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
        />

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
          {/* Old price centered below current price */}
          {hasDiscount && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{
                background: '#C41230', color: 'white',
                borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                padding: '4px 12px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                whiteSpace: 'nowrap',
              }}>
                -{discountPercent}%
              </span>
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
