# Nexyflow

> Nexyflow è una piattaforma all-in-one di analisi social media basata sull'intelligenza artificiale per Instagram, TikTok e YouTube. Ottieni insights, strategie di crescita personalizzate e contenuti generati dall'AI.

## Cos'è Nexyflow

Nexyflow analizza i profili Instagram, TikTok e YouTube con l'AI e aiuta i creator a far crescere la propria presenza:

- Analisi delle metriche: follower, engagement, visualizzazioni, trend, like e commenti.
- Strategie AI personalizzate, competitor analysis e content generator.
- Monitoraggio nel tempo con storico delle metriche e contenuti top.
- 4 piani: Free (0€/mese), Pro (9,99€/mese), Business (19,99€/mese), Enterprise (29,99€/mese).
- Piano gratuito: 3 query AI al giorno, analisi di base, 1 piattaforma social.

## Sito

- Dominio: [nexyflow.vercel.app](https://nexyflow.vercel.app)
- Supporto: hello@nexyflow.it

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React
- [Supabase](https://supabase.com) (database e autenticazione)
- [Recharts](https://recharts.org) (grafici)
- [Tailwind CSS](https://tailwindcss.com)

## Getting Started

Prima di tutto, copia `.env.example` in `.env.local` (o `.env`) e configura le variabili necessarie: Supabase, JWT_SECRET e gli eventuali provider AI / social (Instagram, TikTok, YouTube).

Poi avvia il server di sviluppo:

```bash
npm run dev
# oppure
npm i && npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) con il browser per vedere il risultato.

## Script

- `npm run dev` — server di sviluppo
- `npm run build` — build di produzione (`next build --webpack`)
- `npm run start` — avvia la build di produzione
- `npm run lint` — lint con ESLint

## Deploy su Vercel

Il progetto è configurato per il deploy su [Vercel](https://vercel.com) tramite integrazione git (repository GitHub). Il file `vercel.json` imposta il comando di build e i Cron Jobs.

### Passi

1. **Pusha il codice su GitHub** (`main`):
   ```bash
   git push origin main
   ```
2. **Importa il repo su Vercel**: `vercel.com > New Project > Import Git Repository` e seleziona il repo.
3. **Imposta le Environment Variables** nel progetto (Project Settings > Environment Variables). Copia i valori da `.env`/`.env.local`. Le variabili richieste:

   | Variabile | Note |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Pubblica (client) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pubblica (client) |
   | `SUPABASE_SERVICE_ROLE_KEY` | **Segreta** (server) |
   | `JWT_SECRET` | **Segreta** — genera con `openssl rand -hex 32` |
   | `OPENAI_API_KEY` | **Obbligatoria** — chiave API OpenAI (unico provider AI supportato) |
   | `OPENAI_MODEL` | Default `gpt-4o-mini` (opzionale) |
   | `GOOGLE_CLIENT_ID` / `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Pubblica |
   | `GOOGLE_CLIENT_SECRET` | **Segreta** |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Pubblica |
   | `STRIPE_SECRET_KEY` | **Segreta** |
   | `STRIPE_WEBHOOK_SECRET` | **Segreta** |
   | `RESEND_API_KEY` | **Segreta** |
   | `CONTACT_EMAIL` | Opzionale |
   | `NEXT_PUBLIC_GA_ID` | Pubblica (opzionale) |
   | `NEXT_PUBLIC_APP_URL` | **Obbligatoria** — `https://nexyflow.vercel.app` |
   | `YOUTUBE_API_KEY` / `INSTAGRAM_*` / `TIKTOK_*` | Opzionali (dati reali) |
   | `CRON_SECRET` | **Segreta** (per Cron Jobs) |

   > ℹ️ I file `.env` non vengono mai committati (sono in `.gitignore`). Usa `.env.example` come riferimento.

4. **Deploy** — Vercel avvia il build automaticamente. Comando: `next build --webpack` (impostato in `vercel.json`).
5. **Configura i servizi terzi per il dominio in produzione** (un passo che Vercel non fa da solo):
   - **Stripe**: nel dashboard Stripe, crea un webhook → `https://<tuo-dominio>/api/webhooks/stripe` con evento `checkout.session.completed`, copia il secret in `STRIPE_WEBHOOK_SECRET`. Aggiungi il dominio in *Whitelist*.
   - **Google OAuth**: in Google Cloud Console > Credenziali, aggiungi il dominio di produzione a *Authorized redirect URIs* e *Authorized JavaScript origins*.
   - **Instagram / TikTok / YouTube**: aggiorna i redirect/API key per il dominio di produzione.
   - **Supabase Auth**: in Project Settings > Auth > URL Configuration, aggiungi il dominio di produzione agli *Allowed Redirect URLs*.

### Cron Jobs (opzionali)

`vercel.json` dichiara due cron (attivi solo su plan Hobby+):

- `/api/cron/daily-sync` — tutti i giorni alle 06:00 (+ `CRON_SECRET` come `Authorization: Bearer`)
- `/api/cron/weekly-report` — ogni lunedì alle 08:00

Per disattivarli, rimuovi la sezione `crons` da `vercel.json`.

### Build locale di verifica

```bash
npm run build
```
Il build atteso deve terminare con `✓ Compiled successfully` e generare tutte le route (statiche, SSG e serverless ƒ).
