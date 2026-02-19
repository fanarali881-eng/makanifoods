import { useState, useRef, useEffect } from 'react';
import { useStore } from './StoreContext';
import { useLocation } from 'wouter';

export default function StoreHeader() {
  const { categories, getCartCount, searchQuery, setSearchQuery, searchProducts } = useStore();
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const cartCount = getCartCount();
  const megaTimeoutRef = useRef<any>(null);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 1) {
      setSearchResults(searchProducts(q).slice(0, 8));
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchResults([]);
    }
  };

  const openMega = (key: string) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaMenuOpen(key);
  };

  const closeMega = () => {
    megaTimeoutRef.current = setTimeout(() => setMegaMenuOpen(null), 150);
  };

  const megaMenuKeys = ['frozen', 'chilled-dry'];

  const megaImages: Record<string, string> = {
    'frozen': '/images/frozen-mega.webp',
    'chilled-dry': '/images/chilled-mega.webp',
  };

  const megaShopAllText: Record<string, string> = {
    'frozen': 'تسوق الأطعمة المجمدة',
    'chilled-dry': 'تسوق الأطعمة المبردة والجافة',
  };

  return (
    <header className="store-header" dir="rtl" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top announcement bar */}
      <div style={{ background: '#000000', color: 'white', padding: '8px 20px', fontSize: '13px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <a onClick={() => navigate('/store')} style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
          توصيل مجاني للطلبات بقيمة 20 د.ك أو أكثر - شروط التوصيل ←
        </a>
        <span style={{ position: 'absolute', left: '20px', fontSize: '12px', cursor: 'pointer', color: 'white' }}>English</span>
      </div>

      {/* Main header - Red background */}
      <div style={{ background: '#C41230', padding: '12px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo + tagline */}
          <a onClick={() => navigate('/store')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ color: 'white', fontSize: '28px', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Arial, sans-serif' }}>مكاني<br/>فودز</span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: 500 }}>مختصوا الأغذية المجمدة</span>
          </a>

          {/* Navigation - desktop */}
          <nav className="store-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {/* Frozen mega menu */}
            <div
              onMouseEnter={() => openMega('frozen')}
              onMouseLeave={closeMega}
              style={{ position: 'relative' }}
            >
              <a onClick={() => { navigate('/store/collection/frozen'); setMegaMenuOpen(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 16px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: megaMenuOpen === 'frozen' ? 700 : 500, whiteSpace: 'nowrap', textDecoration: 'none' }}>
                أطعمة مجمدة
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><path d="M2 3.5L5 6.5L8 3.5" stroke="white" strokeWidth="1.5" fill="none"/></svg>
              </a>
            </div>

            {/* Chilled & Dry mega menu */}
            <div
              onMouseEnter={() => openMega('chilled-dry')}
              onMouseLeave={closeMega}
              style={{ position: 'relative' }}
            >
              <a onClick={() => { navigate('/store/collection/chilled-dry'); setMegaMenuOpen(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 16px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: megaMenuOpen === 'chilled-dry' ? 700 : 500, whiteSpace: 'nowrap', textDecoration: 'none' }}>
                أطعمة مبردة وجافة
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><path d="M2 3.5L5 6.5L8 3.5" stroke="white" strokeWidth="1.5" fill="none"/></svg>
              </a>
            </div>

            {/* Other nav items */}
            <a onClick={() => navigate('/store/collection/new-arrivals')}
              style={{ padding: '10px 16px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              وصل حديثاً
            </a>
            <a onClick={() => navigate('/store/collection/promotion')}
              style={{ padding: '10px 16px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              عروض
            </a>
            <a onClick={() => navigate('/store/collection/boxes')}
              style={{ padding: '10px 16px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              بوكسات
            </a>
          </nav>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexShrink: 0 }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <a style={{ cursor: 'pointer', padding: '4px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </a>
            <a onClick={() => navigate('/store/cart')} style={{ cursor: 'pointer', position: 'relative', padding: '4px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', left: '-6px', background: 'white', color: '#C41230', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                  {cartCount}
                </span>
              )}
            </a>
            <button className="store-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', padding: '4px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {megaMenuOpen && megaMenuKeys.includes(megaMenuOpen) && categories[megaMenuOpen] && (
        <div
          onMouseEnter={() => openMega(megaMenuOpen!)}
          onMouseLeave={closeMega}
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'white',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            zIndex: 99,
            direction: 'rtl',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 30px 20px', display: 'flex', gap: '30px' }}>
            {/* Left side - Image */}
            <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <img
                src={megaImages[megaMenuOpen]}
                alt=""
                style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <a
                onClick={() => { navigate(`/store/collection/${megaMenuOpen}`); setMegaMenuOpen(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center',
                  marginTop: '12px', color: '#333', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', textDecoration: 'none',
                }}
              >
                {megaShopAllText[megaMenuOpen]}
                <span style={{ fontSize: '16px' }}>←</span>
              </a>
            </div>

            {/* Right side - Categories grid */}
            <div style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px 30px',
              alignContent: 'start',
            }}>
              {categories[megaMenuOpen].subcategories.map((sub: any) => (
                <div key={sub.handle} style={{ marginBottom: '10px' }}>
                  <a
                    onClick={() => { navigate(`/store/collection/${sub.handle}`); setMegaMenuOpen(null); }}
                    style={{
                      display: 'block',
                      fontSize: '15px', fontWeight: 700, color: '#222',
                      marginBottom: '8px', cursor: 'pointer', textDecoration: 'none',
                    }}
                  >
                    {sub.title}
                  </a>
                  {sub.subcategories && sub.subcategories.map((nested: any) => (
                    <a
                      key={nested.handle}
                      onClick={() => { navigate(`/store/collection/${nested.handle}`); setMegaMenuOpen(null); }}
                      style={{
                        display: 'block',
                        fontSize: '13px', color: '#555',
                        padding: '3px 0', cursor: 'pointer', textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#C41230')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                    >
                      {nested.title}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div style={{ background: 'white', padding: '15px 20px', borderBottom: '2px solid #C41230', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <input type="text" placeholder="ابحث عن منتجات..." value={searchQuery} onChange={e => handleSearch(e.target.value)} autoFocus
              style={{ width: '100%', padding: '12px 45px 12px 15px', border: '2px solid #C41230', borderRadius: '8px', fontSize: '15px', outline: 'none', direction: 'rtl' }} />
            <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C41230" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            {searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', right: 0, left: 0, background: 'white', border: '1px solid #ddd', borderRadius: '0 0 8px 8px', marginTop: '2px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '400px', overflow: 'auto' }}>
                {searchResults.map(p => (
                  <a key={p.id} onClick={() => { navigate(`/store/product/${p.handle}`); setSearchResults([]); setSearchQuery(''); setSearchOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textDecoration: 'none', color: '#333' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                    <img src={p.image} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{p.titleAr || p.title}</div>
                      <div style={{ fontSize: '13px', color: '#C41230', fontWeight: 600 }}>{p.variants[0]?.price} KD</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 200 }}>
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '300px', background: 'white', overflowY: 'auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #C41230' }}>
              <span style={{ color: '#C41230', fontSize: '22px', fontWeight: 800 }}>مكاني فودز</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#333' }}>✕</button>
            </div>
            {Object.entries(categories).map(([key, cat]) => (
              <MobileCategory key={key} cat={cat} navigate={navigate} close={() => setMobileMenuOpen(false)} />
            ))}
            <a onClick={() => { navigate('/store/collection/promotion'); setMobileMenuOpen(false); }}
              style={{ display: 'block', padding: '12px 0', fontWeight: 600, fontSize: '15px', color: '#C41230', cursor: 'pointer', textDecoration: 'none', borderBottom: '1px solid #eee' }}>
              عروض
            </a>
            <a onClick={() => { navigate('/store/collection/boxes'); setMobileMenuOpen(false); }}
              style={{ display: 'block', padding: '12px 0', fontWeight: 600, fontSize: '15px', color: '#333', cursor: 'pointer', textDecoration: 'none', borderBottom: '1px solid #eee' }}>
              بوكسات
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .store-nav-desktop { display: none !important; }
          .store-mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}

function MobileCategory({ cat, navigate, close }: { cat: any; navigate: (path: string) => void; close: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #eee' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a onClick={() => { navigate(`/store/collection/${cat.handle}`); close(); }}
          style={{ display: 'block', padding: '12px 0', fontWeight: 600, fontSize: '15px', color: '#333', cursor: 'pointer', textDecoration: 'none', flex: 1 }}>
          {cat.title}
        </a>
        {cat.subcategories && cat.subcategories.length > 0 && (
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', fontSize: '16px', color: '#666' }}>
            {expanded ? '−' : '+'}
          </button>
        )}
      </div>
      {expanded && cat.subcategories && cat.subcategories.map((sub: any) => (
        <div key={sub.handle}>
          <a onClick={() => { navigate(`/store/collection/${sub.handle}`); close(); }}
            style={{ display: 'block', padding: '8px 15px', fontSize: '14px', color: '#333', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
            {sub.title}
          </a>
          {sub.subcategories && sub.subcategories.map((nested: any) => (
            <a key={nested.handle} onClick={() => { navigate(`/store/collection/${nested.handle}`); close(); }}
              style={{ display: 'block', padding: '6px 30px', fontSize: '13px', color: '#666', cursor: 'pointer', textDecoration: 'none' }}>
              {nested.title}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
