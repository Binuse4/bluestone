# BLUE'STON Connect — Topo Technique

> **État d'avancement** — Dernière mise à jour : 2 juin 2026
> Ce fichier documente tout ce qui a été développé et implémenté jusqu'à aujourd'hui.

---

## 1. Setup Initial du Projet

### Stack mise en place

| Couche | Technologie | Détails |
|--------|------------|---------|
| **Framework** | Vite + React 19 | Build ultra-rapide, utilisation des Hooks modernes |
| **Routing** | React Router v7 | Navigation fluide, gestion des slugs boutiques |
| **Base de données** | Supabase (PostgreSQL) | Tables `stores`, `categories`, `products`, `banners` |
| **Storage** | Supabase Storage | Bucket `assets` pour upload direct des produits |
| **Utilitaires** | html-to-image | Capture PNG du panier avec résolution CORS automatique |

---

## 2. Arborescence Mise à Jour

```
BlueStone/
├── supabase/
│   └── schema.sql              # Schéma SQL + Seed (product_images, icon_url inclus)
├── src/
│   ├── context/
│   │   ├── CartContext.jsx      # Logique addToCart (sync image/variante)
│   │   └── ThemeContext.jsx     # Template switcher (Minimal / Élégance)
│   ├── lib/
│   │   ├── supabase.js         # Client v2
│   │   └── whatsapp.js         # Message personnalisé PNG
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.jsx      # Header aligné, icônes standardisées (22x22)
│   │   ├── catalog/
│   │   │   ├── ProductCard.jsx  # Grille stable, prix verticaux (Élégance)
│   │   │   └── CategoryCard.jsx # Emojis (Minimal uniquement)
│   │   └── cart/
│   │       └── CartDrawer.jsx   # Actions séparées : PNG vs WhatsApp
│   ├── pages/
│   │   ├── ProductPage.jsx      # Fiche fixe (450px), sync couleur→image robuste
│   │   └── admin/
│   │       └── DashboardPage.jsx # Admin : gestion images par couleur (mapping index)
```

---

## 3. Fonctionnalités Phares Implémentées

### ✅ Gestion des Variantes (Exclusivité BLUE'STON)
- **Mapping Indexé** : Chaque couleur saisie dans l'admin peut être liée à une image spécifique.
- **Synchronisation Instantanée** : Le changement de couleur sur la page produit met à jour le visuel principal sans recharger la page.
- **Persistance Panier** : Le panier conserve l'image exacte de la variante choisie par le client.

### ✅ Design "Full-Bleed" & Stabilité
- **Remplissage Total** : Les images produits occupent 100% de leur cadre (`object-fit: cover`) sur tous les supports.
- **Layout Verrouillé** : Hauteurs fixes (450px en détail, 80px en panier) pour éviter que l'interface ne "saute" lors des changements d'images.
- **Grille Mobile 3 Col** : Optimisation maximale de l'espace sur smartphone.

### ✅ Flux WhatsApp 2.0
- **Bouton Téléchargement** : Génère un PNG professionnel du panier (sans les boutons d'interface).
- **Message Direct** : Redirection WhatsApp simplifiée avec message incitant à joindre l'image téléchargée.

---

## 4. Système de Prix & Devises
- **Intégrité de Ligne** : Utilisation de `white-space: nowrap` partout pour éviter que "FCFA" soit coupé.
- **Layout Élégance** : Prix actuel en haut (gras), ancien prix en bas (barré) pour une lecture rapide sur mobile.
- **Optimisation Minimal** : Taille de police réduite (`0.8rem`) en grille pour garantir l'affichage complet des montants.

---

## 5. Base de Données (Supabase)

### Nouvelles colonnes critiques
- **Table `categories`** : `icon_url` (TEXT) pour les émojis du thème Minimal.
- **Table `products`** : `product_images` (TEXT[]) pour stocker le tableau des visuels par couleur.

---

## 6. Prochaines Étapes (Roadmap Post-Démo)
1. **Authentification** : Sécuriser l'accès au Dashboard via Supabase Auth.
2. **Recherche Avancée** : Filtres par prix et tags.
3. **Statistiques** : Tracking des clics "WhatsApp" par boutique dans l'admin.
