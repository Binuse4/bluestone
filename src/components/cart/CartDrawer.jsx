import React, { useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { generateWhatsAppLink } from '../../lib/whatsapp';
import { toPng } from 'html-to-image';

export default function CartDrawer({ isOpen, onClose, store }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    promoCode,
    promoError,
    discount,
    finalTotal,
    applyPromoCode
  } = useCart();
  const { template } = useTheme();

  const [promoInput, setPromoInput] = useState('');
  const cartRef = useRef(null);

  // Génération du lien WhatsApp
  const whatsappNumber = store?.whatsapp_number || '22997000000';
  const storeName = store?.name || 'Boutique';
  const whatsappUrl = generateWhatsAppLink(
    whatsappNumber,
    storeName,
    cart,
    cartTotal,
    store?.currency || 'FCFA',
    promoCode,
    discount,
    finalTotal
  );

  const handleDownloadCart = async () => {
    if (cartRef.current) {
      try {
        // 1. Conteneur hors-écran pour ne pas toucher au DOM visible
        const offscreen = document.createElement('div');
        offscreen.style.cssText = 'position:absolute;left:-9999px;top:0;';
        document.body.appendChild(offscreen);

        // 2. Cloner le panier en position static (html-to-image ne capture pas position:fixed)
        const clone = cartRef.current.cloneNode(true);
        clone.style.cssText = `
          position: static;
          transform: none;
          width: ${cartRef.current.offsetWidth}px;
          height: auto;
          max-height: none;
          overflow: visible;
          background: white;
          box-shadow: none;
        `;

        // Rendre le body du clone non-scrollable
        const clonedBody = clone.querySelector('.cart-drawer-body');
        if (clonedBody) {
          clonedBody.style.overflow = 'visible';
          clonedBody.style.maxHeight = 'none';
          clonedBody.style.flex = 'none';
        }

        // Retirer la note de bas de page et les boutons du clone
        const note = clone.querySelector('.cart-drawer-note');
        if (note) note.remove();
        const footer = clone.querySelector('.cart-drawer-footer');
        if (footer) {
          // On garde le résumé mais on enlève les boutons d'action dans la capture
          const actions = footer.querySelectorAll('button');
          actions.forEach(btn => btn.remove());
        }

        offscreen.appendChild(clone);

        // 3. Convertir les images en data URLs
        const images = clone.querySelectorAll('img');
        await Promise.all([...images].map(img => {
          return new Promise((resolve) => {
            if (!img.src || img.src.startsWith('data:')) { resolve(); return; }
            const tmp = new Image();
            tmp.crossOrigin = 'anonymous';
            tmp.onload = () => {
              try {
                const c = document.createElement('canvas');
                c.width = tmp.naturalWidth;
                c.height = tmp.naturalHeight;
                c.getContext('2d').drawImage(tmp, 0, 0);
                img.src = c.toDataURL('image/png');
              } catch (ex) { /* CORS stricte */ }
              resolve();
            };
            tmp.onerror = () => resolve();
            tmp.src = img.src + (img.src.includes('?') ? '&' : '?') + 'cb=' + Date.now();
          });
        }));

        // 4. Capturer le clone
        const imgData = await toPng(clone, {
          backgroundColor: '#ffffff',
          pixelRatio: 2,
        });

        // 5. Nettoyer
        document.body.removeChild(offscreen);

        // 6. Télécharger
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `panier-${storeName.replace(/\s+/g, '-')}.png`;
        link.click();
      } catch (err) {
        console.error("Erreur lors du téléchargement du panier :", err);
        const leftover = document.querySelector('div[style*="left: -9999px"]');
        if (leftover) document.body.removeChild(leftover);
      }
    }
  };

  const handleWhatsAppCheckout = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // --- RENDU THÈME MODERN RED ---
  if (template === 'modern-red') {
    return (
      <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
        <div className="cart-drawer mr-cart" onClick={(e) => e.stopPropagation()} ref={cartRef}>
          {/* Header */}
          <div className="cart-drawer-header" style={{ backgroundColor: '#F3F3F3', borderBottom: 'none', padding: '20px' }}>
            <button className="cart-drawer-close" onClick={onClose} style={{ color: '#111', background: 'none', border: 'none' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <h3 style={{ fontWeight: 800, margin: 0 }}>Mon Panier</h3>
            <div style={{ width: 24 }}></div>
          </div>

          <div className="cart-drawer-body">
            {cart.length === 0 ? (
              <div className="cart-empty-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <span style={{ fontSize: '3rem' }}>🛒</span>
                <p>Votre panier est vide</p>
                <button onClick={onClose} className="mr-checkout-btn" style={{ marginTop: 20 }}>Continuer mes achats</button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.cartItemId} className="mr-cart-item fade-in">
                    <div className="mr-cart-img-box">
                      <img src={item.image_url} alt={item.name} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 700, margin: 0 }}>{item.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#666', margin: '2px 0' }}>{item.selectedSize} | {item.selectedColor}</p>
                      <div className="mr-qty-pill">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800 }}>
                      {item.price.toLocaleString()}
                    </div>
                  </div>
                ))}

                <div className="mr-summary" style={{ padding: '0 20px', marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span>Sous-total</span>
                    <span>{cartTotal.toLocaleString()} {store?.currency || 'FCFA'}</span>
                  </div>
                  <div style={{ height: '2px', backgroundColor: '#000', margin: '15px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
                    <span>Total Net</span>
                    <span>{finalTotal.toLocaleString()} {store?.currency || 'FCFA'}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-drawer-footer" style={{ borderTop: 'none', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="mr-promo-btn" style={{ width: '100%', height: '45px' }} onClick={handleDownloadCart}>Télécharger mon panier</button>
              <button className="mr-checkout-btn" onClick={handleWhatsAppCheckout}>Commander sur WhatsApp</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDU THÈME PAR DÉFAUT / ÉLÉGANCE / VITRINE ---
  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`cart-drawer ${template === 'elegance' || template === 'vitrine' ? 'modern-cart' : ''}`} onClick={(e) => e.stopPropagation()} ref={cartRef}>
        {/* En-tête */}
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            <span>Mon Panier</span>
            <span className="cart-count-badge">({cartCount})</span>
          </h3>
          <button className="cart-drawer-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Corps */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <span className="cart-empty-icon">🛒</span>
              <p>Votre panier est vide</p>
              <button onClick={onClose} className="btn btn-secondary" style={{ marginTop: 10 }}>Continuer mes achats</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="cart-item fade-in">
                <img src={item.image_url} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <div>
                    <div className="cart-item-header">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.cartItemId)} className="cart-item-remove">Retirer</button>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {item.selectedSize !== 'Standard' && <span>{item.selectedSize} </span>}
                      {item.selectedColor !== 'Unique' && <span>| {item.selectedColor}</span>}
                    </p>
                    <p className="cart-item-price">{item.price.toLocaleString()} {item.currency || 'FCFA'}</p>
                  </div>
                  <div className="cart-item-qty-actions">
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="cart-item-qty-btn">-</button>
                    <span className="cart-item-qty-val">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="cart-item-qty-btn">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pied de page */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div className="cart-summary-row"><span>Sous-total</span><span>{cartTotal.toLocaleString()} {store?.currency || 'FCFA'}</span></div>
              <div className="cart-summary-row" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 10 }}><strong>Total Net</strong><strong style={{ fontSize: '1.25rem' }}>{finalTotal.toLocaleString()} {store?.currency || 'FCFA'}</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-secondary btn-full" onClick={handleDownloadCart} style={{ padding: '12px 24px', fontWeight: 600 }}>
                Télécharger mon panier
              </button>
              <button className="btn btn-primary btn-full btn-accent" onClick={handleWhatsAppCheckout} style={{ padding: '14px 24px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                Commander sur WhatsApp
              </button>
            </div>
            <p className="cart-drawer-note" style={{ textAlign: 'center', marginTop: 15, fontSize: '0.75rem', color: '#999' }}>Téléchargez votre panier pour garder une trace de votre sélection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
