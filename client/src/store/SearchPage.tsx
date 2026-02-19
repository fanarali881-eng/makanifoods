import { useMemo } from 'react';
import { useStore } from './StoreContext';
import { useLocation } from 'wouter';
import ProductCard from './ProductCard';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

export default function SearchPage() {
  const { searchProducts, isLoading } = useStore();
  const [location] = useLocation();

  const query = useMemo(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    return params.get('q') || '';
  }, [location]);

  const results = useMemo(() => searchProducts(query), [query, searchProducts]);

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

  return (
    <div dir="rtl" style={{ background: '#fafafa', minHeight: '100vh' }}>
      <StoreHeader />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#333', marginBottom: '5px' }}>
          نتائج البحث عن "{query}"
        </h1>
        <p style={{ fontSize: '14px', color: '#999', marginBottom: '20px' }}>{results.length} نتيجة</p>

        {results.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {results.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px' }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>لم يتم العثور على نتائج</p>
            <p style={{ fontSize: '14px', color: '#999' }}>حاول البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
}
