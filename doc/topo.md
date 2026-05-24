# BLUE'STON Connect — Topo Technique

> **État d'avancement** — Dernière mise à jour : 24 mai 2026
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
│   │   ├── CartContext.jsx      # Gestion du panier (état global)
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
│   │   └── mock-store.json     # Données mockées (1 boutique, 4 catégories, 32 produits)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.jsx      # Header avec 4 variantes (elegance, vitrine, minimal, modern-red)
│   │   ├── catalog/
│   │   │   ├── ProductCard.jsx  # Carte produit avec 4 variantes visuelles
│   │   │   └── CategoryCard.jsx # Carte catégorie
│   │   └── cart/
│   │       └── CartDrawer.jsx   # Panier latéral (drawer)
│   │
│   ├── pages/
│   │   ├── StorefrontPage.jsx   # Homepage de la boutique (hero, catégories)
│   │   ├── CatalogPage.jsx      # Grille catalogue avec 4 rendus distincts par template
│   │   ├── ProductPage.jsx      # Fiche produit avec 4 rendus distincts par template
│   │   ├── NotFoundPage.jsx     # Page 404
│   │   └── admin/
│   │       └── DashboardPage.jsx # Console admin complète + sélecteur de template visuel
│   │
│   └── styles/
│       ├── index.css            # Variables CSS globales, reset, animations
│       ├── components.css       # Styles des composants (header, cards, panier)
│       ├── pages.css            # Styles des pages (hero, catalogue, admin)
│       └── themes/
│           ├── elegance.css     # Template Élégance (App-style moderne, ~811 lignes)
│           ├── vitrine.css      # Template Vitrine (Masonry/Crème, ~614 lignes)
│           ├── minimal.css      # Template Minimal (Ultra-propre, ~151 lignes)
│           └── modern-red.css   # Template Modern Red (Soft UI rouge, ~398 lignes)
└── .env                         # Variables d'environnement Supabase
```

---

## 3. Fonctionnalités Implémentées

### ✅ Catalogue Public (Pages Client)

| Fonctionnalité | Description | Fichier principal |
|---|---|---|
| **Homepage boutique** | Hero banner, profil boutique centré, grille catégories | `StorefrontPage.jsx` |
| **Catalogue complet** | Grille de produits, barre de recherche, filtres par catégorie (pills) | `CatalogPage.jsx` |
| **Fiche produit** | Image principale, prix, description, sélecteurs taille/couleur, quantité, ajout au panier | `ProductPage.jsx` |
| **Panier latéral** | Drawer animé, modification quantités, suppression, récap prix | `CartDrawer.jsx` |
| **Commande WhatsApp** | Le bouton "Commander" génère un lien WhatsApp avec le récapitulatif du panier formaté | `whatsapp.js` |

### ✅ Options Produits

| Option | Détail |
|---|---|
| **Tailles** | Stockées en `TEXT[]` PostgreSQL (ex: `['S', 'M', 'L', 'XL']`), pastilles interactives |
| **Couleurs** | Stockées en `TEXT[]`, pastilles avec dot de couleur (mapping nom → hex) |
| **Images multiples** | Champ `product_images TEXT[]` pour galerie d'images par produit |
| **Clé panier unique** | Combinaison `id + size + color` → un même produit en 2 tailles = 2 lignes de panier |

### ✅ Système de Favoris (Likes)

- Bouton cœur flottant sur chaque `ProductCard` et sur la fiche produit
- Lien favoris dans le header (icône cœur) → `?view=favorites`
- Persistance dans `localStorage` (`blueston_likes`)
- Toggle visuel instantané (cœur rempli en rouge si liké)

### ✅ Codes Promotionnels

| Code | Type | Règle |
|---|---|---|
| `BLUESTON10` | -10% | Pourcentage sur le total |
| `WELCOME5000` | -5 000 FCFA | Remise fixe (si panier ≥ 15 000 FCFA) |
| `FREE2026` | -100% | Démo : gratuit total |

- Champ de saisie dans le `CartDrawer`, validation instantanée
- Montant de la réduction affiché dans le récap
- Inclus dans le message WhatsApp

### ✅ Upload d'Images (Supabase Storage)

- Module `storage.js` pour uploader des fichiers vers le bucket `assets`
- Utilisé dans l'admin pour : logo, couverture, images de catégories, images de produits
- Les images sont organisées en sous-dossiers par boutique : `{slug}/logo/`, `{slug}/product/`, etc.

### ✅ Espace Admin (Dashboard)

| Section | Actions |
|---|---|
| **Général** | Modifier nom, description, WhatsApp, logo URL, couverture URL, couleur de thème + upload d'images |
| **Design & Template** | Choisir parmi 4 templates visuels (sélecteur avec miniatures) |
| **Catégories** | Ajouter / supprimer des catégories (avec icon_url emoji) |
| **Produits** | Ajouter / supprimer / modifier des produits, saisir tailles et couleurs |

- Toutes les actions CRUD fonctionnent avec **Supabase** (si connecté) ou **localStorage** (mode local)
- Badge vert "🟢 Connecté à Supabase" ou bleu "🛠️ Démo Locale" dans la sidebar

---

## 4. Système de Templates Dynamiques (4 templates)

### Architecture

```
ThemeContext → body.classList → theme-{name} → CSS overrides + JSX conditionnel
```

Chaque composant (Header, CatalogPage, ProductCard, ProductPage) a des blocs `if (template === '...')` qui retournent un rendu JSX complètement différent par template.

### Les 4 Templates

| Aspect | 🏛 Élégance | 🎨 Vitrine | ⬜ Minimal | 🔴 Modern Red |
|---|---|---|---|---|
| **Style global** | App-style moderne | Masonry éditorial | Ultra-épuré | Soft UI gris + rouge vif |
| **Header** | Titre centré "Explorer", icônes actions | Logo + titre, bouton Admin | Logo minimaliste, icônes fines | Logo + titre, accent rouge |
| **Catalogue** | Bannière sneaker, catégories pills | Bannière lavande, masonry 3 col | Barre de recherche seule, grille 2 col | Banner photo, grille 2-4 col |
| **Cards** | Neomorphic light, image flottante inclinée, ombre de profondeur | Fond gris doux, cascade hauteurs variées | Fond gris, coins arrondis 25px | Fond gris `#E8E8E8`, prix ancien/nouveau |
| **Fiche produit** | Image inclinée + thumbnails, options modernes | Image pleine, infos épurées | Simple 1 colonne | Panneau arrondi 40px, bouton rouge |
| **Panier** | Coins arrondis 40px, bouton bleu | Coins droits, bouton noir | Panier standard | Background gris, qty pill rouge |
| **Couleur accent** | Bleu `#3b82f6` | Noir `#111` | Noir `#121212` | Rouge `#EF4444` |
| **Typo** | Poppins bold | Poppins | Poppins light | Poppins |
| **CSS** | `elegance.css` (~811 lignes) | `vitrine.css` (~614 lignes) | `minimal.css` (~151 lignes) | `modern-red.css` (~398 lignes) |

### Détails des rendus JSX par composant

Chaque composant a des branches conditionnelles complètes :

- **Header.jsx** : 4 variantes (`minimal` → texte uppercase + icônes fines, `modern-red` → logo + titre + accent, `vitrine` → logo + titre crème, `elegance` → titre centré "Explorer")
- **ProductCard.jsx** : 4 variantes (`vitrine` → `minimal-card` avec fond gris, `minimal` → `refine-card`, `elegance` → `modern-card` avec image inclinée + ombre, `modern-red` → `mr-card` avec prix ancien/nouveau)
- **CatalogPage.jsx** : 3 rendus spécialisés (`vitrine` → masonry + bannière lavande + badges catégories, `minimal` → recherche seule + grille, `elegance` → profil boutique + bannière discount + catégories pills) + rendu par défaut
- **ProductPage.jsx** : 2 rendus spécialisés (`vitrine` → refine-style avec back link + galerie + options, `elegance` → breadcrumb + galerie inclinée + panneau options) + rendu par défaut

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
  icon_url TEXT,              -- Emoji ou URL d'icône (pour le thème moderne)
  is_selected BOOLEAN,        -- Pour le thème moderne
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
  currency TEXT,
  image_url TEXT,              -- Image principale (rétro-compatibilité)
  product_images TEXT[],       -- Multiples images (galerie thème moderne)
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
- **32 produits** (8 par catégorie) avec tailles, couleurs, images multiples (`product_images`) et images Unsplash

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

### Thème (ThemeContext)

- **4 templates valides** : `['elegance', 'vitrine', 'minimal', 'modern-red']`
- `useTheme()` retourne `{ template, setTemplate, VALID_TEMPLATES }`
- `setTemplate('vitrine')` → retire toutes les classes `theme-*` du body et ajoute `theme-vitrine`
- Synchro automatique : `StoreLayout` lit `store.template` et appelle `setTemplate()` au chargement

### WhatsApp

- `generateWhatsAppLink(store, cartItems, totalPrice, promoDetails)`
- Format du message : numéro, nom boutique, liste produits (nom, taille, couleur, quantité), sous-total, réduction, total

### Upload d'images (storage.js)

- `uploadFile(file, bucket, path)` → retourne l'URL publique du fichier uploadé
- Bucket `assets` sur Supabase Storage, organisé par slug de boutique

### Rendu conditionnel par template

Chaque composant majeur utilise des blocs `if (template === '...) return (...)` en haut du rendu pour retourner un JSX complètement différent selon le template actif. Le rendu par défaut (fallback) est toujours en bas de la fonction.

---

## 7. Ce qui reste à faire

### Avant la démo (28 mai)

- [ ] **Supabase** : exécuter les SQL de migration pour les nouveaux champs :
  ```sql
  ALTER TABLE stores ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'elegance';
  ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_url TEXT;
  ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_selected BOOLEAN DEFAULT false;
  ALTER TABLE products ADD COLUMN IF NOT EXISTS product_images TEXT[] DEFAULT '{}';
  ```
- [ ] Vérifier le rendu responsive des 4 templates sur mobile
- [ ] Tester le flux complet : scan NFC → catalogue → panier → WhatsApp
- [ ] Déployer sur Vercel (avec variables d'environnement Supabase)
- [ ] Configurer Supabase Storage (bucket `assets` en public)

### Post-démo (roadmap)

- [ ] Authentification admin (login/mot de passe)
- [ ] Upload multiple d'images (galerie produit)
- [ ] Gestion des stocks avancée
- [ ] Multi-boutiques (déjà architecturé avec le slug)
- [ ] Notifications push / PWA
- [ ] Analytics et statistiques
- [ ] Vue favoris dédiée (actuellement `?view=favorites` dans l'URL)
