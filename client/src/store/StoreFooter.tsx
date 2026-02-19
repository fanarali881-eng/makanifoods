import { useLocation } from 'wouter';
import { useLang } from './LanguageContext';

export default function StoreFooter() {
  const [, navigate] = useLocation();
  const { t, dir } = useLang();

  return (
    <footer dir={dir} style={{ background: '#1a1a1a', color: '#aaa', padding: '50px 0 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* About */}
          <div>
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 800, display: 'block', marginBottom: '15px' }}>{t('footer.brandName')}</span>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#999' }}>{t('footer.about')}</p>
          </div>

          {/* Customer support */}
          <div>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>{t('footer.customerSupport')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a onClick={() => navigate('/store')} style={{ color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>{t('footer.contactUs')}</a>
              <a onClick={() => navigate('/store')} style={{ color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>{t('footer.faq')}</a>
              <a onClick={() => navigate('/store')} style={{ color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>{t('footer.storeInfo')}</a>
              <a onClick={() => navigate('/store')} style={{ color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>{t('footer.aboutUs')}</a>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>{t('footer.policies')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a style={{ color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>{t('footer.returnPolicy')}</a>
              <a style={{ color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>{t('footer.deliveryTerms')}</a>
              <a style={{ color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>{t('footer.privacyPolicy')}</a>
              <a style={{ color: '#999', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>{t('footer.termsConditions')}</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>{t('footer.contactTitle')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="tel:1809090" style={{ color: '#999', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                1809090
              </a>
              <div style={{ display: 'flex', gap: '12px', marginTop: '5px' }}>
                <a href="https://www.instagram.com/makanifoods" target="_blank" rel="noopener" style={{ color: '#999', transition: 'color 0.2s' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.facebook.com/makanifoods" target="_blank" rel="noopener" style={{ color: '#999', transition: 'color 0.2s' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://twitter.com/makanifoods" target="_blank" rel="noopener" style={{ color: '#999', transition: 'color 0.2s' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>{t('footer.paymentMethods')}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ background: '#fff', color: '#333', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>KNET</span>
              <span style={{ background: '#fff', color: '#1a1f71', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>VISA</span>
              <span style={{ background: '#fff', color: '#eb001b', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>Mastercard</span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#666' }}>{t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
}
