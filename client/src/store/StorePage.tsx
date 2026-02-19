import { useRef, useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import { useLocation } from 'wouter';
import ProductCard from './ProductCard';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

/* ── Hero Slider ── */
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slides = [
    { desktop: '/store-images/banner1-desktop.webp', mobile: '/store-images/banner1-mobile.webp', link: '/store/collection/promotion' },
    { desktop: '/store-images/banner2-desktop.webp', mobile: '/store-images/banner2-mobile.webp', link: '/store/collection/oceans-pride' },
    { desktop: '/store-images/banner3-desktop.webp', mobile: '/store-images/banner3-mobile.webp', link: '/store/collection/promotion' },
    { desktop: '/store-images/banner4-desktop.webp', mobile: '/store-images/banner4-mobile.webp', link: '/store/collection/promotion' },
    { desktop: '/store-images/banner5-desktop.webp', mobile: '/store-images/banner5-mobile.webp', link: '/store/collection/promotion' },
    { desktop: '/store-images/banner6-desktop.webp', mobile: '/store-images/banner6-mobile.webp', link: '/store/collection/promotion' },
    { desktop: '/store-images/banner7-desktop.webp', mobile: '/store-images/banner7-mobile.webp', link: '/store/collection/promotion' },
    { desktop: '/store-images/banner8-desktop.webp', mobile: '/store-images/banner8-mobile.webp', link: '/store/collection/promotion' },
    { desktop: '/store-images/banner9-desktop.webp', mobile: '/store-images/banner9-mobile.webp', link: '/store/collection/promotion' },
    { desktop: '/store-images/banner10-desktop.webp', mobile: '/store-images/banner10-mobile.webp', link: '/store/collection/promotion' },
  ];
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: '#C41230' }}>
      <div style={{ display: 'flex', transition: 'transform 0.6s ease', transform: `translateX(${current * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={i} onClick={() => navigate(s.link)} style={{ minWidth: '100%', cursor: 'pointer' }}>
            <picture>
              <source media="(max-width: 768px)" srcSet={s.mobile} />
              <img src={s.desktop} alt="" style={{ width: '100%', display: 'block' }} />
            </picture>
          </div>
        ))}
      </div>
      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px', border: 'none', background: i === current ? '#C41230' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
        ))}
      </div>
    </section>
  );
}

/* ── Product Carousel ── */
function ProductCarousel({ title, products, viewAllLink }: { title: string; products: any[]; viewAllLink?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!products.length) return null;

  return (
    <section style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#333', textAlign: 'center', marginBottom: '25px' }}>{title}</h2>
        <div style={{ position: 'relative' }}>
          {/* Right arrow */}
          <button onClick={() => scroll('right')} style={{
            position: 'absolute', right: '-10px', top: '40%', transform: 'translateY(-50%)', zIndex: 10,
            background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '18px',
          }}>›</button>
          {/* Left arrow */}
          <button onClick={() => scroll('left')} style={{
            position: 'absolute', left: '-10px', top: '40%', transform: 'translateY(-50%)', zIndex: 10,
            background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '18px',
          }}>‹</button>

          <div ref={scrollRef} style={{
            display: 'flex', gap: '0', overflowX: 'auto', scrollBehavior: 'smooth', padding: '5px 0',
            scrollbarWidth: 'none',
          }}>
            {products.map(p => (
              <div key={p.id} style={{ minWidth: '240px', maxWidth: '240px', flexShrink: 0, borderLeft: '1px solid #f0f0f0' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
        {viewAllLink && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a onClick={() => navigate(viewAllLink)} style={{
              display: 'inline-block', background: '#C41230', color: 'white', padding: '10px 30px', borderRadius: '25px',
              fontWeight: 600, fontSize: '14px', cursor: 'pointer', textDecoration: 'none',
            }}>عرض الكل</a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Category Cards (الأكثر زيارة) ── */
function CategoryCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const cats = [
    { handle: 'frozen_fries-appetizers', title: 'بطاطا مقلية ومقبلات', image: '/store-images/cat-fries.webp' },
    { handle: 'frozen_beef', title: 'لحم بقر و عجل', image: '/store-images/cat-beef.jpg' },
    { handle: 'frozen_poultry', title: 'دواجن', image: '/store-images/cat-poultry.jpg' },
    { handle: 'frozen_seafood', title: 'مأكولات بحرية', image: '/store-images/cat-seafood.jpg' },
    { handle: 'frozen_vegetables-fruits', title: 'خضار وفواكه', image: '/store-images/cat-vegs.jpg' },
    { handle: 'chilled-dry_cheese', title: 'ألبان ، أجبان ، وبيض', image: '/store-images/cat-dairy.jpg' },
  ];

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#333', textAlign: 'center', marginBottom: '25px' }}>الأكثر زيارة</h2>
        <div style={{ position: 'relative' }}>
          <button onClick={() => scroll('right')} style={{
            position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '18px',
          }}>›</button>
          <button onClick={() => scroll('left')} style={{
            position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
            background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '18px',
          }}>‹</button>
          <div ref={scrollRef} style={{
            display: 'flex', gap: '15px', overflowX: 'auto', scrollBehavior: 'smooth', padding: '5px 0',
            scrollbarWidth: 'none',
          }}>
            {cats.map(cat => (
              <div key={cat.handle} onClick={() => navigate(`/store/collection/${cat.handle}`)}
                style={{
                  minWidth: '280px', maxWidth: '280px', flexShrink: 0, cursor: 'pointer',
                  borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee',
                  display: 'flex', alignItems: 'center', background: 'white',
                  transition: 'box-shadow 0.2s', height: '120px',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <img src={cat.image} alt={cat.title} style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                <div style={{ padding: '15px', fontSize: '15px', fontWeight: 600, color: '#333', direction: 'rtl', flex: 1 }}>{cat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Brand Logos ── */
function BrandLogos() {
  const brands = [
    { name: 'Sadia', logo: '/store-images/brand-sadia.png' },
    { name: "Ocean's Pride", logo: '/store-images/brand-op.png' },
    { name: 'Lamb Weston', logo: '/store-images/brand-lw.png' },
    { name: 'Storm', logo: '/store-images/brand-storm.png' },
    { name: 'Daawat', logo: '/store-images/brand-daawat.png' },
    { name: 'Crops', logo: '/store-images/brand-crops.png' },
  ];

  return (
    <section style={{ padding: '40px 0', background: '#f9f9f9' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
        {brands.map(b => (
          <div key={b.name} style={{ width: '120px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={b.logo} alt={b.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Main Store Page ── */
export default function StorePage() {
  const { products, getProductsByCollection, isLoading } = useStore();

  if (isLoading) {
    return (
      <div dir="rtl">
        <StoreHeader />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid #eee', borderTop: '4px solid #C41230', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }} />
            <p style={{ color: '#666' }}>جاري تحميل المتجر...</p>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const newArrivals = getProductsByCollection('new-arrivals');
  const bestSellers = getProductsByCollection('frontpage').length > 0
    ? getProductsByCollection('frontpage')
    : products.slice(0, 15);
  const offers = getProductsByCollection('promotion');
  const oceansPride = getProductsByCollection('oceans-pride');

  return (
    <div dir="rtl" style={{ background: '#fff', minHeight: '100vh' }}>
      <StoreHeader />

      {/* Hero Slider */}
      <HeroSlider />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <ProductCarousel title="وصل حديثاً" products={newArrivals} viewAllLink="/store/collection/new-arrivals" />
      )}

      {/* Best Sellers */}
      <ProductCarousel title="الأكثر مبيعا" products={bestSellers.slice(0, 15)} viewAllLink="/store/collection/all-products" />

      {/* Most Visited Categories */}
      <CategoryCards />

      {/* Special Offers */}
      {offers.length > 0 && (
        <ProductCarousel title="عروض خاصة" products={offers} viewAllLink="/store/collection/promotion" />
      )}

      {/* Ocean's Pride */}
      {oceansPride.length > 0 && (
        <ProductCarousel title="أوشنز برايد" products={oceansPride.slice(0, 15)} viewAllLink="/store/collection/oceans-pride" />
      )}

      {/* Brand Logos */}
      <BrandLogos />

      <StoreFooter />

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
