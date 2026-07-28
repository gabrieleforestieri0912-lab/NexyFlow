import { Brain, BarChart3, Zap, TrendingUp, Shield, Target } from 'lucide-react'

export interface Feature {
  slug: string
  title: string
  description: string
  longDescription: string
  icon: any
  accentColor: string
  tags: string[]
  colSpan: string
  gradientFrom: string
  gradientTo: string
  borderColor: string
  glowColor: string
  big: boolean
  wide: boolean
  benefits: string[]
  howItWorks: string[]
}

export const features: Feature[] = [
  {
    slug: 'strategie-ai',
    title: 'Strategie AI',
    description: 'Piani di crescita personalizzati basati sull\'AI che analizza il tuo profilo e i tuoi competitor per consigli su misura.',
    longDescription: 'Le nostre strategie AI analizzano migliaia di dati per creare piani di crescita personalizzati. Il sistema esamina il tuo profilo, i tuoi competitor e le tendenze di mercato per suggerirti azioni concrete e misurabili.',
    icon: Brain,
    accentColor: '#dc2743',
    tags: ['Content Strategy', 'AI Insights', 'Competitor Analysis'],
    colSpan: 'col-span-12 md:col-span-7',
    gradientFrom: 'rgba(220,39,67,0.18)',
    gradientTo: 'rgba(220,39,67,0.04)',
    borderColor: 'rgba(220,39,67,0.3)',
    glowColor: 'rgba(220,39,67,0.15)',
    big: true,
    wide: false,
    benefits: ['Piani su misura', 'Analisi competitor', 'Trend di mercato'],
    howItWorks: ['Connetti i tuoi profili', 'L\'AI analizza i dati', 'Ricevi strategie personalizzate'],
  },
  {
    slug: 'analisi-dettagliata',
    title: 'Analisi Dettagliata',
    description: 'Metriche complete per ogni piattaforma: follower, engagement, visualizzazioni e trend settimanali.',
    longDescription: 'Monitora ogni metrica importante per le tue piattaforme social. Follower, engagement, visualizzazioni e trend settimanali sono organizzati in report chiari e facili da interpretare.',
    icon: BarChart3,
    accentColor: '#8b5cf6',
    tags: [],
    colSpan: 'col-span-12 md:col-span-5',
    gradientFrom: 'rgba(139,92,246,0.18)',
    gradientTo: 'rgba(139,92,246,0.04)',
    borderColor: 'rgba(139,92,246,0.3)',
    glowColor: 'rgba(139,92,246,0.15)',
    big: false,
    wide: false,
    benefits: ['Metriche complete', 'Report chiari', 'Trend settimanali'],
    howItWorks: ['Seleziona la piattaforma', 'Ottieni il report', 'Esporta i dati'],
  },
  {
    slug: 'real-time-analytics',
    title: 'Real-time Analytics',
    description: 'Monitora le performance in tempo reale con aggiornamenti automatici e notifiche smart.',
    longDescription: 'I dati si aggiornano automaticamente e ricevi notifiche istantanee quando qualcosa cambia. Non perdere mai un trend o un picco di engagement.',
    icon: Zap,
    accentColor: '#f59e0b',
    tags: [],
    colSpan: 'col-span-12 md:col-span-4',
    gradientFrom: 'rgba(245,158,11,0.18)',
    gradientTo: 'rgba(245,158,11,0.04)',
    borderColor: 'rgba(245,158,11,0.3)',
    glowColor: 'rgba(245,158,11,0.15)',
    big: false,
    wide: false,
    benefits: ['Aggiornamenti live', 'Notifiche smart', 'Monitoraggio continuo'],
    howItWorks: ['Attiva il monitoraggio', 'Ricevi alert', 'Agisci in tempo reale'],
  },
  {
    slug: 'growth-tracking',
    title: 'Growth Tracking',
    description: 'Traccia la crescita nel tempo con grafici interattivi e confronti periodici personalizzati.',
    longDescription: 'Traccia l\'andamento della tua crescita nel tempo con grafici interattivi. Confronta periodi diversi e scopri quale contenuto funziona meglio.',
    icon: TrendingUp,
    accentColor: '#06b6d4',
    tags: [],
    colSpan: 'col-span-12 md:col-span-4',
    gradientFrom: 'rgba(6,182,212,0.18)',
    gradientTo: 'rgba(6,182,212,0.04)',
    borderColor: 'rgba(6,182,212,0.3)',
    glowColor: 'rgba(6,182,212,0.15)',
    big: false,
    wide: false,
    benefits: ['Grafici interattivi', 'Confronti periodici', 'Obiettivi personalizzati'],
    howItWorks: ['Imposta il periodo', 'Visualizza la crescita', 'Ottimizza la strategia'],
  },
  {
    slug: 'dati-sicuri',
    title: 'Dati Sicuri',
    description: 'I tuoi dati sono protetti con crittografia avanzata e non vengono mai condivisi con terze parti.',
    longDescription: 'La sicurezza dei tuoi dati è la nostra priorità. Utilizziamo crittografia avanzata e non condividiamo mai le tue informazioni con terze parti.',
    icon: Shield,
    accentColor: '#22c55e',
    tags: [],
    colSpan: 'col-span-12 md:col-span-4',
    gradientFrom: 'rgba(34,197,94,0.18)',
    gradientTo: 'rgba(34,197,94,0.04)',
    borderColor: 'rgba(34,197,94,0.3)',
    glowColor: 'rgba(34,197,94,0.15)',
    big: false,
    wide: false,
    benefits: ['Crittografia E2E', 'Nessuna condivisione', 'Conformità GDPR'],
    howItWorks: ['Registrati', 'Connetti i profili', 'I dati sono protetti'],
  },
  {
    slug: 'content-generator',
    title: 'Content Generator',
    description: 'Genera idee originali, script e caption per i tuoi contenuti con l\'intelligenza artificiale avanzata.',
    longDescription: 'Genera idee originali, script completi e caption ottimizzate per ogni piattaforma. L\'AI crea contenuti pronti da pubblicare in pochi secondi.',
    icon: Target,
    accentColor: '#f97316',
    tags: ['Idee per video', 'Script completi', 'Caption Instagram', 'Hook TikTok', 'Titoli YouTube'],
    colSpan: 'col-span-12',
    gradientFrom: 'rgba(249,115,22,0.12)',
    gradientTo: 'rgba(249,115,22,0.03)',
    borderColor: 'rgba(249,115,22,0.25)',
    glowColor: 'rgba(249,115,22,0.12)',
    big: false,
    wide: true,
    benefits: ['Idee virali', 'Caption ottimizzate', 'Script completi'],
    howItWorks: ['Scegli il tema', 'Seleziona la piattaforma', 'Genera il contenuto'],
  },
]
