"use client";

import { useState } from "react";
import { Search, Lightbulb, Loader2 } from "lucide-react";
import { YoutubeIcon, TiktokIcon, InstagramIcon } from "@/lib/icons";
import AnalyticsChart from "@/components/AnalyticsChart";
import ProtectedRoute from "@/components/ProtectedRoute";

type Platform = "instagram" | "tiktok" | "youtube";

interface AnalysisProfile {
  displayName: string;
  avatar: string;
  followers: number;
  views: number;
  engagement: number;
  videos: number;
}

interface AnalysisResult {
  analysis: string;
  tips: string[];
}

interface AnalysisData {
  platform: string;
  platformLabel: string;
  username: string;
  profile: AnalysisProfile;
  history: { name: string; followers: number; views: number }[];
  analysis: AnalysisResult;
}

export default function AnalyzePage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState("");

  const platforms: {
    id: Platform;
    label: string;
    icon: any;
    color: string;
    placeholder: string;
    gradient: string;
  }[] = [
    {
      id: "instagram",
      label: "Instagram",
      icon: InstagramIcon,
      color: "from-pink-500 to-purple-500",
      placeholder: "Inserisci username Instagram...",
      gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
    },
    {
      id: "tiktok",
      label: "TikTok",
      icon: TiktokIcon,
      color: "from-zinc-900 to-black",
      placeholder: "Inserisci username TikTok...",
      gradient: "from-zinc-900 to-black",
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: YoutubeIcon,
      color: "from-red-600 to-red-800",
      placeholder: "Inserisci handle YouTube (es. @nomecanale)...",
      gradient: "from-[#FF0000] to-[#c4302b]",
    },
  ];

  const extractUsername = (input: string) => {
    try {
      if (input.includes("/")) {
        const url = new URL(
          input.startsWith("http") ? input : `https://${input}`,
        );
        const parts = url.pathname.split("/").filter(Boolean);
        return parts[parts.length - 1] || input;
      }
    } catch {}
    return input.trim();
  };

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    const username = extractUsername(url);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, username }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      setError(err.message || "Errore durante l'analisi");
    } finally {
      setLoading(false);
    }
  };

  const hasLiveData = Boolean(
    data &&
    (data.profile.followers ||
      data.profile.views ||
      data.profile.engagement ||
      data.profile.videos),
  );

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-normal text-white tracking-tight">
            Analisi Profilo
          </h1>
          <p className="text-gray-400 mt-1">
            Inserisci qualsiasi account social pubblico per generare report di
            performance immediati
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white/[0.04] backdrop-blur-[12px] transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-48 h-48 bg-[#dc2743]/5 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-thin">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPlatform(p.id);
                  setData(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-normal uppercase tracking-wider transition-all shrink-0 border ${
                  platform === p.id
                    ? `bg-gradient-to-r ${p.gradient} text-white border-transparent shadow-lg shadow-black/20`
                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                }`}
              >
                <p.icon className="w-4 h-4" />
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder={
                platforms.find((p) => p.id === platform)?.placeholder
              }
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 outline-none transition-all text-sm"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? "Analisi in corso..." : "Analizza Ora"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3.5 rounded-xl text-sm font-normal flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-8 animate-fade-in">
            {!hasLiveData && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-4 py-3.5 rounded-xl text-sm font-medium">
                Non siamo riusciti a recuperare dati live per questo account.
                Verifica l’username o riprova più tardi.
              </div>
            )}

            {/* Profile Summary Card */}
            <div className="bg-white/[0.04] backdrop-blur-[12px] transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 border border-white/[0.08] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -right-32 -top-32 w-64 h-64 bg-[#dc2743]/5 blur-[70px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-xl font-normal shadow-lg shadow-black/20">
                  {data.profile.displayName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <h2 className="text-xl font-normal text-white tracking-tight">
                    {data.profile.displayName}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">
                    @{data.username} •{" "}
                    <span className="text-gray-500">{data.platformLabel}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Follower / Iscritti",
                    value: data.profile.followers?.toLocaleString() || "0",
                  },
                  {
                    label: "Visualizzazioni",
                    value: data.profile.views?.toLocaleString() || "0",
                  },
                  {
                    label: "Engagement Rate",
                    value: `${data.profile.engagement || 0}%`,
                    highlight: true,
                  },
                  {
                    label: "Contenuti",
                    value: data.profile.videos?.toLocaleString() || "0",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-4 rounded-xl bg-white/1 border border-white/[0.08] hover:border-white/10 transition-all duration-200"
                  >
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      {s.label}
                    </p>
                    <p
                      className={`text-xl font-normal mt-1 tracking-tight ${s.highlight ? "text-green-400" : "text-white"}`}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* History chart */}
              <div>
                <h3 className="text-sm font-normal text-gray-400 uppercase tracking-wider mb-4">
                  Grafico di Crescita (Stima Settimanale)
                </h3>
                <div className="h-60 w-full">
                  <AnalyticsChart data={data.history} mode="followers" />
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/[0.04] backdrop-blur-[12px] transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 border border-white/[0.08] rounded-2xl p-6">
                <h2 className="text-lg font-normal text-white mb-4">
                  Suggerimenti AI Consigliati
                </h2>
                <ul className="space-y-3.5">
                  {data.analysis.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-white/1 hover:bg-white/2 border border-white/[0.08] rounded-xl p-3.5 transition-colors"
                    >
                      <div className="p-1 bg-[#dc2743]/10 border border-[#dc2743]/15 rounded-lg shrink-0">
                        <Lightbulb className="w-4 h-4 text-[#dc2743]" />
                      </div>
                      <span className="text-sm text-gray-300 leading-relaxed">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            {/* Detailed text analysis */}
            <div className="bg-white/[0.04] backdrop-blur-[12px] transition-all duration-200 hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-[#dc2743]/5 blur-2xl rounded-full pointer-events-none" />
              <h2 className="text-lg font-normal text-white mb-3 relative z-10">
                Analisi Strategica Dettagliata
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed relative z-10">
                {data.analysis.analysis}
              </p>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
