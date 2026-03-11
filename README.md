# Inception — Travel Tracker

> Vos voyages, votre histoire

Inception est une PWA (Progressive Web App) de carnet de voyage. Tu crees des voyages, tu postes tes photos, tes decouvertes culinaires et les lieux que tu visites. Le tout dans une interface mobile-first minimaliste.

---

## Comment ca marche (vue d'ensemble)

```
+------------------------------------------+
|            NAVIGATEUR (mobile)            |
|                                           |
|  Ecran HOME          Ecran TRIP           |
|  ┌─────────────┐     ┌─────────────┐     |
|  │ Mes voyages  │ --> │ Feed photos  │    |
|  │ Stats        │     │ Carte lieux  │    |
|  │ + Nouveau    │     │ Journal food │    |
|  └─────────────┘     │ + Nouveau    │    |
|                       └─────────────┘     |
|                                           |
|  Donnees = state React (en memoire)       |
|  Images = URLs Unsplash (demo)            |
|  Pas de backend / pas de base de donnees  |
+------------------------------------------+
```

C'est une application **100% frontend**. Toute la logique tourne dans le navigateur. Il n'y a pas de serveur, pas de base de donnees. Les donnees de demo sont codees en dur dans le JavaScript et disparaissent si tu recharges la page.

---

## Structure du projet

```
inception-app/
├── index.html          # Page HTML d'entree (charge React)
├── package.json        # Dependances npm (React + Vite)
├── vite.config.js      # Configuration Vite (port 3000, base /inception/)
├── public/
│   └── manifest.json   # Configuration PWA (nom, icone, couleurs)
├── src/
│   ├── main.jsx        # Point d'entree React
│   └── App.jsx         # Toute l'application (765 lignes)
└── CLAUDE.md           # Documentation technique
```

---

## Explication de chaque fichier

### `index.html` — Le point d'entree

Le fichier que le navigateur charge en premier. Il contient :

- Les **meta tags PWA** : permettent d'installer l'app sur l'ecran d'accueil du telephone (comme une vraie app)
- La couleur du theme (`#4a9e7e`, un vert sauge)
- Le lien vers le `manifest.json` pour les infos PWA
- La `<div id="root">` ou React injecte l'application
- Le chargement de `src/main.jsx`

**C'est quoi une PWA ?**
Une Progressive Web App, c'est un site web qui peut s'installer comme une application sur ton telephone. Tu ajoutes un `manifest.json` + quelques meta tags et le navigateur te propose de "l'ajouter a l'ecran d'accueil".

### `public/manifest.json` — La configuration PWA

Definit les infos de l'app quand elle est installee :

- `name` : "Inception" (nom complet)
- `short_name` : "Inception" (sous l'icone)
- `display: "standalone"` : l'app s'affiche sans la barre d'adresse du navigateur
- `theme_color` et `background_color` : les couleurs de l'app
- `icons` : les icones de l'app (192px et 512px) — pas encore creees

### `vite.config.js` — Le bundler

Configure Vite pour :
- Activer le plugin React (pour compiler le JSX)
- Definir le chemin de base `/inception/` (pour le deploiement en sous-dossier)
- Lancer le serveur de dev sur le port 3000 avec ouverture automatique

### `src/main.jsx` — L'initialisation de React

Tres court. Il fait juste :
1. Importe React et le composant App
2. Monte `<App />` dans la `<div id="root">`
3. Active `StrictMode` (un mode de React qui signale les problemes potentiels en dev)

### `src/App.jsx` — L'application complete (765 lignes)

Tout est dans ce fichier : les composants, le style CSS, les donnees de demo, la logique. Voici les sections :

---

#### Les donnees de demo

```javascript
const DEMO_TRIPS = [
  { id: "china-2026", name: "Voyage en Chine", ... },
  { id: "japan-2025", name: "Tokyo & Kyoto", ... },
  { id: "italy-2025", name: "Dolce Vita", ... }
]

const DEMO_POSTS = {
  "china-2026": [ /* 5 posts */ ],
  "japan-2025": [ /* 3 posts */ ],
  "italy-2025": [ /* 2 posts */ ]
}
```

3 voyages de demo avec des posts (lieux et nourriture). Les images sont des URLs Unsplash. Ces donnees sont chargees au demarrage et vivent uniquement en memoire.

---

#### Le state React (les donnees de l'app)

```javascript
const [screen, setScreen] = useState("home")       // "home" ou "trip"
const [trips, setTrips] = useState(DEMO_TRIPS)      // Liste des voyages
const [allPosts, setAllPosts] = useState(DEMO_POSTS) // Posts par voyage
const [currentTrip, setCurrentTrip] = useState(null) // Voyage ouvert
const [tab, setTab] = useState("feed")               // "feed", "map", "food"
const [liked, setLiked] = useState(new Set())         // Posts likes
const [detail, setDetail] = useState(null)            // Post en vue detail
```

**C'est quoi `useState` ?**
C'est la facon dont React stocke des donnees qui peuvent changer. Quand tu appelles `setTrips(newTrips)`, React re-rend automatiquement l'interface avec les nouvelles donnees.

---

#### Les fonctions utilitaires

- `fmtDate(date)` : Formate "2025-04-12" en "12 avril" (format francais)
- `fmtDateShort(date)` : Formate en "12 avr. 2025"
- `daysBetween(start, end)` : Calcule le nombre de jours entre 2 dates
- `resizeImage(file, callback)` : Redimensionne une image uploadee cote client
  - Utilise l'API **Canvas** du navigateur
  - Centre et recadre l'image
  - Reduit a max 1200px de large
  - Compresse en JPEG 85%
  - Renvoie un data URL (l'image encodee en texte base64)

---

#### Les composants (les "blocs" de l'interface)

| Composant | Ce qu'il affiche |
|-----------|-----------------|
| **PostCard** | Une carte de post : photo, titre, lieu, description, likes, date |
| **DetailView** | Vue plein ecran d'un post (avec bouton supprimer) |
| **MapView** | Carte SVG qui montre les lieux visites avec des points et des lignes |
| **FoodView** | Journal food : stats + liste des plats avec notes en etoiles |
| **PostModal** | Formulaire pour creer un post (photo, type lieu/food, texte) |
| **TripModal** | Formulaire pour creer un voyage (photo, nom, dates, couleur) |
| **ConfirmDialog** | Popup de confirmation avant suppression |

---

#### Les 2 ecrans principaux

**Ecran HOME** (`screen === "home"`) :
- Logo + message de bienvenue selon l'heure ("Bonjour", "Bonsoir")
- Stats : nombre de voyages, posts, villes, plats
- Grille de cartes de voyage (photo cover, nom, destination, dates)
- Bouton "+" pour creer un nouveau voyage
- Barre de navigation en bas

**Ecran TRIP** (`screen === "trip"`) :
- Header avec le nom du voyage, les dates, la destination
- 3 onglets dans la barre de navigation :
  - **Feed** : Fil vertical de posts style Instagram
  - **Map** : Carte SVG avec les lieux visites relies par des lignes pointillees
  - **Food** : Journal culinaire avec notation par etoiles
- Bouton "+" au centre de la nav pour ajouter un post
- Vue detail en overlay quand on clique sur un post

---

#### Le design

Tout le CSS est ecrit dans une chaine de caracteres au debut du composant App et injecte via un `<style>` tag.

- **Couleur accent** : `#4a9e7e` (vert sauge) — change selon la couleur du voyage
- **Fond** : Blanc (`#ffffff`)
- **Police** : Nunito (Google Fonts)
- **Largeur max** : 430px (taille d'un telephone)
- **Style** : Ultra minimaliste — pas d'ombres, pas de degrades, bordures 1px fines
- **Bordures arrondies** : 20px pour les cartes, 16px pour les stats, 12px pour les boutons

---

## Installation

### Prerequis

- **Node.js 18+** ([telecharger ici](https://nodejs.org/))

### Etape 1 : Cloner le projet

```bash
git clone https://github.com/sylv1SENG/inception-app.git
cd inception-app
```

### Etape 2 : Installer les dependances

```bash
npm install
```

### Etape 3 : Lancer en dev

```bash
npm run dev
```

L'app s'ouvre sur **http://localhost:3000**

### Etape 4 : Build pour la production

```bash
npm run build
```

Le dossier `dist/` contient l'app prete a deployer.

### Deployer sur Vercel

```bash
npx vercel
```

---

## Stack technique

| Technologie | Role |
|-------------|------|
| React 18 | Interface utilisateur (composants, state) |
| Vite 6 | Bundler et serveur de dev |
| Canvas API | Redimensionnement d'images cote client |
| Chart.js-style SVG | Carte des lieux visites |
| CSS-in-JS | Tout le style dans App.jsx |
| Google Fonts (Nunito) | Typographie |

---

## Comment le code est organise

```
App.jsx
├── DEMO_TRIPS, DEMO_POSTS ── Donnees de demo
├── State React (useState) ── trips, posts, screen, tab, liked...
├── Utilitaires ────────────── fmtDate, resizeImage, daysBetween
├── Icones SVG (objet I) ──── 20 icones vectorielles
├── CSS (chaine <style>) ──── Design system complet
├── ConfirmDialog ──────────── Popup de confirmation
├── PostCard ───────────────── Carte de post (photo + infos)
├── DetailView ─────────────── Vue plein ecran d'un post
├── MapView ────────────────── Carte SVG des lieux
├── FoodView ───────────────── Journal culinaire
├── PostModal ──────────────── Formulaire creation de post
├── TripModal ──────────────── Formulaire creation de voyage
└── App (principal) ────────── Gere HOME et TRIP screens
```

La navigation est geree par la variable `screen` : `"home"` affiche la liste des voyages, `"trip"` affiche le contenu d'un voyage. Pas de librairie de routage — juste un `if/else` dans le rendu.
