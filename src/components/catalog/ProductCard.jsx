import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProductCard({ product, categoryName, onLikeToggle }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { slug } = useParams();
  const { template } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [hoveredColorIndex, setHoveredColorIndex] = useState(null);

  // Charger le statut favori depuis localStorage
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem('blueston_likes');
      if (storedLikes) {
        const likes = JSON.parse(storedLikes);
        setIsLiked(likes.includes(product.id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  const handleLikeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const storedLikes = localStorage.getItem('blueston_likes');
      let likes = storedLikes ? JSON.parse(storedLikes) : [];

      let newLikedStatus = false;
      if (likes.includes(product.id)) {
        likes = likes.filter(id => id !== product.id);
        newLikedStatus = false;
      } else {
        likes.push(product.id);
        newLikedStatus = true;
      }

      localStorage.setItem('blueston_likes', JSON.stringify(likes));
      setIsLiked(newLikedStatus);

      if (onLikeToggle) onLikeToggle(product.id, newLikedStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.is_available !== false) {
      addToCart(product, 1);
    }
  };

  const formattedPrice = product.price.toLocaleString() + ' ' + (product.currency || 'FCFA');
  const formattedComparePrice = product.compare_price ? product.compare_price.toLocaleString() + ' ' + (product.currency || 'FCFA') : null;

  // --- RENDU THÈME MINIMAL ---
  if (template === 'minimal') {
    return (
      <div className="product-card minimal-card fade-in" style={{ opacity: product.is_available === false ? 0.6 : 1 }}>
        <Link to={`/c/catalogue/${slug}/product/${product.id}`} className="minimal-card-link">
          <div className="minimal-card-top">
            <div className="minimal-like-wrapper">
              <button onClick={handleLikeToggle} className="minimal-like-btn" aria-label="Aimer le produit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </button>
            </div>
            <div className="minimal-image-wrapper">
              <img
                src={product.image_url}
                alt={product.name}
                className="minimal-product-img"
                style={{
                  filter: product.is_available === false ? 'grayscale(1)' : 'none'
                }}
              />
              {/* Zone d'affichage Badge : Rupture prioritaire, sinon Ancien Prix */}
              {product.is_available === false ? (
                <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#000', color: 'white', padding: '4px 10px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1 }}>
                  RUPTURE
                </div>
              ) : (
                formattedComparePrice && (
                  <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#f0f0f0', color: '#999', padding: '4px 10px', fontSize: '0.65rem', fontWeight: 600, textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
                    {formattedComparePrice}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="minimal-card-bottom">
            <h4 className="minimal-card-title">{product.name}</h4>
            <div className="minimal-card-price" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem', fontWeight: 600, color: '#111' }}>
              {formattedPrice}
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // --- RENDU THÈME NORDIC ---
  if (template === 'nordic') {
    const nordicColors = product.colors || [];
    const nordicImages = product.product_images || [];

    const getNordicColorHex = (colorName) => {
      if (!colorName) return '#CBD5E0';
      const name = colorName.trim().toLowerCase();
      const map = {
        'noir': '#000000', 'blanc': '#FFFFFF', 'rouge': '#EF4444', 'bleu': '#3B82F6',
        'vert': '#10B981', 'jaune': '#F59E0B', 'marron': '#8B4513', 'gris': '#9CA3AF',
        'rose': '#EC4899', 'ocre': '#D97706', 'indigo': '#4F46E5', 'camel': '#C19A6B',
        'orange': '#F97316', 'violet': '#8B5CF6', 'beige': '#F5F5DC', 'marine': '#000080',
        'black': '#000000', 'white': '#FFFFFF', 'red': '#EF4444', 'blue': '#3B82F6',
        'green': '#10B981', 'yellow': '#F59E0B', 'brown': '#8B4513', 'gray': '#9CA3AF',
        'pink': '#EC4899', 'purple': '#8B5CF6', 'gold': '#FFD700', 'silver': '#C0C0C0'
      };
      return map[name] || '#CBD5E0';
    };

    // N'associer que les couleurs qui ont une image dédiée
    const swatchEntries = nordicColors
      .map((color, i) => ({ color, image: nordicImages[i] }))
      .filter(entry => !!entry.image);

    // Image affichée : swatch survolé si disponible, sinon image par défaut du produit
    const displayImage = (hoveredColorIndex !== null && swatchEntries[hoveredColorIndex])
      ? swatchEntries[hoveredColorIndex].image
      : product.image_url;

    const handleNordicQuickAdd = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (product.is_available !== false) {
        const selectedColor = (hoveredColorIndex !== null && swatchEntries[hoveredColorIndex])
          ? swatchEntries[hoveredColorIndex].color
          : (nordicColors[0] || '');
        addToCart(product, 1, '', selectedColor);
        setIsCartOpen(true);
      }
    };

    return (
      <Link to={`/c/catalogue/${slug}/product/${product.id}`} className="nordic-card fade-in" style={{ opacity: product.is_available === false ? 0.6 : 1 }}>
        <div className="nordic-card-top">
          {product.is_available === false && (
            <div className="nordic-badge sold-out">RUPTURE</div>
          )}
          {product.compare_price && product.is_available !== false && (
            <div className="nordic-badge sale">PROMO</div>
          )}
          <img src={displayImage} alt={product.name} className="nordic-card-img" style={{ filter: product.is_available === false ? 'grayscale(1)' : 'none' }} />
          {product.is_available !== false && (
            <button onClick={handleNordicQuickAdd} className="nordic-quick-add-plus" aria-label="Ajouter au panier">
              +
            </button>
          )}
        </div>
        <div className="nordic-card-bottom">
          <h4 className="nordic-card-name" style={{ margin: 0 }}>{product.name}</h4>
          {swatchEntries.length > 1 && (
            <div className="nordic-color-swatches">
              {swatchEntries.map((entry, i) => (
                <span
                  key={i}
                  className={`nordic-swatch${hoveredColorIndex === i ? ' active' : ''}`}
                  style={{
                    backgroundColor: getNordicColorHex(entry.color),
                    border: entry.color.toLowerCase() === 'blanc' || entry.color.toLowerCase() === 'white' ? '1px solid #E2E8F0' : 'none'
                  }}
                  onMouseEnter={() => setHoveredColorIndex(i)}
                  onMouseLeave={() => setHoveredColorIndex(null)}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHoveredColorIndex(prev => prev === i ? null : i); }}
                  title={entry.color}
                />
              ))}
            </div>
          )}
          <div className="nordic-price-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="nordic-card-price" style={{ whiteSpace: 'nowrap' }}>{formattedPrice}</span>
              {formattedComparePrice && <span className="nordic-card-old-price" style={{ textDecoration: 'line-through', color: '#A0AEC0', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{formattedComparePrice}</span>}
            </div>
            <button onClick={handleLikeToggle} className="nordic-like-btn" aria-label="Ajouter aux favoris">
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? '#E53E3E' : 'none'} stroke={isLiked ? '#E53E3E' : '#A0AEC0'} strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // --- RENDU THÈME ÉLÉGANCE (PAR DÉFAUT) ---
  return (
    <div className="product-card modern-card fade-in" style={{ opacity: product.is_available === false ? 0.8 : 1 }}>
      <Link to={`/c/catalogue/${slug}/product/${product.id}`}>
        <div className="modern-card-top">
          {product.is_available === false && (
            <div style={{ position: 'absolute', top: 15, left: 15, backgroundColor: '#3b82f6', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800, zIndex: 10 }}>
              RUPTURE
            </div>
          )}
          <div className="floating-shoe-wrapper">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="floating-shoe-img" 
              style={{ 
                filter: product.is_available === false ? 'grayscale(1)' : 'none' 
              }} 
            />
          </div>
        </div>
        <div className="modern-card-bottom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <h4 className="modern-card-title" style={{ margin: 0, flex: 1 }}>{product.name}</h4>
            <button onClick={handleLikeToggle} className="modern-like-btn-inline" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? '#EF4444' : 'none'} stroke={isLiked ? '#EF4444' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </button>
          </div>
          <div className="modern-card-details" style={{ flexWrap: 'nowrap', alignItems: 'flex-end' }}>
            <div className="modern-card-price-box" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="modern-card-price" style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 800, color: '#111' }}>
                {formattedPrice}
              </span>
              {formattedComparePrice && (
                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                  {formattedComparePrice}
                </span>
              )}
            </div>
            <div className="modern-card-rating">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              <span style={{ fontSize: '0.75rem' }}>4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
