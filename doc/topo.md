# BLUE'STON Connect — Topo Technique

> **État d'avancement** — Dernière mise à jour : 26 mai 2026
> Ce fichier documente tout ce qui a été développé et implémenté jusqu'à aujourd'hui.

---

## 1. Setup Initial du Projet

### Stack mise en place

| Couche | Technologie | Détails |
|--------|------------|---------|
| **Framework** | Vite + React | Projet initialisé avec `create-vite`, build rapide |
| **Routing** | React Router v7 | Navigation SPA entre pages |
| **Base de données** | Supabase (PostgreSQL) | Tables `stores`, `categories`, `products` |
| **Storage** | Supabase Storage | Bucket `assets` pour upload d'images |
| **Données locales** | localStorage | Fallback quand Supabase n'est pas configuré |
| **Styling** | Vanilla CSS | Design system avec variables CSS (pas de Tailwind) |
| **Typo** | Google Fonts (Poppins) | Police principale pour tous les templates |

### Connexion Supabase

- **URL** : `https://qyqmcdaufnrptndfgxwe.supabase.co`
- **Clé publique** : configurée dans `.env` via `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- **Fallback** : si les variables d'env sont absentes, l'app fonctionne entièrement en mode local avec `localStorage` + `mock-store.json`

---

## 2. Arborescence du Projet

```
BlueStone/
├── doc/
│   ├── context.md              # Contexte projet (specs, vision)
│   └── topo.md                 # Ce fichier (avancement technique)
├── supabase/
│   └── schema.sql              # Schéma SQL + seed de démo
├── src/
│   ├── main.jsx                # Point d'entrée React
│   ├── App.jsx                 # Routes + Providers (Cart, Theme)
│   ├── index.css               # Imports CSS globaux (4 templates)
│   │
│   ├── context/
│   │   ├── CartContext.jsx      # Gestion du panier + codes promo (état global)
│   │   └── ThemeContext.jsx     # Gestion du template actif (4 templates)
│   │
│   ├── hooks/
│   │   └── useStoreData.js     # Hook principal : charge store/catégories/produits
│   │
│   ├── lib/
│   │   ├── supabase.js         # Client Supabase (ou null si non configuré)
│   │   ├── storage.js          # Upload d'images vers Supabase Storage
│   │   └── whatsapp.js         # Génération du lien WhatsApp pré-rempli
│   │
│   ├── data/
│   │   └── mock-store.json     # Données mockées (1 boutique, 4 catégories, ~32 produits)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.jsx      # Header avec 4 variantes (elegance, vitrine, minimal, modern-red)
│   │   ├── catalog/
│   │   │   ├── ProductCard.jsx  # Carte produit (4 variantes + fallback) + badge RUPTURE + compare_price
│   │   │   └── CategoryCard.jsx # Carte catégorie (icône masquée sur Élégance)
│   │   └── cart/
│   │       └── CartDrawer.jsx   # Panier latéral (drawer) + code promo
│   │
│   ├── pages/
│   │   ├── StorefrontPage.jsx   # Homepage boutique (4 rendus template-aware, featured products)
│   │   ├── CatalogPage.jsx      # Catalogue (4 rendus + fallback, favoris, search, promo banner)
│   │   ├── ProductPage.jsx      # Fiche produit (4 rendus + galerie + sync couleur→image)
│   │   ├── NotFoundPage.jsx     # Page 404
│   │   └── admin/
│   │       └── DashboardPage.jsx # Console admin (CRUD, edit, template, upload, promo)
│   │
│   └── styles/
│       ├── index.css            # Variables CSS globales, reset, animations
│       ├── components.css       # Styles des composants (header, cards, panier)
│       ├── pages.css            # Styles des pages (hero, catalogue, admin)
│       └── themes/
│           ├── elegance.css     # Template Élégance (App-style moderne)
│           ├── vitrine.css      # Template Vitrine (Masonry/Crème)
│           ├── minimal.css      # Template Minimal (Ultra-propre)
│           └── modern-red.css   # Template Modern Red (Soft UI rouge)
└── .env                         # Variables d'environnement Supabase
```

---

## 3. Fonctionnalités Implémentées

### ✅ Catalogue Public (Pages Client)

| Fonctionnalité | Description | Fichier principal |
|---|---|---|
| **Homepage boutique** | Hero banner, profil boutique centré, grille catégories, produits vedettes (4 rendus par template) | `StorefrontPage.jsx` |
| **Catalogue complet** | Grille produits, recherche, filtres catégories, vue favoris, bannière promo dynamique | `CatalogPage.jsx` |
| **Fiche produit** | Galerie d'images, prix + ancien prix barré, sélecteurs taille/couleur, quantité, ajout panier | `ProductPage.jsx` |
| **Panier latéral** | Drawer animé, modification quantités, suppression, code promo, récap prix | `CartDrawer.jsx` |
| **Commande WhatsApp** | Bouton "Commander" → lien WhatsApp avec récapitulatif panier formaté | `whatsapp.js` |
| **Vue Favoris** | `?view=favorites` → filtre les produits likés, bouton retour au catalogue | `CatalogPage.jsx` |
| **Focus Search** | `?focus=search` → auto-focus sur la barre de recherche | `CatalogPage.jsx` |

### ✅ Gestion de la Disponibilité (Rupture de Stock)

Tous les templates affichent visuellement les produits en rupture :
- **Badge "RUPTURE"** affiché en overlay sur la carte produit
- **Image en grayscale** (`filter: grayscale(1)`) quand `is_available === false`
- **Opacité réduite** de la carte (0.6 à 0.8 selon le template)
- Les produits en rupture restent visibles dans le catalogue (pas filtrés) mais sont clairement identifiés
- Style du badge adapté à chaque template : bleu arrondi (elegance), noir texte (minimal), fond semi-transparent (vitrine), rouge vif (modern-red)

### ✅ Options Produits

| Option | Détail |
|---|---|
| **Tailles** | Stockées en `TEXT[]` PostgreSQL (ex: `['S', 'M', 'L', 'XL']`), pastilles interactives |
| **Couleurs** | Stockées en `TEXT[]`, pastilles de couleur avec mapping nom → hex (`getColorHex()`) |
| **Images multiples** | Champ `product_images TEXT[]` pour galerie d'images par produit |
| **Sync couleur → image** | Sélectionner une couleur change automatiquement l'image affichée (index) |
| **Prix comparé** | Champ `compare_price DECIMAL` pour afficher l'ancien prix barré |
| **Clé panier unique** | Combinaison `id + size + color` → un même produit en 2 tailles = 2 lignes de panier |

### ✅ Système de Favoris (Likes)

- Bouton cœur flottant sur chaque `ProductCard` (4 variantes) et sur la fiche produit
- Lien favoris dans le header (icône cœur) → `/explore?view=favorites`
- Callback `onLikeToggle` de ProductCard vers CatalogPage pour réactivité temps réel
- Persistance dans `localStorage` (`blueston_likes`)
- Toggle visuel instantané (cœur rempli en rouge `#ef4444` si liké)

### ✅ Système de Promotions

#### Promotions dynamiques (admin)
- Champs `promo_active` (BOOLEAN), `promo_rate` (INT, pourcentage), `promo_category_id` (UUID, optionnel) dans le store
- Configurables depuis l'admin
- Affichage conditionnel dans le catalogue :
  - **Élégance** : bannière discount avec images sneakers flottantes + texte dynamique
  - **Vitrine** : bannière promo lavande avec le taux et la catégorie ciblée
- Si `promo_category_id` est renseigné → promo ciblée sur une catégorie
- Si vide → promo sur toute la boutique

#### Codes promotionnels (panier)
| Code | Type | Règle |
|---|---|---|
| `BLUESTON10` | -10% | Pourcentage sur le total |
| `WELCOME5000` | -5 000 FCFA | Remise fixe (si panier ≥ 15 000 FCFA) |
| `FREE2026` | -100% | Démo : gratuit total |

- Champ de saisie dans le `CartDrawer`, validation instantanée
- Recalcul automatique quand le panier change
- Inclus dans le message WhatsApp

### ✅ Upload d'Images (Supabase Storage)

- Module `storage.js` pour uploader des fichiers vers le bucket `assets`
- Utilisé dans l'admin pour : logo, couverture, icône de catégorie, images de catégories, images de produits
- Sous-dossiers par boutique : `{slug}/store/`, `{slug}/product/`, `{slug}/category-icon/`, etc.
- Indicateur `isUploading` pour feedback visuel

### ✅ Espace Admin (Dashboard)

| Section | Actions |
|---|---|
| **Général** | Modifier nom, description, WhatsApp, adresse, logo + cover (URL + upload) |
| **Design & Template** | Choisir parmi 4 templates visuels (sélecteur avec descriptions + features) |
| **Catégories** | **Ajouter / Modifier / Supprimer** (icône emoji/URL + bannière + upload) |
| **Produits** | **Ajouter / Modifier / Supprimer** (tailles, couleurs, prix comparé, image + upload) |

Fonctionnalités admin :
- **Mode édition** : boutons "Modifier" sur chaque catégorie et produit dans les tableaux
- **`editingCatId` / `editingProdId`** : états pour basculer entre création et modification
- **`cancelEdit()`** : réinitialise tous les formulaires et sort du mode édition
- **`startEditCategory(cat)` / `startEditProduct(prod)`** : pré-rempli les formulaires
- **Upload fichiers** : `handleFileUpload(e, type, target)` avec routing vers le bon champ
- **Icônes prédéfinies** : palette d'emojis (`iconBase`) pour choix rapide d'icônes
- **Champ `compare_price`** : ancien prix dans le formulaire produit
- **Champ `address`** : adresse physique (lien Google Maps sur la homepage)
- **Promotions** : `promo_active`, `promo_rate`, `promo_category_id` configurables
- Toutes les actions CRUD → **Supabase** (si connecté) ou **localStorage** (mode local)

---

## 4. Système de Templates Dynamiques (4 templates)

### Architecture

```
ThemeContext → body.classList → theme-{name} → CSS overrides + JSX conditionnel
```

Chaque composant (Header, CatalogPage, ProductCard, ProductPage, StorefrontPage, CategoryCard) a des rendus conditionnels par template.

### Les 4 Templates

| Aspect | 🏛 Élégance | 🎨 Vitrine | ⬜ Minimal | 🔴 Modern Red |
|---|---|---|---|---|
| **Style global** | App-style moderne | Masonry éditorial | Ultra-épuré | Soft UI gris + rouge vif |
| **Header** | Titre centré "Explorer", icônes recherche/favoris/panier | Logo + titre, bouton Admin | Logo minimaliste, uppercase, icônes fines | Logo arrondi + titre, accent `#EF4444` |
| **Homepage** | Hero + profil centré + badges maps/whatsapp + catégories + sélection du moment | Full-screen banner + description + collections | Banner arrondi + logo + titre géant + lien catalogue | Banner 30vh + card arrondie remontée + produits vedettes |
| **Catalogue** | Profil boutique + bannière promo dynamique + pills catégories (sans icônes) + recherche | Recherche + bannière promo dynamique + masonry cascade + badges catégories avec icônes | Recherche + catégories soulignées + grille | Recherche gris + pills rouges + grille 2-4 col |
| **Cards** | `modern-card` : image flottante inclinée, ombre, rating ⭐, badge RUPTURE bleu | `minimal-card` : fond gris, cascade, badge RUPTURE noir | `refine-card` : image + infos épurées, like overlay, badge RUPTURE noir | `mr-card` : fond `#E8E8E8`, prix ancien/nouveau, badge RUPTURE rouge |
| **Fiche produit** | Galerie inclinée + thumbnails, dots couleur, pills taille, rating | Image + thumbnails, rating + avis, options taille/couleur | Simple 1 colonne, sélecteurs minimalistes | Panneau arrondi 40px, swatches couleur, tailles cercles |
| **Catégorie card** | Image + titre + desc (pas d'icône overlay) | Image + titre + desc + icône overlay | Image + titre + desc + icône overlay | Image + titre + desc + icône overlay |
| **Couleur accent** | Bleu `#3b82f6` | Noir `#111` | Noir `#121212` | Rouge `#EF4444` |
| **CSS** | `elegance.css` | `vitrine.css` | `minimal.css` | `modern-red.css` |

### Détails des rendus JSX par composant

- **Header.jsx** (4 variantes) : `minimal` → uppercase + icônes fines, `modern-red` → logo arrondi + accent, `vitrine` → logo + titre crème, `elegance` → titre centré "Explorer"
- **ProductCard.jsx** (4 variantes + fallback) : chaque template a son layout, like, `compare_price` barré, badge RUPTURE stylé, grayscale si indisponible
- **CatalogPage.jsx** (4 rendus + fallback) : chaque template a sa recherche, ses catégories, sa vue favoris, sa bannière promo dynamique (elegance + vitrine)
- **ProductPage.jsx** (4 rendus + fallback) : galerie, couleurs dots/pills, tailles, `compare_price`, sync couleur→image
- **StorefrontPage.jsx** (4 rendus) : homepage complète par template avec featured products, liens Maps/WhatsApp
- **CategoryCard.jsx** : icône overlay masquée pour `elegance` (`template !== 'elegance'`)

---

## 5. Base de Données (Supabase)

### Schéma SQL

```sql
-- Table des Boutiques
stores (
  id UUID PK,
  slug TEXT UNIQUE,          -- URL : /c/catalogue/{slug}
  name TEXT,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  whatsapp_number TEXT,
  address TEXT,               -- Adresse physique (lien Google Maps)
  theme_color TEXT,           -- ex: '#8c6239'
  template TEXT,              -- 'elegance' | 'vitrine' | 'minimal' | 'modern-red'
  promo_active BOOLEAN,       -- Promotion active ?
  promo_rate INT,             -- Taux de réduction en %
  promo_category_id UUID,     -- Catégorie ciblée (null = toute la boutique)
  currency TEXT,              -- 'FCFA'
  is_active BOOLEAN,
  created_at, updated_at
)

-- Table des Catégories
categories (
  id UUID PK,
  store_id UUID FK → stores,
  name TEXT,
  description TEXT,
  image_url TEXT,
  icon_url TEXT,              -- Emoji ou URL d'icône (masqué sur Élégance)
  is_selected BOOLEAN,
  sort_order INT
)

-- Table des Produits
products (
  id UUID PK,
  store_id UUID FK → stores,
  category_id UUID FK → categories,
  name TEXT,
  description TEXT,
  price DECIMAL,
  compare_price DECIMAL,      -- Ancien prix (affiché barré si renseigné)
  currency TEXT,
  image_url TEXT,              -- Image principale
  product_images TEXT[],       -- Multiples images (galerie)
  sizes TEXT[],                -- ex: {'S', 'M', 'L', 'XL'}
  colors TEXT[],               -- ex: {'Blanc', 'Noir', 'Ocre'}
  is_available BOOLEAN,
  sort_order INT
)
```

### Row Level Security (RLS)

- **Lecture publique** activée sur les 3 tables
- **Écriture publique temporaire** (à restreindre avec auth plus tard)

### Données de démo (Seed)

- **1 boutique** : "Africa Chic" (slug: `africa-chic`)
- **4 catégories** : Prêt-à-Porter (👕), Maroquinerie (👜), Bijoux d'Art (💍), Chaussures (👟)
- **~10 produits** de démo avec tailles, couleurs et images Unsplash

---

## 6. Patterns & Conventions

### Persistance (useStoreData)

```
Si Supabase configuré ?
  → SELECT * FROM stores/categories/products
Sinon ?
  → Lire localStorage
  → Si vide, initialiser avec mock-store.json
```

### Panier (CartContext)

- **Clé unique** : `cartItemId = productId-size-color`
- Un même produit avec tailles différentes = 2 entrées distinctes
- `addToCart(product, qty, size, color)` / `removeFromCart(cartItemId)` / `updateQuantity(cartItemId, newQty)`
- Persistance auto dans `localStorage` (`blueston_cart`)
- Recalcul automatique de la réduction promo quand le panier change

### Thème (ThemeContext)

- **4 templates valides** : `['elegance', 'vitrine', 'minimal', 'modern-red']`
- `useTheme()` retourne `{ template, setTemplate, VALID_TEMPLATES }`
- `setTemplate('vitrine')` → retire toutes les classes `theme-*` du body et ajoute `theme-vitrine`
- Synchro auto : `StoreLayout` lit `store.template` et appelle `setTemplate()` au chargement

### Filtrage des produits (CatalogPage)

```javascript
const filteredProducts = products.filter(p => {
  const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.description?.toLowerCase().includes(searchQuery);
  const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
  const matchesFavorites = !isFavoritesView || likedIds.includes(p.id);
  return matchesSearch && matchesCategory && matchesFavorites;
});
```
> Les produits en rupture restent visibles dans les résultats — le badge "RUPTURE" est géré côté `ProductCard`.

### Color Hex Mapping

`getColorHex(colorName)` dans `ProductPage.jsx` :
- 24 noms de couleurs français → codes hex (Noir, Blanc, Rouge, Bleu, Vert, Jaune, Marron, Gris, Rose, Ocre, Indigo, Camel)
- Fallback : `#CCCCCC`

### Sync Couleur → Image

- `useEffect` sur `selectedColor` dans `ProductPage.jsx`
- `mainImageIndex` mis à jour avec l'index correspondant dans `product_images`

### WhatsApp

- `generateWhatsAppLink(store, cartItems, totalPrice, promoDetails)`
- Format : numéro, nom boutique, liste produits (nom, taille, couleur, quantité), sous-total, réduction, total

### Upload d'images (storage.js)

- `uploadFile(file, bucket, path)` → URL publique
- Bucket `assets` sur Supabase Storage, organisé par slug

### Rendu conditionnel par template

- Blocs `if (template === '...') return (...)` en haut de chaque composant
- `CatalogPage` a un **rendu fallback** (5ème rendu par défaut avec pills + search basiques)
- `CategoryCard` masque l'icône overlay quand `template === 'elegance'`

---

## 7. Ce qui reste à faire

### Migrations SQL (à exécuter sur Supabase)

```sql
ALTER TABLE stores ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'elegance';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS promo_active BOOLEAN DEFAULT false;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS promo_rate INT DEFAULT 0;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS promo_category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_url TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_selected BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_images TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10,2);
```

### Avant la démo

- [ ] Exécuter les migrations SQL ci-dessus sur Supabase
- [ ] Vérifier le rendu responsive des 4 templates sur mobile
- [ ] Tester le flux complet : scan NFC → catalogue → panier → WhatsApp
- [ ] Déployer sur Vercel (avec variables d'environnement Supabase)
- [ ] Configurer Supabase Storage (bucket `assets` en public + policies)

### Post-démo (roadmap)

- [ ] Authentification admin (login/mot de passe)
- [ ] Upload multiple d'images (galerie produit via formulaire admin)
- [ ] Gestion des stocks avancée (quantités par taille/couleur)
- [ ] Multi-boutiques (déjà architecturé avec le slug)
- [ ] Notifications push / PWA
- [ ] Analytics et statistiques (vues, ajouts panier, commandes)
- [ ] Page favoris dédiée (actuellement intégrée dans CatalogPage via `?view=favorites`)
- [ ] Système de commentaires/avis clients
