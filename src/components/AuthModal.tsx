"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { getSupabaseClient } from "../../lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: string) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [classLevel, setClassLevel] = useState("terminale");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMsg(
        "Désolé, Supabase n'est pas encore connecté à cette instance (variables d'environnement manquantes).",
      );
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: "student",
              class_level: classLevel,
            },
          },
        });

        if (error) throw error;

        setSuccessMsg("Votre compte a été créé avec succès !");
        onClose();
        router.push("/");
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const userRole = data.user?.user_metadata?.role || "student";
        onSuccess(userRole);
        onClose();
        router.push("/student");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "Une erreur s'est produite lors de l'authentification.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Conteneur plein écran : c'est LUI qui scrolle si besoin, jamais la carte */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-md"
      >
        {/* min-h-full + items-center = centré verticalement quand ça rentre,
            scroll naturel de la page quand ça déborde (mobile + champs inscription) */}
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/80 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/80 dark:ring-white/10"
          >
            {/* Halo ambiant — bleu de marque */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#0066FF]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-0 h-48 w-48 rounded-full bg-[#3385FF]/10 blur-3xl" />

            {/* Barre de dégradé en haut */}
            <div className="relative h-1.5 w-full bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#3385FF]" />

            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 rounded-full border border-transparent p-2 text-slate-400 transition-all duration-200 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-600 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-6 sm:p-8">
              {/* En-tête */}
              <div className="mb-6 sm:mb-8 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mx-auto mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0052CC] to-[#0066FF] shadow-lg shadow-[#0066FF]/20"
                >
                  <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {isSignUp ? "Créer un compte" : "Bon retour !"}
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {isSignUp
                    ? "Rejoignez la plateforme d'apprentissage nationale du Togo."
                    : "Connectez-vous pour accéder à vos cours et exercices."}
                </p>
              </div>

              {/* Alertes */}
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 backdrop-blur-sm dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-700 backdrop-blur-sm dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulaire */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-5">
                <AnimatePresence mode="popLayout">
                  {isSignUp && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 sm:space-y-5 overflow-hidden"
                    >
                      {/* Nom complet */}
                      <div className="space-y-1.5">
                        <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Nom Complet
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0066FF] dark:text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="Ex: Koffi Amen"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#0066FF] dark:focus:bg-slate-800 dark:focus:ring-[#0066FF]/20"
                          />
                        </div>
                      </div>

                      {/* Niveau (seul champ restant, plein largeur) */}
                      <div className="space-y-1.5">
                        <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Niveau
                        </label>
                        <div className="relative">
                          <select
                            value={classLevel}
                            onChange={(e) => setClassLevel(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white/50 py-3 pl-4 pr-10 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-[#0066FF] dark:focus:bg-slate-800 dark:focus:ring-[#0066FF]/20"
                          >
                            <option value="seconde">Seconde</option>
                            <option value="premiere">Première</option>
                            <option value="terminale">Terminale</option>
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Adresse Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0066FF] dark:text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="nom@ecole.tg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#0066FF] dark:focus:bg-slate-800 dark:focus:ring-[#0066FF]/20"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-1.5">
                  <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Mot De Passe
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0066FF] dark:text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white/50 py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#0066FF] dark:focus:bg-slate-800 dark:focus:ring-[#0066FF]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0052CC] to-[#0066FF] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0066FF]/25 transition-all duration-200 hover:shadow-[#0066FF]/40 hover:from-[#0047B3] hover:to-[#0066FF] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        {isSignUp ? "Créer un compte" : "Se connecter"}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              {/* Bascule connexion / inscription */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-[#0066FF] dark:text-slate-400 dark:hover:text-[#3385FF]"
                >
                  {isSignUp
                    ? "Vous possédez déjà un compte ? Connectez-vous"
                    : "Pas encore inscrit ? Créez un compte"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}