# GestionMax Frontend

Frontend Next.js pour GestionMax - Plateforme de gestion de formations

## Stack

- Next.js 15.5.4
- React 19
- TypeScript
- Tailwind CSS
- Axios pour les appels API

## Setup local

```bash
npm install
cp .env.local .env.local.example
# Editer .env.local si nécessaire
npm run dev
```

L'application sera accessible sur http://localhost:3010

## Variables d'environnement

- `NEXT_PUBLIC_API_URL`: URL de l'API backend (default: http://localhost:3000)

## Identifiants par défaut

- Email: `aurelien@gestionmax.fr`
- Mot de passe: `Admin123!`

## Déploiement Vercel

1. Pusher sur GitHub
2. Connecter Vercel au repo
3. Définir la variable `NEXT_PUBLIC_API_URL` vers l'URL Railway du backend
4. Déployer

## Structure

- `src/app/` - Pages Next.js (App Router)
- `src/lib/` - Services et utilitaires
- `src/components/` - Composants réutilisables (à venir)
