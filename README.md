# Portfolio LUCHRIST

Portfolio de Christian Luther Noutchom Noumbiap : projets, compétences, parcours, CV et contact.
Frontend Angular 21 standalone, français/anglais et thèmes clair/sombre. Hébergement sur un serveur personnel.

## Développement

Commandes depuis la racine `PORTFOLIO/`, avec Node 22 et les dépendances installées dans `frontend/` :

```bash
(cd frontend && npx ng serve)
```

Le site est disponible sur `http://localhost:4300/`.

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
- `web3formsAccessKey` : clé de soumission du formulaire ; sans clé valide, le formulaire reste masqué.
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

Le formulaire utilise le contrat `ContactMessageSender` et une implémentation Web3Forms.
Une implémentation appelant une API pourra remplacer le fournisseur sans changer le formulaire.
Les données publiques sont dans `frontend/public/data/`, les traductions dans
`frontend/public/i18n/` et les composants partagés dans `frontend/src/app/shared/`.

## Lancer le site avec Docker

Le frontend est servi par **nginx** dans un conteneur. Le build Angular se fait dans l'image : aucune installation de Node n'est nécessaire sur la machine.

### Prérequis

- Docker et Docker Compose v2

### Démarrage

~~~bash
cp .env.example .env      # puis remplir les valeurs
docker compose up -d --build
~~~

Le site est disponible sur **http://localhost:8080** (ou sur le port défini par `FRONTEND_PORT`).

### Variables d'environnement (`.env`, jamais commité)

| Variable | Rôle | Obligatoire |
|---|---|---|
| `WHATSAPP_NUMBER` | Numéro WhatsApp, chiffres uniquement avec l'indicatif | Non (bouton masqué si vide) |
| `WEB3FORMS_ACCESS_KEY` | Clé du formulaire de contact | Non (formulaire désactivé si vide) |
| `CV_PDF_FR` / `CV_PDF_EN` | Chemins des PDF du CV | Non (défaut `/cv/cv-fr.pdf`, `/cv/cv-en.pdf`) |
| `FRONTEND_PORT` | Port local exposé | Non (défaut `8080`) |

Au démarrage, le conteneur génère `/config/contact.json` à partir de ces variables. Aucun numéro de téléphone ni aucune clé ne se trouve dans l'image ou dans Git, et aucun numéro d'appel n'est publié en ligne.

### CV en PDF

Les PDF publics (`cv-fr.pdf`, `cv-en.pdf`) se placent dans `frontend/public/cv/`. Ce dossier est ignoré par Git et monté en lecture seule dans le conteneur : un PDF remplacé est servi immédiatement, sans reconstruire l'image.

### Commandes utiles

| Commande | Effet |
|---|---|
| `docker compose ps` | État du conteneur (`healthy` attendu) |
| `docker compose logs -f frontend` | Journaux en direct |
| `docker compose up -d --build` | Reconstruire après une modification |
| `docker compose down` | Arrêter et supprimer le conteneur |

### Structure

~~~
PORTFOLIO/
├── docker-compose.yml        # orchestre les services (frontend aujourd'hui, API en V2)
├── .env.example              # modèle des variables
└── frontend/
    ├── Dockerfile            # build Angular (Node 22) puis service nginx
    ├── nginx.conf            # routes Angular, cache, en-têtes de sécurité
    ├── docker-entrypoint.sh  # génère contact.json au démarrage
    └── .dockerignore
~~~
