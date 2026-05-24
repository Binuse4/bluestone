import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { generateWhatsAppLink } from '../../lib/whatsapp';

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

  // Génération du lien WhatsApp
  const whatsappNumber = store?.whatsapp_number || '22997000000';
  const storeName = store?.name || 'Africa Chic';
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

  // --- RENDU THÈME MODERN RED ---
  if (template === 'modern-red') {
    return (
      <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
        <div className="cart-drawer mr-cart" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="cart-drawer-header" style={{ backgroundColor: '#F3F3F3', borderBottom: 'none', padding: '20px' }}>
            <button className="cart-drawer-close" onClick={onClose} style={{ color: '#111', background: 'none', border: 'none' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h3 style={{ fontWeight: 800, margin: 0 }}>Mon Panier</h3>
            <button className="header-icon-btn" style={{ background: 'none', border: 'none' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </button>
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
                      <p style={{ fontSize: '0.75rem', color: '#666', margin: '2px 0' }}>Taille: {item.selectedSize} | Couleur: {item.selectedColor}</p>
                      <div className="mr-qty-pill">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'white', fontWeight: 800, cursor: 'pointer' }}>-</button>
                        <span style={{ fontWeight: 800 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', fontWeight: 800, cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800 }}>
                      {item.price.toLocaleString()}
                    </div>
                  </div>
                ))}

                <div className="mr-promo-bar">
                  <input type="text" placeholder="Code Promo" className="mr-promo-input" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
                  <button className="mr-promo-btn" onClick={() => applyPromoCode(promoInput)}>Appliquer</button>
                </div>

                <div className="mr-summary" style={{ padding: '0 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span>Sous-total</span>
                    <span>{cartTotal.toLocaleString()} {store?.currency || 'FCFA'}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#EF4444' }}>
                      <span>Réduction</span>
                      <span>-{discount.toLocaleString()}</span>
                    </div>
                  )}
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
            <div className="cart-drawer-footer" style={{ borderTop: 'none', padding: '20px' }}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="mr-checkout-btn">Passer commande</button>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDU THÈME PAR DÉFAUT / ÉLÉGANCE / VITRINE ---
  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`cart-drawer ${template === 'elegance' || template === 'vitrine' ? 'modern-cart' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span>{template === 'elegance' || template === 'vitrine' ? 'Mon Panier' : 'Mon Panier'}</span>
            <span className="cart-count-badge">({cartCount})</span>
          </h3>
          <button className="cart-drawer-close" onClick={onClose} aria-label="Fermer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Corps */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <span className="cart-empty-icon">🛒</span>
              <p>Votre panier est vide</p>
              <button 
                onClick={onClose} 
                className="btn btn-secondary"
                style={{ marginTop: 10 }}
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="cart-item fade-in">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <div>
                    <div className="cart-item-header">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="cart-item-remove"
                        aria-label="Supprimer"
                      >
                        Retirer
                      </button>
                    </div>
                    
                    {/* Affichage des options sélectionnées (taille & couleur) */}
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {item.selectedSize && item.selectedSize !== 'Standard' && item.selectedSize !== 'Unique' && (
                        <span>Taille : <strong>{item.selectedSize}</strong></span>
                      )}
                      {item.selectedSize && item.selectedSize !== 'Standard' && item.selectedSize !== 'Unique' && item.selectedColor && item.selectedColor !== 'Unique' && item.selectedColor !== 'Standard' && (
                        <span style={{ color: '#e5e5e5' }}>|</span>
                      )}
                      {item.selectedColor && item.selectedColor !== 'Unique' && item.selectedColor !== 'Standard' && (
                        <span>Couleur : <strong>{item.selectedColor}</strong></span>
                      )}
                    </p>
                    
                    <p className="cart-item-price">
                      {item.price.toLocaleString()} {item.currency || 'FCFA'}
                    </p>
                  </div>

                  <div className="cart-item-qty-actions">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="cart-item-qty-btn"
                    >
                      -
                    </button>
                    <span className="cart-item-qty-val">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="cart-item-qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pied de page (si panier rempli) */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            
            {/* Zone Code Promo */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 16, marginBottom: 16 }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                Code Promo
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <input 
                  type="text" 
                  placeholder="Ex: BLUESTON10 (-10%)" 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    backgroundColor: 'white'
                  }}
                  disabled={!!promoCode}
                />
                {promoCode ? (
                  <button
                    onClick={() => {
                      applyPromoCode('');
                      setPromoInput('');
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  >
                    Retirer
                  </button>
                ) : (
                  <button
                    onClick={() => applyPromoCode(promoInput)}
                    className="btn btn-primary"
                    style={{ padding: '8px 12px', fontSize: '0.85rem', backgroundColor: 'var(--text-primary)', whiteSpace: 'nowrap' }}
                  >
                    Appliquer
                  </button>
                )}
              </div>
              
              {promoError && (
                <p style={{ color: '#d9534f', fontSize: '0.75rem', marginTop: 6, fontWeight: 500 }}>
                  ⚠️ {promoError}
                </p>
              )}
              {promoCode && (
                <p style={{ color: '#15803d', fontSize: '0.75rem', marginTop: 6, fontWeight: 600 }}>
                  ✓ Code <strong>{promoCode}</strong> activé !
                </p>
              )}
            </div>

            {/* Récapitulatif Tarifs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Sous-total</span>
                <span className="cart-summary-value" style={{ fontSize: '1rem', fontWeight: 500 }}>
                  {cartTotal.toLocaleString()} {store?.currency || 'FCFA'}
                </span>
              </div>
              
              {discount > 0 && (
                <div className="cart-summary-row" style={{ color: '#15803d' }}>
                  <span className="cart-summary-label" style={{ color: '#15803d', fontWeight: 500 }}>
                    Réduction ({promoCode})
                  </span>
                  <span className="cart-summary-value" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                    -{discount.toLocaleString()} {store?.currency || 'FCFA'}
                  </span>
                </div>
              )}

              <div className="cart-summary-row" style={{ borderTop: discount > 0 ? '1px dashed var(--border-color)' : 'none', paddingTop: discount > 0 ? 10 : 0 }}>
                <span className="cart-summary-label" style={{ fontWeight: 600 }}>Total Net</span>
                <span className="cart-summary-value" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {finalTotal.toLocaleString()} {store?.currency || 'FCFA'}
                </span>
              </div>
            </div>
            
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary btn-full btn-accent"
              style={{ padding: '14px 24px', fontWeight: 600 }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: 8 }}
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Commander sur WhatsApp
            </a>
            
            <p className="cart-drawer-note">
              La commande sera envoyée par message pré-rempli. Le commerçant conviendra de la livraison et du paiement avec vous sur WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
