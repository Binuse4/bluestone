import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useStoreData } from './hooks/useStoreData';

// Pages
import StorefrontPage from './pages/StorefrontPage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import DashboardPage from './pages/admin/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Header from './components/layout/Header';
import CartDrawer from './components/cart/CartDrawer';

// Composant Layout pour encapsuler les pages publiques de la boutique
function StoreLayout() {
  const { slug } = useParams();
  const { store, loading } = useStoreData(slug);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { setTemplate } = useTheme();

  // Synchroniser le template du store avec le ThemeContext
  useEffect(() => {
    if (store?.template) {
      setTemplate(store.template);
    }
  }, [store?.template, setTemplate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header store={store} onCartClick={() => setIsCartOpen(true)} />
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        store={store} 
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirection par défaut vers la boutique de démo */}
            <Route path="/" element={<Navigate to="/c/catalogue/africa-chic" replace />} />
            
            {/* Routes Publiques de la Boutique */}
            <Route path="/c/catalogue/:slug" element={<StoreLayout />}>
              <Route index element={<StorefrontPage />} />
              <Route path="explore" element={<CatalogPage />} />
              <Route path="product/:productId" element={<ProductPage />} />
            </Route>

            {/* Route Espace Admin */}
            <Route path="/admin/:slug" element={<DashboardPage />} />

            {/* Route 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}
