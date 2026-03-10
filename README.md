# 📍 Inception

> Vos voyages, votre histoire

Inception est une PWA de suivi de voyage. Créez des carnets de voyage, partagez vos photos, vos découvertes culinaires et les lieux que vous visitez.

## Démarrage rapide

```bash
# Cloner ou copier le dossier
cd inception-app

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'app sera disponible sur [http://localhost:3000](http://localhost:3000)

## Build production

```bash
npm run build
npm run preview
```

Le dossier `dist/` contient l'app prête à déployer sur Vercel, Netlify, ou tout autre hébergeur statique.

## Déployer sur Vercel

```bash
npx vercel
```

## Structure du projet

```
inception-app/
├── public/
│   └── manifest.json       # PWA manifest
├── src/
│   ├── App.jsx              # Application complète
│   └── main.jsx             # Point d'entrée React
├── index.html               # HTML entry
├── vite.config.js           # Configuration Vite
├── package.json
├── CLAUDE.md                # Instructions pour Claude Code
└── README.md
```

## Reprendre avec Claude Code

```bash
cd inception-app
claude
# Claude lira automatiquement CLAUDE.md pour comprendre le projet
```

## Fonctionnalités

- 🗺️ Multi-voyages avec cover photo et couleur personnalisée
- 📸 Feed photo style Instagram (like, vue détail)
- 🍜 Journal food avec notation par étoiles
- 📍 Carte SVG des lieux visités
- ➕ Interface admin pour poster depuis le mobile
- 🗑️ Suppression avec confirmation
- 📱 PWA installable sur téléphone

## Licence

Projet personnel.
