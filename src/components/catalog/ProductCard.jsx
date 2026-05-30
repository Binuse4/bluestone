import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProductCard({ product, categoryName, onLikeToggle }) {
  const { addToCart } = useCart();
  const { slug } = useParams();
  const { template } = useTheme();
  const [isLiked, setIsLiked] = useState(false);

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
              <img src={product.image_url} alt={product.name} className="minimal-product-img" style={{ filter: product.is_available === false ? 'grayscale(1)' : 'none' }} />
              {product.is_available === false && (
                <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#000', color: 'white', padding: '4px 10px', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1 }}>
                  RUPTURE
                </div>
              )}
            </div>
          </div>
          <div className="minimal-card-bottom">
            <h4 className="minimal-card-title">{product.name}</h4>
            <span className="minimal-card-price">
               {formattedComparePrice && <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85em', marginRight: '5px' }}>{formattedComparePrice}</span>}
               {formattedPrice}
            </span>
          </div>
        </Link>
      </div>
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
          <button onClick={handleLikeToggle} className="modern-like-btn" aria-label="Aimer le produit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? '#EF4444' : 'none'} stroke={isLiked ? '#EF4444' : 'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </button>
          <div className="floating-shoe-wrapper">
            <img src={product.image_url} alt={product.name} className="floating-shoe-img" style={{ filter: product.is_available === false ? 'grayscale(1)' : 'none' }} />
            <div className="shoe-depth-shadow"></div>
          </div>
        </div>
        <div className="modern-card-bottom">
          <h4 className="modern-card-title">{product.name}</h4>
          <div className="modern-card-details">
            <span className="modern-card-price">
              {formattedComparePrice && <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85em', marginRight: '5px' }}>{formattedComparePrice}</span>}
              {formattedPrice}
            </span>
            <div className="modern-card-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              <span>4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
