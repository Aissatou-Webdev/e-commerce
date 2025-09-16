# CAHIER DES CHARGES - PLATEFORME E-COMMERCE BEAUTÉ

## 📋 TABLE DES MATIÈRES

1. [Présentation du projet](#1-présentation-du-projet)
2. [Objectifs](#2-objectifs)
3. [Périmètre fonctionnel](#3-périmètre-fonctionnel)
4. [Spécifications techniques](#4-spécifications-techniques)
5. [Architecture système](#5-architecture-système)
6. [Interfaces utilisateur](#6-interfaces-utilisateur)
7. [Sécurité](#7-sécurité)
8. [Planning de développement](#8-planning-de-développement)
9. [Budget détaillé](#9-budget-détaillé)
10. [Maintenance et évolutions](#10-maintenance-et-évolutions)

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
Développement d'une plateforme e-commerce spécialisée dans les produits de beauté et cosmétiques, offrant une expérience utilisateur moderne avec une interface d'administration complète.

### 1.2 Porteur du projet
**Client :** Entreprise de cosmétiques  
**Développeur :** Équipe de développement full-stack  
**Date de début :** Septembre 2025  
**Durée estimée :** 3 mois  

### 1.3 Vision du projet
Créer une boutique en ligne élégante avec un thème noir et doré, permettant aux clients de découvrir et acheter des produits de beauté, tout en offrant aux administrateurs des outils de gestion efficaces.

---

## 2. OBJECTIFS

### 2.1 Objectifs principaux
- ✅ Créer une plateforme e-commerce fonctionnelle
- ✅ Implémenter un système d'authentification sécurisé
- ✅ Développer une interface d'administration complète
- ✅ Optimiser l'expérience utilisateur mobile et desktop
- ✅ Intégrer un système de panier et de commandes

### 2.2 Objectifs secondaires
- 📈 Améliorer la conversion client
- 🎨 Créer une identité visuelle forte (noir/doré)
- 📱 Assurer la responsivité sur tous supports
- 🔐 Garantir la sécurité des données

---

## 3. PÉRIMÈTRE FONCTIONNEL

### 3.1 Fonctionnalités Clients

#### 3.1.1 Navigation et Catalogue
- **Page d'accueil** avec présentation des produits phares
- **Catalogue produits** avec 9 produits de beauté :
  - Crème hydratante (20€)
  - Rouge à lèvres (15€)
  - Fond de teint (25€)
  - Gel de douche (25€)
  - Huile pour cheveux (25€)
  - Gloss (25€)
  - Parfum (25€)
  - Baya (25€)
  - Baume à lèvres (25€)
- **Recherche et filtres** par catégorie
- **Fiches produits** détaillées avec images

#### 3.1.2 Gestion des comptes
- **Inscription** avec validation email
- **Connexion/Déconnexion** sécurisée
- **Profil utilisateur** modifiable :
  - Informations personnelles
  - Adresse de livraison
  - Historique des commandes

#### 3.1.3 Panier et Commandes
- **Ajout au panier** avec gestion des quantités
- **Visualisation du panier** en temps réel
- **Modification des quantités** 
- **Suppression d'articles**
- **Calcul automatique** des totaux
- **Processus de commande** simplifié

#### 3.1.4 Interface Utilisateur
- **Design responsive** (mobile, tablette, desktop)
- **Thème noir et doré** élégant
- **Animations fluides** et transitions
- **Notifications** en temps réel (toast)

### 3.2 Fonctionnalités Administrateur

#### 3.2.1 Authentification Admin
- **Connexion sécurisée** séparée des clients
- **Interface dédiée** sans accès aux pages publiques
- **Gestion des sessions** avec tokens JWT

#### 3.2.2 Tableau de Bord
- **Statistiques en temps réel** :
  - Nombre de clients
  - Nombre de produits
  - Nombre de commandes
  - Chiffre d'affaires total
- **Graphiques et métriques** visuelles
- **Aperçu des activités récentes**

#### 3.2.3 Gestion des Produits
- **Liste complète** des produits
- **Ajout de nouveaux produits** :
  - Nom, description, prix
  - Upload d'images
  - Gestion du stock
  - Catégorisation
- **Modification** des produits existants
- **Suppression** avec confirmation
- **Gestion des images** (upload vers serveur)

#### 3.2.4 Gestion des Clients
- **Liste des utilisateurs** inscrits
- **Consultation des profils** clients
- **Gestion des comptes** (suspension/activation)

#### 3.2.5 Gestion des Commandes
- **Suivi des commandes** en temps réel
- **Changement de statut** des commandes
- **Historique complet** des transactions

#### 3.2.6 Centre de Messages
- **Réception des messages** de contact
- **Gestion des demandes** clients
- **Système de notifications**

---

## 4. SPÉCIFICATIONS TECHNIQUES

### 4.1 Stack Technologique

#### Frontend
- **Framework :** React 18.3.1 avec TypeScript
- **Build Tool :** Vite 6.0.5
- **Styling :** Tailwind CSS 3.4.17
- **Routing :** React Router DOM 7.3.0
- **State Management :** React Context API
- **HTTP Client :** Axios 1.8.2
- **Notifications :** React Toastify 11.0.5
- **Icons :** Lucide React + React Icons 5.5.0

#### Backend
- **Runtime :** Node.js avec Express.js
- **Base de données :** MySQL 2
- **Authentification :** JWT (jsonwebtoken)
- **Sécurité :** bcrypt/bcryptjs pour hashage
- **Upload de fichiers :** Multer
- **CORS :** cors middleware
- **Architecture :** RESTful API

#### Infrastructure
- **Développement :** Serveurs locaux (Frontend: 5176, Backend: 5001)
- **Base de données :** MySQL local/cloud
- **Stockage fichiers :** Système de fichiers local (/uploads)

### 4.2 Architecture de la Base de Données

#### Tables principales :
```sql
-- Utilisateurs (clients)
users (id, name, email, password, phone, address, role, created_at)

-- Administrateurs  
admins (id, nom, email, password, role, created_at)

-- Produits
products (id, name, description, price, stock, category, image, created_at)

-- Panier
cart (id, user_id, product_id, quantity, created_at)

-- Commandes
orders (id, user_id, total_amount, status, created_at)

-- Messages de contact
messages (id, firstname, name, email, message, created_at)
```

---

## 5. ARCHITECTURE SYSTÈME

### 5.1 Architecture Frontend
```
src/
├── components/           # Composants réutilisables
│   ├── admin/           # Composants spécifiques admin
│   ├── Navbar.tsx       # Navigation principale
│   ├── Footer.tsx       # Pied de page
│   └── ProductCard.tsx  # Carte produit
├── pages/               # Pages de l'application
│   ├── admin/          # Pages administrateur
│   ├── Home.tsx        # Page d'accueil
│   ├── Catalog.tsx     # Catalogue produits
│   └── ClientProfile.tsx # Profil client
├── context/            # Gestion d'état globale
├── assets/            # Images et ressources statiques
└── styles/           # Styles personnalisés
```

### 5.2 Architecture Backend
```
backend/
├── Routes/              # Routes API
│   ├── Admin.js        # Gestion admin
│   ├── authAdmin.js    # Auth admin
│   ├── authClient.js   # Auth client
│   ├── client.js       # Gestion clients
│   └── cart.js         # Gestion panier
├── middlewares/         # Middlewares
│   ├── verifyToken.js  # Vérification JWT
│   └── requireAdmin.js # Vérification admin
├── config/             # Configuration
│   └── db.js          # Connexion base de données
├── uploads/           # Stockage images
└── server.js         # Point d'entrée
```

---

## 6. INTERFACES UTILISATEUR

### 6.1 Charte Graphique
- **Couleurs principales :** Noir (#000000) et doré (#FFD700)
- **Police :** System fonts avec fallbacks
- **Style :** Moderne, épuré, luxueux
- **Effets :** Gradient, backdrop-blur, animations CSS

### 6.2 Pages Publiques
1. **Accueil** - Présentation et produits phares
2. **Catalogue** - Grille de 9 produits avec images statiques
3. **Contact** - Formulaire de contact
4. **Connexion/Inscription** - Authentification

### 6.3 Espace Client
1. **Profil** - Gestion informations personnelles
2. **Panier** - Visualisation et modification du panier
3. **Commandes** - Historique des achats

### 6.4 Interface Admin
1. **Dashboard** - Tableau de bord avec statistiques
2. **Produits** - CRUD complet des produits
3. **Clients** - Gestion des utilisateurs
4. **Commandes** - Suivi des ventes
5. **Messages** - Centre de communication

---

## 7. SÉCURITÉ

### 7.1 Authentification
- **JWT Tokens** pour sessions sécurisées
- **Hashage bcrypt** des mots de passe (salt: 10)
- **Séparation des rôles** client/admin
- **Expiration des tokens** (1 heure pour admin)

### 7.2 Autorisation
- **Middleware de vérification** sur routes protégées
- **Contrôle d'accès basé sur les rôles** (RBAC)
- **Validation des tokens** à chaque requête

### 7.3 Sécurité des données
- **Validation des entrées** côté client et serveur
- **Protection CORS** configurée
- **Gestion des erreurs** sans exposition d'informations sensibles
- **Upload sécurisé** de fichiers avec Multer

---

## 8. PLANNING DE DÉVELOPPEMENT

### Phase 1 : Fondations (Semaines 1-2) ✅
- [x] Configuration de l'environnement de développement
- [x] Structure de base du projet (Frontend + Backend)
- [x] Configuration de la base de données
- [x] Authentification de base (clients et admins)

### Phase 2 : Frontend Core (Semaines 3-4) ✅
- [x] Interface utilisateur avec thème noir/doré
- [x] Pages principales (Accueil, Catalogue, Contact)
- [x] Système de navigation responsive
- [x] Gestion du panier avec Context API

### Phase 3 : Backend API (Semaines 5-6) ✅
- [x] API RESTful complète
- [x] Gestion des produits (CRUD)
- [x] Système de panier et commandes
- [x] Upload et gestion des images

### Phase 4 : Interface Admin (Semaines 7-8) ✅
- [x] Dashboard administrateur
- [x] Gestion des produits (ajout, modification, suppression)
- [x] Interface séparée sans navigation publique
- [x] Statistiques et métriques

### Phase 5 : Optimisations (Semaines 9-10) ✅
- [x] Gestion cohérente des images (catalogue ↔ panier)
- [x] Amélioration de l'expérience utilisateur
- [x] Gestion des erreurs et notifications
- [x] Tests et débogage

### Phase 6 : Finalisation (Semaines 11-12)
- [ ] Tests complets end-to-end
- [ ] Optimisation des performances
- [ ] Documentation utilisateur
- [ ] Déploiement en production

---

## 9. BUDGET DÉTAILLÉ

### 9.1 Coûts de Développement

#### Ressources Humaines
| Poste | Tarif/jour | Jours | Total |
|-------|------------|-------|-------|
| **Développeur Full-Stack Senior** | 600€ | 45 | 27,000€ |
| **Designer UI/UX** | 500€ | 8 | 4,000€ |
| **Chef de projet** | 700€ | 10 | 7,000€ |
| **Testeur QA** | 400€ | 5 | 2,000€ |
| **Total Ressources Humaines** | | | **40,000€** |

#### Licences et Outils
| Service | Coût mensuel | Durée | Total |
|---------|--------------|--------|-------|
| **IDE et outils de développement** | 50€ | 3 mois | 150€ |
| **Serveurs de développement** | 100€ | 3 mois | 300€ |
| **Outils de design (Figma Pro)** | 45€ | 3 mois | 135€ |
| **Total Licences** | | | **585€** |

### 9.2 Coûts d'Infrastructure

#### Infrastructure de Production
| Service | Coût mensuel | Année 1 | Total |
|---------|--------------|---------|-------|
| **Hébergement web (VPS)** | 89€ | 12 mois | 1,068€ |
| **Base de données MySQL** | 45€ | 12 mois | 540€ |
| **CDN pour images** | 25€ | 12 mois | 300€ |
| **Certificat SSL** | 0€ | 12 mois | 0€ |
| **Nom de domaine** | 15€ | 1 an | 15€ |
| **Backup et sécurité** | 35€ | 12 mois | 420€ |
| **Total Infrastructure** | | | **2,343€** |

#### Services Externes
| Service | Coût | Description |
|---------|------|-------------|
| **Email transactionnel** | 300€/an | Envoi de confirmations |
| **Monitoring et analytics** | 200€/an | Suivi performance |
| **Support technique** | 500€/an | Maintenance préventive |
| **Total Services** | **1,000€** | |

### 9.3 Coûts de Maintenance

#### Maintenance Première Année
| Service | Coût mensuel | Total annuel |
|---------|--------------|--------------|
| **Maintenance corrective** | 800€ | 9,600€ |
| **Mises à jour sécurité** | 400€ | 4,800€ |
| **Support utilisateur** | 300€ | 3,600€ |
| **Évolutions mineures** | 600€ | 7,200€ |
| **Total Maintenance** | **2,100€** | **25,200€** |

### 9.4 RÉCAPITULATIF BUDGET TOTAL

| Phase | Coût | Pourcentage |
|-------|------|-------------|
| **Développement initial** | 40,585€ | 58% |
| **Infrastructure (An 1)** | 3,343€ | 5% |
| **Maintenance (An 1)** | 25,200€ | 37% |
| **TOTAL ANNÉE 1** | **69,128€** | **100%** |

#### Répartition par trimestre :
- **T1 (Développement)** : 40,585€
- **T2-T4 (Fonctionnement)** : 28,543€

### 9.5 Budget Prévisionnel Années Suivantes

| Année | Infrastructure | Maintenance | Évolutions | Total |
|-------|----------------|-------------|------------|-------|
| **Année 2** | 3,500€ | 18,000€ | 8,000€ | 29,500€ |
| **Année 3** | 3,700€ | 19,000€ | 10,000€ | 32,700€ |

### 9.6 Options et Extensions (Budget additionnel)

#### Fonctionnalités Avancées
| Fonctionnalité | Coût | Délai |
|----------------|------|-------|
| **Système de paiement en ligne** | 8,000€ | 2 semaines |
| **Programme de fidélité** | 12,000€ | 3 semaines |
| **Application mobile** | 35,000€ | 3 mois |
| **Intelligence artificielle (recommandations)** | 15,000€ | 1 mois |
| **Marketplace multi-vendeurs** | 25,000€ | 2 mois |

#### Marketing et SEO
| Service | Coût | Description |
|---------|------|-------------|
| **Optimisation SEO** | 3,000€ | Référencement naturel |
| **Campagne de lancement** | 5,000€ | Marketing digital |
| **Formation utilisateurs** | 2,000€ | Formation admin |

---

## 10. MAINTENANCE ET ÉVOLUTIONS

### 10.1 Maintenance Préventive
- **Mises à jour sécurité** mensuelles
- **Sauvegarde quotidienne** des données
- **Monitoring 24/7** de la plateforme
- **Tests de performance** trimestriels

### 10.2 Support Technique
- **Support Niveau 1** : 2h de réponse
- **Support Niveau 2** : 4h de réponse  
- **Urgences critiques** : 1h de réponse
- **Formation utilisateurs** : 2 sessions/an

### 10.3 Évolutions Prévues
#### Court terme (6 mois)
- Intégration système de paiement
- Module de gestion des stocks avancé
- Notifications push

#### Moyen terme (12 mois)
- Application mobile (iOS/Android)
- Programme de fidélité
- API pour partenaires

#### Long terme (24 mois)
- Intelligence artificielle
- Marketplace multi-vendeurs
- Internationalisation

### 10.4 Indicateurs de Performance (KPI)
- **Disponibilité** : 99.9% uptime
- **Performance** : <2s temps de chargement
- **Conversion** : Taux de conversion panier
- **Satisfaction** : Score utilisateur >4.5/5

---

## 11. LIVRABLES

### 11.1 Livrables Techniques
- ✅ **Code source complet** (Frontend + Backend)
- ✅ **Base de données** avec données de test
- ✅ **Documentation technique** de l'API
- ✅ **Guide d'installation** et de déploiement
- [ ] **Tests automatisés** (unitaires + intégration)
- [ ] **Guide de maintenance**

### 11.2 Livrables Fonctionnels
- ✅ **Plateforme e-commerce fonctionnelle**
- ✅ **Interface d'administration complète**
- ✅ **Documentation utilisateur**
- [ ] **Formation équipe cliente**
- [ ] **Procédures de sauvegarde**

### 11.3 Livrables de Déploiement
- [ ] **Configuration serveur de production**
- [ ] **Certificats SSL**
- [ ] **Scripts de déploiement automatisé**
- [ ] **Monitoring et alertes**

---

## 12. RISQUES ET MITIGATION

### 12.1 Risques Techniques
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Problèmes de performance** | Moyenne | Élevé | Tests de charge, optimisation |
| **Failles de sécurité** | Faible | Critique | Audit sécurité, tests pénétration |
| **Compatibilité navigateurs** | Faible | Moyen | Tests cross-browser |

### 12.2 Risques Projet
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Dépassement budget** | Moyenne | Élevé | Suivi hebdomadaire, jalons |
| **Retard de livraison** | Faible | Moyen | Planning détaillé, marge |
| **Changement de scope** | Élevée | Élevé | Contrat précis, avenants |

---

## 13. ACCEPTATION ET VALIDATION

### 13.1 Critères d'Acceptation
- ✅ Toutes les fonctionnalités décrites sont opérationnelles
- ✅ Interface conforme aux maquettes approuvées
- ✅ Performance conforme aux exigences
- [ ] Tests de sécurité validés
- [ ] Formation équipe réalisée

### 13.2 Procédure de Recette
1. **Tests fonctionnels** sur environnement de recette
2. **Tests de performance** et charge
3. **Tests de sécurité** et pénétration
4. **Formation utilisateurs** administrateurs
5. **Validation finale** et mise en production

---

**Date de création :** 10 Septembre 2025  
**Version :** 1.0  
**Statut :** En cours de développement (Phase 5/6)  

**Contact projet :**  
- Chef de projet : [Nom]
- Développeur lead : [Nom]
- Email : [Email de contact]

---

*Ce document constitue le référentiel officiel du projet e-commerce. Toute modification doit faire l'objet d'un avenant signé par les parties.*