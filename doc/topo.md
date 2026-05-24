# BLUE'STON Connect — Topo Technique

> **État d'avancement** — Dernière mise à jour : 24 mai 2026
> Ce fichier documente tout ce qui a été développé et implémenté jusqu'à aujourd'hui.

---

## 1. État Actuel du Projet

L'application est un catalogue e-commerce digital (NFC-ready) avec 4 univers visuels complets et une gestion dynamique des données via Supabase ou fallback local.

### Système de Templates (4 Thèmes)
- **Élégance (Thème 1) :** Style "Modern App" avec header "Explore" épuré, bannières promotionnelles avec images flottantes et design néomorphique léger.
- **Vitrine (Thème 2) :** Design "Refine Home" avec une grille en cascade (Masonry) sur 3 colonnes, palette crème/ivoire et typographie sophistiquée.
- **Minimal (Thème 3) :** Style "Apple" ultra-épuré, focus sur les espaces blancs, images carrées et navigation discrète.
- **Modern Red (Thème 4) :** Design "Soft UI" avec accents rouge vif, cartes surélevées avec prix "Ancien/Neuf" et navigation intuitive.

### Fonctionnalités Implémentées
- **Navigation Standardisée :** Le logo et le nom de la boutique redirigent systématiquement vers la page d'accueil.
- **Gestion des Catégories :** Intégrée dans tous les thèmes avec des composants spécifiques (carrousels de pilules, liens textuels, badges).
- **Fiche Produit Avancée :** Galerie d'images scrollable, sélecteurs de variantes (tailles/couleurs) et suggestions de produits.
- **Panier (Shopping Bag) :** Entièrement thématisé pour chaque univers, gestion des quantités, codes promo et bouton de commande WhatsApp.
- **Console Admin :**
    - Personnalisation de l'identité (Nom, Description, WhatsApp).
    - **Upload d'images :** Système de téléchargement direct pour les logos, bannières, catégories et produits vers Supabase Storage.
    - Sélecteur de Template avec aperçu visuel instantané.

### Stack Technique
- **Frontend :** React 19 + Vite 8.
- **Routage :** React Router 7 (SPA avec gestion du `vercel.json`).
- **Backend :** Supabase (Base de données PostgreSQL + Storage pour les images).
- **Fallback :** Système intelligent utilisant le `localStorage` et un fichier `mock-store.json` si Supabase n'est pas configuré.
- **Langue :** Interface 100% en Français.

---

## 2. Structure des Données (Supabase)

### Table `stores`
- `id`, `slug`, `name`, `description`, `whatsapp_number`, `logo_url`, `cover_url`, `theme_color`, `template`.

### Table `categories`
- `id`, `store_id`, `name`, `description`, `image_url`, `icon_url`.

### Table `products`
- `id`, `store_id`, `category_id`, `name`, `description`, `price`, `currency`, `image_url`, `product_images` (Array), `sizes` (Array), `colors` (Array).

---

## 3. Ce qui reste à faire / Pistes d'amélioration

- [ ] **Finalisation du flux WhatsApp :** Vérifier le formatage exact du message pré-rempli avec les variantes.
- [ ] **Authentification Admin :** Sécuriser l'accès au DashboardPage (actuellement ouvert via le slug).
- [ ] **Gestion des stocks :** Ajouter un champ quantité restante par variante.
- [ ] **Analytics :** Suivre le nombre de clics par bouton WhatsApp.
- [ ] **Déploiement final :** Connecter le domaine client sur Vercel.

---

> *Note : L'application est optimisée pour un usage "Mobile First" mais reste totalement responsive sur desktop.*
