# Struttura e Funzionamento dell'Applicazione Nexyflow

Nexyflow è una piattaforma SaaS di AI marketing per social media creator progettata per connettere i profili social, analizzare le performance, ricevere suggerimenti strategici generati tramite AI e creare contenuti mirati.

---

## 📂 Struttura delle Cartelle principale

```
nexyflow/
├── app/                      # Next.js App Router (Pagine, Layout e API Routes)
│   ├── api/                  # Endpoint API (Autenticazione, Connect, Analytics, AI)
│   ├── dashboard/            # Dashboard principale (Analytics, Strategia, Connect, Tools)
│   ├── login / register      # Flussi di autenticazione dell'utente
│   ├── globals.css           # Stili globali e utility per il tema scuro premium
│   └── layout.tsx            # Root layout con configurazione di base
├── components/               # Componenti React riutilizzabili (Sidebar, Hero, Features, ecc.)
├── lib/                      # Servizi e client di terze parti
│   ├── social/               # Integrazioni API Social (YouTube, Instagram, TikTok)
│   ├── supabase.ts           # Configurazione e connessione a Supabase
│   └── icons.tsx             # Icone personalizzate (Instagram, TikTok, YouTube)
├── models/                   # Modelli di dati per Supabase (User, Notification)
├── public/                   # Asset statici
├── tailwind.config.ts        # Configurazione di Tailwind CSS
```

---

## ⚙️ Funzionamento dei Componenti Chiave

### 1. Database & Autenticazione (Supabase)
L'app utilizza **Supabase** come database per memorizzare le informazioni utente, i profili connessi, le metriche storiche e le notifiche.
- **Modelli (`/models`)**: I file `User.ts` e `Notification.ts` incapsulano le query dirette sul database Supabase tramite il client `@/lib/supabase`.
- **Autenticazione**: Gestita tramite token JWT memorizzati nei cookie, che vengono letti dal middleware/API di Next.js.

### 2. Dashboard Web
La dashboard offre un'esperienza utente premium con tema scuro avanzato (`#09090f`), mesh gradient e micro-animazioni.
- **Home (`/dashboard`)**: Mostra metriche aggregate tramite grafici interattivi con Recharts (`AnalyticsChart.tsx`) e card statistiche dal design unico.
- **Connect (`/dashboard/connect`)**: Consente di connettere/disconnettere Instagram, TikTok e YouTube. Se l'utente specifica un profilo, l'app tenta di scaricare i dati reali tramite le API social e cade su dati simulati controllati se le chiavi API non sono configurate.
- **Strategy (`/dashboard/strategy`)**: Genera insight strategici e piani editoriali settimanali. Utilizza un modello AI locale (Ollama / Llama 3) e include una logica di fallback intelligente per generare suggerimenti basati sui canali dell'utente se Ollama non è avviato.
- **Content Generator (`/dashboard/tools/content-generator`)**: Strumento per la generazione di copy e script basato sui profili social dell'utente.


