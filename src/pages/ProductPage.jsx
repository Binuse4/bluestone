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

  const product = products?.find((p) => p.id === productId);

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

  if (loading) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Chargement...</div>;
  if (error || !store || !product) return <div className="container" style={{ padding: 100, textAlign: 'center' }}>Produit introuvable</div>;

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
    if (product.is_available !== false) {
      // Forcer l'utilisation des états actuels pour garantir la précision
      addToCart(product, quantity, selectedSize, selectedColor);
    }
  };

  const formattedPrice = product.price.toLocaleString() + ' ' + (product.currency || 'FCFA');
  const category = categories.find(c => c.id === product.category_id);
  
  // Helper for color dots - Mapping étendu pour éviter le gris
  const getColorHex = (colorName) => {
    if (!colorName) return '#CCCCCC';
    const name = colorName.trim().toLowerCase();
    const map = {
      // Français
      'noir': '#000000', 'blanc': '#ffffff', 'rouge': '#EF4444', 'bleu': '#3B82F6',
      'vert': '#10B981', 'jaune': '#F59E0B', 'marron': '#8B4513', 'gris': '#9CA3AF',
      'rose': '#EC4899', 'ocre': '#D97706', 'indigo': '#4F46E5', 'camel': '#C19A6B',
      'orange': '#F97316', 'violet': '#8B5CF6', 'beige': '#F5F5DC', 'argent': '#C0C0C0',
      'or': '#FFD700', 'bronze': '#CD7F32', 'kaki': '#F0E68C', 'marine': '#000080',
      // Anglais
      'black': '#000000', 'white': '#ffffff', 'red': '#EF4444', 'blue': '#3B82F6',
      'green': '#10B981', 'yellow': '#F59E0B', 'brown': '#8B4513', 'gray': '#9CA3AF',
      'pink': '#EC4899', 'purple': '#8B5CF6', 'gold': '#FFD700', 'silver': '#C0C0C0'
    };
    return map[name] || '#CCCCCC';
  };

  // Logique de changement d'image par couleur
  let currentMainImage = product.image_url;
  if (product.colors && product.colors.length > 0 && selectedColor) {
    const colorIndex = product.colors.findIndex(c => c.trim().toLowerCase() === selectedColor.trim().toLowerCase());
    if (colorIndex !== -1 && product.product_images && product.product_images[colorIndex]) {
      currentMainImage = product.product_images[colorIndex];
    }
  }

  // --- RENDU THÈME MINIMAL ---
  if (template === 'minimal') {
    return (
      <div className="container minimal-product-page fade-in">
        <div style={{ padding: '20px 0 40px 0', textAlign: 'center' }}>
          <Link to={`/c/catalogue/${store.slug}/explore`} style={{ textDecoration: 'none', color: '#888', fontSize: '0.85rem', letterSpacing: 1 }}>&larr; RETOUR AU CATALOGUE</Link>
        </div>

        <div className="minimal-product-grid">
          <div className="minimal-product-gallery" style={{ 
            opacity: product.is_available === false ? 0.6 : 1,
            height: '450px', // Hauteur fixe pour stabilité
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#F9F9F9',
            borderRadius: '20px'
          }}>
            <img 
              src={currentMainImage} 
              alt={product.name} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: product.is_available === false ? 'grayscale(1)' : 'none'
              }} 
            />
          </div>

          <div className="minimal-product-info">
            <h1 className="minimal-product-name">{product.name}</h1>
            <div className="minimal-product-price" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', flexWrap: 'nowrap' }}>
              {product.compare_price && <span style={{ textDecoration: 'line-through', opacity: 0.3, marginRight: 10, fontSize: '1rem', whiteSpace: 'nowrap' }}>{product.compare_price.toLocaleString()} {product.currency || 'FCFA'}</span>}
              <span style={{ fontSize: '1.25rem', whiteSpace: 'nowrap' }}>{formattedPrice}</span>
            </div>
            
            <div className="minimal-description">
              <p>{product.description}</p>
            </div>

            {/* Sélecteur de Tailles - Minimal */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
              <div className="minimal-option-group" style={{ marginBottom: 20 }}>
                <span className="minimal-option-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>TAILLE</span>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 20px',
                        border: '1px solid #eee',
                        backgroundColor: selectedSize === size ? '#000' : 'transparent',
                        color: selectedSize === size ? '#fff' : '#000',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sélecteur de Couleurs - Minimal */}
            {product.colors && product.colors.length > 0 && product.colors[0] !== 'Unique' && (
              <div className="minimal-option-group" style={{ marginBottom: 30 }}>
                <span className="minimal-option-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>COULEUR</span>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {product.colors.map(color => (
                    <button 
                      key={color} 
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: getColorHex(color),
                        border: selectedColor === color ? '2px solid #000' : '1px solid #eee',
                        padding: 0,
                        cursor: 'pointer',
                        transform: selectedColor === color ? 'scale(1.2)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="minimal-purchase-actions">
              <div className="minimal-qty-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)}>+</button>
              </div>
              <button 
                onClick={handleAddToCart} 
                className="minimal-add-btn"
                disabled={product.is_available === false}
                style={{ backgroundColor: product.is_available === false ? '#888' : '#000' }}
              >
                {product.is_available === false ? 'RUPTURE' : 'AJOUTER AU PANIER'}
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

  // --- RENDU THÈME ÉLÉGANCE (PAR DÉFAUT) ---
  return (
    <div className="container product-detail-layout modern-product-page fade-in">
      <div className="modern-breadcrumb">
        <Link to={`/c/catalogue/${store.slug}/explore`} className="modern-back-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
        <span className="breadcrumb-title">Détails du produit</span>
      </div>
      <div className="modern-gallery-section" style={{ 
        opacity: product.is_available === false ? 0.7 : 1,
        height: '450px', // Hauteur fixe pour stabilité
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '40px',
        backgroundColor: '#f9f9f9'
      }}>
        <div className="modern-main-image-wrapper" style={{ width: '100%', height: '100%' }}>
          <img 
            src={currentMainImage} 
            alt={product.name} 
            className="modern-main-img" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: product.is_available === false ? 'grayscale(1)' : 'none' 
            }} 
          />
          <div className="shoe-depth-shadow-large"></div>
        </div>
      </div>
      <div className="modern-info-panel">
        <div className="modern-info-header">
          <div><h1 className="modern-product-name">{product.name}</h1>{category && <span className="modern-product-cat">{category.name}</span>}</div>
          <button onClick={handleLikeToggle} className={`modern-page-like-btn ${isLiked ? 'liked' : ''}`}><svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></button>
        </div>
        <div className="modern-price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', whiteSpace: 'nowrap' }}>
            <span className="modern-price-value" style={{ whiteSpace: 'nowrap', fontSize: '1.6rem', fontWeight: 800 }}>{formattedPrice}</span>
            {product.compare_price && <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>{product.compare_price.toLocaleString()} {product.currency || 'FCFA'}</span>}
          </div>
          <div className="modern-rating-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg><span>4.8 (120 avis)</span></div>
        </div>
        <div className="modern-description-section"><h3 className="modern-section-label">Description</h3><p className="modern-description-text">{product.description}</p></div>
        
        {/* Options de Tailles - Élégance */}
        {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
          <div className="modern-options-group" style={{ marginBottom: 25 }}>
            <span className="modern-section-label">Sélectionner la taille</span>
            <div className="modern-option-list" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`modern-size-pill ${selectedSize === size ? 'active' : ''}`}
                  style={{
                    minWidth: 50,
                    height: 50,
                    borderRadius: 15,
                    border: selectedSize === size ? '2px solid #111' : '2px solid #f0f0f0',
                    backgroundColor: selectedSize === size ? '#111' : 'white',
                    color: selectedSize === size ? 'white' : '#111',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Options de Couleurs - Élégance */}
        {product.colors && product.colors.length > 0 && product.colors[0] !== 'Unique' && (
          <div className="modern-options-group" style={{ marginBottom: 35 }}>
            <span className="modern-section-label">Couleurs disponibles</span>
            <div className="modern-option-list" style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
              {product.colors.map(color => (
                <button 
                  key={color} 
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: '50%',
                    backgroundColor: getColorHex(color),
                    border: '3px solid white',
                    boxShadow: selectedColor === color ? '0 0 0 2px #111' : '0 0 0 1px #eee',
                    cursor: 'pointer',
                    transform: selectedColor === color ? 'scale(1.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="modern-purchase-footer">
          <div className="modern-qty-selector"><button onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button><span>{quantity}</span><button onClick={() => setQuantity(q => q+1)}>+</button></div>
          <button 
            onClick={handleAddToCart} 
            className="modern-add-btn" 
            disabled={product.is_available === false}
            style={{ backgroundColor: product.is_available === false ? '#3b82f6' : '#111' }}
          >
            {product.is_available === false ? 'RUPTURE DE STOCK' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  );
}
