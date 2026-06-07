import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('blueston_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      console.error("Erreur de lecture du panier dans localStorage", e);
      return [];
    }
  });

  // États pour les codes promo
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem('blueston_cart', JSON.stringify(cart));
  }, [cart]);

  // Ajouter un produit au panier avec taille et couleur
  const addToCart = (product, quantity = 1, selectedSize = '', selectedColor = '') => {
    // Déterminer les valeurs finales (priorité au choix utilisateur, puis aux données produit)
    const finalSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const finalColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Unique');
    
    // Générer un identifiant de ligne panier unique : id-taille-couleur
    // On nettoie les chaînes pour éviter les problèmes d'espaces
    const cartItemId = `${product.id}-${finalSize.trim()}-${finalColor.trim()}`;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { 
        ...product, 
        cartItemId,
        quantity, 
        selectedSize: finalSize, 
        selectedColor: finalColor 
      }];
    });
  };

  // Mettre à jour la quantité d'un produit (via sa clé cartItemId)
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  // Retirer un produit du panier (via sa clé cartItemId)
  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setDiscount(0);
  };

  // Calcul du total des articles
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Calcul du prix brut (sans réduction)
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Appliquer un code promotionnel
  const applyPromoCode = (code) => {
    setPromoError('');
    if (!code) {
      setPromoCode('');
      setDiscount(0);
      return true;
    }

    const cleanCode = code.toUpperCase().trim();
    
    if (cleanCode === 'BLUESTON10') {
      setPromoCode(cleanCode);
      setDiscount(Math.round(cartTotal * 0.1));
      return true;
    } else if (cleanCode === 'WELCOME5000') {
      if (cartTotal < 15000) {
        setPromoError("Ce code nécessite un panier d'au moins 15 000 FCFA.");
        return false;
      }
      setPromoCode(cleanCode);
      setDiscount(5000);
      return true;
    } else if (cleanCode === 'FREE2026') {
      setPromoCode(cleanCode);
      setDiscount(cartTotal);
      return true;
    } else {
      setPromoError("Code promo invalide.");
      return false;
    }
  };

  // Recalculer la réduction si le prix total change
  useEffect(() => {
    if (promoCode) {
      if (promoCode === 'BLUESTON10') {
        setDiscount(Math.round(cartTotal * 0.1));
      } else if (promoCode === 'WELCOME5000') {
        if (cartTotal < 15000) {
          setPromoCode('');
          setDiscount(0);
          setPromoError("Code promo annulé (panier < 15 000 FCFA).");
        } else {
          setDiscount(5000);
        }
      } else if (promoCode === 'FREE2026') {
        setDiscount(cartTotal);
      }
    } else {
      setDiscount(0);
    }
  }, [cartTotal, promoCode]);

  // Prix total final (net de réduction)
  const finalTotal = Math.max(0, cartTotal - discount);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      promoCode,
      promoError,
      discount,
      finalTotal,
      applyPromoCode
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé au sein d\'un CartProvider');
  }
  return context;
};
