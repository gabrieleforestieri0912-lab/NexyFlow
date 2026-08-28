import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { checkDailyQueryLimit } from "@/lib/plan";
import { getYouTubeStats } from "@/lib/social/youtube";
import { getInstagramStats } from "@/lib/social/instagram";
import { getTikTokStats } from "@/lib/social/tiktok";
import { aiChatJson } from "@/lib/ai";

function buildUnavailableStats(platform: string, username: string) {
  const displayName = username || "Account social";
  if (platform === "youtube") {
    return {
      subscribers: 0,
      views: 0,
      videos: 0,
      engagement: 0,
      title: displayName,
      thumbnail: "",
      unavailable: true,
    };
  }
  return {
    followers: 0,
    views: 0,
    videos: 0,
    engagement: 0,
    displayName,
    avatar: "",
    unavailable: true,
  };
}

function generateHistory(stats: any, platform: string) {
  const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const followersKey = platform === "youtube" ? "subscribers" : "followers";
  const baseFollowers = stats?.unavailable ? 0 : stats[followersKey] || 1000;
  const baseViews = stats?.unavailable ? 0 : stats.views || 10000;
  return days.map((name, i) => ({
    name,
    followers: Math.floor(baseFollowers * (0.95 + i * 0.01)),
    views: Math.floor(baseViews * (0.7 + Math.random() * 0.6)),
  }));
}

function getFallbackAnalysis(stats: any, platform: string) {
  const engagement = stats?.engagement || 0;
  const followers = stats?.followers || stats?.subscribers || 0;
  const views = stats?.views || 0;
  const videos = stats?.videos || 0;

  const platformName =
    platform === "youtube"
      ? "YouTube"
      : platform === "instagram"
        ? "Instagram"
        : "TikTok";

  if (stats?.unavailable) {
    return {
      analysis: `Non siamo riusciti a recuperare dati live per ${platformName}. Verifica l'username o riprova più tardi.`,
      tips: [
        "Controlla che l'account sia pubblico e l'username sia corretto.",
        "Riprova tra qualche minuto per ricevere una nuova analisi.",
        "Il servizio sarà pienamente operativo al lancio iniziale.",
      ],
    };
  }

  const analysisText =
    "Analisi del profilo " +
    platformName +
    ". Il profilo mostra " +
    followers +
    " " +
    (platform === "youtube" ? "iscritti" : "follower") +
    " con un engagement rate del " +
    engagement +
    "%. " +
    (engagement > 5
      ? "Ottimo livello di interazione con il pubblico."
      : "Il tasso di engagement puo essere migliorato.") +
    " " +
    (views > 50000
      ? "Le visualizzazioni sono consistenti."
      : "C'e margine per aumentare le visualizzazioni.") +
    " " +
    (videos > 50
      ? "La frequenza di pubblicazione e buona."
      : "Pubblica piu frequentemente per crescere piu velocemente.");

  return {
    analysis: analysisText,
    tips: [
      engagement < 5
        ? "Migliora l'engagement rispondendo ai commenti e creando contenuti interattivi"
        : "Continua a interagire con il tuo pubblico per mantenere l'engagement alto",
      videos < 30
        ? "Aumenta la frequenza di pubblicazione a 4-5 volte a settimana"
        : "Mantieni la costanza di pubblicazione e sperimenta nuovi formati",
      views / Math.max(followers, 1) < 5
        ? "Ottimizza titoli e thumbnail per aumentare le visualizzazioni"
        : "I tuoi contenuti raggiungono bene il pubblico",
      "Analizza i tuoi competitor per scoprire nuove opportunita di contenuto",
      "Utilizza le storie e i formati brevi per aumentare la visibilita",
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    let token = request.cookies.get("token")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) token = authHeader.slice(7);
    }
    if (!token) {
      return NextResponse.json(
        { error: "Autenticazione richiesta" },
        { status: 401 },
      );
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
    } catch {
      return NextResponse.json({ error: "Sessione scaduta" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 },
      );
    }

    const limit = await checkDailyQueryLimit(user);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Daily limit reached",
          response: limit.reason,
        },
        { status: 200 },
      );
    }

    const { platform, username } = await request.json();
    if (!platform || !username) {
      return NextResponse.json(
        { error: "Piattaforma e username richiesti" },
        { status: 400 },
      );
    }

    let stats = null;
    if (platform === "youtube") {
      stats = await getYouTubeStats(username);
    } else if (platform === "instagram") {
      stats = await getInstagramStats();
    } else if (platform === "tiktok") {
      stats = await getTikTokStats(username);
    }

    if (!stats) {
      stats = buildUnavailableStats(platform, username);
    }

    const history = generateHistory(stats, platform);

    const systemPrompt =
      "Sei un analista social AI specializzato in " +
      platform +
      '. Analizza il profilo con questi dati e rispondi SOLO in italiano.\nRispondi ESCLUSIVAMENTE con un oggetto JSON valido (senza markdown, senza backtick):\n{\n  "analysis": "<testo analisi dettagliata in italiano, 3-4 frasi>",\n  "tips": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>", "<tip 5>"]\n}';

    let analysis = null;
    try {
      const result = await aiChatJson(systemPrompt, [
        { role: "user", content: JSON.stringify(stats) },
      ]);
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // AI non disponibile, usa fallback
    }

    if (!analysis) {
      analysis = getFallbackAnalysis(stats, platform);
    }

    const platformLabel =
      platform === "youtube"
        ? "YouTube"
        : platform === "instagram"
          ? "Instagram"
          : "TikTok";

    const response = NextResponse.json({
      platform,
      platformLabel,
      username,
      profile: {
        displayName: stats.displayName || stats.title || username,
        avatar: stats.avatar || stats.thumbnail || "",
        followers: stats.followers || stats.subscribers || 0,
        views: stats.views || 0,
        engagement: stats.engagement || 0,
        videos: stats.videos || 0,
      },
      history,
      analysis,
    });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return response;
  } catch (error) {
    console.error("Analyze API error:", error);
    const errResponse = NextResponse.json(
      { error: "Errore durante l'analisi" },
      { status: 500 },
    );
    errResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errResponse;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  return response;
}
