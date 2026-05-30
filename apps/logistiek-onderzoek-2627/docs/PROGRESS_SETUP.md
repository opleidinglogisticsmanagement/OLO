# Voortgangstracking - Vercel Postgres (Neon) Setup

Deze app ondersteunt voortgangstracking via anonieme UUID (geen login) en Neon Postgres (via Vercel).

## 1. Database toevoegen

1. Ga naar [Vercel Dashboard](https://vercel.com/dashboard) → je project
2. **Storage** tab → **Create Database** → **Postgres** (of **Neon** via Marketplace)
3. Kies een naam (bijv. `olo-progress`)
4. Vercel voegt automatisch `POSTGRES_URL` en/of `DATABASE_URL` toe

## 2. Database tabel aanmaken

Voer het volgende SQL uit in de Vercel Postgres SQL Editor (Storage → je database → Query):

```sql
CREATE TABLE IF NOT EXISTS progress (
  user_id UUID NOT NULL,
  goal_id TEXT NOT NULL,
  progress INT DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, goal_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
```

## 3. Dependencies

De dependency `@neondatabase/serverless` staat in `package.json`. Na toevoegen van de database:

```bash
npm install
```

## 4. Gebruik in de app

### Scripts laden (in index.html of gepersonaliseerd.html)

```html
<script src="js/UserIdManager.js"></script>
<script src="js/ProgressService.js"></script>
```

### Voortgang ophalen

```javascript
const progress = await ProgressService.getProgress();
// [{ goal_id: 'ld-w2-1', progress: 100, status: 'completed', ... }, ...]
```

### Voortgang opslaan

```javascript
await ProgressService.saveProgress('ld-w2-1', 100, 'completed');
```

## 5. API Endpoints

| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| GET | `/api/progress?userId=xxx` | Haal voortgang op voor gebruiker |
| POST | `/api/progress` | Sla voortgang op (body: `{ userId, goalId, progress?, status? }`) |

## 6. Lokaal testen

Voor lokaal testen moet `POSTGRES_URL` of `DATABASE_URL` in `.env` staan. Kopieer de waarde uit het Vercel Dashboard (Storage → je database → .env.local).
