# Configuration Frontend - Backend Headless

## ✅ Architecture Actuelle

```
┌─────────────────────────┐         ┌─────────────────────────┐
│   Frontend Next.js      │  REST   │  Backend Payload CMS    │
│   localhost:3010        │────────▶│  localhost:3002         │
│                         │  API    │  (Headless mode)        │
└─────────────────────────┘         └─────────────────────────┘
```

## 🔧 Configuration Frontend (.env.local)

```bash
# Backend API URL - Mode Headless
NEXT_PUBLIC_API_URL=http://localhost:3002/api

# En production (Railway/Vercel)
# NEXT_PUBLIC_API_URL=https://gestionmaxback-production.up.railway.app/api

# Application Frontend
NEXT_PUBLIC_APP_NAME=Formation App GestionMax
NEXT_PUBLIC_APP_URL=http://localhost:3010

# Mode développement
NEXT_PUBLIC_USE_MOCK_DATA=false
NODE_ENV=development
```

## 🔐 Authentification (Cookie-based avec JWT)

### Configuration API (src/lib/api.ts)

```typescript
export const API_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3002/api';

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    credentials: 'include', // ⚠️ CRITIQUE pour les cookies JWT
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  // Gestion des erreurs d'authentification
  if (res.status === 403 || res.status === 401) {
    throw new Error('Non authentifié - Veuillez vous connecter');
  }

  return res.json();
}
```

### Endpoints REST utilisés

```typescript
// Authentification
POST /api/users/login        // Connexion (retourne cookie JWT)
POST /api/users/logout       // Déconnexion
GET  /api/users/me           // Utilisateur courant

// Gestion utilisateurs
GET    /api/users            // Liste (avec filtres)
GET    /api/users/:id        // Détail
POST   /api/users            // Création
PATCH  /api/users/:id        // Mise à jour
DELETE /api/users/:id        // Suppression

// Formations
GET    /api/formations       // Liste
GET    /api/formations/:id   // Détail
POST   /api/formations       // Création
PATCH  /api/formations/:id   // Mise à jour
DELETE /api/formations/:id   // Suppression
```

## 🎯 Points Critiques

### 1. credentials: 'include' OBLIGATOIRE

**Toutes** les requêtes doivent inclure `credentials: 'include'` pour envoyer le cookie JWT :

```typescript
fetch(url, {
  credentials: 'include',  // ⚠️ CRITIQUE
  // ...
})
```

### 2. CORS configuré dans le backend

Le backend autorise déjà le frontend dans `backend/payload.config.ts` :

```typescript
cors: [
  'http://localhost:3010',  // Frontend dev
  'http://localhost:3000',
  'http://localhost:4200',
  'https://votre-frontend.vercel.app', // Production
]
```

### 3. Pas de GraphQL actuellement

Le projet utilise **uniquement REST API**, pas GraphQL.
Si GraphQL est nécessaire plus tard :

```typescript
const client = new GraphQLClient(`${API_URL}/graphql`, {
  headers: { 'Content-Type': 'application/json' },
});
```

### 4. Pas de routes /admin dans le frontend

Le frontend est **100% autonome** et ne dépend pas de l'interface admin Payload.
L'admin Payload est accessible uniquement via le backend : http://localhost:3002/admin

## 🚀 Démarrage

### Développement local

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# → http://localhost:3002 (ou 3000, 3001 selon disponibilité)

# Terminal 2 - Frontend
cd frontend
npm run dev
# → http://localhost:3010
```

### Test d'authentification

Accédez à : http://localhost:3010/test-auth

1. **Login** avec vos identifiants Payload
2. **getCurrentUser** - vérifie que le cookie fonctionne
3. **checkEmailExists** - teste la vérification email
4. **fetchUsers** - charge les utilisateurs

## 📊 En production

### Backend (Railway/Hetzner)

```bash
# Variables d'environnement
PORT=3000
DATABASE_URI=mongodb://...
PAYLOAD_SECRET=your-secret
```

### Frontend (Vercel)

```bash
# Variables d'environnement
NEXT_PUBLIC_API_URL=https://gestionmaxback-production.up.railway.app/api
NEXT_PUBLIC_APP_URL=https://votre-frontend.vercel.app
```

## 🔍 Debugging

### Vérifier que le cookie est envoyé

Ouvrez DevTools → Network → Sélectionnez une requête API :
- **Request Headers** doit contenir `Cookie: payload-token=...`
- **Credentials** doit être `include`

### Tester depuis la console

```javascript
// 1. Login
await fetch('http://localhost:3002/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'votre@email.com',
    password: 'votre-password'
  })
}).then(r => r.json()).then(console.log)

// 2. Vérifier la session
await fetch('http://localhost:3002/api/users/me', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

## 📚 Ressources

- [Payload Headless Mode](https://payloadcms.com/docs/admin/overview#headless)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Fetch API credentials](https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials)
