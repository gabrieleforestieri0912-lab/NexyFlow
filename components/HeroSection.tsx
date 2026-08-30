"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const platforms = ["Instagram", "TikTok", "YouTube"];

export default function HeroSection() {
  const { t } = useLanguage();
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let isMounted = true;
    let currentText = "";
    let isDeleting = false;
    let loopNum = 0;

    const tick = () => {
      if (!isMounted) return;

      const i = loopNum % platforms.length;
      const fullText = platforms[i];

      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setDisplayText(currentText);

      let delta = 80;
      if (isDeleting) delta = 40;

      if (!isDeleting && currentText === fullText) {
        delta = 1500;
        isDeleting = true;
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        loopNum++;
        delta = 500;
      }

      timeout = setTimeout(tick, delta);
    };

    timeout = setTimeout(tick, 100);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-28" id="home">
      {/* Static poster as fallback background while the video loads (or if it fails) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'url(/hero-poster.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-hidden="true"
      />
      <video
        id="bg-video"
        className="hero-video"
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260816_125506_3a597378-ec85-4ebd-bd22-03b45508ac62.mp4"
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* AI badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-chip text-orange-600 text-[13px] font-normal tracking-wide mt-4 mb-7 animate-[revealUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
          <Sparkles size={14} className="animate-[pulse-soft_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          <span>{t("common.aiPowered")}</span>
          <span className="w-px h-3 bg-orange-400/30" />
          <span className="text-cyan-700/70 text-[11px]">{t("common.new")}</span>
        </div>

        {/* H1 */}
        <h1 className="animate-[revealUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-gray-900 mb-6 leading-[1.2] sm:leading-[1.3] tracking-tight">
          {t("landing.heroTitleStart")}{" "}
          <span className="inline-flex items-center min-w-36 sm:min-w-56 md:min-w-80 lg:min-w-96 text-left whitespace-nowrap">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
              {displayText || "\u200B"}
            </span>
            <span className="ml-1 w-1 h-[0.95em] bg-linear-to-b from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full animate-[cursor-blink_0.8s_step-end_infinite]" />
          </span>
          <br />
          {t("landing.heroTitleEnd")}
          <br />{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]">
            {t("landing.heroTitleLine3")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-[revealUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both] text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed px-4">
          {t("landing.heroSubtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="animate-[revealUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 px-4">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-linear-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-2xl text-white font-medium text-sm sm:text-base hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-200 w-fit"
          >
            {t("landing.heroCta")}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 glass-panel rounded-2xl text-gray-700 font-normal hover:bg-white/70 hover:-translate-y-0.5 transition-all duration-200 w-fit"
          >
            {t("common.learnMore")}
          </Link>
        </div>

        <div className="animate-[revealUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both] mb-12 sm:mb-16 px-4">
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base font-medium text-gray-500 leading-relaxed">
            Il lancio iniziale è pensato per essere semplice, chiaro e
            affidabile, con un onboarding guidato e contenuti reali.
          </p>
        </div>
      </div>
    </section>
  );
}
