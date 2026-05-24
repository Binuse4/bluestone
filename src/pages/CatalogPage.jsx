import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useStoreData } from '../hooks/useStoreData';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/catalog/ProductCard';

export default function CatalogPage() {
  const { slug } = useParams();
  const { store, categories, products, loading, error } = useStoreData(slug);
  const { template } = useTheme();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialView = searchParams.get('view') || 'all';
  const initialFocus = searchParams.get('focus') || null;
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavoritesView, setIsFavoritesOnly] = useState(initialView === 'favorites');
  
  // État local pour les IDs aimés pour la réactivité de la vue favoris
  const [likedIds, setLikedIds] = useState([]);
  
  const searchInputRef = useRef(null);

  // Charger les likes au démarrage
  useEffect(() => {
    const storedLikes = localStorage.getItem('blueston_likes');
    if (storedLikes) {
      setLikedIds(JSON.parse(storedLikes));
    }
  }, []);

  // Synchroniser la catégorie et le mode favoris avec l'URL
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
  }, [searchParams]);

  const handleLikeToggleCallback = (productId, isLiked) => {
    if (isLiked) {
      setLikedIds(prev => [...prev, productId]);
    } else {
      setLikedIds(prev => prev.filter(id => id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="skeleton" style={{ width: '100%', maxWidth: 400, height: 48, marginBottom: 30, borderRadius: 'var(--radius-sm)' }}></div>
        <div className="products-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)' }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container not-found-layout">
        <h2 className="not-found-title">Boutique introuvable</h2>
        <p className="not-found-text">Une erreur s'est produite lors du chargement.</p>
        <Link to="/c/catalogue/africa-chic" className="btn btn-primary">Voir la boutique de démo</Link>
      </div>
    );
  }

  // Filtrage des produits
  const filteredProducts = products.filter((product) => {
    // 1. Filtrage par favoris si activé
    if (isFavoritesView) {
      if (!likedIds.includes(product.id)) return false;
    }

    // 2. Filtrage par catégorie
    const matchCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    
    // 3. Filtrage par recherche
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchCategory && matchSearch;
  });

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const clearFavorites = () => {
    searchParams.delete('view');
    setSearchParams(searchParams);
  };

  // --- RENDU THÈME MODERN-RED ---
  if (template === 'modern-red') {
    return (
      <div className="container catalog-layout mr-view fade-in">
        {isFavoritesView && (
           <div style={{ padding: '20px 0', borderBottom: '1px solid #ddd', marginBottom: 20 }}>
             <h2 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#EF4444' }}>❤️ Mes Favoris</h2>
             <button onClick={clearFavorites} style={{ background: 'none', border: 'none', color: '#666', fontWeight: 700, cursor: 'pointer', padding: 0 }}>&larr; Retour au catalogue</button>
           </div>
        )}

        <section className="mr-search-section" style={{ padding: '20px 0' }}>
          <div className="mr-search-bar" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#DDD', borderRadius: '15px', padding: '12px 20px', gap: '15px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input ref={searchInputRef} type="text" placeholder="Rechercher..." style={{ border: 'none', background: 'none', outline: 'none', flex: 1 }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </section>

        <section className="mr-categories" style={{ marginBottom: 30 }}>
          <div className="mr-cat-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
            <button onClick={() => handleCategoryChange('all')} style={{ padding: '10px 24px', borderRadius: '25px', border: 'none', fontWeight: 800, cursor: 'pointer', backgroundColor: selectedCategory === 'all' ? '#EF4444' : '#DDD', color: selectedCategory === 'all' ? 'white' : '#666' }}>Tout</button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} style={{ padding: '10px 24px', borderRadius: '25px', border: 'none', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', backgroundColor: selectedCategory === cat.id ? '#EF4444' : '#DDD', color: selectedCategory === cat.id ? 'white' : '#666' }}>{cat.name}</button>
            ))}
          </div>
        </section>

        <section className="mr-products" style={{ padding: '0 0 60px 0' }}>
          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((product) => (<ProductCard key={product.id} product={product} onLikeToggle={handleLikeToggleCallback} />))}
          </div>
          {filteredProducts.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#666', marginTop: 40 }}>{isFavoritesView ? "Vous n'avez pas encore de favoris." : "Aucun produit trouvé"}</p>}
        </section>
      </div>
    );
  }

  // --- RENDU THÈME VITRINE ---
  if (template === 'vitrine') {
    return (
      <div className="container catalog-layout refine-view fade-in">
        {isFavoritesView && (
           <div style={{ padding: '20px 20px 0 20px' }}>
             <h2 style={{ fontWeight: 900, fontSize: '1.5rem' }}>❤️ Mes Favoris</h2>
             <button onClick={clearFavorites} style={{ background: 'none', border: 'none', color: '#666', fontWeight: 700, cursor: 'pointer', padding: 0 }}>&larr; Retour au catalogue</button>
           </div>
        )}
        <section className="refine-search-section">
          <div className="refine-search-bar">
            <input ref={searchInputRef} type="text" placeholder="Rechercher" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="filter-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/></svg></button>
          </div>
        </section>

        {!isFavoritesView && (
          <section className="refine-promo-banner">
            <div className="promo-content"><p className="promo-text">Profitez de 60% de réduction sur nos pièces d'exception !</p><button className="promo-buy-btn">Acheter</button></div>
            <div className="promo-image"><img src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=400" alt="Home Decor" /></div>
          </section>
        )}

        <section className="refine-categories">
          <div className="refine-cat-scroll">
            <button onClick={() => handleCategoryChange('all')} className={`refine-cat-badge all-badge ${selectedCategory === 'all' ? 'active' : ''}`}>Tout</button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`refine-cat-badge ${selectedCategory === cat.id ? 'active' : ''}`}><span className="cat-icon-outline">🪑</span><span>{cat.name}</span></button>
            ))}
          </div>
        </section>

        <section className="refine-products">
          {filteredProducts.length === 0 ? (
            <div className="empty-state"><p>{isFavoritesView ? "Vous n'avez pas encore de favoris." : "Aucun produit trouvé"}</p></div>
          ) : (
            <div className="refine-masonry-grid">
              {filteredProducts.map((product, index) => {
                const sizeClass = index % 5 === 0 ? 'large' : (index % 3 === 0 ? 'medium' : 'small');
                return (
                  <div key={product.id} className={`refine-masonry-item ${sizeClass}`}><ProductCard product={product} onLikeToggle={handleLikeToggleCallback} categoryName={categories.find(c => c.id === product.category_id)?.name} /></div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  // --- RENDU THÈME MINIMAL ---
  if (template === 'minimal') {
    return (
      <div className="container catalog-layout minimal-view fade-in">
        {isFavoritesView && (
           <div style={{ textAlign: 'center', padding: '20px 0' }}>
             <h2 style={{ fontWeight: 300, fontSize: '2rem', letterSpacing: 1 }}>MES FAVORIS</h2>
             <button onClick={clearFavorites} style={{ background: 'none', border: 'none', color: '#888', letterSpacing: 1, cursor: 'pointer' }}>&larr; RETOUR AU CATALOGUE</button>
           </div>
        )}
        <section className="minimal-search-section">
          <div className="minimal-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input ref={searchInputRef} type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </section>

        <section className="minimal-categories" style={{ marginBottom: 40, display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
          <button onClick={() => handleCategoryChange('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, textDecoration: selectedCategory === 'all' ? 'underline' : 'none', color: selectedCategory === 'all' ? '#000' : '#888' }}>Tout</button>
          {categories.map((cat) => (<button key={cat.id} onClick={() => handleCategoryChange(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, textDecoration: selectedCategory === cat.id ? 'underline' : 'none', color: selectedCategory === cat.id ? '#000' : '#888' }}>{cat.name}</button>))}
        </section>

        <section className="minimal-products">
          <div className="products-grid">
            {filteredProducts.map((product) => (<ProductCard key={product.id} product={product} onLikeToggle={handleLikeToggleCallback} />))}
          </div>
          {filteredProducts.length === 0 && <p style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>{isFavoritesView ? "Aucun favori pour le moment." : "Aucun produit trouvé"}</p>}
        </section>
      </div>
    );
  }

  // --- RENDU THÈME ÉLÉGANCE ---
  if (template === 'elegance') {
    return (
      <div className="container catalog-layout modern-view fade-in">
        {isFavoritesView && (
           <div style={{ padding: '0 0 20px 0' }}>
             <h2 style={{ fontWeight: 800, fontSize: '1.8rem' }}>Mes Favoris ❤️</h2>
             <button onClick={clearFavorites} className="section-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>&larr; Retour au catalogue</button>
           </div>
        )}
        
        {!isFavoritesView && (
          <section className="modern-store-header">
            <div className="modern-logo-wrapper"><img src={store.logo_url} alt={store.name} /></div>
            <div className="modern-store-info"><h2 className="modern-store-name">{store.name}</h2><p className="modern-store-tagline">Boutique Officielle • {store.whatsapp_number}</p></div>
          </section>
        )}

        <section className="discount-banner">
          <div className="discount-content"><p className="discount-text">50% de réduction sur votre première commande !</p><button className="discount-btn">En profiter</button></div>
          <div className="discount-images"><img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400" alt="Sneaker" className="floating-img img-1" /><img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400" alt="Sneaker" className="floating-img img-2" /></div>
          <div className="carousel-dots"><span className="dot active"></span><span className="dot"></span><span className="dot"></span></div>
        </section>

        <section className="modern-categories">
          <div className="section-header"><h2 className="section-title">Catégories</h2><button className="section-link">Voir tout</button></div>
          <div className="category-scroll-wrapper">
            <button onClick={() => handleCategoryChange('all')} className={`modern-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}><div className="cat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div><span>Tout</span></button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`modern-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}><div className="cat-icon">{cat.icon_url ? <span>{cat.icon_url}</span> : <span>🏷️</span>}</div><span>{cat.name}</span></button>
            ))}
          </div>
        </section>

        <div className="search-bar-wrapper" style={{ margin: '0 auto 30px auto' }}>
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input ref={searchInputRef} type="text" className="search-input" placeholder="Rechercher un produit..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <section className="modern-products">
          <div className="products-grid">
            {filteredProducts.map((product) => (<ProductCard key={product.id} product={product} onLikeToggle={handleLikeToggleCallback} categoryName={categories.find(c => c.id === product.category_id)?.name} />))}
          </div>
          {filteredProducts.length === 0 && <div className="empty-state"><p>{isFavoritesView ? "Vous n'avez pas encore de favoris." : "Aucun produit trouvé"}</p></div>}
        </section>
      </div>
    );
  }

  return null;
}
