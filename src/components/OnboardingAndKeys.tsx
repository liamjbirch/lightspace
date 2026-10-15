import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Key, UserCheck, Shield, Sparkles, Globe, 
  HelpCircle, CheckCircle2, ChevronRight, Award, CircleDot
} from "lucide-react";
import { StewardshipKey } from "../types";

interface OnboardingAndKeysProps {
  stewardshipKeys: StewardshipKey[];
  onBack: () => void;
  onUpdateKeys: (updated: StewardshipKey[]) => void;
}

export const OnboardingAndKeys: React.FC<OnboardingAndKeysProps> = ({
  stewardshipKeys,
  onBack,
  onUpdateKeys
}) => {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [onboardStep, setOnboardStep] = useState<1 | 2 | 3>(1);
  const [onboardRole, setOnboardRole] = useState<string>("");
  const [onboardEmail, setOnboardEmail] = useState("");
  const [onboardCompleted, setOnboardCompleted] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Rewards states
  const [rewardClaimingId, setRewardClaimingId] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onboardStep === 1) {
      if (!onboardEmail.trim() || !onboardEmail.includes("@")) return;
      setOnboardStep(2);
    } else if (onboardStep === 2) {
      if (!onboardRole) return;
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        setOnboardStep(3);
        setOnboardCompleted(true);
      }, 2000);
    }
  };

  const claimRewards = (keyId: string) => {
    setRewardClaimingId(keyId);
    setTimeout(() => {
      const updated = stewardshipKeys.map(k => {
        if (k.id === keyId) {
          const rawNum = parseFloat(k.rewardsClaimed.replace(/[^0-9.]/g, ""));
          const nextVal = (rawNum + 1500 * k.multiplier).toLocaleString("en-US", { maximumFractionDigits: 0 });
          return { ...k, rewardsClaimed: `${nextVal} USDC` };
        }
        return k;
      });
      onUpdateKeys(updated);
      setRewardClaimingId(null);
      setClaimSuccess(keyId);
      setTimeout(() => setClaimSuccess(null), 3000);
    }, 1800);
  };

  // Translations content dictionary
  const t = {
    en: {
      onboarding: "Steward Onboarding",
      subOnboarding: "Effortless, bilingual, and secure identity validation.",
      rolePrompt: "Select your relationship with the Land",
      roleSteward: "Land Steward / Steward of Soil",
      roleProfessional: "Ecological Service Provider",
      roleFunder: "Carbon / Restoration Funder",
      roleLeader: "Community Guardian",
      emailPrompt: "Verify your electronic identity (Email)",
      emailLabel: "Steward Email",
      btnNext: "Continue Path",
      btnVerify: "Verify Identity",
      completedTitle: "Verification Completed",
      completedDesc: "Your digital identity is permanently inscribed in our secure directory. You have been issued a Guest Seed Key.",
      stepOf: "Step {current} of 2",
      activeKeys: "Stewardship Keys & Smart Rewards",
      keysDesc: "Holders of sacred keys earn automatic income paid by global carbon smart contracts.",
      unlocked: "Unlocked At",
      rewards: "Stewardship Earnings",
      btnClaim: "Trigger Smart Contract Payout",
      multiplier: "Reward Multiplier",
      claimWait: "Securing block network...",
      claimDone: "Payout Completed!",
      chooseLang: "Choose Language"
    },
    es: {
      onboarding: "Registro de Custodio",
      subOnboarding: "Validación de identidad sencilla, bilingüe y segura.",
      rolePrompt: "Selecciona tu relación con la Tierra",
      roleSteward: "Custodio de Tierra / Cuidador del Suelo",
      roleProfessional: "Proveedor de Servicios Ecológicos",
      roleFunder: "Financiador de Carbono / Restauración",
      roleLeader: "Guardián de la Comunidad",
      emailPrompt: "Verifica tu identidad electrónica (Email)",
      emailLabel: "Correo de Custodio",
      btnNext: "Continuar Sendero",
      btnVerify: "Verificar Identidad",
      completedTitle: "Verificación Completada",
      completedDesc: "Tu identidad digital ha sido inscrita de forma permanente en nuestro directorio seguro. Se te ha emitido una Llave de Semilla.",
      stepOf: "Paso {current} de 2",
      activeKeys: "Llaves de Custodio y Recompensas",
      keysDesc: "Los poseedores de llaves sagradas obtienen ingresos automáticos pagados por contratos inteligentes de carbono global.",
      unlocked: "Desbloqueado En",
      rewards: "Ganancias de Custodia",
      btnClaim: "Activar Pago de Contrato Inteligente",
      multiplier: "Multiplicador de Ganancia",
      claimWait: "Asegurando red de bloques...",
      claimDone: "¡Pago Completado!",
      chooseLang: "Elegir Idioma"
    }
  };

  const words = t[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto bg-forest-950/85 border border-forest-800/40 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative"
    >
      {/* Radiant amber flare */}
      <div className="absolute w-48 h-48 rounded-full bg-amber-gold/5 blur-[100px] top-10 left-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-forest-800/30 pb-5 mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-forest-900/40 border border-forest-800/30 hover:border-amber-gold text-earth-sand hover:text-amber-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-amber-gold animate-sway" />
              <h2 className="font-serif text-2xl text-earth-sand font-medium">Steward Portal</h2>
            </div>
            <p className="text-xs text-forest-300 font-mono tracking-widest uppercase mt-0.5">
              Cap. 01 & 05 — Identity & Smart Contracts
            </p>
          </div>
        </div>

        {/* Bilingual Selector */}
        <div className="flex items-center space-x-2 bg-forest-900/30 border border-forest-800/35 px-3.5 py-2 rounded-full self-start sm:self-center">
          <Globe className="w-3.5 h-3.5 text-amber-gold" />
          <span className="text-[10px] font-mono text-forest-400 uppercase tracking-wider">{words.chooseLang}:</span>
          <button
            onClick={() => setLang("en")}
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${lang === "en" ? "bg-amber-gold text-[#3E3E2F]" : "text-forest-300 hover:text-earth-sand"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("es")}
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${lang === "es" ? "bg-amber-gold text-[#3E3E2F]" : "text-forest-300 hover:text-earth-sand"}`}
          >
            ES
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* LEFT COLUMN: MULTI-STEP BILINGUAL ONBOARDING (IDENTITY AND ONBOARDING) */}
        <div className="lg:col-span-2 bg-forest-900/10 border border-forest-800/25 rounded-2xl p-5 md:p-6 space-y-5">
          <div className="border-b border-forest-800/20 pb-3">
            <div className="flex items-center space-x-2.5">
              <UserCheck className="w-4 h-4 text-amber-gold" />
              <h4 className="font-serif text-base text-earth-sand font-semibold">{words.onboarding}</h4>
            </div>
            <p className="text-xs text-forest-300 leading-relaxed font-light mt-1">
              {words.subOnboarding}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!onboardCompleted ? (
              <motion.form
                key="onboard-form"
                onSubmit={handleOnboardSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Step indicators */}
                <div className="flex items-center justify-between text-[10px] font-mono text-forest-400">
                  <span className="uppercase tracking-widest">
                    {words.stepOf.replace("{current}", String(onboardStep))}
                  </span>
                  <div className="flex space-x-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${onboardStep >= 1 ? "bg-amber-gold" : "bg-forest-800"}`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${onboardStep >= 2 ? "bg-amber-gold" : "bg-forest-800"}`} />
                  </div>
                </div>

                {onboardStep === 1 && (
                  <motion.div
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    className="space-y-3"
                  >
                    <label className="block text-xs font-serif italic text-earth-sand/90">
                      {words.emailPrompt}
                    </label>
                    <input
                      type="email"
                      value={onboardEmail}
                      onChange={(e) => setOnboardEmail(e.target.value)}
                      placeholder="steward@earth.org"
                      className="w-full px-4 py-2.5 bg-forest-950 border border-forest-800 rounded-xl text-earth-sand text-xs focus:outline-none focus:border-amber-gold/50 font-mono"
                      required
                    />
                    
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-1.5 bg-forest-900 hover:bg-forest-800 border border-forest-800 hover:border-amber-gold/40 text-amber-gold font-mono text-xs py-2.5 rounded-xl transition-all font-semibold"
                    >
                      <span>{words.btnNext}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}

                {onboardStep === 2 && (
                  <motion.div
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    className="space-y-3"
                  >
                    <label className="block text-xs font-serif italic text-earth-sand/90 mb-1">
                      {words.rolePrompt}
                    </label>
                    
                    <div className="space-y-2">
                      {[
                        { id: "steward", label: words.roleSteward },
                        { id: "professional", label: words.roleProfessional },
                        { id: "funder", label: words.roleFunder },
                        { id: "leader", label: words.roleLeader }
                      ].map((role) => (
                        <div
                          key={role.id}
                          onClick={() => setOnboardRole(role.id)}
                          className={`p-3 rounded-xl border text-xs font-serif italic cursor-pointer transition-all flex items-center space-x-3 ${
                            onboardRole === role.id 
                              ? "bg-forest-900 border-amber-gold text-amber-gold font-bold" 
                              : "bg-forest-950/60 border-forest-800/60 text-forest-300 hover:border-forest-700"
                          }`}
                        >
                          <CircleDot className={`w-3.5 h-3.5 ${onboardRole === role.id ? "text-amber-gold" : "text-forest-600"}`} />
                          <span>{role.label}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={!onboardRole || verifying}
                      className="w-full flex items-center justify-center space-x-2 bg-amber-gold hover:bg-yellow-400 text-[#3E3E2F] font-mono text-xs font-bold py-2.5 rounded-xl transition-all disabled:opacity-40"
                    >
                      {verifying ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-forest-950 border-t-transparent rounded-full animate-spin" />
                          <span>Encrypting DNA Seed...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          <span>{words.btnVerify}</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </motion.form>
            ) : (
              /* ONBOARDING COMPLETED SCREEN */
              <motion.div
                key="onboard-completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-serif text-base text-earth-sand font-bold">{words.completedTitle}</h5>
                  <p className="text-xs text-forest-300 leading-relaxed font-light">
                    {words.completedDesc}
                  </p>
                </div>

                <div className="bg-forest-950 border border-forest-800/40 p-4 rounded-xl text-left font-mono text-[10px] text-forest-400 leading-normal space-y-1.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 bg-emerald-950 text-emerald-400 uppercase font-bold tracking-tight text-[8px] border-b border-l border-emerald-900 rounded-bl">
                    VERIFIED
                  </div>
                  <p><span className="text-amber-gold">ID HASH:</span> QmSh92...e67f</p>
                  <p><span className="text-amber-gold">EMAIL:</span> {onboardEmail}</p>
                  <p><span className="text-amber-gold">ROLE:</span> {onboardRole.toUpperCase()}</p>
                  <p><span className="text-amber-gold">INSCRIBED:</span> BLOCK #18,495,204</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: STEWARDSHIP KEYS & SMART CONTRACT AUTOMATIC REWARDS (CAP. 05) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="border-b border-forest-800/30 pb-3">
            <h3 className="font-serif text-lg text-earth-sand font-medium">{words.activeKeys}</h3>
            <p className="text-xs text-forest-300 leading-relaxed font-light mt-0.5">
              {words.keysDesc}
            </p>
          </div>

          <div className="space-y-4">
            {stewardshipKeys.map((k) => (
              <div 
                key={k.id} 
                className="p-5 rounded-2xl bg-forest-900/15 border border-forest-800/25 space-y-4 hover:border-amber-gold/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual decoration */}
                <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-amber-gold">
                  <Award className="w-24 h-24" />
                </div>

                {/* Key metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 rounded-full bg-forest-950 border border-amber-gold/40 text-amber-gold animate-float">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-earth-sand font-bold">{k.name}</h4>
                      <p className="text-[10px] font-mono text-forest-400 uppercase tracking-wider">
                        Tier: {k.tier} • Holder: {k.holder}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-forest-400 block uppercase">{words.multiplier}</span>
                    <span className="text-sm font-bold text-amber-gold font-mono">{k.multiplier}x Yield</span>
                  </div>
                </div>

                <p className="text-xs text-forest-300 font-serif italic leading-relaxed">
                  "{k.description}"
                </p>

                {/* Claim action bar */}
                <div className="pt-3 border-t border-forest-800/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-forest-500 uppercase block">Total Payouts Logged</span>
                    <span className="text-xs font-mono font-bold text-earth-sand">{k.rewardsClaimed}</span>
                  </div>

                  {claimSuccess === k.id ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                      <span>{words.claimDone}</span>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => claimRewards(k.id)}
                      disabled={rewardClaimingId !== null}
                      className="px-4 py-2 rounded-full bg-forest-950/80 border border-forest-800 hover:border-amber-gold/50 text-xs font-mono text-amber-gold font-bold hover:bg-forest-900/60 disabled:opacity-45 transition-all flex items-center space-x-2"
                    >
                      {rewardClaimingId === k.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-amber-gold border-t-transparent rounded-full animate-spin" />
                          <span>{words.claimWait}</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-3.5 h-3.5" />
                          <span>{words.btnClaim}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </motion.div>
  );
};
