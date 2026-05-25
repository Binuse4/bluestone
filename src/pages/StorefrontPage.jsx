import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStoreData } from '../hooks/useStoreData';
import { useTheme } from '../context/ThemeContext';
import CategoryCard from '../components/catalog/CategoryCard';
import ProductCard from '../components/catalog/ProductCard';

export default function StorefrontPage() {
  const { slug } = useParams();
  const { store, categories, products, loading, error } = useStoreData(slug);
  const { template } = useTheme();

  if (loading) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Chargement...</div>;
  if (error || !store) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Boutique introuvable</div>;

  // On ne garde que les produits disponibles pour la page d'accueil
  const featuredProducts = products.filter(p => p.is_available !== false).slice(0, 4);

  // --- RENDU THÈME MODERN-RED ---
  if (template === 'modern-red') {
    return (
      <div className="fade-in theme-modern-red-home" style={{ backgroundColor: '#E8E8E8', minHeight: '100vh' }}>
        {/* Banner */}
        <div className="mr-home-banner" style={{ height: '30vh', overflow: 'hidden' }}>
          <img src={store.cover_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200"} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        
        <div className="container" style={{ marginTop: -50, paddingBottom: 80, position: 'relative', zIndex: 2 }}>
          <div className="mr-home-card" style={{ backgroundColor: '#F3F3F3', borderRadius: 30, padding: 30, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <img src={store.logo_url} alt={store.name} style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: 20, border: '5px solid #F3F3F3', marginTop: -80, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
            <h1 style={{ fontWeight: 900, fontSize: '2.5rem', marginBottom: 10 }}>{store.name}</h1>
            <p style={{ color: '#666', marginBottom: 25, fontSize: '1.1rem' }}>{store.description}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 25, flexWrap: 'wrap' }}>
               {store.address && <a href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 15px', borderRadius: 20, backgroundColor: '#ddd', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', color: '#333' }}>📍 Maps</a>}
               {store.whatsapp_number && <a href={`https://wa.me/${store.whatsapp_number.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 15px', borderRadius: 20, backgroundColor: '#ddd', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', color: '#333' }}>💬 WhatsApp</a>}
            </div>
            <Link to={`/c/catalogue/${store.slug}/explore`} className="mr-add-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Explorer le Catalogue</Link>
          </div>

          <section style={{ marginTop: 60 }}>
            <h2 style={{ fontWeight: 800, marginBottom: 30, fontSize: '1.8rem' }}>Dernières Arrivées</h2>
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 25 }}>
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- RENDU THÈME VITRINE ---
  if (template === 'vitrine') {
    return (
      <div className="fade-in theme-vitrine-home" style={{ backgroundColor: '#FDF8F2', minHeight: '100vh' }}>
        {/* Full Screen Banner style */}
        <div style={{ position: 'relative', height: '60vh', marginBottom: 60 }}>
          <img src={store.cover_url || "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1200"} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
          <div className="container" style={{ position: 'absolute', bottom: 40, left: 0, right: 0 }}>
            <img src={store.logo_url} alt={store.name} style={{ width: 80, height: 80, borderRadius: '20px', marginBottom: 20, border: '2px solid white' }} />
            <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{store.name}</h1>
          </div>
        </div>

        <div className="container" style={{ paddingBottom: 80 }}>
          <div style={{ maxWidth: 700, marginBottom: 80 }}>
            <p style={{ fontSize: '1.4rem', color: '#444', lineHeight: 1.6, fontWeight: 500 }}>{store.description}</p>
            <div style={{ display: 'flex', gap: 20, margin: '20px 0 40px 0' }}>
               {store.address && <a href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#111', fontWeight: 700, fontSize: '0.9rem' }}>📍 Boutique Officielle</a>}
               {store.whatsapp_number && <a href={`https://wa.me/${store.whatsapp_number.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#111', fontWeight: 700, fontSize: '0.9rem' }}>💬 Contact WhatsApp</a>}
            </div>
            <div style={{ marginTop: 20 }}>
              <Link to={`/c/catalogue/${store.slug}/explore`} className="promo-buy-btn" style={{ textDecoration: 'none', display: 'inline-block', padding: '18px 45px', fontSize: '1.1rem' }}>Explorer la collection</Link>
            </div>
          </div>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>Collections</h2>
              <Link to={`/c/catalogue/${store.slug}/explore`} style={{ color: '#111', fontWeight: 800, textDecoration: 'none', borderBottom: '2px solid #111' }}>Voir tout</Link>
            </div>
            <div className="grid-categories" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 30 }}>
              {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- RENDU THÈME MINIMAL ---
  if (template === 'minimal') {
    return (
      <div className="fade-in theme-minimal-home" style={{ backgroundColor: '#FFF', minHeight: '100vh' }}>
        {/* Soft Minimal Banner */}
        <div className="container" style={{ paddingTop: 40 }}>
          <div style={{ height: '40vh', borderRadius: 30, overflow: 'hidden', marginBottom: 60 }}>
            <img src={store.cover_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200"} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 100px auto' }}>
            <img src={store.logo_url} alt={store.name} style={{ width: 60, height: 60, marginBottom: 30, opacity: 0.8 }} />
            <h1 style={{ fontSize: '5rem', fontWeight: 300, letterSpacing: -2, marginBottom: 30, lineHeight: 1 }}>{store.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#888', fontWeight: 400, maxWidth: 600, margin: '0 auto 50px auto', lineHeight: 1.6 }}>{store.description}</p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 40 }}>
               {store.address && <a href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>📍 Localisation</a>}
               {store.whatsapp_number && <a href={`https://wa.me/${store.whatsapp_number.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>💬 WhatsApp</a>}
            </div>
            <Link to={`/c/catalogue/${store.slug}/explore`} style={{ color: '#000', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid #000', paddingBottom: 8, fontSize: '1.1rem', letterSpacing: 1 }}>VOIR LE CATALOGUE &rarr;</Link>
          </div>

          <section>
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 60 }}>
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- RENDU THÈME ÉLÉGANCE (PAR DÉFAUT) ---
  return (
    <div className="fade-in">
      <div className="hero-wrapper">
        <img className="hero-cover" src={store.cover_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200"} alt={store.name} />
        <div className="hero-overlay"></div>
      </div>

      <div className="container">
        <div className="store-profile-section">
          <div className="store-logo-wrapper"><img className="store-logo-img" src={store.logo_url} alt={store.name} /></div>
          <h1 className="store-name-title">{store.name}</h1>
          <p className="store-description-text">{store.description}</p>
          <div className="store-info-badges">
            {store.address ? (
              <a href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" className="badge-info" style={{ textDecoration: 'none' }}>📍 Boutique Officielle</a>
            ) : (
              <span className="badge-info">📍 Boutique Officielle</span>
            )}
            {store.whatsapp_number ? (
              <a href={`https://wa.me/${store.whatsapp_number.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="badge-info" style={{ textDecoration: 'none' }}>💬 WhatsApp : {store.whatsapp_number}</a>
            ) : (
              <span className="badge-info">💬 WhatsApp</span>
            )}
          </div>
          <div style={{ marginTop: 30 }}>
            <Link to={`/c/catalogue/${store.slug}/explore`} className="btn btn-primary" style={{ padding: '14px 40px', fontWeight: 700, borderRadius: 15 }}>Voir le Catalogue</Link>
          </div>
        </div>

        <section className="home-section" style={{ borderTop: '1px solid #eee', marginTop: 40 }}>
          <div className="section-header">
            <h2 className="section-title">Nos Catégories</h2>
            <Link to={`/c/catalogue/${store.slug}/explore`} className="section-link">Tout voir</Link>
          </div>
          <div className="grid-categories">
            {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
          </div>
        </section>

        {featuredProducts.length > 0 && (
          <section className="home-section">
            <div className="section-header">
              <h2 className="section-title">Sélection du moment</h2>
            </div>
            <div className="products-grid">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
