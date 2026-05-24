import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStoreData } from '../../hooks/useStoreData';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/storage';

export default function DashboardPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { store, categories, products, loading, error } = useStoreData(slug);
  const { setTemplate: setGlobalTemplate } = useTheme();
  
  const [activeTab, setActiveTab] = useState('general'); // general | design | categories | products
  const [selectedTemplate, setSelectedTemplate] = useState('elegance');
  const [isUploading, setIsUploading] = useState(false);
  
  // États formulaire Boutique
  const [storeForm, setStoreForm] = useState({
    name: '',
    description: '',
    whatsapp_number: '',
    logo_url: '',
    cover_url: '',
    theme_color: '#8c6239'
  });
  
  // États formulaire Catégorie
  const [newCat, setNewCat] = useState({ name: '', description: '', image_url: '', icon_url: '' });
  
  // États formulaire Produit
  const [newProd, setNewProd] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    is_available: true
  });

  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // États de modification
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingProdId, setEditingProdId] = useState(null);

  // Annuler la modification
  const cancelEdit = () => {
    setEditingCatId(null);
    setNewCat({ name: '', description: '', image_url: '', icon_url: '' });
    setEditingProdId(null);
    setNewProd({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category_id: categories[0]?.id || '',
      is_available: true
    });
    setSizesInput('');
    setColorsInput('');
    setShowAddProductForm(false);
  };

  // Préparer la modification d'une catégorie
  const startEditCategory = (cat) => {
    setEditingCatId(cat.id);
    setNewCat({
      name: cat.name,
      description: cat.description || '',
      image_url: cat.image_url || '',
      icon_url: cat.icon_url || ''
    });
    setActiveTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Préparer la modification d'un produit
  const startEditProduct = (prod) => {
    setEditingProdId(prod.id);
    setNewProd({
      name: prod.name,
      description: prod.description || '',
      price: prod.price.toString(),
      image_url: prod.image_url || '',
      category_id: prod.category_id || '',
      is_available: prod.is_available
    });
    setSizesInput(prod.sizes ? prod.sizes.join(', ') : '');
    setColorsInput(prod.colors ? prod.colors.join(', ') : '');
    setShowAddProductForm(true);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler pour l'upload d'images
  const handleFileUpload = async (e, type, target) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!supabase) {
      alert("L'upload nécessite une configuration Supabase. En mode démo, utilisez uniquement des URLs.");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadFile(file, 'assets', `${slug}/${type}`);
      
      if (target === 'store-logo') setStoreForm(prev => ({ ...prev, logo_url: url }));
      if (target === 'store-cover') setStoreForm(prev => ({ ...prev, cover_url: url }));
      if (target === 'category') setNewCat(prev => ({ ...prev, image_url: url }));
      if (target === 'category-icon') setNewCat(prev => ({ ...prev, icon_url: url }));
      if (target === 'product') setNewProd(prev => ({ ...prev, image_url: url }));
      
      alert("Image chargée avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Charger les données de la boutique dans le formulaire
  useEffect(() => {
    if (store) {
      setStoreForm({
        name: store.name || '',
        description: store.description || '',
        whatsapp_number: store.whatsapp_number || '',
        logo_url: store.logo_url || '',
        cover_url: store.cover_url || '',
        theme_color: store.theme_color || '#8c6239'
      });
      setSelectedTemplate(store.template || 'elegance');
    }
  }, [store]);

  // Définir la catégorie par défaut une fois chargées
  useEffect(() => {
    if (categories.length > 0 && !newProd.category_id) {
      setNewProd(prev => ({ ...prev, category_id: categories[0].id }));
    }
  }, [categories, newProd.category_id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: 200, height: 35, margin: '0 auto 30px auto' }}></div>
        <div className="skeleton" style={{ width: '100%', height: 300, borderRadius: 'var(--radius-md)' }}></div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="container not-found-layout">
        <h2 className="not-found-title">Dashboard introuvable</h2>
        <p className="not-found-text">Nous n'avons pas pu charger les données de cette boutique.</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  // Liste des templates disponibles
  const templateOptions = [
    {
      id: 'elegance',
      name: 'Élégance',
      emoji: '🏛️',
      description: 'Design moderne "App-style" avec header flottant, bannières néomorphiques et typographie premium.',
      features: ['Header Moderne', 'Bannière Sneaker', 'Soft UI', 'Gallery View'],
      preview: {
        headerBg: '#ffffff',
        headerText: '#111',
        cardRadius: '30px',
        gridCols: 2,
        heroHeight: '400px'
      }
    },
    {
      id: 'vitrine',
      name: 'Vitrine',
      emoji: '🎨',
      description: 'Style éditorial sophistiqué avec une grille en cascade (Masonry). Idéal pour la décoration et l\'art.',
      features: ['Masonry Grid', 'Palette Crème', 'Full-width Banner', '3 colonnes'],
      preview: {
        headerBg: '#fdf8f2',
        headerText: '#111',
        cardRadius: '20px',
        gridCols: 3,
        heroHeight: '60vh'
      }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      emoji: '⬜',
      description: 'Design ultra-épuré style Apple. Beaucoup d\'espace blanc, images carrées, navigation discrète. Boutiques premium.',
      features: ['2 colonnes max', 'Images carrées', 'Typographie serif', 'Sans ombre'],
      preview: {
        headerBg: '#fafafa',
        headerText: '#1a1a1a',
        cardRadius: '0px',
        gridCols: 2,
        heroHeight: '0px'
      }
    },
    {
      id: 'modern-red',
      name: 'Modern Red',
      emoji: '🔴',
      description: 'Design Soft UI avec des accents rouge vif. Cartes surélevées, ombres douces et prix avant/après. Style app mobile.',
      features: ['Accent Rouge', 'Soft UI / Ombres', 'Prix Ancien/Neuf'],
      preview: {
        headerBg: '#f3f3f3',
        headerText: '#111',
        cardRadius: '16px',
        gridCols: 2,
        heroHeight: '0px'
      }
    }
  ];

  // Sauvegarder le template choisi
  const handleSaveTemplate = async (templateId) => {
    setSelectedTemplate(templateId);
    setGlobalTemplate(templateId);

    const updatedStore = { ...store, template: templateId };

    if (supabase) {
      try {
        const { error } = await supabase
          .from('stores')
          .update({ template: templateId })
          .eq('id', store.id);

        if (error) throw error;
        alert(`Design "${templateOptions.find(t => t.id === templateId)?.name}" appliqué avec succès !`);
      } catch (err) {
        console.error('Erreur sauvegarde template Supabase:', err);
        alert('Erreur Supabase: ' + err.message);
        return;
      }
    } else {
      localStorage.setItem(`blueston_store_${store.slug}`, JSON.stringify(updatedStore));
      alert(`Design "${templateOptions.find(t => t.id === templateId)?.name}" appliqué localement !`);
    }
  };

  // Sauvegarder les réglages généraux de la boutique
  const handleSaveStore = async (e) => {
    e.preventDefault();
    const updatedStore = {
      ...store,
      ...storeForm
    };

    if (supabase) {
      try {
        const { error } = await supabase
          .from('stores')
          .update({
            name: storeForm.name,
            description: storeForm.description,
            whatsapp_number: storeForm.whatsapp_number,
            logo_url: storeForm.logo_url,
            cover_url: storeForm.cover_url,
            theme_color: storeForm.theme_color
          })
          .eq('id', store.id);

        if (error) throw error;
        alert("Paramètres de la boutique enregistrés sur Supabase !");
      } catch (err) {
        console.error("Erreur de sauvegarde Supabase:", err);
        alert("Erreur lors de l'enregistrement sur Supabase: " + err.message);
        return;
      }
    } else {
      localStorage.setItem(`blueston_store_${store.slug}`, JSON.stringify(updatedStore));
      alert("Paramètres de la boutique enregistrés localement (localStorage) !");
    }
    
    document.documentElement.style.setProperty('--theme-color', storeForm.theme_color);
  };

  // Ajouter ou Modifier une catégorie
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name) {
      alert("Le nom de la catégorie est obligatoire.");
      return;
    }

    if (!supabase) {
      const activeSlug = slug || store?.slug;
      if (!localStorage.getItem(`blueston_store_${activeSlug}`)) {
        localStorage.setItem(`blueston_store_${activeSlug}`, JSON.stringify(store));
      }
    }

    const catData = {
      store_id: store.id,
      name: newCat.name,
      description: newCat.description,
      image_url: newCat.image_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400',
      icon_url: newCat.icon_url,
      sort_order: categories.length + 1
    };

    if (supabase) {
      try {
        if (editingCatId) {
          const { error } = await supabase
            .from('categories')
            .update(catData)
            .eq('id', editingCatId);
          if (error) throw error;
          alert(`Catégorie "${newCat.name}" modifiée !`);
        } else {
          const { error } = await supabase
            .from('categories')
            .insert([catData]);
          if (error) throw error;
          alert(`Catégorie "${newCat.name}" ajoutée !`);
        }
      } catch (err) {
        console.error("Erreur catégorie Supabase:", err);
        alert("Erreur Supabase: " + err.message);
        return;
      }
    } else {
      let updatedCategories;
      if (editingCatId) {
        updatedCategories = categories.map(c => 
          c.id === editingCatId ? { ...c, ...newCat } : c
        );
        alert(`Catégorie "${newCat.name}" modifiée localement !`);
      } else {
        const categoryId = `cat-${Date.now()}`;
        const categoryToAdd = {
          ...catData,
          id: categoryId
        };
        updatedCategories = [...categories, categoryToAdd];
        alert(`Catégorie "${newCat.name}" ajoutée localement !`);
      }
      localStorage.setItem(`blueston_categories_${store.slug}`, JSON.stringify(updatedCategories));
    }
    
    cancelEdit();
    window.location.reload();
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?`)) {
      if (supabase) {
        try {
          const { error } = await supabase.from('categories').delete().eq('id', categoryId);
          if (error) throw error;
          alert("Catégorie supprimée de Supabase !");
        } catch (err) {
          console.error("Erreur suppression catégorie Supabase:", err);
          alert("Erreur Supabase: " + err.message);
          return;
        }
      } else {
        const updatedCategories = categories.filter(c => c.id !== categoryId);
        localStorage.setItem(`blueston_categories_${store.slug}`, JSON.stringify(updatedCategories));
        alert("Catégorie supprimée localement !");
      }
      window.location.reload();
    }
  };

  // Ajouter ou Modifier un produit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      alert("Le nom et le prix sont obligatoires.");
      return;
    }

    if (!supabase) {
      const activeSlug = slug || store?.slug;
      if (!localStorage.getItem(`blueston_store_${activeSlug}`)) {
        localStorage.setItem(`blueston_store_${activeSlug}`, JSON.stringify(store));
      }
    }

    const parsedSizes = sizesInput ? sizesInput.split(',').map(s => s.trim()).filter(Boolean) : ['Standard'];
    const parsedColors = colorsInput ? colorsInput.split(',').map(c => c.trim()).filter(Boolean) : ['Unique'];

    const prodData = {
      store_id: store.id,
      category_id: newProd.category_id || null,
      name: newProd.name,
      description: newProd.description,
      price: parseFloat(newProd.price),
      currency: store.currency || 'FCFA',
      image_url: newProd.image_url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600',
      sizes: parsedSizes,
      colors: parsedColors,
      is_available: newProd.is_available,
      sort_order: products.length + 1
    };

    if (supabase) {
      try {
        if (editingProdId) {
          const { error } = await supabase
            .from('products')
            .update(prodData)
            .eq('id', editingProdId);
          if (error) throw error;
          alert(`Produit "${newProd.name}" modifié !`);
        } else {
          const { error } = await supabase
            .from('products')
            .insert([prodData]);
          if (error) throw error;
          alert(`Produit "${newProd.name}" ajouté !`);
        }
      } catch (err) {
        console.error("Erreur produit Supabase:", err);
        alert("Erreur Supabase: " + err.message);
        return;
      }
    } else {
      let updatedProducts;
      if (editingProdId) {
        updatedProducts = products.map(p => 
          p.id === editingProdId ? { ...p, ...prodData } : p
        );
        alert(`Produit "${newProd.name}" modifié localement !`);
      } else {
        const productId = `prod-${Date.now()}`;
        updatedProducts = [{ ...prodData, id: productId }, ...products];
        alert(`Produit "${newProd.name}" ajouté localement !`);
      }
      localStorage.setItem(`blueston_products_${store.slug}`, JSON.stringify(updatedProducts));
    }

    cancelEdit();
    window.location.reload();
  };

  // Supprimer un produit
  const handleDeleteProduct = async (productId, productName) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?`)) {
      if (supabase) {
        try {
          const { error } = await supabase.from('products').delete().eq('id', productId);
          if (error) throw error;
          alert("Produit supprimé !");
        } catch (err) {
          console.error("Erreur suppression produit Supabase:", err);
          alert("Erreur Supabase: " + err.message);
          return;
        }
      } else {
        const updatedProducts = products.filter(p => p.id !== productId);
        localStorage.setItem(`blueston_products_${store.slug}`, JSON.stringify(updatedProducts));
        alert("Produit supprimé localement !");
      }
      window.location.reload();
    }
  };

  const toggleProductAvailability = async (product) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ is_available: !product.is_available })
          .eq('id', product.id);
        if (error) throw error;
      } catch (err) {
        console.error(err);
        return;
      }
    } else {
      const updatedProducts = products.map(p => p.id === product.id ? { ...p, is_available: !p.is_available } : p);
      localStorage.setItem(`blueston_products_${store.slug}`, JSON.stringify(updatedProducts));
    }
    window.location.reload();
  };

  return (
    <div className="admin-layout fade-in">
      {/* Sidebar Admin */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to={`/c/catalogue/${slug}`} className="admin-back-btn">
            &larr; Voir boutique
          </Link>
        </div>
        <nav className="admin-nav-list">
          <button 
            onClick={() => setActiveTab('general')} 
            className={`admin-nav-item ${activeTab === 'general' ? 'active' : ''}`}
          >
            ⚙️ Général
          </button>
          <button 
            onClick={() => setActiveTab('design')} 
            className={`admin-nav-item ${activeTab === 'design' ? 'active' : ''}`}
          >
            🎨 Design & Template
          </button>
          <button 
            onClick={() => setActiveTab('categories')} 
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
          >
            📁 Catégories
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
          >
            📦 Produits
          </button>
        </nav>
      </aside>

      {/* Zone principale */}
      <main className="admin-main-content">
        <header className="admin-header">
          <h2 className="admin-title">
            {activeTab === 'general' && 'Réglages de la Boutique'}
            {activeTab === 'design' && 'Personnalisation Visuelle'}
            {activeTab === 'categories' && 'Gestion des Catégories'}
            {activeTab === 'products' && 'Gestion du Catalogue'}
          </h2>
        </header>

        {/* --- ONGLET 1 : GÉNÉRAL --- */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveStore} className="admin-card fade-in">
            <h3 className="admin-card-title">Identité de la Boutique</h3>
            
            <div className="form-group">
              <label className="form-label">Nom de la boutique</label>
              <input 
                type="text" 
                className="form-input" 
                value={storeForm.name} 
                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description commerciale</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                value={storeForm.description} 
                onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Numéro WhatsApp (Commande)</label>
              <input 
                type="text" 
                className="form-input" 
                value={storeForm.whatsapp_number} 
                onChange={(e) => setStoreForm({ ...storeForm, whatsapp_number: e.target.value })} 
                placeholder="Ex: 22997000000"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Logo</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="text" className="form-input" value={storeForm.logo_url} onChange={(e) => setStoreForm({ ...storeForm, logo_url: e.target.value })} placeholder="URL du logo" />
                  <input type="file" onChange={(e) => handleFileUpload(e, 'store', 'store-logo')} disabled={isUploading} style={{ width: '150px' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bannière (Cover)</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="text" className="form-input" value={storeForm.cover_url} onChange={(e) => setStoreForm({ ...storeForm, cover_url: e.target.value })} placeholder="URL de bannière" />
                  <input type="file" onChange={(e) => handleFileUpload(e, 'store', 'store-cover')} disabled={isUploading} style={{ width: '150px' }} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Enregistrer les réglages</button>
          </form>
        )}

        {/* --- ONGLET 2 : DESIGN --- */}
        {activeTab === 'design' && (
          <div className="admin-card fade-in">
            <h3 className="admin-card-title">Choix du Template</h3>
            <div className="admin-templates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {templateOptions.map(opt => (
                <div 
                  key={opt.id} 
                  className={`template-card ${selectedTemplate === opt.id ? 'active' : ''}`} 
                  onClick={() => handleSaveTemplate(opt.id)}
                  style={{
                    padding: 20,
                    borderRadius: 'var(--radius-md)',
                    border: selectedTemplate === opt.id ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: selectedTemplate === opt.id ? 'var(--bg-tertiary)' : 'white'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 15 }}>{opt.emoji}</div>
                  <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{opt.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 15 }}>{opt.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {opt.features.map(f => <span key={f} className="badge-info" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{f}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ONGLET 3 : CATÉGORIES --- */}
        {activeTab === 'categories' && (
          <div className="fade-in">
            <form onSubmit={handleAddCategory} className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>
                  {editingCatId ? "📝 Modifier la catégorie" : "📁 Nouvelle catégorie"}
                </h3>
                {editingCatId && (
                  <button type="button" onClick={cancelEdit} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    Annuler
                  </button>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Nom</label>
                <input type="text" className="form-input" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows="2" value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Icône (Emoji ou URL)</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input type="text" className="form-input" value={newCat.icon_url} onChange={(e) => setNewCat({ ...newCat, icon_url: e.target.value })} />
                    <input type="file" onChange={(e) => handleFileUpload(e, 'category-icon', 'category-icon')} disabled={isUploading} style={{ width: '150px' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bannière</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input type="text" className="form-input" value={newCat.image_url} onChange={(e) => setNewCat({ ...newCat, image_url: e.target.value })} />
                    <input type="file" onChange={(e) => handleFileUpload(e, 'category', 'category')} disabled={isUploading} style={{ width: '150px' }} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                {editingCatId ? "Mettre à jour la catégorie" : "Créer la catégorie"}
              </button>
            </form>

            <div className="admin-card">
              <h3 className="admin-card-title">Liste des Catégories</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Nom</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                  <tbody>{categories.map(cat => (
                    <tr key={cat.id}>
                      <td><strong>{cat.name}</strong></td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => startEditCategory(cat)} className="btn btn-secondary" style={{ marginRight: 10, fontSize: '0.8rem', padding: '6px 12px' }}>Modifier</button>
                        <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="btn btn-secondary" style={{ color: 'red', fontSize: '0.8rem', padding: '6px 12px' }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- ONGLET 4 : PRODUITS --- */}
        {activeTab === 'products' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button onClick={() => { if(showAddProductForm) cancelEdit(); setShowAddProductForm(!showAddProductForm); }} className="btn btn-accent">
                {showAddProductForm ? "Fermer le formulaire" : "＋ Ajouter un produit"}
              </button>
            </div>

            {showAddProductForm && (
              <form onSubmit={handleAddProduct} className="admin-card fade-in">
                <h3 className="admin-card-title">{editingProdId ? "📝 Modifier le produit" : "📦 Fiche produit"}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input type="text" className="form-input" value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prix (FCFA)</label>
                    <input type="number" className="form-input" value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: e.target.value })} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Catégorie</label>
                    <select className="form-select" value={newProd.category_id} onChange={(e) => setNewProd({ ...newProd, category_id: e.target.value })}>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input type="text" className="form-input" value={newProd.image_url} onChange={(e) => setNewProd({ ...newProd, image_url: e.target.value })} />
                      <input type="file" onChange={(e) => handleFileUpload(e, 'product', 'product')} disabled={isUploading} style={{ width: '150px' }} />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tailles (virgules)</label>
                    <input type="text" className="form-input" value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} placeholder="S, M, L..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Couleurs (virgules)</label>
                    <input type="text" className="form-input" value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} placeholder="Noir, Blanc..." />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows="3" value={newProd.description} onChange={(e) => setNewProd({ ...newProd, description: e.target.value })} />
                </div>

                <div style={{ display: 'flex', gap: 15 }}>
                  <button type="submit" className="btn btn-primary">{editingProdId ? "Enregistrer les modifications" : "Enregistrer le produit"}</button>
                  {editingProdId && <button type="button" onClick={cancelEdit} className="btn btn-secondary">Annuler</button>}
                </div>
              </form>
            )}

            <div className="admin-card">
              <h3 className="admin-card-title">Catalogue Produits</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Image</th><th>Nom</th><th>Prix</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                  <tbody>{products.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.image_url} alt={p.name} className="product-row-img" /></td>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.price.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => startEditProduct(p)} className="btn btn-secondary" style={{ marginRight: 10, fontSize: '0.8rem', padding: '6px 12px' }}>Modifier</button>
                        <button onClick={() => handleDeleteProduct(p.id, p.name)} className="btn btn-secondary" style={{ color: 'red', fontSize: '0.8rem', padding: '6px 12px' }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
