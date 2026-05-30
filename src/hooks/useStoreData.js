import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import mockData from '../data/mock-store.json';

export function useStoreData(storeSlug) {
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Si Supabase est disponible et configuré, on tente de fetch
        if (supabase) {
          // 1. Charger la boutique par son slug
          const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('*')
            .eq('slug', storeSlug)
            .single();

          if (storeError) {
            throw new Error(`Boutique introuvable ou erreur : ${storeError.message}`);
          }

          if (storeData) {
            // 2. Charger les catégories de cette boutique
            const { data: categoriesData, error: categoriesError } = await supabase
              .from('categories')
              .select('*')
              .eq('store_id', storeData.id)
              .order('sort_order', { ascending: true });

            if (categoriesError) throw categoriesError;

            // 3. Charger les produits de cette boutique
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('*')
              .eq('store_id', storeData.id)
              .order('sort_order', { ascending: true });

            if (productsError) throw productsError;

            // 4. Charger les Bannières
            const { data: bannersData, error: bannersError } = await supabase
              .from('banners')
              .select('*, products(name, image_url)')
              .eq('store_id', storeData.id)
              .eq('is_active', true)
              .order('sort_order', { ascending: true });

            if (bannersError) {
              console.warn("Could not load banners, table might not exist yet:", bannersError.message);
              setBanners([]);
            } else {
              setBanners(bannersData || []);
            }

            setStore(storeData);
            setCategories(categoriesData || []);
            setProducts(productsData || []);
          }
        } else {
          // Fallback sur localStorage / données mockées locales
          await new Promise(resolve => setTimeout(resolve, 500));

          const activeSlug = storeSlug || mockData.store.slug;

          let localStore = localStorage.getItem(`blueston_store_${activeSlug}`);
          let localCategories = localStorage.getItem(`blueston_categories_${activeSlug}`);
          let localProducts = localStorage.getItem(`blueston_products_${activeSlug}`);
          let localBanners = localStorage.getItem(`blueston_banners_${activeSlug}`);

          if (!localStore) {
            const initialStore = { ...mockData.store, slug: activeSlug };
            if (activeSlug !== mockData.store.slug) {
              initialStore.name = activeSlug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
            
            localStorage.setItem(`blueston_store_${activeSlug}`, JSON.stringify(initialStore));
            
            if (!localCategories) {
              localStorage.setItem(`blueston_categories_${activeSlug}`, JSON.stringify(mockData.categories));
              setCategories(mockData.categories);
            } else {
              setCategories(JSON.parse(localCategories));
            }

            if (!localProducts) {
              localStorage.setItem(`blueston_products_${activeSlug}`, JSON.stringify(mockData.products));
              setProducts(mockData.products);
            } else {
              setProducts(JSON.parse(localProducts));
            }

            setStore(initialStore);
            setBanners([]);
          } else {
            setStore(JSON.parse(localStore));
            setCategories(JSON.parse(localCategories));
            setProducts(JSON.parse(localProducts));
            setBanners(localBanners ? JSON.parse(localBanners) : []);
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données de la boutique:", err);
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [storeSlug]);

  return { store, categories, products, banners, loading, error };
}
