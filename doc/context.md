# BLUE'STON Connect — Module Catalogue Commerce

> **Document de contexte** — Dernière mise à jour : 1er juin 2026
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
Le client explore les catégories et choisit des produits
        ↓
Le panier génère un message WhatsApp pré-rempli
        ↓
Le client envoie la commande au commerçant via WhatsApp
```

---

## 2. Architecture des Pages

| Page | Nom | Description |
|------|-----|-------------|
| **PAGE 1** | Landing / Splash Screen | Page d'accueil de la boutique (branding, logo, intro) |
| **PAGE 2** | Exploration / Catalogue | Parcours des catégories et produits (grille, filtres) |
| **PAGE 3** | Détail produit + Panier → WhatsApp | Fiche produit, récapitulatif du panier, bouton "Commander" qui redirige vers WhatsApp |

### Page 3 — Détail du flux de commande

- Le client voit un récapitulatif de tout ce qu'il a choisi
- Le bouton **"Commander"** ne mène **PAS** vers une page de paiement
- Il génère un message WhatsApp pré-rempli envoyé au numéro de la boutique
- Le numéro WhatsApp est intégré comme un lien dans le bouton commander/proceed

---

## 3. Stack Technique

| Couche | Technologie |
|--------|------------|
| **Frontend** | React |
| **Backend** | NestJS |
| **Base de données** | Supabase |
| **Hébergement existant** | [https://bluestoneconnect.bj](https://bluestoneconnect.bj) |
| **Déploiement démo** | Vercel |

### Informations Clés

- **Pas de code source existant partagé** — on part de zéro
- **Pas d'API existante** — tout est à créer
- **Un back-office / interface admin existe déjà** sur la plateforme BLUE'STON CONNECT (mais pas pour ce module catalogue)
- Le front du catalogue est **personnalisable au goût du commerçant**

### Structure d'URL cible

```
bluestonconnect.bj/c/catalogue/{nom-de-la-societe}
```

Le lien NFC ne change pas, mais les données affichées sont mises à jour dynamiquement depuis le serveur (Supabase).

---

## 4. Périmètre de la Démo (Mercredi 28 mai 2026)

### Inclus dans la démo ✅

- **Catalogue public** (ce que voit le client qui scanne le NFC)
- **Personnalisation par le commerçant** (interface pour saisir ses propres données)
- **1 commerçant / 1 boutique** de démonstration
- **4 catégories** avec **8 produits par catégorie** (32 produits total)
- Aperçu d'un catalogue commerçant déjà créé (données fictives, images libres)

### Exclu de la démo ✔️ (Implémenté depuis)

- ~~Flux WhatsApp~~ → **Implémenté** : lien WhatsApp pré-rempli + capture PNG du panier via `html-to-image`
- Paiement en ligne
- Multi-boutiques
- Gestion des stocks avancée

---

## 5. Roadmap Post-Démo (Fonctionnalités Futures)

### 🔧 Back-Office & Gestion

- [ ] Panneau d'administration pour modifier les produits
- [ ] Gestion des stocks
- [ ] Système de commandes / panier avancé
- [ ] Facturation et envoi dans WhatsApp

### 🏪 Multi-Boutiques

- [ ] Ajout d'autres commerçants / boutiques
- [ ] Personnalisation du front par boutique

### 👤 Utilisateurs

- [ ] Création de comptes clients (pas prioritaire, pas encore utile)
- [ ] Historique de commandes
- [ ] Système de favoris / wishlist

### 📝 Contenu

- [ ] Plus de 4 catégories / plus de 8 produits par catégorie
- [ ] Blog ou contenu éditorial
- [ ] Avis / notes sur les produits

### ⚙️ Technique

- [ ] Notifications push
- [ ] PWA (Progressive Web App)
- [ ] Multi-langue
- [ ] SEO avancé
- [ ] Analytics / statistiques

### 💬 WhatsApp

- [x] Intégration du lien WhatsApp dans le bouton "Commander"
- [x] Message pré-rempli avec le récapitulatif du panier
- [x] Capture PNG du panier téléchargée automatiquement (via `html-to-image` + clone hors-écran)
- [ ] Chatbot automatisé (déjà développé par Stone — évaluer la nécessité)
- [ ] Suivi de commande via WhatsApp

---

## 6. Décisions Techniques Prises

| # | Question | Décision |
|---|----------|----------|
| Q1 | Backend existe ? | Oui, déjà en place. Faire une Vercel app pour la démo, le code sera intégré dans le module ensuite |
| Q2 | Périmètre v1 | 1 boutique, 4 catégories × 8 produits, flux WhatsApp = pas mercredi |
| Q3 | Fonctionnalités futures | Voir roadmap section 5 |
| Q4 | Deadline | Mercredi (28 mai 2026) pour la première démo |
| Q5 | WhatsApp | Numéro intégré comme lien dans le bouton commander |
| Q6 | Choix technologiques | Utiliser ce qui marche le mieux |
| Q7 | Exemple de design | Pas d'exemple existant, faire une proposition |
| Q8 | URL | `bluestonconnect.bj/c/catalogue/{nom}` |
| Q9 | Mise à jour données | Le lien ne change pas, données mises à jour côté serveur |
| Q10 | Hébergement | bluestoneconnect.bj (Africa something) |
| Q11 | Admin | Back-office existant sur la plateforme |
| Q12 | Design front | Personnalisable au goût du commerçant |

---

## 7. Parties Prenantes

| Rôle | Personne | Notes |
|------|----------|-------|
| **Product Owner / Commanditaire** | Stone AGASSOUNON | Fondateur BLUE'STON Connect, décisions produit |
| **Développeur** | Binusè | Développement front + back du module catalogue |

---

## 8. Questions Ouvertes

- [ ] Quelles données exactes pour la boutique de démo ? (logo, nom, produits, images)
- [ ] Design system existant à respecter pour BLUE'STON Connect ?
- [ ] Accès au Supabase existant ou créer une instance séparée pour la démo ?
- [ ] Schéma de base de données existant à suivre ?
- [ ] Processus d'intégration du code dans le module BLUE'STON Connect après la démo ?

---

## 9. Notes Importantes

> [!WARNING]
> **Deadline serrée** — La démo doit être prête pour **mercredi 28 mai 2026**.

> [!NOTE]
> Ce module sera intégré dans sa niche au niveau de BLUE'STON Connect une fois terminé. La démo Vercel est temporaire.

> [!IMPORTANT]
> Pas de code source existant partagé. Tout le développement part de zéro, basé uniquement sur les spécifications de Stone.
