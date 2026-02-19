import { useState, useMemo, useEffect } from 'react';
import { useStore } from './StoreContext';
import { useRoute, useLocation } from 'wouter';
import ProductCard from './ProductCard';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

export default function CollectionPage() {
  const { products, getProductsByCollection, categories, isLoading } = useStore();
  const [, params] = useRoute('/store/collection/:handle');
  const [, navigate] = useLocation();
  const handle = params?.handle || '';
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 24;

  // Reset page when handle changes
  useEffect(() => { setCurrentPage(1); setSortBy('default'); }, [handle]);

  // Find collection title and parent info
  let title = handle;
  let parentCategory: string | null = null;
  let parentTitle: string | null = null;
  let subcategories: any[] = [];

  // Special collection names
  const specialNames: Record<string, string> = {
    'all-products': 'جميع المنتجات',
    'new-arrivals': 'وصل حديثاً',
    'promotion': 'عروض',
    'boxes': 'بوكسات',
    'frontpage': 'الأكثر مبيعاً',
    'oceans-pride': 'أوشنز برايد',
  };

  if (specialNames[handle]) {
    title = specialNames[handle];
  } else {
    // Check main categories and their nested subcategories
    for (const [, cat] of Object.entries(categories)) {
      if (cat.handle === handle) {
        title = cat.title;
        subcategories = cat.subcategories || [];
        break;
      }
      // Check level 1 subcategories
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          if (sub.handle === handle) {
            title = sub.title;
            parentCategory = cat.handle;
            parentTitle = cat.title;
            subcategories = (sub as any).subcategories || [];
            break;
          }
          // Check level 2 subcategories (nested)
          if ((sub as any).subcategories) {
            for (const nested of (sub as any).subcategories) {
              if (nested.handle === handle) {
                title = nested.title;
                parentCategory = cat.handle;
                parentTitle = cat.title;
                break;
              }
            }
          }
        }
      }
    }
  }

  // Get products
  const collectionProducts = useMemo(() => {
    if (handle === 'all-products') return products;
    
    // For parent categories with subcategories, also include products from all sub-collections
    const directProducts = getProductsByCollection(handle);
    if (directProducts.length > 0) return directProducts;
    
    // If no direct products, try aggregating from subcategories
    if (subcategories.length > 0) {
      const allIds = new Set<number>();
      const allProducts: any[] = [];
      for (const sub of subcategories) {
        const subProds = getProductsByCollection(sub.handle);
        for (const p of subProds) {
          if (!allIds.has(p.id)) {
            allIds.add(p.id);
            allProducts.push(p);
          }
        }
        // Also check nested
        if (sub.subcategories) {
          for (const nested of sub.subcategories) {
            const nestedProds = getProductsByCollection(nested.handle);
            for (const p of nestedProds) {
              if (!allIds.has(p.id)) {
                allIds.add(p.id);
                allProducts.push(p);
              }
            }
          }
        }
      }
      return allProducts;
    }
    
    return directProducts;
  }, [handle, products, getProductsByCollection, subcategories]);

  // Sort
  const sortedProducts = useMemo(() => {
    const sorted = [...collectionProducts];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => parseFloat(a.variants[0]?.price || '0') - parseFloat(b.variants[0]?.price || '0'));
      case 'price-desc':
        return sorted.sort((a, b) => parseFloat(b.variants[0]?.price || '0') - parseFloat(a.variants[0]?.price || '0'));
      case 'name-asc':
        return sorted.sort((a, b) => (a.titleAr || a.title).localeCompare(b.titleAr || b.title, 'ar'));
      case 'name-desc':
        return sorted.sort((a, b) => (b.titleAr || b.title).localeCompare(a.titleAr || a.title, 'ar'));
      default:
        return sorted;
    }
  }, [collectionProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / perPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

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
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '15px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <a onClick={() => navigate('/store')} style={{ color: '#C41230', cursor: 'pointer', textDecoration: 'none' }}>الرئيسية</a>
          <span>/</span>
          {parentCategory && (
            <>
              <a onClick={() => navigate(`/store/collection/${parentCategory}`)} style={{ color: '#C41230', cursor: 'pointer', textDecoration: 'none' }}>
                {parentTitle}
              </a>
              <span>/</span>
            </>
          )}
          <span>{title}</span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '20px' }}>{title}</h1>

        {/* Subcategory chips */}
        {subcategories.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {subcategories.map((sub: any) => (
              <a key={sub.handle} onClick={() => navigate(`/store/collection/${sub.handle}`)}
                style={{
                  padding: '8px 18px', borderRadius: '20px', fontSize: '14px',
                  background: 'white', border: '1px solid #ddd', color: '#333',
                  cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s',
                  fontWeight: 500,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C41230'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#C41230'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = '#ddd'; }}>
                {sub.title}
              </a>
            ))}
          </div>
        )}

        {/* Sort & count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>{sortedProducts.length} منتج</span>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', background: 'white', direction: 'rtl' }}>
            <option value="default">الترتيب الافتراضي</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
            <option value="name-asc">الاسم: أ - ي</option>
            <option value="name-desc">الاسم: ي - أ</option>
          </select>
        </div>

        {/* Products grid */}
        {paginatedProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {paginatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>لا توجد منتجات في هذا التصنيف</p>
            <a onClick={() => navigate('/store')} style={{ color: '#C41230', cursor: 'pointer', textDecoration: 'none' }}>العودة للرئيسية</a>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '30px', flexWrap: 'wrap' }}>
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(p => p - 1)}
                style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>
                السابق
              </button>
            )}
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              // Show pages around current page
              let page: number;
              if (totalPages <= 10) {
                page = i + 1;
              } else if (currentPage <= 5) {
                page = i + 1;
              } else if (currentPage >= totalPages - 4) {
                page = totalPages - 9 + i;
              } else {
                page = currentPage - 4 + i;
              }
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '8px 14px', borderRadius: '6px', cursor: 'pointer',
                    background: currentPage === page ? '#C41230' : 'white',
                    color: currentPage === page ? 'white' : '#333',
                    border: currentPage === page ? '1px solid #C41230' : '1px solid #ddd',
                  }}>
                  {page}
                </button>
              );
            })}
            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage(p => p + 1)}
                style={{ padding: '8px 14px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>
                التالي
              </button>
            )}
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
}
