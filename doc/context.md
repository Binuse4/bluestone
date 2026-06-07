# BLUE'STON Connect — Module Catalogue Commerce

> **Document de contexte** — Dernière mise à jour : 2 juin 2026
> Ce fichier sert de référence pour toutes les discussions et développements futurs sur ce module.

---

## 1. Vision du Projet

### Concept Global

Un **système de catalogue digital marchand** embarqué dans un objet physique portable (**porte-clé NFC**), extension du système **BLUE'STON CONNECT**, orientée **commerce**.

Quand un client final approche son téléphone du porte-clé NFC, son navigateur ouvre automatiquement un lien web menant vers le catalogue public de la boutique concernée.

### Flux Utilisateur (Client Final)

```
Client scanne le porte-clé NFC
        ↓
Le téléphone lit une URL dans la puce NFC
        ↓
Le navigateur ouvre le catalogue public de la boutique
        ↓
Le client explore les catégories (avec émojis sur Minimal) et les produits
        ↓
Le client choisit ses variantes (taille/couleur) avec mise à jour visuelle du produit
        ↓
Le client peut télécharger son panier en PNG pour ses archives
        ↓
Le client envoie sa commande au commerçant via WhatsApp (message personnalisé)
```

---

## 2. Architecture des Pages

| Page | Nom | Description |
|------|-----|-------------|
| **PAGE 1** | Landing / Splash Screen | Page d'accueil de la boutique (branding, logo, bannière activée sur Élégance) |
| **PAGE 2** | Exploration / Catalogue | Parcours des catégories et produits (grille 3 col mobile, filtres, bannières promos fixes) |
| **PAGE 3** | Détail produit + Panier | Fiche produit stable, choix des variantes, téléchargement PNG et commande WhatsApp |

### Page 3 — Détail du flux de commande

- Le client voit un récapitulatif avec les visuels exacts des variantes choisies.
- Le bouton **"Télécharger mon panier"** génère une capture propre (PNG) sans les boutons d'action.
- Le bouton **"Commander sur WhatsApp"** redirige vers WhatsApp avec un message pré-rempli invitant à joindre la capture PNG.

---

## 3. Stack Technique

| Couche | Technologie |
|--------|------------|
| **Frontend** | React 19 + Vite |
| **Backend** | Supabase |
| **Base de données** | Supabase (PostgreSQL) |
| **Hébergement** | Vercel |

---

## 4. Périmètre de la Démo (Finalisé)

### Inclus dans la démo ✅

- **Catalogue public** avec deux templates : **Minimal** et **Élégance**.
- **Gestion des variantes** : Choix de tailles et couleurs avec **changement d'image dynamique**.
- **Images "Full-Fill"** : Rendu immersif sur ordinateur et mobile (sans bordures blanches).
- **Panier optimisé** : Séparation du téléchargement PNG et de l'envoi WhatsApp.
- **Header Standardisé** : Icônes et alignements cohérents sur tout le site.
- **Admin Simplifié** : Gestion des catégories (avec émojis) et des produits (avec images par couleur).

---

## 5. Roadmap Post-Démo (Fonctionnalités Futures)

### 🔧 Back-Office & Gestion

- [x] Panneau d'administration complet pour modifier les produits et catégories
- [ ] Gestion des stocks réelle
- [x] Système de variantes (Taille/Couleur) avec images dédiées

### 🏪 Multi-Boutiques

- [ ] Ajout d'autres commerçants / boutiques
- [ ] Isolation complète des données par boutique

### ⚙️ Technique

- [x] Capture PNG du panier optimisée (clonage DOM, résolution CORS)
- [x] Design "Full-Bleed" mobile et desktop
- [ ] PWA (Progressive Web App) pour une expérience "App-like"

### 💬 WhatsApp

- [x] Message pré-rempli personnalisé mentionnant l'envoi de la capture PNG.
- [x] Suppression automatique des boutons d'action dans la capture d'écran du panier.

---

## 6. Décisions Techniques Prises

| # | Question | Décision |
|---|----------|----------|
| Q1 | Backend | Utilisation directe de Supabase (Serverless) |
| Q2 | Périmètre v1 | Catalogue complet + Variantes + Flux WhatsApp PNG |
| Q3 | WhatsApp | Message incitant à joindre la capture PNG du panier |
| Q4 | Design | Deux templates : Minimal (Epuré) et Élégance (Premium) |
| Q5 | Images | Utilisation de `object-fit: cover` pour un remplissage total des cartes |

---

## 7. Parties Prenantes

| Rôle | Personne | Notes |
|------|----------|-------|
| **Product Owner** | Stone AGASSOUNON | Fondateur BLUE'STON Connect |
| **Développeur** | Binusè | Expert React / Vite / Supabase |

---

## 9. Notes Importantes

> [!IMPORTANT]
> Le système d'images par couleur repose sur un mapping par index entre les tableaux `colors` et `product_images` dans Supabase.
