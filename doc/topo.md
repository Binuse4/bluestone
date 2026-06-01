# BLUE'STON Connect — Topo Technique

> **État d'avancement** — Dernière mise à jour : 1er juin 2026
> Ce fichier documente tout ce qui a été développé et implémenté jusqu'à aujourd'hui.

---

## 1. Setup Initial du Projet

### Stack mise en place

| Couche | Technologie | Détails |
|--------|------------|---------|
| **Framework** | Vite + React | Projet initialisé avec `create-vite`, build rapide |
| **Routing** | React Router v7 | Navigation SPA entre pages |
| **Base de données** | Supabase (PostgreSQL) | Tables `stores`, `categories`, `products`, `banners` |
| **Storage** | Supabase Storage | Bucket `assets` pour upload d'images |
| **Données locales** | localStorage | Fallback quand Supabase n'est pas configuré |
| **Styling** | Vanilla CSS | Design system avec variables CSS (pas de Tailwind) |
| **Typo** | Google Fonts (Outfit) | Police principale pour tous les templates |
| **Utilitaires** | html-to-image | Capture d'écran du panier pour envoi WhatsApp (rendu CSS natif via SVG foreignObject) |

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
│   └── schema.sql              # Schéma SQL + seed de démo (address, banners inclus)
├── public/
│   └── 4423697.png             # Logo officiel par défaut
├── src/
│   ├── main.jsx                # Point d'entrée React
│   ├── App.jsx                 # Routes + Providers (Cart, Theme)
│   ├── index.css               # Imports CSS globaux (2 templates : Élégance, Minimal)
│   │
│   ├── context/
│   │   ├── CartContext.jsx      # Gestion du panier + codes promo
│   │   └── ThemeContext.jsx     # Gestion du template actif (élégance, minimal)
│   │
│   ├── hooks/
│   │   └── useStoreData.js     # Hook principal : charge store/cat/prod/banners
│   │
│   ├── lib/
│   │   ├── supabase.js         # Client Supabase
│   │   ├── storage.js          # Upload d'images
│   │   └── whatsapp.js         # Génération du lien WhatsApp
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.jsx      # Header dynamique avec logo 4423697.png
│   │   ├── catalog/
│   │   │   ├── ProductCard.jsx  # Carte produit (uniforme, badge RUPTURE, grayscale)
│   │   │   └── CategoryCard.jsx # Carte catégorie (nettoyée pour Minimal/Élégance)
│   │   └── cart/
│   │       └── CartDrawer.jsx   # Panier + capture image html-to-image (clone hors-écran)
│   │
│   ├── pages/
│   │   ├── StorefrontPage.jsx   # Homepage (Badges contact, Hero désactivé sur Élégance)
│   │   ├── CatalogPage.jsx      # Catalogue (Carousel bannières promo, grille 3 col mobile)
│   │   ├── ProductPage.jsx      # Fiche produit (sync couleur→image, rupture)
│   │   └── admin/
│   │       └── DashboardPage.jsx # Dashboard unifié (2 bannières max, aperçu dynamique)
│   │
│   └── styles/
│       ├── themes/
│           ├── elegance.css     # Template Élégance (App-style, noir/bleu)
│           └── minimal.css      # Template Minimal (Epuré, blanc/vert)
```

---

## 3. Fonctionnalités Implémentées

### ✅ Catalogue Public (Pages Client)

| Fonctionnalité | Description |
|---|---|
| **Homepage** | Profil boutique centré, badges "Localisation" et "Nous contacter" (Élégance) ou WhatsApp vert (Minimal) |
| **Grille Mobile** | **3 colonnes forcées** sur mobile pour tous les templates pour maximiser la visibilité |
| **Bannières Promo** | **Carousel automatique** de 2 bannières max, liées à des produits spécifiques |
| **Fiche produit** | Synchronisation instantanée entre la couleur choisie et l'image de la galerie |
| **Panier Image** | Capture PNG fidèle du panier via `html-to-image` (clone hors-écran + conversion CORS des images) |

### ✅ Gestion des Stocks (Rupture)

- Les produits décochés "En stock" dans l'admin restent visibles mais :
  - Affichent un badge **"RUPTURE"** (stylisé par template)
  - L'image passe en **Noir et Blanc** (`grayscale`)
  - Le bouton "Ajouter au panier" est **bloqué**

### ✅ Système de Bannières de Réduction

- **Limitation** : Maximum 2 bannières par boutique
- **Ciblage** : Chaque bannière est liée à un produit spécifique (pas de catégorie)
- **Automatisation** : Le texte est généré automatiquement : "X% de réduction sur [Produit]"
- **Aperçu** : Rendu en temps réel dans le Dashboard (Carousel & Image produit)

---

## 4. Système de Templates (Simplifié à 2)

L'application a été épurée pour ne garder que les deux meilleurs designs :

| Aspect | 🏛 Élégance | ⬜ Minimal |
|---|---|---|
| **Style** | Shopify-like, contrasté noir/bleu | Ultra-épuré, Apple-style, blanc/vert |
| **Contact** | Badges "Localisation" et "Nous contacter" | Bouton WhatsApp vert avec logo 4423697.png |
| **Admin Catégories** | Choix d'icône supprimé (Bannière uniquement) | Champ Bannière masqué (Icône/Emoji uniquement) |
| **Header** | Titre "Explorer" centré | Logo + Nom Boutique |

---

## 5. Base de Données & Data

### Nouvelles colonnes et tables
- **Table `stores`** : ajout de `address` pour Google Maps
- **Table `banners`** : nouvelle table pour gérer le carousel de promotions multi-produits
- **Table `products`** : ajout de `is_available` et `compare_price` (ancien prix)

### Logo Officiel
- Utilisation systématique de `/4423697.png` comme logo par défaut et fallback.

---

## 6. Patterns & Logiciels

- **Grille 3 colonnes** : forcée via CSS global avec `!important` sur mobile pour tous les templates
- **Cadre Image Uniforme** : toutes les images produits sont centrées dans un cadre carré (`aspect-ratio: 1/1`) avec `object-fit: contain` pour éviter tout rognage malpropre.
- **Aperçu Dashboard** : synchronisation totale du style de l'aperçu avec le template sélectionné (Minimal vs Élégance).
- **Capture Panier (html-to-image)** : migration de `html2canvas` vers `html-to-image` pour la capture PNG du panier. `html2canvas` ré-implémentait le CSS en JS et causait des décalages d'icônes/texte. `html-to-image` utilise `SVG foreignObject` (moteur CSS natif du navigateur) pour un rendu pixel-perfect. La capture se fait sur un **clone hors-écran** (`position: static`, `left: -9999px`) pour ne jamais toucher au DOM visible. Les images produits sont converties en **data URLs** au préalable pour contourner les restrictions CORS de SVG.

---

## 7. État de la Roadmap

- [x] Correction du bug de colonne `address` Supabase
- [x] Limitation des bannières à 2 max
- [x] Automatisation des messages promotionnels
- [x] Grille mobile 3 colonnes sur tous les thèmes
- [x] Suppression des templates Vitrine et Modern Red
- [x] Intégration du logo officiel 4423697.png
- [x] Fix capture panier : migration `html2canvas` → `html-to-image` (résolution décalage icônes/texte + page blanche)
- [ ] Authentification Admin sécurisée (Prochaine étape)
- [ ] Gestion des stocks par variantes (Taille/Couleur)
