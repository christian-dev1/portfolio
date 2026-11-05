# Portfolio LUCHRIST

Portfolio de Christian Luther Noutchom Noumbiap : projets, compétences, parcours, CV et contact.
Frontend Angular 21 standalone, français/anglais et thèmes clair/sombre. Hébergement sur un serveur personnel.

## Développement

Commandes depuis la racine `PORTFOLIO/`, avec Node 22, Java 21, Docker actif
et les dépendances installées dans `frontend/`.

Dans un premier terminal, lancer le backend avec PostgreSQL et Mailpit :

```bash
cd backend
./mvnw spring-boot:test-run
```

L’API écoute sur `http://localhost:8081/`. L’URL de l’interface Mailpit est affichée
au démarrage pour consulter les messages reçus.

Dans un second terminal, lancer le frontend :

```bash
(cd frontend && npx ng serve --port 4300)
```

Le site est disponible sur `http://localhost:4300/`. La cible `serve` utilise
`frontend/proxy.conf.json` pour transmettre les requêtes `/api` au backend local.
Le backend doit rester démarré pendant la navigation et les envois du formulaire.

```bash
(cd frontend && npx ng test --watch=false)
```

```bash
(cd frontend && npx ng build)
```

## Configuration d’exécution

Copier `frontend/public/config/contact.example.json` vers
`frontend/public/config/contact.json`, puis renseigner la configuration locale.
Le fichier réel est ignoré par Git. Le déploiement doit fournir ce fichier sur le serveur.
Les champs facultatifs absents ou invalides masquent les fonctions correspondantes.

- `whatsapp` et `phones` : coordonnées privées ; aucun numéro affiché sur le CV public.
- `cvPdf` : chemins des PDF publics, par langue :

```json
"cvPdf": { "fr": "/cv/cv-fr.pdf", "en": "/cv/cv-en.pdf" }
```

Le bouton « Télécharger mon CV » apparaît uniquement pour la langue active et après
un HEAD 200 avec un type `application/pdf`. Les vérifications, y compris les échecs,
sont mises en cache pour la session ; recharger la page après un changement de déploiement.
Les pages HTML de repli et les fichiers absents ne produisent aucun bouton.

## Générer et déployer le CV public

La page `/cv` constitue la source du CV imprimé : A4, identité, liens lisibles,
ville seule et contenu professionnel. Le titre d’impression est traduit puis restauré.

1. Ouvrir `http://localhost:4300/cv`, sans paramètre de mode complet.
2. Choisir le français ou l’anglais dans le menu.
3. Imprimer en A4, avec arrière-plans graphiques, sans en-têtes ni pieds de page du navigateur.
4. Déposer les PDF publics `cv-fr.pdf` et `cv-en.pdf` dans `frontend/public/cv/`.
5. Envoyer les PDF publics sur le serveur au déploiement et déclarer leurs chemins dans `contact.json`.

**Aucun PDF n’est commité, même public.** Le dossier entier `frontend/public/cv/`
est ignoré par Git. Vérifier l’absence de numéro de téléphone dans chaque export public.

## CV complet réservé aux recruteurs

Le mode complet exige **à la fois** `?complet=1` et un hôte exactement égal à
`localhost` ou `127.0.0.1`. Exemples : `http://localhost:4300/cv?complet=1` et
`http://127.0.0.1:4300/cv?complet=1`. Sur le domaine public ou le réseau local,
le paramètre est ignoré. Les coordonnées proviennent de la configuration locale.

Enregistrer la version complète **hors du dépôt, dans `~/Documents/`**, puis la
transmettre uniquement aux recruteurs. Ne jamais la déposer dans `frontend/public/`
ni la publier sur le serveur. Ce mode local est une règle d’affichage, pas un mécanisme
d’authentification du fichier de configuration : n’y renseigner que les coordonnées
que le fonctionnement du site nécessite.

## Architecture

Le formulaire utilise le contrat `ContactMessageSender` et l’implémentation `ApiContactSender`
pour appeler `POST /api/contact`. L’API accepte les messages avec une réponse 202 et
les transmet par e-mail après enregistrement ; une réponse 429 indique une limite d’envois.
Le formulaire ne dépend pas de la configuration locale des coordonnées.
Les données publiques sont lues depuis l’API. Les traductions sont dans
`frontend/public/i18n/` et les composants partagés dans `frontend/src/app/shared/`.

## Lancer le site avec Docker

Quatre services démarrent par défaut : `frontend` (nginx), `backend` (Java 21),
`database` (PostgreSQL 18) et `backup` (sauvegardes). Le profil `local-mail` ajoute
Mailpit. PostgreSQL reste sur un réseau interne sans port publié. Le backend n'a
pas de port publié et dispose d'une sortie Internet pour le SMTP.

Le volume nommé `database-data` est monté sur `/var/lib/postgresql`, avec le
répertoire de données versionné de PostgreSQL 18. Les PDF publics restent montés
en lecture seule depuis `frontend/public/cv/`.

### Premier lancement

Prérequis : Docker rootless et Docker Compose v2. Fournir les variables par
l'environnement du serveur ou un fichier de configuration privé hors du dépôt :

- `DB_USER` et `DB_PASSWORD` sont obligatoires ; Compose refuse une valeur absente
  ou vide. La base s'appelle `portfolio` et `DB_URL` est construit par Compose.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_AUTH` et
  `SMTP_STARTTLS_ENABLED` configurent l'envoi. Authentification et STARTTLS sont
  actifs par défaut. Renseigner `CONTACT_TO` et `CONTACT_FROM`.
- `API_DOCS_ENABLED=false` par défaut ; passer à `true` pour exposer `/api/docs/ui`.
- `BACKUP_RETENTION_DAYS=7` par défaut ; entier positif de 1 à 99999.
- Le frontend reçoit uniquement `WHATSAPP_NUMBER`, `CV_PDF_FR` et `CV_PDF_EN`.
  Aucune variable de base ou de SMTP ne lui est transmise ; `phones` reste vide.

Dans les commandes suivantes, les variables sont déjà exportées. Si elles sont
stockées hors du dépôt, ajouter `--env-file /chemin/prive/portfolio.env` juste après
`docker compose`. Ne pas versionner ce fichier.

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

Pour le VPS décrit ici, exporter `FRONTEND_PORT=8090`. Le Nginx du serveur relaie
vers `127.0.0.1:8090` et termine le HTTPS ; sa configuration reste gérée séparément.
Le port local par défaut est `8080`, toujours lié à `127.0.0.1`.

Le frontend démarre indépendamment du backend. Son relais `/api/` résout le nom
`backend` à l'exécution ; une API indisponible renvoie une erreur de passerelle,
sans empêcher le site statique de démarrer. Les réponses API portent `no-store`.
Tomcat traite `X-Forwarded-For` de droite à gauche : les adresses privées et de
loopback sont des proxys internes, puis la première adresse publique rencontrée
sert à la limite d'envois. `X-Forwarded-Proto` conserve le protocole HTTPS initial.

### Mise à jour

Après avoir récupéré la version souhaitée du dépôt :

```bash
docker compose exec -T backup /usr/local/bin/backup.sh
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 backend
```

Flyway applique les migrations au démarrage. `docker compose down` conserve les
données ; ne pas utiliser `down -v` pour une mise à jour.

### Sauvegardes et restauration

Chaque jour à **02:30, Africa/Douala**, `backup` lance `pg_dump` au format custom.
Les archives datées sont écrites dans `./backups/`, ignoré par Git : dossier en
mode `700`, fichiers en mode `600`. La rétention s'applique après une sauvegarde
réussie ; une archive partielle n'est jamais publiée comme sauvegarde terminée.
Le conteneur tourne en root à l'intérieur : avec Docker rootless, les fichiers
appartiennent à l'utilisateur qui exécute Docker sur le serveur.

Sauvegarde immédiate et liste des archives :

```bash
docker compose exec -T backup /usr/local/bin/backup.sh
docker compose exec -T backup ls -l /backups
```

Pour restaurer une archive, remplacer le nom ci-dessous par celui choisi. Cette
commande remplace les objets de la base `portfolio` par ceux de l'archive :

```bash
docker compose stop backend backup
docker compose up -d --wait database
docker compose exec -T database sh -c 'pg_restore --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --clean --if-exists --no-owner --no-privileges --exit-on-error' < backups/portfolio_DATE_HEURE_SUFFIX.dump
docker compose up -d backend backup
docker compose ps
```

### Tester le courrier avec Mailpit

Sans compte SMTP, exporter les valeurs locales suivantes :

```bash
export SMTP_HOST=mailpit SMTP_PORT=1025
export SMTP_AUTH=false SMTP_STARTTLS_ENABLED=false
export CONTACT_TO=contact@example.com CONTACT_FROM=portfolio@example.com
docker compose --profile local-mail up -d --build
```

Mailpit est disponible uniquement sur `http://127.0.0.1:8025`. Le formulaire de
`http://localhost:8080/contact` doit répondre avec un statut 202, puis le message
apparaît dans Mailpit. Rétablir les paramètres SMTP de production avant déploiement.

Pour arrêter également le service optionnel, sans supprimer les données :

```bash
docker compose --profile local-mail down
```

### Passer de la v1.0.0 à la v2.0.0

Renseigner les nouvelles variables de base, SMTP, destinataire et rétention à
partir de `.env.example`. `WEB3FORMS_ACCESS_KEY` n'est plus utilisée. Conserver les
variables des PDF et de WhatsApp ; le frontend n'importe plus tout le fichier de
configuration privé. Le premier démarrage initialise PostgreSQL et les migrations.
Configurer `FRONTEND_PORT=8090` pour le relais du VPS, puis vérifier `/api/health`,
les pages du portfolio et un envoi de contact avant de terminer la mise à jour.
