import { useState, useMemo } from 'react';
import { useStore, Product } from './StoreContext';
import { useRoute, useLocation } from 'wouter';
import ProductCard from './ProductCard';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

export default function ProductPage() {
  const { getProductByHandle, addToCart, products, isLoading } = useStore();
  const [, params] = useRoute('/store/product/:handle');
  const [, navigate] = useLocation();
  const handle = params?.handle || '';
  const product = getProductByHandle(handle);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.id !== product.id && (p.vendor === product.vendor || p.productType === product.productType))
      .slice(0, 8);
  }, [product, products]);

  if (isLoading) {
    return (
      <div dir="rtl">
        <StoreHeader />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #eee', borderTop: '4px solid #C41230', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div dir="rtl">
        <StoreHeader />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>المنتج غير موجود</p>
          <a onClick={() => navigate('/store')} style={{ color: '#C41230', cursor: 'pointer' }}>العودة للرئيسية</a>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const images = product.images || [product.image];
  const hasDiscount = variant?.compareAtPrice && parseFloat(variant.compareAtPrice) > parseFloat(variant.price);
  const discountPercent = hasDiscount ? Math.round((1 - parseFloat(variant.price) / parseFloat(variant.compareAtPrice!)) * 100) : 0;

  const handleAddToCart = () => {
    if (variant) {
      addToCart(product, variant, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div dir="rtl" style={{ background: '#fafafa', minHeight: '100vh' }}>
      <StoreHeader />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '20px', display: 'flex', gap: '5px' }}>
          <a onClick={() => navigate('/store')} style={{ color: '#C41230', cursor: 'pointer' }}>الرئيسية</a>
          <span>/</span>
          <span>{product.title}</span>
        </div>

        {/* Product detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', background: 'white', borderRadius: '12px', padding: '30px' }} className="product-detail-grid">
          {/* Images */}
          <div>
            <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', background: '#f8f8f8' }}>
              <img src={images[selectedImage]} alt={product.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setSelectedImage(i)}
                    style={{
                      width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer',
                      border: selectedImage === i ? '2px solid #C41230' : '2px solid #eee',
                    }} />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', color: '#999', marginBottom: '5px' }}>{product.vendor}</div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#333', marginBottom: '15px', lineHeight: 1.4 }}>{product.title}</h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: hasDiscount ? '#f44336' : '#333' }}>
                {variant?.price} KD
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through' }}>{variant.compareAtPrice} KD</span>
                  <span style={{ background: '#f44336', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>-{discountPercent}%</span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>الحجم:</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.variants.map((v, i) => (
                    <button key={v.id} onClick={() => { setSelectedVariant(i); }}
                      style={{
                        padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
                        background: selectedVariant === i ? '#C41230' : 'white',
                        color: selectedVariant === i ? 'white' : '#333',
                        border: selectedVariant === i ? '2px solid #C41230' : '2px solid #ddd',
                        fontWeight: selectedVariant === i ? 600 : 400,
                      }}>
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>الكمية:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #ddd', borderRadius: '6px', width: 'fit-content' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ padding: '8px 14px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '18px', borderRadius: '6px 0 0 6px' }}>-</button>
                <span style={{ padding: '8px 20px', fontSize: '16px', fontWeight: 600, minWidth: '50px', textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  style={{ padding: '8px 14px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '18px', borderRadius: '0 6px 6px 0' }}>+</button>
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart}
              style={{
                width: '100%', padding: '14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: '16px', fontWeight: 600, transition: 'all 0.2s',
                background: added ? '#8B0000' : '#C41230', color: 'white',
              }}>
              {added ? '✓ تمت الإضافة' : 'أضف إلى السلة'}
            </button>

            {/* Description */}
            {product.bodyHtml && (
              <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '10px', color: '#333' }}>وصف المنتج</h3>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: product.bodyHtml }} />
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#333', textAlign: 'center', marginBottom: '20px' }}>منتجات مشابهة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <StoreFooter />

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 20px !important; padding: 15px !important; }
        }
      `}</style>
    </div>
  );
}
