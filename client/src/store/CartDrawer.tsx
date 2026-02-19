import { useStore } from './StoreContext';

export default function CartDrawer() {
  const {
    cart, cartDrawerOpen, setCartDrawerOpen,
    removeFromCart, updateCartQuantity, getCartTotal, getCartCount,
  } = useStore();

  if (!cartDrawerOpen) return null;

  const total = getCartTotal();
  const count = getCartCount();
  const freeShippingThreshold = 15;
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);
  const qualifiesForFreeShipping = total >= freeShippingThreshold;

  const getVariantLabel = (title: string) => {
    const t = title.toLowerCase();
    if (t === 'piece' || t === 'default title' || t === '1') return 'قطعة واحدة';
    if (t.includes('carton') || t.includes('box')) {
      const match = t.match(/(\d+)/);
      if (match) return `كرتونة ( ${match[1]} قطع )`;
      return 'كرتونة';
    }
    return title;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 10000,
          transition: 'opacity 0.3s',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '460px',
        background: 'white',
        zIndex: 10001,
        display: 'flex', flexDirection: 'column',
        direction: 'rtl',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s ease',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #eee',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="#333">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#C41230', color: 'white',
                  borderRadius: '50%', width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                }}>{count}</span>
              )}
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#333' }}>سلتي</span>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            style={{
              background: 'none', border: 'none',
              fontSize: '24px', cursor: 'pointer', color: '#333',
              padding: '4px', lineHeight: 1,
            }}
          >✕</button>
        </div>

        {/* Free shipping bar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontSize: '13px', color: '#333', marginBottom: '8px', textAlign: 'center' }}>
            {qualifiesForFreeShipping
              ? 'مبروك! أنت مؤهل للحصول على توصيل مجاني.'
              : `أضف ${(freeShippingThreshold - total).toFixed(3)} د.ك للحصول على توصيل مجاني`
            }
          </div>
          <div style={{
            height: '6px', background: '#eee', borderRadius: '3px',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: qualifiesForFreeShipping
                ? 'linear-gradient(90deg, #C41230, #C41230)'
                : 'linear-gradient(90deg, #C41230, #C41230)',
              borderRadius: '3px',
              transition: 'width 0.3s',
            }} />
            {/* Circle indicator */}
            <div style={{
              position: 'absolute', top: '50%', left: `${Math.min(progress, 100)}%`,
              transform: 'translate(-50%, -50%)',
              width: '14px', height: '14px',
              background: 'white', border: '3px solid #C41230',
              borderRadius: '50%',
            }} />
          </div>
        </div>

        {/* Cart items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: '16px' }}>
              سلتك فارغة
            </div>
          ) : (
            cart.map((item, idx) => {
              const isCatchWeight = item.product.tags?.includes('catch_weight_item');
              const hasDiscount = item.variant.compareAtPrice && parseFloat(item.variant.compareAtPrice) > parseFloat(item.variant.price);
              const lineTotal = parseFloat(item.variant.price) * item.quantity;

              return (
                <div key={`${item.product.id}-${item.variant.id}`} style={{
                  padding: '16px 0',
                  borderBottom: idx < cart.length - 1 ? '1px solid #f0f0f0' : 'none',
                  display: 'flex', gap: '12px',
                }}>
                  {/* Product image */}
                  <img
                    src={item.product.image}
                    alt={item.product.titleAr || item.product.title}
                    style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '4px', flexShrink: 0 }}
                  />

                  {/* Product info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '4px', lineHeight: 1.4 }}>
                      {item.product.titleAr || item.product.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                      نوع العبوة: {getVariantLabel(item.variant.title)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#333', marginBottom: '2px' }}>
                      {item.quantity} x {item.variant.price} KD
                      {hasDiscount && (
                        <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '6px', fontSize: '12px' }}>
                          {item.variant.compareAtPrice} KD
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>
                      {lineTotal.toFixed(3)} KD
                    </div>

                    {/* Quantity controls + delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        border: '1.5px solid #ddd', borderRadius: '6px',
                        overflow: 'hidden',
                      }}>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                          style={{
                            width: '34px', height: '34px',
                            background: 'white', border: 'none',
                            fontSize: '18px', cursor: 'pointer', color: '#333',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >−</button>
                        <span style={{
                          width: '36px', textAlign: 'center',
                          fontSize: '14px', fontWeight: 600, color: '#333',
                        }}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                          style={{
                            width: '34px', height: '34px',
                            background: 'white', border: 'none',
                            fontSize: '18px', cursor: 'pointer', color: '#333',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >+</button>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variant.id)}
                        style={{
                          background: 'none', border: 'none',
                          cursor: 'pointer', padding: '4px', color: '#999',
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Catch weight notice */}
                    {isCatchWeight && (
                      <div style={{
                        marginTop: '8px', padding: '8px 10px',
                        background: '#f0f9f0', borderRadius: '6px',
                        fontSize: '11px', color: '#555', lineHeight: 1.5,
                      }}>
                        سعر الحبة {item.variant.price} د.ك. سيتم استرداد أي فرق نقدي لحسابك تلقائيًا بناء على الوزن الصافي.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #eee' }}>
            {/* Add note */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid #f0f0f0', marginBottom: '14px',
              cursor: 'pointer',
            }}>
              <span style={{ fontSize: '14px', color: '#333' }}>أضف ملاحظة على الطلب</span>
              <span style={{ fontSize: '18px', color: '#333' }}>+</span>
            </div>

            {/* Total button */}
            <button style={{
              width: '100%', padding: '16px',
              background: '#C41230', color: 'white',
              border: 'none', borderRadius: '30px',
              fontSize: '18px', fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px',
            }}>
              اجمالي KD {total.toFixed(3)}
            </button>

            <div style={{
              textAlign: 'center', marginTop: '10px',
              fontSize: '12px', color: '#888',
            }}>
              رسوم التوصيل محسوبة على صفحة الشراء.
            </div>
          </div>
        )}
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
