import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import mockData from '../data/mock-store.json';

export function useStoreData(storeSlug) {
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
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
            setStore(storeData);

            // 2. Charger les catégories de cette boutique
            const { data: categoriesData, error: categoriesError } = await supabase
              .from('categories')
              .select('*')
              .eq('store_id', storeData.id)
              .order('sort_order', { ascending: true });

            if (categoriesError) throw categoriesError;
            setCategories(categoriesData || []);

            // 3. Charger les produits de cette boutique
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('*')
              .eq('store_id', storeData.id)
              .order('sort_order', { ascending: true });

            if (productsError) throw productsError;
            setProducts(productsData || []);
          }
        } else {
          // Fallback sur localStorage / données mockées locales
          // Pour la démo, on simule un petit délai de chargement
          await new Promise(resolve => setTimeout(resolve, 500));

          // Déterminer le slug effectif
          const activeSlug = storeSlug || mockData.store.slug;

          // Charger depuis localStorage ou initialiser avec mockData
          let localStore = localStorage.getItem(`blueston_store_${activeSlug}`);
          let localCategories = localStorage.getItem(`blueston_categories_${activeSlug}`);
          let localProducts = localStorage.getItem(`blueston_products_${activeSlug}`);

          if (!localStore) {
            // Initialisation avec les valeurs mockées par défaut
            const initialStore = { ...mockData.store, slug: activeSlug };
            if (activeSlug !== mockData.store.slug) {
              initialStore.name = activeSlug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
            
            localStorage.setItem(`blueston_store_${activeSlug}`, JSON.stringify(initialStore));
            
            // On n'écrase que si c'est vide
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
          } else {
            setStore(JSON.parse(localStore));
            setCategories(JSON.parse(localCategories));
            setProducts(JSON.parse(localProducts));
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

  return { store, categories, products, loading, error };
}
