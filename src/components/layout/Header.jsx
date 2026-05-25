import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ store, onCartClick }) {
  const { cartCount } = useCart();
  const { slug } = useParams();
  const { template } = useTheme();
  
  const storeSlug = slug || store?.slug || 'africa-chic';

  const renderLogo = () => {
    // --- THÈME MINIMAL ---
    if (template === 'minimal') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Link to={`/c/catalogue/${storeSlug}`} className="logo" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#000' }}>
            {store?.logo_url && <img src={store.logo_url} alt={store.name} style={{ width: 30, height: 30, borderRadius: '50%' }} />}
            <span style={{ fontWeight: 300, letterSpacing: 1 }}>{store?.name?.toUpperCase() || "BOUTIQUE"}</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
             <Link to={`/c/catalogue/${storeSlug}/explore?view=favorites`} className="header-icon-btn" style={{ color: '#000' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
             </Link>
             <Link to={`/admin/${storeSlug}`} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>admin</Link>
             <button onClick={onCartClick} className="cart-trigger" style={{ padding: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {cartCount > 0 && <span className="cart-badge" style={{ backgroundColor: '#000', width: 16, height: 16 }}>{cartCount}</span>}
             </button>
          </div>
        </div>
      );
    }

    // --- THÈME MODERN-RED ---
    if (template === 'modern-red') {
      return (
        <div className="header-mr-layout" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to={`/c/catalogue/${storeSlug}`} className="header-mr-logo-link">
              {store?.logo_url ? (
                <img src={store.logo_url} alt={store.name} style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#EF4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                  {store?.name?.charAt(0) || 'B'}
                </div>
              )}
            </Link>
            <Link to={`/c/catalogue/${storeSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 className="header-mr-title">{store?.name || "Boutique"}</h1>
            </Link>
          </div>
          <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to={`/admin/${storeSlug}`} style={{ color: '#111', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', border: '1px solid #111', padding: '4px 10px', borderRadius: '10px' }}>Admin</Link>
            <Link to={`/c/catalogue/${storeSlug}/explore?view=favorites`} className="header-icon-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </Link>
            <button onClick={onCartClick} className="header-icon-btn cart-trigger" style={{ background: 'none', border: 'none', position: 'relative' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && <span className="cart-badge" style={{ backgroundColor: '#EF4444', position: 'absolute', top: -5, right: -5, color: 'white', fontSize: '0.7rem', minWidth: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      );
    }

    // --- THÈME VITRINE ---
    if (template === 'vitrine') {
      return (
        <div className="header-refine-layout" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <div className="header-refine-left" style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <Link to={`/c/catalogue/${storeSlug}`} className="header-refine-logo-link">
              {store?.logo_url && <img src={store.logo_url} alt={store.name} style={{ width: 40, height: 40, borderRadius: '8px' }} />}
            </Link>
            <Link to={`/c/catalogue/${storeSlug}`} className="header-refine-title-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 className="header-refine-title">{store?.name || "Refine Home"}</h1>
            </Link>
          </div>
          <div className="header-refine-right" style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <Link to={`/c/catalogue/${storeSlug}/explore?view=favorites`} className="header-icon-btn" style={{ color: '#111' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </Link>
            <Link to={`/admin/${storeSlug}`} className="refine-admin-btn">Admin</Link>
            <button onClick={onCartClick} className="header-icon-btn refine-cart-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      );
    }

    // --- THÈME ÉLÉGANCE (PAR DÉFAUT) ---
    return (
      <div className="header-modern-layout" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <Link to={`/c/catalogue/${storeSlug}`} className="logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {store?.logo_url && (
              <div style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #eee', backgroundColor: 'white', position: 'relative' }}>
                <img src={store.logo_url} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
          </Link>
        </div>
        
        <Link to={`/c/catalogue/${storeSlug}`} style={{ textDecoration: 'none', color: 'inherit', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <h1 className="header-title-centered" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Explorer</h1>
        </Link>

        <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <Link to={`/admin/${storeSlug}`} className="admin-pill-link">Admin</Link>
          <Link to={`/c/catalogue/${storeSlug}/explore?focus=search`} className="header-icon-btn" style={{ background: 'none', border: 'none' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </Link>
          <Link to={`/c/catalogue/${storeSlug}/explore?view=favorites`} className="header-icon-btn" style={{ background: 'none', border: 'none' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </Link>
          <button onClick={onCartClick} className="header-icon-btn cart-trigger" style={{ background: 'none', border: 'none', position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <header className="site-header">
      <div className="container header-container" style={{ position: 'relative' }}>
        {renderLogo()}
      </div>
    </header>
  );
}
