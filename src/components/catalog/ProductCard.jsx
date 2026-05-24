import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProductCard({ product, categoryName }) {
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

      if (likes.includes(product.id)) {
        likes = likes.filter(id => id !== product.id);
        setIsLiked(false);
      } else {
        likes.push(product.id);
        setIsLiked(true);
      }

      localStorage.setItem('blueston_likes', JSON.stringify(likes));
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Par défaut, ajoute la première taille et couleur si disponibles
    addToCart(product, 1);
  };

  const formattedPrice = product.price.toLocaleString() + ' ' + (product.currency || 'FCFA');

  // Rendu spécifique pour le thème MODERN-RED
  if (template === 'modern-red') {
    const wasPrice = (product.price * 1.5).toLocaleString() + ' ' + (product.currency || 'FCFA');
    return (
      <div className="product-card mr-card fade-in">
        <Link to={`/c/catalogue/${slug}/product/${product.id}`}>
          <div className="mr-card-top">
            <h4 className="mr-card-name">{product.name.replace(' ', '\n')}</h4>
            <button onClick={handleLikeToggle} className="mr-like-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? '#111' : 'none'} stroke="#111" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </button>
          </div>
          <div className="mr-card-image-wrapper">
            <img src={product.image_url} alt={product.name} className="mr-card-img" />
          </div>
          <div className="mr-card-bottom">
            <div className="mr-price-col-left">
              <span className="mr-price-label">Ancien</span>
              <span className="mr-price-was">{wasPrice}</span>
            </div>
            <div className="mr-price-col-right">
              <span className="mr-price-label">Maintenant</span>
              <span className="mr-price-now">{formattedPrice}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Rendu spécifique pour le thème VITRINE (Refine Home avec Cascade)
  if (template === 'vitrine') {
    return (
      <div className="product-card minimal-card fade-in">
        <Link to={`/c/catalogue/${slug}/product/${product.id}`}>
          <div className="minimal-card-top">
            <div className="minimal-like-wrapper">
              <button 
                onClick={handleLikeToggle}
                className="minimal-like-btn"
                aria-label="Aimer le produit"
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill={isLiked ? '#ef4444' : 'none'} 
                  stroke={isLiked ? '#ef4444' : 'currentColor'} 
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div className="minimal-image-wrapper">
              <img src={product.image_url} alt={product.name} className="minimal-product-img" />
            </div>
          </div>
          <div className="minimal-card-bottom">
            <h4 className="minimal-card-title">{product.name}</h4>
            <span className="minimal-card-price">{formattedPrice}</span>
          </div>
        </Link>
      </div>
    );
  }

  // Rendu spécifique pour le thème MINIMAL (Original Refine design fallback)
  if (template === 'minimal') {
    return (
      <div className="product-card refine-card fade-in">
        <Link to={`/c/catalogue/${slug}/product/${product.id}`}>
          <div className="refine-card-image-wrapper">
            <img src={product.image_url} alt={product.name} className="refine-card-img" />
            <button 
              onClick={handleLikeToggle}
              className={`refine-like-btn ${isLiked ? 'liked' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
          <div className="refine-card-info">
            <h4 className="refine-card-title">{product.name}</h4>
            <span className="refine-card-price">{formattedPrice}</span>
          </div>
        </Link>
      </div>
    );
  }

  // Rendu spécifique pour le thème ÉLÉGANCE (Moderne/App-style)
  if (template === 'elegance') {
    return (
      <div className="product-card modern-card fade-in">
        <Link to={`/c/catalogue/${slug}/product/${product.id}`}>
          {/* Floating Object Area (Top Half) */}
          <div className="modern-card-top">
            {/* Heart Icon */}
            <button 
              onClick={handleLikeToggle}
              className="modern-like-btn"
              aria-label="Aimer le produit"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill={isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Floating Image & Depth Shadow */}
            <div className="floating-shoe-wrapper">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="floating-shoe-img"
              />
              <div className="shoe-depth-shadow"></div>
            </div>
          </div>

          {/* Product Details Area (Bottom Half) */}
          <div className="modern-card-bottom">
            <h4 className="modern-card-title">{product.name}</h4>
            <div className="modern-card-details">
              <span className="modern-card-price">{formattedPrice}</span>
              <div className="modern-card-rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>4.8</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="product-card fade-in">
      <Link to={`/c/catalogue/${slug}/product/${product.id}`} style={{ display: 'block' }}>
        <div className="product-card-image-wrapper">
          <img 
            className="product-card-image" 
            src={product.image_url} 
            alt={product.name} 
            loading="lazy"
          />
          
          {/* Bouton Like / Favori */}
          <button 
            onClick={handleLikeToggle}
            className="btn-like-floater"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              backgroundColor: template === 'vitrine' ? 'rgba(0,0,0,0.4)' : 'white',
              border: 'none',
              borderRadius: template === 'minimal' || template === 'vitrine' ? '0' : '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: template === 'minimal' ? 'none' : 'var(--shadow-sm)',
              color: isLiked ? '#e53e3e' : (template === 'vitrine' ? 'white' : '#8c8c8c'),
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            aria-label="Aimer le produit"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill={isLiked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {!product.is_available && (
            <span className="product-card-badge" style={{ backgroundColor: template === 'minimal' ? 'transparent' : '#d9534f', color: template === 'minimal' ? '#d9534f' : 'white', border: template === 'minimal' ? '1px solid #d9534f' : 'none' }}>
              {template === 'vitrine' ? 'RUPTURE' : 'Rupture'}
            </span>
          )}
          {product.is_available && (
            <div className="product-card-quick-add">
              <button 
                onClick={handleQuickAdd} 
                className="btn btn-accent btn-full"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {template === 'vitrine' ? 'AJOUTER AU PANIER' : 'Ajouter au panier'}
              </button>
            </div>
          )}
        </div>
      </Link>
      
      <div className="product-card-info">
        {categoryName && (
          <span className="product-card-category">
            {template === 'vitrine' ? categoryName.toUpperCase() : categoryName}
          </span>
        )}
        <Link to={`/c/catalogue/${slug}/product/${product.id}`}>
          <h4 className="product-card-title">{product.name}</h4>
        </Link>
        <span className="product-card-price">{formattedPrice}</span>
      </div>
    </div>
  );
}
