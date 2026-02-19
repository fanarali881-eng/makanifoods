import { useState } from 'react';
import { useStore, Product, Variant } from './StoreContext';
import { useLocation } from 'wouter';

interface QuickAddModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickAddModal({ product, onClose }: QuickAddModalProps) {
  const { addToCart, setCartDrawerOpen } = useStore();
  const [, navigate] = useLocation();
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant);
      onClose();
      setCartDrawerOpen(true);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    navigate(`/store/product/${product.handle}`);
  };

  // Get variant display name in Arabic
  const getVariantLabel = (v: Variant) => {
    const title = v.title.toLowerCase();
    if (title === 'piece' || title === 'default title' || title === '1') return 'قطعة واحدة';
    if (title.includes('carton') || title.includes('box')) {
      // Try to extract quantity
      const match = title.match(/(\d+)/);
      if (match) return `كرتونة ( ${match[1]} قطع )`;
      return 'كرتونة';
    }
    return v.title;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 9998,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        zIndex: 9999,
        width: '90%',
        maxWidth: '380px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        direction: 'rtl',
        textAlign: 'center',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px', left: '12px',
            background: 'none', border: 'none',
            fontSize: '22px', cursor: 'pointer',
            color: '#666', padding: '4px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Product title */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#333',
          marginBottom: '20px',
          marginTop: '10px',
          lineHeight: 1.5,
        }}>
          {product.titleAr || product.title}
        </h3>

        {/* Variant selector - only show if multiple variants */}
        {product.variants.length > 1 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#333',
              marginBottom: '12px',
            }}>
              نوع العبوة
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '30px',
                    border: selectedVariant.id === v.id ? '2px solid #333' : '1.5px solid #ddd',
                    background: 'white',
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: selectedVariant.id === v.id ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {getVariantLabel(v)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: added ? '#333' : '#C41230',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            direction: 'ltr',
          }}
        >
          {added ? '✓ تمت الإضافة' : `KD ${selectedVariant?.price} أضف للسلة`}
        </button>

        {/* View details link */}
        <a
          href={`/store/product/${product.handle}`}
          onClick={handleViewDetails}
          style={{
            fontSize: '14px',
            color: '#333',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          عرض التفاصيل الكاملة
        </a>
      </div>
    </>
  );
}
