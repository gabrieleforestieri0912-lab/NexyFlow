# Struttura e Funzionamento dell'Applicazione NextBrand

NextBrand è una piattaforma SaaS di AI marketing per social media creator progettata per connettere i profili social, analizzare le performance, ricevere suggerimenti strategici generati tramite AI e creare contenuti mirati. L'ecosistema comprende un'applicazione web Next.js e un'estensione Chrome per l'interazione diretta con le piattaforme social.

---

## 📂 Struttura delle Cartelle principale

```
nextbrand/
├── app/                      # Next.js App Router (Pagine, Layout e API Routes)
│   ├── api/                  # Endpoint API (Autenticazione, Connect, Analytics, AI)
│   ├── dashboard/            # Dashboard principale (Analytics, Strategia, Connect, Tools)
│   ├── login / register      # Flussi di autenticazione dell'utente
│   ├── popup/                # Interfaccia React per l'estensione Chrome
│   ├── globals.css           # Stili globali e utility per il tema scuro premium
│   └── layout.tsx            # Root layout con configurazione di base
├── components/               # Componenti React riutilizzabili (Sidebar, Hero, Features, ecc.)
├── lib/                      # Servizi e client di terze parti
│   ├── social/               # Integrazioni API Social (YouTube, Instagram, TikTok)
│   ├── supabase.ts           # Configurazione e connessione a Supabase
│   └── icons.tsx             # Icone personalizzate (Instagram, TikTok, YouTube)
├── models/                   # Modelli di dati per Supabase (User, Notification)
├── public/                   # Asset statici e codice sorgente dell'Estensione Chrome
│   ├── manifest.json         # Manifest dell'estensione Chrome (V3)
│   ├── background.js         # Service worker dell'estensione
│   ├── content-*.js          # Content script specifici per le piattaforme social
│   └── sidebar.*             # Interfaccia per la barra laterale dell'estensione
├── scripts/                  # Script di utilità
│   └── build-extension.mjs   # Script di build per l'estensione Chrome
└── tailwind.config.ts        # Configurazione di Tailwind CSS
```

---

## ⚙️ Funzionamento dei Componenti Chiave

### 1. Database & Autenticazione (Supabase)
L'app utilizza **Supabase** come database per memorizzare le informazioni utente, i profili connessi, le metriche storiche e le notifiche.
- **Modelli (`/models`)**: I file `User.ts` e `Notification.ts` incapsulano le query dirette sul database Supabase tramite il client `@/lib/supabase`.
- **Autenticazione**: Gestita tramite token JWT memorizzati nei cookie, che vengono letti sia dal middleware/API di Next.js che dalle richieste dell'estensione Chrome.

### 2. Dashboard Web
La dashboard offre un'esperienza utente premium con tema scuro avanzato (`#09090f`), mesh gradient e micro-animazioni.
- **Home (`/dashboard`)**: Mostra metriche aggregate tramite grafici interattivi con Recharts (`AnalyticsChart.tsx`) e card statistiche dal design unico.
- **Connect (`/dashboard/connect`)**: Consente di connettere/disconnettere Instagram, TikTok e YouTube. Se l'utente specifica un profilo, l'app tenta di scaricare i dati reali tramite le API social e cade su dati simulati controllati se le chiavi API non sono configurate.
- **Strategy (`/dashboard/strategy`)**: Genera insight strategici e piani editoriali settimanali. Utilizza un modello AI locale (Ollama / Llama 3) e include una logica di fallback intelligente per generare suggerimenti basati sui canali dell'utente se Ollama non è avviato.
- **Content Generator (`/dashboard/tools/content-generator`)**: Strumento per la generazione di copy e script basato sui profili social dell'utente.

### 3. Estensione Chrome (`/public` e `/app/popup`)
L'estensione Chrome si integra direttamente sulle pagine web di Instagram, TikTok e YouTube per analizzare profili in tempo reale.
- **Content Scripts (`content-*.js`)**: Rilevano quando l'utente si trova su un profilo social abilitato e iniettano un'interfaccia utente (come un pulsante o una sidebar) per avviare l'analisi.
- **Popup (`app/popup/page.jsx`)**: L'interfaccia popup dell'estensione è scritta in React dentro Next.js. Viene compilata durante la build e impacchettata nell'estensione.
- **Background Script (`background.js`)**: Gestisce la comunicazione tra i content script, l'interfaccia dell'estensione e le API di NextBrand.

---

## 🛠️ Flusso di Build dell'Estensione Chrome

Per distribuire l'estensione senza dover configurare un build system separato per React, il progetto utilizza lo script `scripts/build-extension.mjs`:

1. Esegue la build standard di Next.js (`npm run build`).
2. Crea una cartella standalone `dist-extension`.
3. Copia i file statici dell'estensione da `public/` (come `manifest.json`, `background.js` e i `content-*.js`).
4. Trova il bundle JavaScript compilato per la pagina `/popup` nella cache di Next.js (`.next/static/chunks/popup-*.js`), lo rinomina in `popup.js` e lo sposta in `dist-extension`.
5. Estrae il file CSS generato da Next.js e lo sposta come `style.css`.
6. Genera un file `popup.html` che carica il CSS ed il JS pronti all'uso.

La cartella risultante `dist-extension` può essere caricata direttamente in Chrome in modalità sviluppatore (`chrome://extensions/` -> "Carica estensione non pacchettizzata").
