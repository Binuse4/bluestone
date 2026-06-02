import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStoreData } from '../hooks/useStoreData';
import { useTheme } from '../context/ThemeContext';
import CategoryCard from '../components/catalog/CategoryCard';
import ProductCard from '../components/catalog/ProductCard';

export default function StorefrontPage() {
  const { slug } = useParams();
  const { store, categories, products, banners, loading, error } = useStoreData(slug);
  const { template } = useTheme();

  if (loading) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Chargement...</div>;
  if (error || !store) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Boutique introuvable</div>;

  const featuredProducts = products.filter(p => p.is_available !== false).slice(0, 4);

  // --- RENDU THÈME MINIMAL ---
  if (template === 'minimal') {
    return (
      <div className="fade-in theme-minimal-home" style={{ backgroundColor: '#FFF', minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: 40 }}>
          <div style={{ height: '400px', borderRadius: 30, overflow: 'hidden', marginBottom: 60 }}>
            <img src={store.cover_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200"} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 100px auto' }}>
            <h1 style={{ fontSize: '5rem', fontWeight: 300, letterSpacing: -2, marginBottom: 30, lineHeight: 1 }}>{store.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#888', fontWeight: 400, maxWidth: 600, margin: '0 auto 50px auto', lineHeight: 1.6 }}>{store.description}</p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 40 }}>
              {store.whatsapp_number && (
                <a href={`https://wa.me/${store.whatsapp_number.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="whatsapp-minimal-badge">
                  <img src="/4423697.png" alt="WhatsApp" style={{ width: '20px', height: '20px' }} />
                  <span>WhatsApp</span>
                </a>
              )}
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
        <img src={store.cover_url || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200"} alt={store.name} className="hero-cover" />
        <div className="hero-overlay"></div>
      </div>

      <div className="container">
        <div className="store-profile-section" style={{ marginTop: 60, textAlign: 'center' }}>
          <div className="store-logo-wrapper" style={{ margin: '0 auto 20px auto', width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: '4px solid white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            {store.logo_url && <img className="store-logo-img" src={store.logo_url} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
          </div>
          <h1 className="store-name-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 10 }}>{store.name}</h1>
          <p className="store-description-text" style={{ color: '#666', maxWidth: 600, margin: '0 auto 30px auto' }}>{store.description}</p>
          <div className="store-info-badges" style={{ display: 'flex', gap: 15, justifyContent: 'center', marginBottom: 30 }}>
            {store.address ? (
              <a 
                href={store.address.startsWith('http') ? store.address : `https://maps.google.com/?q=${encodeURIComponent(store.address)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ backgroundColor: '#f5f5f5', padding: '8px 20px', borderRadius: 20, textDecoration: 'none', color: '#111', fontWeight: 700, fontSize: '0.85rem' }}
              >
                Localisation
              </a>
            ) : (
              <span style={{ backgroundColor: '#f5f5f5', padding: '8px 20px', borderRadius: 20, color: '#111', fontWeight: 700, fontSize: '0.85rem' }}>Localisation</span>
            )}
            {store.whatsapp_number ? (
              <a href={`https://wa.me/${store.whatsapp_number.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#111', color: 'white', padding: '8px 20px', borderRadius: 20, textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>Nous contacter</a>
            ) : (
              <span style={{ backgroundColor: '#111', color: 'white', padding: '8px 20px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>Nous contacter</span>
            )}
          </div>
          <div style={{ marginTop: 30 }}>
            <Link to={`/c/catalogue/${store.slug}/explore`} className="btn btn-primary" style={{ padding: '14px 40px', fontWeight: 700, borderRadius: 15 }}>Voir le Catalogue</Link>
          </div>
        </div>

        <section className="home-section" style={{ borderTop: '1px solid #eee', marginTop: 60, paddingTop: 40 }}>
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

