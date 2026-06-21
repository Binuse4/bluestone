import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useStoreData } from '../hooks/useStoreData';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/catalog/ProductCard';

export default function CatalogPage() {
  const { slug } = useParams();
  const { store, categories, products, banners, loading, error } = useStoreData(slug);
  const { template } = useTheme();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialView = searchParams.get('view') || 'all';
  const initialFocus = searchParams.get('focus') || null;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavoritesView, setIsFavoritesOnly] = useState(initialView === 'favorites');

  const [likedIds, setLikedIds] = useState([]);
  const searchInputRef = useRef(null);

  // Carousel Logic for Banners
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  useEffect(() => {
    if (banners && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIdx(prev => (prev + 1) % banners.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  useEffect(() => {
    const storedLikes = localStorage.getItem('blueston_likes');
    if (storedLikes) {
      try {
        setLikedIds(JSON.parse(storedLikes));
      } catch (e) {
        console.error("Error parsing likes", e);
      }
    }
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const view = searchParams.get('view') || 'all';
    const focus = searchParams.get('focus');

    setSelectedCategory(cat);
    setIsFavoritesOnly(view === 'favorites');

    if (focus === 'search' && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      searchParams.delete('focus');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleLikeToggle = (productId, isLiked) => {
    if (isLiked) {
      setLikedIds(prev => [...prev, productId]);
    } else {
      setLikedIds(prev => prev.filter(id => id !== productId));
    }
  };

  const clearFavorites = () => {
    searchParams.delete('view');
    setSearchParams(searchParams);
  };

  if (loading) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Chargement...</div>;
  if (error || !store) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Erreur catalogue</div>;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesFavorites = !isFavoritesView || likedIds.includes(p.id);
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const renderBanner = () => {
    if (!banners || banners.length === 0) return null;

    const banner = banners[currentBannerIdx];
    if (!banner) return null;

    const bannerProduct = Array.isArray(banner.products) ? banner.products[0] : banner.products;
    const bannerTitle = banner.title || (bannerProduct ? `${banner.discount_rate}% de réduction sur ${bannerProduct.name}` : "Offre Spéciale");
    const bannerImg = bannerProduct?.image_url;

    const isNordic = template === 'nordic';
    const isMinimal = template === 'minimal';

    return (
      <section className="discount-banner fade-in" style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: isMinimal ? '12px 16px' : isNordic ? '22px 24px' : '12px 16px',
        backgroundColor: isMinimal ? '#f5f5f5' : '#1a1a1a',
        borderRadius: isMinimal ? '0px' : isNordic ? '22px' : '12px',
        color: isMinimal ? '#111' : '#fff',
        minHeight: isMinimal ? '80px' : isNordic ? '160px' : '76px',
        position: 'relative',
        zIndex: 10,
        width: '100%',
      }}>
        <div className="discount-content" style={{ flex: '1 1 60%', paddingRight: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: isNordic ? '8px' : '4px' }}>
          <p className="discount-text" style={{
            fontSize: isNordic ? '1.05rem' : '0.8rem',
            fontWeight: 800,
            margin: 0,
            color: 'inherit',
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {bannerTitle}
          </p>
          <div className="discount-price" style={{
            fontSize: isNordic ? '1.05rem' : '0.85rem',
            fontWeight: 800,
            margin: 0,
            whiteSpace: 'nowrap'
          }}>
            {banner.products.price.toLocaleString()} {store?.currency || 'FCFA'}
          </div>
          <Link to={`/c/catalogue/${slug}/product/${banner.product_id}`} className="discount-btn" style={{
            textDecoration: 'none',
            display: 'inline-block',
            backgroundColor: isMinimal ? '#000' : '#ff8c00',
            color: '#fff',
            padding: isNordic ? '10px 22px' : '5px 14px',
            borderRadius: isMinimal ? '0px' : isNordic ? '18px' : '8px',
            fontWeight: 700,
            fontSize: isNordic ? '0.88rem' : '0.72rem',
            width: 'fit-content'
          }}>En profiter</Link>
        </div>
        <div className="discount-images" style={{
          flex: '0 0 40%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          {bannerImg && (
            <div style={{
              width: isNordic ? '120px' : '70px',
              height: isNordic ? '120px' : '70px',
              borderRadius: isNordic ? '14px' : '10px',
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.08)',
              flexShrink: 0,
            }}>
              <img
                src={bannerImg}
                alt="Promo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
        {banners.length > 1 && template !== 'minimal' && (
          <div className="carousel-dots" style={{ bottom: 15, position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
            {banners.map((_, i) => (
              <span key={i} className={`dot ${i === currentBannerIdx ? 'active' : ''}`} onClick={() => setCurrentBannerIdx(i)} style={{ width: 8, height: 8, borderRadius: '50%', cursor: 'pointer', backgroundColor: template === 'minimal' ? (i === currentBannerIdx ? '#000' : '#ccc') : (i === currentBannerIdx ? '#ff8c00' : '#666') }}></span>
            ))}
          </div>
        )}
      </section>
    );
  };

  // --- RENDU THÈME MINIMAL ---
  if (template === 'minimal') {
    return (
      <div className="container catalog-layout minimal-view fade-in">
        <section className="minimal-search-section">
          <div className="minimal-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input ref={searchInputRef} type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </section>

        {renderBanner()}

        <section className="minimal-categories" style={{ marginBottom: 40, display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
          <button onClick={() => handleCategoryChange('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, textDecoration: selectedCategory === 'all' ? 'underline' : 'none', color: selectedCategory === 'all' ? '#000' : '#888' }}>Tout</button>
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => handleCategoryChange(cat.id)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '0.9rem', 
                fontWeight: 500, 
                textDecoration: selectedCategory === cat.id ? 'underline' : 'none', 
                color: selectedCategory === cat.id ? '#000' : '#888',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {cat.icon_url && (
                <span style={{ fontSize: '1.1rem' }}>
                  {cat.icon_url.length < 5 ? cat.icon_url : <img src={cat.icon_url} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />}
                </span>
              )}
              {cat.name}
            </button>
          ))}
        </section>

        <section className="minimal-products">
          <div className="products-grid">
            {filteredProducts.map((product) => (<ProductCard key={product.id} product={product} onLikeToggle={handleLikeToggle} />))}
          </div>
        </section>

        {/* WhatsApp Badge Minimal only */}
        {store.whatsapp_number && (
          <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
            <a href={`https://wa.me/${store.whatsapp_number.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="whatsapp-minimal-badge">
              <img src="/4423697.png" alt="WhatsApp" style={{ width: '24px', height: '24px' }} />
              <span>WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // --- RENDU THÈME NORDIC ---
  if (template === 'nordic') {
    return (
      <div className="container fade-in" style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2D3748', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 15px 0' }}>Collection</h2>
          <div className="nordic-category-scroll" style={{ display: 'flex', gap: '15px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '10px' }}>
            <button onClick={() => handleCategoryChange('all')} style={{ flexShrink: 0, background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: selectedCategory === 'all' ? 700 : 400, color: selectedCategory === 'all' ? '#1a202c' : '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', padding: '5px 0', borderBottom: selectedCategory === 'all' ? '2px solid #1a202c' : '2px solid transparent' }}>Tout</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} style={{ flexShrink: 0, background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: selectedCategory === cat.id ? 700 : 400, color: selectedCategory === cat.id ? '#1a202c' : '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', padding: '5px 0', borderBottom: selectedCategory === cat.id ? '2px solid #1a202c' : '2px solid transparent' }}>{cat.name}</button>
            ))}
          </div>
        </div>

        {renderBanner()}

        <div className="products-grid">
          {filteredProducts.map((product) => (<ProductCard key={product.id} product={product} onLikeToggle={handleLikeToggle} />))}
        </div>
      </div>
    );
  }

  // --- RENDU THÈME ÉLÉGANCE (DEFAULT) ---
  return (
    <div className="container catalog-layout modern-view fade-in">
      <section className="modern-store-header">
        <div className="modern-logo-wrapper">
          {store.logo_url && <img src={store.logo_url} alt={store.name} />}
        </div>
        <div className="modern-store-info">
          <h2 className="modern-store-name">{store.name}</h2>
          <p className="modern-store-tagline">
            {store.address ? (
              <a href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#f5f5f5', padding: '6px 15px', borderRadius: 20, textDecoration: 'none', color: '#111', fontWeight: 700, fontSize: '0.75rem' }}>Localisation</a>
            ) : (
              <span style={{ backgroundColor: '#f5f5f5', padding: '6px 15px', borderRadius: 20, color: '#111', fontWeight: 700, fontSize: '0.75rem' }}>Localisation</span>
            )}
            {' '}
            {store.whatsapp_number ? (
              <a href={`https://wa.me/${store.whatsapp_number.toString().replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#111', padding: '6px 15px', borderRadius: 20, textDecoration: 'none', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>Nous contacter</a>
            ) : (
              <span style={{ backgroundColor: '#111', padding: '6px 15px', borderRadius: 20, color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>Nous contacter</span>
            )}
          </p>
        </div>
      </section>

      {renderBanner()}

      <section className="modern-categories">
        <div className="section-header"><h2 className="section-title">Catégories</h2></div>
        <div className="category-scroll-wrapper">
          <button onClick={() => handleCategoryChange('all')} className={`modern-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}><span>Tout</span></button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`modern-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="search-bar-wrapper" style={{ margin: '0 auto 30px auto' }}>
        <div className="search-input-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input ref={searchInputRef} type="text" placeholder="Rechercher un article..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <section className="modern-products">
        <div className="products-grid">
          {filteredProducts.map(product => (<ProductCard key={product.id} product={product} onLikeToggle={handleLikeToggle} />))}
        </div>
      </section>
    </div>
  );
}
