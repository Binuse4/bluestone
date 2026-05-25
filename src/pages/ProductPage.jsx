import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStoreData } from '../hooks/useStoreData';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/catalog/ProductCard';

export default function ProductPage() {
  const { slug, productId } = useParams();
  const { store, categories, products, loading, error } = useStoreData(slug);
  const { addToCart } = useCart();
  const { template } = useTheme();

  // États de sélection
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const product = products?.find((p) => p.id === productId);

  // Sync image with color selection
  useEffect(() => {
    if (product && product.colors && product.colors.length > 0 && selectedColor && selectedColor !== 'Unique') {
      const colorIndex = product.colors.indexOf(selectedColor);
      if (colorIndex !== -1 && product.product_images && product.product_images.length > colorIndex) {
        setMainImageIndex(colorIndex);
      }
    }
  }, [selectedColor, product]);

  // Initialiser les sélections par défaut une fois le produit chargé
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Standard');
      }

      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor('Unique');
      }

      try {
        const storedLikes = localStorage.getItem('blueston_likes');
        if (storedLikes) {
          const likes = JSON.parse(storedLikes);
          setIsLiked(likes.includes(product.id));
        }
      } catch (e) {
        console.error("Error loading likes", e);
      }
    }
  }, [product, productId]);

  if (loading) {
    return (
      <div className="container product-detail-layout" style={{ padding: '40px 20px' }}>
        <div className="skeleton" style={{ width: '100%', aspectRatio: '4/5', borderRadius: 'var(--radius-md)' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div className="skeleton" style={{ width: '20%', height: 16 }}></div>
          <div className="skeleton" style={{ width: '80%', height: 36 }}></div>
        </div>
      </div>
    );
  }

  if (error || !store || !products || !product) {
    return (
      <div className="container not-found-layout">
        <h2 className="not-found-title">Produit introuvable</h2>
        <p className="not-found-text">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <Link to={`/c/catalogue/${slug || 'africa-chic'}/explore`} className="btn btn-primary">Retour au catalogue</Link>
      </div>
    );
  }

  const handleLikeToggle = () => {
    try {
      const storedLikes = localStorage.getItem('blueston_likes');
      let likes = storedLikes ? JSON.parse(storedLikes) : [];

      if (likes.includes(product.id)) {
        likes = likes.filter(id => id !== product.id);
        setIsLiked(false);
      } else {
        likes.push(product.id);
        setIsLiked(true);
      }
      localStorage.setItem('blueston_likes', JSON.stringify(likes));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const formattedPrice = product.price.toLocaleString() + ' ' + (product.currency || 'FCFA');
  const category = categories.find(c => c.id === product.category_id);
  
  // Helper for color dots
  const getColorHex = (colorName) => {
    const map = {
      'Noir': '#000000', 'noir': '#1a1a1a', 'Blanc': '#FFFFFF', 'blanc': '#ffffff', 
      'Rouge': '#EF4444', 'rouge': '#EF4444', 'Bleu': '#3B82F6', 'bleu': '#3B82F6',
      'Vert': '#10B981', 'vert': '#10B981', 'Jaune': '#F59E0B', 'jaune': '#F59E0B',
      'Marron': '#8B4513', 'marron': '#8c6239', 'Gris': '#9CA3AF', 'gris': '#9CA3AF',
      'Rose': '#EC4899', 'rose': '#EC4899', 'Ocre': '#D97706', 'ocre': '#b45309',
      'Indigo': '#4F46E5', 'indigo': '#3f51b5', 'Camel': '#C19A6B', 'camel': '#c19a6b'
    };
    return map[colorName] || map[colorName.toLowerCase()] || '#CCCCCC';
  };

  // --- RENDU THÈME MODERN RED ---
  if (template === 'modern-red') {
    const wasPrice = product.compare_price ? product.compare_price.toLocaleString() + ' ' + (product.currency || 'FCFA') : (product.price * 1.5).toLocaleString() + ' ' + (product.currency || 'FCFA');
    return (
      <div className="container mr-product-page fade-in">
        <div className="mr-gallery-section">
          <div className="mr-page-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 10px 20px 10px' }}>
            <Link to={`/c/catalogue/${store.slug}/explore`} className="header-icon-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
            <span style={{ fontWeight: 800 }}>Détails</span>
            <button onClick={handleLikeToggle} className="header-icon-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? '#111' : 'none'} stroke="#111" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></button>
          </div>
          <img src={product.image_url} alt={product.name} className="mr-main-img" />
          <div className="mr-pagination"><span className="mr-dot active"></span><span className="mr-dot"></span><span className="mr-dot"></span></div>
        </div>
        <div className="mr-info-panel">
          <div className="mr-info-header">
            <h1 className="mr-product-name">{product.name}</h1>
            <div className="mr-price-stack">
              <span className="mr-price-was" style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.9rem', marginRight: 10 }}>{wasPrice}</span>
              <span className="mr-product-price">{formattedPrice}</span>
            </div>
          </div>
          <div className="mr-description">
            <p>{product.description}</p>
          </div>
          {/* Colors section */}
          {product.colors && product.colors.length > 0 && product.colors[0] !== 'Unique' && (
            <div className="mr-colors-section">
              <span className="mr-section-title">Couleurs</span>
              <div className="mr-colors-row">
                {product.colors.map(color => (
                  <button 
                    key={color} 
                    onClick={() => setSelectedColor(color)}
                    className={`mr-color-swatch ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes & CTA */}
          <div className="mr-bottom-row">
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
              <div className="mr-sizes-section">
                <span className="mr-section-title">Tailles</span>
                <div className="mr-sizes-list">
                  {product.sizes.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`mr-size-circle ${selectedSize === size ? 'active' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button 
              onClick={handleAddToCart} 
              className="mr-add-btn"
              disabled={!product.is_available}
            >
              {product.is_available ? 'Ajouter au panier' : 'Rupture'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDU THÈME VITRINE ---
  if (template === 'vitrine') {
    const images = product.product_images && product.product_images.length > 0 ? product.product_images : [product.image_url];
    const displayImage = images[mainImageIndex] || images[0];

    return (
      <div className="container refine-product-page fade-in">
        <div className="refine-page-header">
          <Link to={`/c/catalogue/${store.slug}/explore`} className="refine-back-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span>Retour à la collection</span></Link>
        </div>
        <div className="refine-product-grid">
          <div className="refine-product-gallery">
            <div className="refine-main-img-container">
              <img src={displayImage} alt={product.name} />
              <button onClick={handleLikeToggle} className={`refine-page-heart ${isLiked ? 'liked' : ''}`}><svg width="22" height="22" viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></button>
            </div>
            {images.length > 1 && (
              <div className="refine-image-scroll">
                {images.map((img, idx) => (
                  <div key={idx} className={`refine-scroll-item ${idx === mainImageIndex ? 'active-thumb' : ''}`} onClick={() => setMainImageIndex(idx)} style={{ cursor: 'pointer', border: idx === mainImageIndex ? '2px solid #111' : 'none' }}>
                    <img src={img} alt={`${product.name} ${idx}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="refine-product-info">
            <div className="refine-info-top">
              <h1 className="refine-product-name">{product.name}</h1>
              <div className="refine-price-row">
                 {product.compare_price && <span style={{ textDecoration: 'line-through', opacity: 0.4, marginRight: 10 }}>{product.compare_price.toLocaleString()} {product.currency || 'FCFA'}</span>}
                 <p className="refine-product-price">{formattedPrice}</p>
              </div>
            </div>
            <div className="refine-product-meta">
              <div className="refine-rating"><svg width="14" height="14" viewBox="0 0 24 24" fill="#DAA520" stroke="#DAA520"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg><span>4.8 (24 avis)</span></div>
              <span className="refine-sep">•</span><span className="refine-cat-name">{category?.name}</span>
            </div>
            <div className="refine-description"><span className="refine-section-label">Description</span><p>{product.description}</p></div>
            <div className="refine-options">
               {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
                 <div className="refine-opt-row">
                   <span className="refine-opt-label">Taille</span>
                   <div className="refine-pill-list">{product.sizes.map(size => (<button key={size} onClick={() => setSelectedSize(size)} className={`refine-pill ${selectedSize === size ? 'active' : ''}`}>{size}</button>))}</div>
                 </div>
               )}
               {product.colors && product.colors.length > 0 && product.colors[0] !== 'Unique' && (
                 <div className="refine-opt-row" style={{ marginTop: 20 }}>
                   <span className="refine-opt-label">Couleur</span>
                   <div className="refine-pill-list">{product.colors.map(color => (<button key={color} onClick={() => setSelectedColor(color)} className={`refine-pill ${selectedColor === color ? 'active' : ''}`}>{color}</button>))}</div>
                 </div>
               )}
            </div>
            <div className="refine-actions-footer">
              <div className="refine-qty-input"><button onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button><span>{quantity}</span><button onClick={() => setQuantity(q => q+1)}>+</button></div>
              <button onClick={handleAddToCart} className="refine-add-button" disabled={!product.is_available}>{product.is_available ? 'Acheter maintenant' : 'Rupture de stock'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDU THÈME ÉLÉGANCE ---
  if (template === 'elegance') {
    const images = product.product_images && product.product_images.length > 0 ? product.product_images : [product.image_url];
    const displayImage = images[mainImageIndex] || images[0];

    return (
      <div className="container product-detail-layout modern-product-page fade-in">
        <div className="modern-breadcrumb">
          <Link to={`/c/catalogue/${store.slug}/explore`} className="modern-back-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></Link>
          <span className="breadcrumb-title">Détails du produit</span>
        </div>
        <div className="modern-gallery-section">
          <div className="modern-main-image-wrapper"><img src={displayImage} alt={product.name} className="modern-main-img" /><div className="shoe-depth-shadow-large"></div></div>
          {images.length > 1 && (
            <div className="modern-thumbnails">{images.map((img, idx) => (<div key={idx} className={`modern-thumb ${idx === mainImageIndex ? 'active' : ''}`} onClick={() => setMainImageIndex(idx)}><img src={img} alt={`${product.name} ${idx}`} /></div>))}</div>
          )}
        </div>
        <div className="modern-info-panel">
          <div className="modern-info-header">
            <div><h1 className="modern-product-name">{product.name}</h1>{category && <span className="modern-product-cat">{category.name}</span>}</div>
            <button onClick={handleLikeToggle} className={`modern-page-like-btn ${isLiked ? 'liked' : ''}`}><svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></button>
          </div>
          <div className="modern-price-row">
            <div>
              {product.compare_price && <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.2rem', marginRight: '10px' }}>{product.compare_price.toLocaleString()} {product.currency || 'FCFA'}</span>}
              <span className="modern-price-value">{formattedPrice}</span>
            </div>
            <div className="modern-rating-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg><span>4.8 (120 avis)</span></div>
          </div>
          <div className="modern-description-section"><h3 className="modern-section-label">Description</h3><p className="modern-description-text">{product.description}</p></div>
          
          <div className="modern-options-grid">
             {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && product.sizes[0] !== 'Unique' && (
               <div className="modern-option-group"><h3 className="modern-section-label">Taille</h3><div className="modern-option-list">{product.sizes.map(size => (<button key={size} onClick={() => setSelectedSize(size)} className={`modern-size-pill ${selectedSize === size ? 'active' : ''}`}>{size}</button>))}</div></div>
             )}
             {product.colors && product.colors.length > 0 && product.colors[0] !== 'Unique' && product.colors[0] !== 'Standard' && (
               <div className="modern-option-group">
                 <h3 className="modern-section-label">Couleur</h3>
                 <div className="modern-option-list">
                   {product.colors.map(c => (
                     <button 
                       key={c} 
                       onClick={() => setSelectedColor(c)} 
                       className={`modern-color-dot ${selectedColor === c ? 'active' : ''}`}
                       style={{ backgroundColor: getColorHex(c) }}
                       title={c}
                     />
                   ))}
                 </div>
               </div>
             )}
          </div>

          <div className="modern-purchase-footer">
            <div className="modern-qty-selector"><button onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button><span>{quantity}</span><button onClick={() => setQuantity(q => q+1)}>+</button></div>
            <button onClick={handleAddToCart} className="modern-add-btn" disabled={!product.is_available}>{product.is_available ? 'Ajouter au panier' : 'Rupture de stock'}</button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDU THÈME MINIMAL ---
  if (template === 'minimal') {
    return (
      <div className="container minimal-product-page fade-in">
        <div style={{ padding: '20px 0 40px 0', textAlign: 'center' }}>
          <Link to={`/c/catalogue/${store.slug}/explore`} style={{ textDecoration: 'none', color: '#888', fontSize: '0.85rem', letterSpacing: 1 }}>&larr; RETOUR AU CATALOGUE</Link>
        </div>

        <div className="minimal-product-grid">
          <div className="minimal-product-gallery">
            <img src={product.image_url} alt={product.name} />
          </div>

          <div className="minimal-product-info">
            <h1 className="minimal-product-name">{product.name}</h1>
            <div className="minimal-product-price">
              {product.compare_price && <span style={{ textDecoration: 'line-through', opacity: 0.3, marginRight: 15 }}>{product.compare_price.toLocaleString()} {product.currency || 'FCFA'}</span>}
              {formattedPrice}
            </div>
            
            <div className="minimal-description">
              <p>{product.description}</p>
            </div>

            <div className="minimal-options">
              {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
                <div className="minimal-option-group">
                  <span className="minimal-option-label">TAILLE</span>
                  <div className="minimal-pill-list">
                    {product.sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`minimal-pill ${selectedSize === size ? 'active' : ''}`}>{size}</button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && product.colors[0] !== 'Unique' && (
                <div className="minimal-option-group">
                  <span className="minimal-option-label">COULEUR</span>
                  <div className="minimal-pill-list">
                    {product.colors.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)} className={`minimal-pill ${selectedColor === color ? 'active' : ''}`}>{color}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="minimal-purchase-actions">
              <div className="minimal-qty-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)}>+</button>
              </div>
              <button 
                onClick={handleAddToCart} 
                className="minimal-add-btn"
                disabled={!product.is_available}
              >
                {product.is_available ? 'AJOUTER AU PANIER' : 'RUPTURE'}
              </button>
            </div>

            <button onClick={handleLikeToggle} className={`minimal-wishlist-btn ${isLiked ? 'active' : ''}`}>
              {isLiked ? 'RETIRER DES FAVORIS' : 'AJOUTER AUX FAVORIS'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback (Style standard)
  return (
    <div className="container fade-in" style={{ paddingBottom: 80 }}>
      <div style={{ padding: '20px 0 10px 0' }}><Link to={`/c/catalogue/${store.slug}/explore`} className="section-link">&larr; Retour au catalogue</Link></div>
      <div className="product-detail-layout">
        <div className="product-gallery-main"><img src={product.image_url} alt={product.name} /></div>
        <div className="product-info-panel">
          <div>
            {category && <span className="product-info-category">{category.name}</span>}
            <h1 className="product-info-name">{product.name}</h1>
            <div className="product-info-price">
              {product.compare_price && <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8em', marginRight: '10px' }}>{product.compare_price.toLocaleString()} {product.currency || 'FCFA'}</span>}
              {formattedPrice}
            </div>
          </div>
          <p className="product-info-description">{product.description}</p>
          <button onClick={handleAddToCart} className="btn btn-accent btn-full" disabled={!product.is_available}>{product.is_available ? 'Ajouter au panier' : 'Rupture de stock'}</button>
        </div>
      </div>
    </div>
  );
}
