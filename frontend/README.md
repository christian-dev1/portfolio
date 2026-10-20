# Frontend LUCHRIST

Angular 21 standalone, signals, SCSS, Transloco, Vitest et polices auto-hébergées.
Aucune dépendance supplémentaire n’est nécessaire pour l’impression ou les téléchargements de CV.

## Commandes

Depuis `frontend/` :

```bash
npx ng serve
```

Serveur local : `http://localhost:4300/`.

```bash
npx ng test --watch=false
```

```bash
npx ng build
```

## Générer le CV en PDF

La page `/cv` est la source des exports FR/EN. Imprimer en A4 avec arrière-plans,
sans en-têtes ni pieds de page du navigateur. Le CV public ne contient aucun numéro
de téléphone et n’affiche que la ville comme localisation.

**Aucun PDF n’est commité, même public.** Déposer les PDF publics dans
`frontend/public/cv/`, dont le dossier entier est ignoré par Git, puis les envoyer sur
le serveur au déploiement. Le fichier d’exécution `frontend/public/config/contact.json`,
également ignoré, peut déclarer :

```json
"cvPdf": { "fr": "/cv/cv-fr.pdf", "en": "/cv/cv-en.pdf" }
```

Le bouton apparaît seulement si le PDF de la langue active est configuré et répond
à HEAD avec le statut 200 et un type PDF. La disponibilité est mise en cache pendant
la session ; absence de fichier ou erreur réseau : bouton masqué.

La version complète exige `/cv?complet=1` **et** `localhost` ou `127.0.0.1`.
Enregistrer cette version hors du dépôt dans `~/Documents/`, uniquement pour les
recruteurs. Ne jamais la déposer dans un dossier public ni sur le serveur.

La [documentation du projet](../README.md) décrit la configuration d’exécution,
le déploiement des PDF et l’architecture du formulaire de contact.
