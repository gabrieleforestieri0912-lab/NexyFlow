"use client";

import { useState } from "react";
import { Check, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfetto per iniziare",
    features: [
      "3 query AI al giorno",
      "Analisi di base",
      "1 piattaforma social",
      "Statistiche essenziali",
      "Accesso dashboard",
      "Report settimanali",
      "Community support",
    ],
    planId: "free",
  },
  {
    name: "Pro",
    price: "9.99",
    description: "Per creator in crescita",
    features: [
      "Query AI illimitate",
      "Analisi avanzate dettagliate",
      "2 piattaforme social",
      "Content Generator AI",
      "Strategie personalizzate AI",
      "Piano editoriale automatico",
      "Supporto prioritario via chat",
      "Export dati in CSV/PDF",
    ],
    planId: "pro",
  },
  {
    name: "Business",
    price: "19.99",
    description: "Per piccoli team e freelancer",
    features: [
      "Tutto del piano Pro",
      "Tutte le piattaforme social",
      "Fino a 3 membri del team",
      "Analisi competitor avanzata",
      "Report personalizzati white-label",
      "Priorità alta in coda AI",
      "Export dati in CSV/PDF/Excel",
      "Supporto prioritario via chat",
      "Onboarding dedicato",
    ],
    planId: "business",
  },
  {
    name: "Enterprise",
    price: "29.99",
    description: "Per agenzie e team",
    features: [
      "Tutto del piano Business",
      "API access dedicato",
      "Team collaboration illimitata",
      "Export dati avanzati",
      "Account manager dedicato",
      "Formazione personalizzata",
      "SLA garantito",
      "Integrazioni custom",
    ],
    planId: "enterprise",
  },
];

export default function PricingSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(planId: string) {
    if (!user) {
      router.push("/register");
      return;
    }

    if (planId === "free") {
      router.push("/dashboard");
      return;
    }

    setLoading(planId);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: user.id,
          userEmail: user.email,
        }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="glass-section py-24 px-4 overflow-hidden" id="pricing">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#dc2743]/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#dc2743]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[90rem] mx-auto relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#dc2743]/10 to-[#f09433]/10 border border-[#dc2743]/20 text-[#dc2743] text-sm font-normal mb-4"
          >
            <Sparkles size={16} />
            Prezzi
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-normal text-gray-900 mb-4"
          >
            Scegli il piano{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2743] via-[#f09433] to-[#bc1888]">
              giusto per te
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Inizia gratis e passa a un piano premium quando sei pronto a
            crescere.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[90rem] mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative group rounded-3xl p-6 lg:p-8 transition-all duration-300 ${
                plan.planId === "pro"
                  ? "glass-panel border-2 border-[#dc2743]/30 scale-105"
                  : "glass-panel hover:scale-[1.02]"
              }`}
            >
              {/* Popular badge for Pro plan */}
              {plan.planId === "pro" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#dc2743] via-[#f09433] to-[#bc1888] text-white text-xs font-medium uppercase tracking-wider shadow-lg">
                    Più Popolare
                  </div>
                </div>
              )}
              
               {plan.planId === "pro" && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#dc2743]/10 via-[#f09433]/5 to-[#bc1888]/10 rounded-3xl blur-lg -z-10 opacity-30" />
              )}

              <h3 className={`text-2xl font-normal mb-2 ${
                plan.planId === "pro" ? "text-gray-900" : "text-gray-900"
              }`}>
                {plan.name}
              </h3>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className={`text-5xl font-bold tracking-tight ${
                  plan.planId === "pro" ? "text-transparent bg-clip-text bg-gradient-to-r from-[#dc2743] to-[#f09433]" : "text-gray-900"
                }`}>
                  €{plan.price}
                </span>
                <span className="text-gray-500 text-sm ml-1">/mese</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li
                    key={fIndex}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-green-500/10">
                      <Check size={12} className="text-green-500" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                onClick={() => handleCheckout(plan.planId)}
                disabled={loading === plan.planId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  plan.planId === "pro"
                    ? "bg-gradient-to-r from-[#dc2743] via-[#f09433] to-[#bc1888] text-white shadow-lg shadow-[#dc2743]/25 hover:shadow-xl hover:shadow-[#dc2743]/30"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {loading === plan.planId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Caricamento...
                  </>
                ) : user?.plan === plan.planId ? (
                  "Piano Attuale"
                ) : (
                  <>
                    {plan.planId === "free" ? "Inizia Gratis" : "Inizia Ora"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
