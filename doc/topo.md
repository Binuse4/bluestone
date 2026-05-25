# BLUE'STON Connect — Topo Technique

> **État d'avancement** — Dernière mise à jour : 25 mai 2026
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
│   │   │   ├── ProductCard.jsx  # Carte produit avec 4 variantes visuelles + compare_price
│   │   │   └── CategoryCard.jsx # Carte catégorie (avec icône overlay optionnelle)
│   │   └── cart/
│   │       └── CartDrawer.jsx   # Panier latéral (drawer) + code promo
│   │
│   ├── pages/
│   │   ├── StorefrontPage.jsx   # Homepage de la boutique (4 rendus : hero, catégories, featured)
│   │   ├── CatalogPage.jsx      # Grille catalogue avec 4 rendus + vue favoris + focus search
│   │   ├── ProductPage.jsx      # Fiche produit avec 4 rendus + galerie images + sync couleur→image
│   │   ├── NotFoundPage.jsx     # Page 404
│   │   └── admin/
│   │       └── DashboardPage.jsx # Console admin (CRUD catégories/produits + edit + template + upload)
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
| **Catalogue complet** | Grille de produits, barre de recherche, filtres par catégorie, vue favoris intégrée | `CatalogPage.jsx` |
| **Fiche produit** | Galerie d'images, prix + ancien prix barré, sélecteurs taille/couleur, quantité, ajout panier | `ProductPage.jsx` |
| **Panier latéral** | Drawer animé, modification quantités, suppression, code promo, récap prix | `CartDrawer.jsx` |
| **Commande WhatsApp** | Le bouton "Commander" génère un lien WhatsApp avec le récapitulatif du panier formaté | `whatsapp.js` |
| **Vue Favoris** | Accessible via `?view=favorites`, filtre les produits likés, bouton retour au catalogue | `CatalogPage.jsx` |
| **Focus Search** | Accessible via `?focus=search`, focus automatique sur la barre de recherche | `CatalogPage.jsx` |

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

### ✅ Codes Promotionnels

| Code | Type | Règle |
|---|---|---|
| `BLUESTON10` | -10% | Pourcentage sur le total |
| `WELCOME5000` | -5 000 FCFA | Remise fixe (si panier ≥ 15 000 FCFA) |
| `FREE2026` | -100% | Démo : gratuit total |

- Champ de saisie dans le `CartDrawer`, validation instantanée
- Recalcul automatique quand le panier change (`useEffect` sur `cartTotal`)
- Montant de la réduction affiché dans le récap
- Inclus dans le message WhatsApp

### ✅ Upload d'Images (Supabase Storage)

- Module `storage.js` pour uploader des fichiers vers le bucket `assets`
- Utilisé dans l'admin pour : logo, couverture, icône de catégorie, images de catégories, images de produits
- Les images sont organisées en sous-dossiers par boutique : `{slug}/store/`, `{slug}/product/`, `{slug}/category-icon/`, etc.
- Indicateur `isUploading` pour feedback visuel pendant l'upload

### ✅ Espace Admin (Dashboard)

| Section | Actions |
|---|---|
| **Général** | Modifier nom, description, WhatsApp, adresse, logo (URL + upload), couverture (URL + upload) |
| **Design & Template** | Choisir parmi 4 templates visuels (sélecteur visuel avec descriptions + features) |
| **Catégories** | **Ajouter / Modifier / Supprimer** des catégories (avec icône emoji/URL + bannière + upload) |
| **Produits** | **Ajouter / Modifier / Supprimer** des produits (tailles, couleurs, prix comparé, image URL + upload) |

Fonctionnalités admin récentes :
- **Mode édition** : boutons "Modifier" sur chaque catégorie et produit dans les tableaux
- **`editingCatId` / `editingProdId`** : états pour basculer entre création et modification
- **`cancelEdit()`** : réinitialise tous les formulaires et sort du mode édition
- **`startEditCategory(cat)`** / **`startEditProduct(prod)`** : pré-rempli les formulaires
- **`handleFileUpload(e, type, target)`** : upload d'image vers Supabase Storage avec routing vers le bon champ
- **Icônes prédéfinies** : palette d'emojis (`iconBase`) pour faciliter le choix d'icônes de catégories
- **Champ `compare_price`** : ancien prix dans le formulaire produit
- **Champ `address`** : adresse physique de la boutique (lien Google Maps sur la homepage)
- Toutes les actions CRUD fonctionnent avec **Supabase** (si connecté) ou **localStorage** (mode local)

---

## 4. Système de Templates Dynamiques (4 templates)

### Architecture

```
ThemeContext → body.classList → theme-{name} → CSS overrides + JSX conditionnel
```

Chaque composant (Header, CatalogPage, ProductCard, ProductPage, StorefrontPage) a des blocs `if (template === '...')` qui retournent un rendu JSX complètement différent par template.

### Les 4 Templates

| Aspect | 🏛 Élégance | 🎨 Vitrine | ⬜ Minimal | 🔴 Modern Red |
|---|---|---|---|---|
| **Style global** | App-style moderne | Masonry éditorial | Ultra-épuré | Soft UI gris + rouge vif |
| **Header** | Titre centré "Explorer", icônes recherche/favoris/panier | Logo + titre, bouton Admin | Logo minimaliste, texte uppercase, icônes fines | Logo arrondi + titre, accent rouge `#EF4444` |
| **Homepage** | Hero banner + profil centré + badges + catégories + sélection du moment | Full-screen banner + description + collections | Banner arrondi + logo + titre géant + lien catalogue | Banner 30vh + card arrondie remontée + produits vedettes |
| **Catalogue** | Profil boutique, bannière discount sneaker, catégories pills avec icônes | Barre de recherche + bannière promo lavande + masonry cascade | Barre de recherche seule + catégories soulignées + grille | Barre de recherche gris + pills rouges + grille 2-4 col |
| **Cards** | `modern-card` : image flottante inclinée, ombre de profondeur, rating ⭐ | `minimal-card` : fond gris, cascade hauteurs variées | `refine-card` : image + infos épurées, like overlay | `mr-card` : fond `#E8E8E8`, prix ancien/nouveau, like rouge |
| **Fiche produit** | Galerie inclinée + thumbnails, couleurs en dots, tailles en pills, rating | Image pleine + thumbnails, rating + avis, options taille/couleur | Simple 1 colonne, sélecteurs minimalistes | Panneau arrondi 40px, swatches couleur, tailles en cercles |
| **Couleur accent** | Bleu `#3b82f6` | Noir `#111` | Noir `#121212` | Rouge `#EF4444` |
| **CSS** | `elegance.css` | `vitrine.css` | `minimal.css` | `modern-red.css` |

### Détails des rendus JSX par composant

Chaque composant a des branches conditionnelles complètes :

- **Header.jsx** (4 variantes) : `minimal` → texte uppercase + icônes fines, `modern-red` → logo arrondi 10px + titre + accent, `vitrine` → logo + titre crème, `elegance` → titre centré "Explorer"
- **ProductCard.jsx** (4 variantes + fallback) : chaque template a son propre layout de carte, bouton like, affichage prix (avec `compare_price` barré si disponible)
- **CatalogPage.jsx** (4 rendus) : `modern-red` → pills rouges + recherche + grille, `vitrine` → masonry + bannière promo, `minimal` → recherche + catégories texte, `elegance` → profil boutique + bannière discount + catégories pills. Tous incluent la vue favoris (`?view=favorites`) et le focus search (`?focus=search`)
- **ProductPage.jsx** (4 rendus + fallback) : `modern-red` → galerie + panneau arrondi + swatches couleur + tailles cercle, `vitrine` → galerie thumbnails + rating + options pilules, `elegance` → galerie inclinée + dots couleur + tailles pilules, `minimal` → image + infos simples. Tous incluent le `compare_price` barré et la sync couleur→image
- **StorefrontPage.jsx** (4 rendus) : `modern-red` → banner + card remontée + produits vedettes, `vitrine` → full-screen banner + collections, `minimal` → banner arrondi + titre géant, `elegance` → hero + profil + catégories + sélection du moment

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
  icon_url TEXT,              -- Emoji ou URL d'icône (affiché sur la carte catégorie)
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
  image_url TEXT,              -- Image principale (rétro-compatibilité)
  product_images TEXT[],       -- Multiples images (galerie)
  sizes TEXT[],                -- ex: {'S', 'M', 'L', 'XL'}
  colors TEXT[],               -- ex: {'Blanc', 'Noir', 'Ocre'}
  is_available BOOLEAN,
  sort_order INT
)
```

### Row Level Security (RLS)

- **Lecture publique** activée sur les 3 tables (tout le monde peut voir les catalogues)
- **Écriture publique temporaire** (pour la démo, à restreindre plus tard avec auth)

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
- Persistance automatique dans `localStorage` (`blueston_cart`)
- Recalcul automatique de la réduction promo quand le panier change

### Thème (ThemeContext)

- **4 templates valides** : `['elegance', 'vitrine', 'minimal', 'modern-red']`
- `useTheme()` retourne `{ template, setTemplate, VALID_TEMPLATES }`
- `setTemplate('vitrine')` → retire toutes les classes `theme-*` du body et ajoute `theme-vitrine`
- Synchro automatique : `StoreLayout` lit `store.template` et appelle `setTemplate()` au chargement

### Color Hex Mapping

`getColorHex(colorName)` dans `ProductPage.jsx` :
- Mapping de 24 noms de couleurs français → codes hex (Noir, Blanc, Rouge, Bleu, Vert, Jaune, Marron, Gris, Rose, Ocre, Indigo, Camel)
- Fallback : `#CCCCCC` si couleur non reconnue
- Utilisé pour les swatches de couleur sur les fiches produit (dots circulaires)

### Sync Couleur → Image

- `useEffect` sur `selectedColor` dans `ProductPage.jsx`
- Quand une couleur est sélectionnée, `mainImageIndex` est mis à jour avec l'index correspondant dans `product_images`
- Permet d'afficher automatiquement l'image du produit dans la couleur choisie

### WhatsApp

- `generateWhatsAppLink(store, cartItems, totalPrice, promoDetails)`
- Format du message : numéro, nom boutique, liste produits (nom, taille, couleur, quantité), sous-total, réduction, total

### Upload d'images (storage.js)

- `uploadFile(file, bucket, path)` → retourne l'URL publique du fichier uploadé
- Bucket `assets` sur Supabase Storage, organisé par slug de boutique

### Rendu conditionnel par template

Chaque composant majeur utilise des blocs `if (template === '...') return (...)` en haut du rendu pour retourner un JSX complètement différent selon le template actif. Pas de rendu fallback par défaut dans CatalogPage (retourne `null`).

---

## 7. Ce qui reste à faire

### Migrations SQL (à exécuter sur Supabase)

```sql
-- Nouveaux champs ajoutés depuis la création initiale :
ALTER TABLE stores ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'elegance';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS address TEXT;
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
- [ ] Configurer Supabase Storage (bucket `assets` en public + policies INSERT/SELECT/UPDATE/DELETE)

### Post-démo (roadmap)

- [ ] Authentification admin (login/mot de passe)
- [ ] Upload multiple d'images (galerie produit via le formulaire admin)
- [ ] Gestion des stocks avancée (quantités par taille/couleur)
- [ ] Multi-boutiques (déjà architecturé avec le slug)
- [ ] Notifications push / PWA
- [ ] Analytics et statistiques (vues, ajouts panier, commandes)
- [ ] Système de promotions dynamiques (taux de réduction par catégorie depuis l'admin)
- [ ] Page favoris dédiée (actuellement intégrée dans CatalogPage via `?view=favorites`)
