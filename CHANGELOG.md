# Journal des versions

Toutes les évolutions notables du portfolio LUCHRIST sont consignées ici.
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et la numérotation suit le [versionnage sémantique](https://semver.org/lang/fr/).

## [Unreleased]

## [2.0.0] — 2026-11-06

### Ajouté

- API V2 : lecture du profil, des projets, des outils et du parcours.
- Contact avec validation, honeypot et erreurs au format ProblemDetail.
- Limitation des envois par e-mail et par adresse réseau.
- Envoi SMTP après enregistrement, suivi des tentatives et relance automatique.
- Documentation OpenAPI et interface Swagger configurables.
- Orchestration Docker complète : frontend, API Java 21, PostgreSQL 18 et profil Mailpit local.
- Sauvegardes quotidiennes à 02:30 (Africa/Douala), rétention configurable et restauration documentée.
- Catégorie « IA & automatisation » dans la boîte à outils et le CV.
- Message « contenu momentanément indisponible » avec un bouton Réessayer quand l’API ne répond pas.

### Modifié

- Frontend branché sur les endpoints de l’API, avec proxy local de développement.
- Formulaire de contact transmis à l’API, avec retour dédié à la limite d’envois.
- Page contact utilisable même sans l’API : formulaire et bouton WhatsApp restent affichés.
- Swagger : URL de serveur relative et schéma de contact limité aux champs réels, avec exemples.
- Réponses des endpoints de lecture déclarées en `application/json`.

### Supprimé

- Envoi du formulaire de contact par Web3Forms.
- Fichiers JSON statiques des données, remplacés par l’API.

### Sécurité

- Secrets fournis uniquement par variables d’environnement.
- Base de données jamais exposée hors du réseau Docker.
- Adresse IP des visiteurs jamais stockée.
- Purge quotidienne des messages de contact après 180 jours.

## [1.0.0] — 2026-10-24

### Ajouté

- **Accueil** : élément signature (bande rouge et anneau autour de la photo, avec les compétences qui défilent en continu), chiffres clés animés, projets mis en avant.
- **Projets** : cartes qui se retournent pour révéler le détail de chaque projet (WIMO, Vesty Shop, Sekouh, SuperApp), avec logos et captures.
- **Outils** : boîte à outils par catégorie, avec les icônes officielles des technologies.
- **À propos** : présentation, valeurs, qualités et parcours en frise chronologique.
- **CV** : version écran, mise en page imprimable A4 sur deux pages, téléchargement des PDF publics en français et en anglais.
- **Contact** : formulaire avec protection anti-spam et états d'envoi (succès, erreur, champs invalides), bouton WhatsApp sans numéro visible.
- Site bilingue français / anglais, thèmes clair et sombre.
- Animations et transitions de page, désactivées automatiquement avec l'option « réduire les animations ».
- **Docker** : image nginx légère construite en deux étapes, configuration générée au démarrage depuis les variables d'environnement, cache optimisé, en-têtes de sécurité et healthcheck.
- Tests unitaires et tests de contrat des données.

### Sécurité et confidentialité

- Aucun numéro de téléphone ni aucune clé dans le dépôt ou dans l'image Docker.
- Aucun numéro d'appel publié en ligne ; le CV complet n'est générable qu'en local.
