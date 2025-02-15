# Rapport Techinque - Optimisation 

## 1. Structure du projet

## 1.1 Organisation des fichiers

ninacarducci.github.io/ ├── assets/ │ ├── images/ │ │ ├── optimized/ │ │ └── original/ │ ├── scriptsJs/ │ │ ├── maugallery.js │ │ ├── maugallery.min.js │ │ ├── scripts.js │ │ └── scripts.min.js │ └── styles/ │ ├── style.css │ └── style.min.css ├── index.html ├── index-base.html └── package.json


## 2. Optimisations Techniques

### 2.1 Images
- **Format** : Conversion en WebP avec fallback JPG
- **Dimensions** :
  - Desktop : 1920px max-width
  - Tablet : 768px max-width
  - Mobile : 375px max-width
- **Compression** : Optimisation avec maintien de la qualité à 80%
- **Lazy Loading** : Implémenté via l'attribut `loading="lazy"`

### 2.2 JavaScript
- **jQuery** : Version 3.7.1
- **Minification** :
  ```javascript
  terser assets/scriptsJs/maugallery.js -o assets/scriptsJs/maugallery.min.js --keep-fnames --keep-classnames
  terser assets/scriptsJs/scripts.js -o assets/scriptsJs/scripts.min.js --keep-fnames --keep-classnames
  ```
- **Script différés** : Utilisation de la directive `defer` sur les script
- **Ordre de chargement** : jQuery -> maugallery.js -> scripts.js
- **generate-sitemap.js** : Utilisation de la commande `node` pour générer les sitemaps : npm run generate-sitemaps
- **maugallery.js** : gère la modal du site
- **scripts.js** : Initialise la gallery 

### 2.3 CSS

- **Minification** : Utilisation de la commande `clean-css-cli`
  ```css
  clean-css assets/styles/style.css -o assets/styles/style.min.css

  ```
- **CSS Critique** : Inline dans le <head>
  ```css critique utilisation de la commande `critical`
  critical: critical index-base.html --css assets/styles/style.min.css --inline > index.html
  ```

- **CSS non critique** : Utilisation de la directive `media="print"` sur les styles  non critiques, afin de pouvoir les afficher sur les appareils mobiles et sur les appareils avec un navigateur non compatibles ce qui rend la page plus responsive
  ```css non critique
  media="screen" onload="this.media='all'"
  ```

 - **Polices**  : Préchargement avec la directive `preconnect` sur les polices Google et `onload="this".media='all'` sur les iens des polices du projet

 - **Media Queries** : 
 ```CSS media queries
 @media all and (max-width: 1180px) {...}
  @media screen and (max-width: 1000px) {...}
  @media screen and (max-width: 650px) {...}
  ```

### HTML
- **Structuure** : Utilisation appropriée de balises sémantiques HTML5
- **Accesibilité** : Utilisation de attributs ARIA pour améliorer l'accessibilité
- **Schema.org** : Implémentation pour le référencement local
- **Metat tags** : Optimisations des balises meta : robots, descriptions, title, OpenGraph, Twitter Cards, robot.text, shema.org

## Performances

### 3.1 Scores Lifghthouse

- **Performance** : 96/100
    - **First Contentful Paint** : 0.9s
    - **Large Contentful Paint** : 1.3s
    - **Cumulative Layout Schift** : 0s
    - **Total Blocking Time** : 0ms
    - **Speed index**: 0.9s

- **Accessibility** : 100/100
- **Best Practices** : 100/100
- **SEO** : 100/100

### Optimisations serveur

- **Compression Gzip** : activée
- **Compression Brotli** : activée
- **Encodage du contenu** : definie en UTF-8
- **Cache control** : configuré
- **Keep Alive** : activé
- **MIME-type sniffing** : nosniff
- **ServerSignature** : off
- **Sitema XML** : généré pour la page web et pour les images du site (via le script Js generate-site-map.js). 


### 4 Conficguration et utilisation des scripts npm utilisé
### 4.1Installation et configuration initiale
Pour installer toutes les dependances nécessaires, vous pouvez utiliser la commande suivante :
```bash
npm install
``` 
### 4.2 Scripts disponibles
- `npm run generate-sitemaps` : Génère les sitemaps
- `npm run generate-sitemaps:watch` : Génère les sitemaps en mode watch
- `npm run minify` : Minifie les fichiers CSS et JavaScript
- `npm run optimize-css` : Optimise les fichiers CSS
- `npm run minify-css` : Minifie les fichiers CSS
- `npm run minify-bootstrap-css` : Minifie les fichiers CSS de Bootstrap
- `npm run minify-js` : Minifie les fichiers JavaScript
- `npm run minify-bootstrap-js` : Minifie les fichiers JavaScript de Bootstrap
- `npm run critical` : Genère un fichier index.html avec les critères CSS Critique
- `npm run build-critical` : Genère un fichier index.html avec les critères CSS Critique
- `npm run clean` : Supprime les fichiers minifiés, les sitemaps et l'index.html


### 4.3 Les scripts disponibles

Voici les scripts configuré dans le package.json :

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",

    "generate-sitemaps": "node assets/JSDev/generate-sitemap.js",
    "generate-sitemaps:watch": "node assets/JSDev/generate-sitemap.js --watch",

    "minify-css": "cleancss -o assets/styles/style.min.css assets/styles/style.css",
    "minify-bootstrap-css": "cleancss -o assets/styles/bootstrap/bootstrap.min.css assets/styles/bootstrap/bootstrap.css",
    "minify-js": "terser assets/scriptsJs/maugallery.js -o assets/scriptsJs/maugallery.min.js --compress --keep-fnames --keep-classnames && terser assets/scriptsJs/scripts.js -o assets/scriptsJs/scripts.min.js --compress --keep-fnames --keep-classnames",
    "minify-bootstrap-js": "terser assets/styles/bootstrap/bootstrap.bundle.js -o assets/styles/bootstrap/bootstrap.bundle.min.js --compress",

    "optimize-css": "postcss assets/styles/style.min.css assets/styles/bootstrap/bootstrap.min.css --use cssnano --no-map -d assets/styles/",
    "minify": "npm run minify-js && npm run minify-css && npm run minify-bootstrap-css && npm run minify-bootstrap-js && npm run optimize-css",

    "critical": "critical index-base.html --css assets/styles/style.min.css --inline > index.html",
    "build-critical": "node build-critical.js",

    "clean": "rimraf assets/styles/style.min.css assets/styles/bootstrap/bootstrap.min.css assets/scriptsJs/maugallery.min.js assets/styles/bootstrap/bootstrap.bundle.min.js  index.html",

    "build": "npm run clean && npm run minify && npm run build-critical"
  },
```
 ### 4.4 Description des bibliothèques utilisées

 1. Clean-css-cli
      - Outil de minification du CSS en ligne d commande 
      - Réduit la taille des fichiers CSS en :
        - Supprimant les espaces et les commentaires
        - Fusionnat les sélecteurs similaires
        - Optimisant les valeurs de propriétés CSS

      - Utilisation :
       ```bash
       npm tun minify-css ou npm run minify-bootstrap-css
       ```

2. Critical
      - Extrait et inline le CSS critique dans le fichier HTML
      - Améliore le First Contentful Paint (FCP)
    
      - Utilisation :
      ```bash
       npm run critical
       ```

3. cssnano
      - Optimiseur Css modulaire
      - Fonctionne avec Postcss
      - Applique des optimisations avancées sur le CSS
      - Utilisation : 
       ```bash
       npm run optimize-css
       ```

 4. postcss 
       - Outil de transformation CSS
       - Permet l'utilisation de plugin comme cssnano
       - Optimise le css final
       - Utilisation : 
       ```bash
       npm run optimize-css
       ```

5. terser
       - Outil de minification JavaScript 
       - Options importantes utilisée ici (la modal ne fonctionne pas sans ces options):
         - --compress : Optimisation agressive
         - --keep-fnames : Préserve les noms des fonctions
         - --keep-classnames : Préserve les noms des classes
       - Utilisation : 
       ```bash
       npm run minify-js
       ```

 6. rimraf
        - Utilitaire de suppression de fichiers
        - Compatible cross-platform
        - Utilisation : 
        ```bash
        npm run clean
        ```

Dépendances de production (dependencies)

1. chokidar 
        - Surveillance des modifications fichiers 
        - Utilisé pour le mode watch
        - Utilisation : Via le script `clean` : npm run clean

 2. xmlbuilder
        - Génère des fichiers XML
        - Utilisé pour créer la sitemap
        - Utilisation : 
        ```bash
        npm run generate-sitemaps
        ```       

4.5 Processus de build

Pour construire le projet
lancer la commande suivante :
```bash
npm run build
```
Ce script éxecute les étapes suivantes :
- 1. Nettoyage (clean)
      - Supprime tous les fichiers minifiés précédents
      - Assure un build propre

 2. Minification (minify)
    - Minifictaion du Javascript : 
       - magallery.js -> mauagllery.min.js
       - scripts.js -> scripts.min.js  
       - bootstrap.bundle.js -> bootstrap.bundle.min.js 

     - Minification du CSS :
       - style.css -> style.min.css
       - bootstrap.css -> bootstrap.min.css
     - Optimise le css avec PostCSS et cssnano

  3. Optimisation finale (build-critical) :
      - Extrait le css critique  
      - Génère le css critique inline dans le head de  index.html  

### 4.6 Recommandations

 1. Toujours utiliser `clean` avant un nouveau build
      - Evite les conflits avec d'anciens fichiers
      - Assure un build cohérent
  2. Préserver les noms des fonctions et classe :
      - Important pour la compatibilité avec Bootstrap
      - Nécessaire pour le bon fionctionnement de maugallery

   3. Optimisation progressive
       - Minification basique
       - Optimisation avancées ensuite
       - Extraction de CSS critique en dernier

    4. Vérification après build
        - Tester la galerie d'images
        - Vérifier le carousel
        - Contrôler les performances


## 5. Points d'Attention Maintenance

### 5.1 Gallerie 🖼️
> **Important** : La gallerie (fichier maugallery.js et scripts.js) utilise un plugin jQuery personnalisé qui nécessite une attention particulière lors des mises à jour.

#### Configuration 
```javascript
// Options de minification requises pour maugallery.js et scripts.js
terser assets/scriptsJs/maugallery.js -o assets/scriptsJs/maugallery.min.js --keep-fnames --keep-classnames
```
conserver les noms des fonctions, des classes obligatoire lors de la minifications des fichiers js
 - Test complet de la gallery après chaque mise a jour
 - Dépendance a jQuery

 ### 5.2 Images

 - **Structure des dossiers** : Optimisation de la structure des dossiers pour faciliter la gestion des images et leur mise en forme
 assets/
 |__images/
      |--optimized/
      |     |--about-portrait/
                      |--desktop/
                      |     |--webp/
                      |     |--jpg/
                      |--tablet/
                      |     |--webp/
                      |     |--jpg/
                      |--mobile/
                      |     |--webp/
                      |     |--jpg/

      |     |--carousel/*
      |     |--contact-appareil-photo/*
      |     |--favicon/*
      |     |--gallery/*
      |     |--icons/*
      |
      |
      |--imgOriginals/*

  - **Recommandations** : 
           - Maintenir les ratios d'aspects définis
           - Utiliser le format Webp, compression qualité 80%
           - Conserver les images originales dans le dossier imgOriginals

### 5.3 Maintenance CSS

Points critiques
- **Si modifications** :
1. CSS inline
- mettre à jour le CSS dans <head>, utilisation de critical 

```bash
npm run critical

```
   - Vérifier les performances après modifications

2. Media Queries
```css
@media all and (max-width: 1180px) {/*styles desktop*/} 
@media all and (max-width : 1000px) {/*styles tablettes*/}
@media all and (max-width : 650px) {/*styles mobiles*/}
```

3. Processus de mise à jour
- Modifier style CSS
- Lancer la minification
- Tester tous les appareils
- Vérifier les scores de performances
```bash
npm run build
```

## 6 Recommandations futures

### 6.1 Améliorations Possibles

-**Images** :
- Optimisation plus poussée des images
   - Automatiser le processus d'optimisation des images avec Sharp (cf: optimisationImages.txt): 
            - Surveiller le dossier imgOriginals
            - Détecter les nouvelles images
            - Optimiser les images

- Mise en place d'un CDN
- Implementation d'un service worker
- Refactoriser le code javascript (maugallery.js) avec une syntaxe plus moderne
- Refactoriser le code CSS, et vérifier qu'il n'y a plus de code redondant
- Vérifier que le site reste accessible
- Améliorer l'accessibilité dans la modal (description des images affichées)
- améliorations du style de la modal

### 6.2 Maintenance 

- Mettre à jour jQuery
- Vérifier régulièrement es scores Lighthouse , Wawe et GtMetrix
- Vérifier les performances des images
- Maintenir les sitemap à jour
- Surveiller l'évolution de l'optimisation et mettre en place une stratégie en fonction des résultats
- Définir des kpis, et surveiller l'volution du site sur Google analytics
- Mettre en place un processus de maintenance
- Nettoyer les dependance inutilisées dans le package.json
- Vérifier que les kpis sont bien réalisés
