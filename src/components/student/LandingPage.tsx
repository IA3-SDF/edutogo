import {
  ArrowRight,
  Atom,
  Award,
  BookMarked,
  BookOpen,
  Calculator,
  CheckCircle,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Map as MapIcon,
  Smartphone,
  Sparkles,
  Users
} from "lucide-react";
import React from "react";
import { fetchPopularChapters } from "../../../lib/supabaseFunctions";
import { Level, Subject } from "../../../types";

interface LandingPageProps {
  levels: Level[];
  subjects: Subject[];
  onSelectLevel: (levelId: string) => void;
  onSelectChapter?: (chapterId: string, levelSlug: string) => void;
  onEnterAdmin: () => void;
  isDarkMode: boolean;
}

// fetchPopularChapters appelle Supabase RPC get_popular_chapters()
// avec fallback automatique vers données statiques si offline

export const LandingPage: React.FC<LandingPageProps> = ({
  levels,
  subjects,
  onSelectLevel,
  onSelectChapter,
  onEnterAdmin,
  isDarkMode,
}) => {
  const [popularLessons, setPopularLessons] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await fetchPopularChapters(8);
        setPopularLessons(data);
      } catch (e) {
        console.error("Erreur de chargement des chapitres populaires", e);
      }
    }
    load();
  }, []);

  // Safe helper to count subjects in a level
  const getSubjectCountStr = (levelId: string) => {
    const count = subjects.filter((s) => s.levelId === levelId).length;
    return `${count} matières disponibles`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D1A] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Premium Togo Flag Top Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-yellow-400 to-red-600 fixed top-0 left-0 right-0 z-50 animate-pulse" />

      {/* ============================================================
         SSTÈME DE HALOS LUMINEUX D'ARRIÈRE-PLAN (Premium Gradient Blobs)
         ============================================================ */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] -left-40 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-10 w-[450px] h-[450px] bg-yellow-500/5 dark:bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute -bottom-20 left-1/3 w-[550px] h-[550px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* ============================================================
         SCHÉMAS DE FONCTIONS MATHÉMATIQUES & DIAGRAMMES FILIGRANES
         ============================================================ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-15 dark:opacity-30 select-none">
        
        {/* Schéma 1 : Repère Cartésien avec Parabole de second degré */}
        <svg className="absolute top-[10%] left-[3%] w-72 h-72 text-emerald-600/15 dark:text-emerald-400/15" viewBox="0 0 200 200">
          <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
          <path d="M 40,40 Q 100,180 160,40" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 15,100 C 45,30 75,170 105,100 C 135,30 165,170 195,100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <text x="180" y="92" fontSize="9" fill="currentColor" className="font-mono opacity-50">x</text>
          <text x="106" y="22" fontSize="9" fill="currentColor" className="font-mono opacity-50">f(x)</text>
        </svg>

        {/* Schéma 2 : Triangle Rectangle de Pythagore et Trigonométrie */}
        <svg className="absolute top-[42%] right-[2%] w-64 h-64 text-sky-600/15 dark:text-sky-400/15" viewBox="0 0 200 200">
          <polygon points="30,160 170,160 170,30" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 155,160 L 155,145 L 170,145" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 55,160 A 25,25 0 0 1 50,142" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <text x="60" y="152" fontSize="10" fill="currentColor" className="font-mono opacity-50">θ</text>
          <text x="95" y="176" fontSize="9" fill="currentColor" className="font-mono opacity-50">cos(θ)</text>
          <text x="176" y="100" fontSize="9" fill="currentColor" className="font-mono opacity-50">sin(θ)</text>
        </svg>

        {/* Schéma 3 : Cercle Trigonométrique unitaire */}
        <svg className="absolute bottom-[28%] left-[2%] w-80 h-80 text-indigo-600/15 dark:text-indigo-400/15" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="15" y1="100" x2="185" y2="100" stroke="currentColor" strokeWidth="0.8" />
          <line x1="100" y1="15" x2="100" y2="185" stroke="currentColor" strokeWidth="0.8" />
          <line x1="100" y1="100" x2="153" y2="47" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="153" cy="47" r="4" fill="currentColor" />
          <line x1="153" y1="47" x2="153" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="153" y1="47" x2="100" y2="47" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <text x="120" y="120" fontSize="8" fill="currentColor" className="font-mono opacity-50">R = 1</text>
        </svg>

        {/* Schéma 4 : Courbe en Cloche de Gauss (Loi Normale) */}
        <svg className="absolute top-[26%] left-[38%] w-[380px] h-40 text-purple-600/15 dark:text-purple-400/15" viewBox="0 0 300 150">
          <path d="M 10,130 L 290,130" stroke="currentColor" strokeWidth="1" />
          <path d="M 10,130 C 80,130 110,25 150,25 C 190,25 220,130 290,130" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <line x1="150" y1="25" x2="150" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <text x="156" y="40" fontSize="9" fill="currentColor" className="font-mono opacity-50">μ (Espérance)</text>
          <text x="210" y="90" fontSize="9" fill="currentColor" className="font-mono opacity-50">σ (Écart-type)</text>
        </svg>

        {/* Schéma 5 : Somme de Vecteurs et Chasles */}
        <svg className="absolute bottom-[8%] right-[8%] w-64 h-64 text-amber-600/15 dark:text-amber-400/15" viewBox="0 0 200 200">
          <path d="M 30,150 L 110,80" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 110,80 L 170,140" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 30,150 L 170,140" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
          <text x="60" y="110" fontSize="9" fill="currentColor" className="font-mono opacity-50">⃗u</text>
          <text x="145" y="105" fontSize="9" fill="currentColor" className="font-mono opacity-50">⃗v</text>
          <text x="100" y="155" fontSize="10" fill="currentColor" className="font-mono font-bold opacity-50">⃗w = ⃗u + ⃗v</text>
        </svg>
      </div>

      {/* ============================================================
         FORMULES MATHÉMATIQUES SUSPENDUES (Finition premium relief)
         ============================================================ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-40 dark:opacity-75">
        
        {/* Formule 1 : Probabilités d'intersection */}
        <div className="absolute top-24 left-[5%] xl:left-[10%] rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105 pointer-events-auto cursor-help">
          <div className="px-3.5 py-1.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
            {"P(A ∪ B) = P(A) + P(B) - P(A ∩ B)"}
          </div>
        </div>

        {/* Formule 2 : Suites numériques */}
        <div className="absolute top-[35%] right-[5%] xl:right-[12%] -rotate-6 hover:rotate-0 transition-all duration-500 hover:scale-105 pointer-events-auto cursor-help">
          <div className="px-3.5 py-1.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none text-xs font-mono text-sky-700 dark:text-sky-400 font-semibold">
            {"u_{n+1} = q × u_n"}
          </div>
        </div>

        {/* Formule 3 : Physique quantique */}
        <div className="absolute bottom-[45%] left-[8%] rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-105 pointer-events-auto cursor-help">
          <div className="px-3.5 py-1.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none text-xs font-mono text-purple-700 dark:text-purple-400 font-semibold">
            {"E = m · c²"}
          </div>
        </div>

        {/* Formule 4 : Limites mathématiques */}
        <div className="absolute top-[68%] left-[2%] xl:left-[6%] -rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-105 pointer-events-auto cursor-help">
          <div className="px-3.5 py-1.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none text-xs font-mono text-indigo-700 dark:text-indigo-400 font-semibold">
            {"lim_{n → +∞} 1/n = 0"}
          </div>
        </div>

        {/* Formule 5 : Probabilités conditionnelles */}
        <div className="absolute top-48 right-[3%] xl:right-[8%] rotate-45 hover:rotate-0 transition-all duration-500 hover:scale-105 pointer-events-auto cursor-help">
          <div className="px-3.5 py-1.5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none text-xs font-mono text-rose-700 dark:text-rose-400 font-semibold">
            {"P_A(B) = P(A ∩ B) / P(A)"}
          </div>
        </div>
      </div>

      {/* ============================================================
         HERO SECTION (Disposition asymétrique premium)
         ============================================================ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Colonne gauche : Appels à l'action */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* National Badge Highlight */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide transition-all shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Conforme au Programme National du Togo (M.E.P.S.T)
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
              Toutes les ressources pour <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-sky-600 dark:from-emerald-400 dark:via-emerald-300 dark:to-sky-400 font-black">
                réussir ton Bac
              </span>
              , gratuitement.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Prépare tes examens nationaux de la Seconde à la Terminale avec des cours
              structurés par des inspecteurs togolais, des fiches d'exercices
              corrigées pas à pas et des annales du Baccalauréat I & II.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="btn-start-revision"
                onClick={() => onSelectLevel("terminale")}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-center cursor-pointer"
              >
                Commencer à réviser
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                id="btn-admin-demo"
                onClick={onEnterAdmin}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-xl shadow-xs transition-colors text-center cursor-pointer"
              >
                Espace Éditeur / Admin
                <GraduationCap className="h-5 w-5" />
              </button>
            </div>

            {/* Confiance sociale (Lycéens togolais) */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                  alt="Élève Togolais 1"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
                  alt="Élève Togolais 2"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=120&auto=format&fit=crop"
                  alt="Élève Togolais 3"
                />
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-600 text-white text-xs font-bold font-mono">
                  +15k
                </div>
              </div>
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white font-display">
                  +15,000 lycéens togolais
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-400">
                  utilisent EduTogo pour préparer sereinement leurs examens d'État.
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
             COLONNE DROITE : LE CHEF-D'ŒUVRE VISUEL (SVG TOGO OFFICIEL AVEC EFFET LUMINEUX ET ÉLÈVE)
             ============================================================ */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-sky-400 rounded-3xl blur-2xl opacity-10 dark:opacity-20 transform rotate-6 scale-95" />
            
            {/* Conteneur principal Premium Glassmorphism */}
            <div className="relative bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200/80 dark:border-slate-800/90 rounded-3xl p-6.5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-2xl overflow-hidden group">
              
              {/* Reflet de lumière intérieur */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <MapIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Régions Éducatives</h3>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      Carte Officielle du Togo
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 dark:bg-yellow-400/5 text-yellow-600 dark:text-yellow-400 border border-yellow-400/20 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                  Ligne Académique Active
                </div>
              </div>

              {/* SPLIT VISUEL : À gauche l'étudiant, à droite le Togo officiel en SVG */}
              <div className="grid grid-cols-12 gap-4 items-center min-h-[320px]">
                
                {/* 1. Illustration Étudiant (Glass Card) */}
                <div className="col-span-5 flex flex-col justify-between h-full space-y-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-500/20 rounded-2xl relative shadow-sm text-left">
                    <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2 animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Mon BAC II</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">Objectif Mention</span>
                  </div>

                  <div className="p-4 bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl text-left">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                      Lycéen Togolais
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal font-medium mt-1">
                      Connecté depuis Lomé, Kara ou Dapaong, j'accède aux fiches d'exercices à tout moment.
                    </p>
                  </div>
                </div>

                {/* 2. LA CARTE OFFICIELLE DU TOGO EN SVG (Votre code SVG exact avec dégradé et stylisation haut de gamme) */}
                <div className="col-span-7 relative flex justify-center items-center">
                  <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 944 1024"
                    enableBackground="new 0 0 944 1024"
                    xmlSpace="preserve"
                    className="w-full max-h-[320px] drop-shadow-[0_12px_24px_rgba(16,185,129,0.18)] filter transition-all duration-300 group-hover:scale-[1.02]"
                  >
                    <defs>
                      <linearGradient id="togoNationalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" /> {/* Vert émeraude */}
                        <stop offset="50%" stopColor="#eab308" /> {/* Jaune or */}
                        <stop offset="100%" stopColor="#ef4444" /> {/* Rouge national */}
                      </linearGradient>
                    </defs>

                    {/* Tracé de la carte d'enseignement officielle */}
                    <g className="text-emerald-600/25 dark:text-emerald-400/20 fill-current stroke-emerald-500/40 dark:stroke-emerald-400/30 stroke-[8px]">
                      <path
                        fill="url(#togoNationalGrad)"
                        opacity="0.9"
                        stroke="none"
                        d="
                        M1.000000,958.463867 
                        C183.750107,958.006287 366.500214,958.018616 549.250305,958.016907 
                        C680.857666,958.015686 812.465027,957.995728 944.536194,957.992065 
                        C945.000000,980.324463 945.000000,1002.648926 945.000000,1024.950684 
                        C630.333313,1024.950684 315.666656,1024.950684 1.000000,1024.950684 
                        C1.000000,1002.910095 1.000000,980.918884 1.000000,958.463867 
                        M92.810211,979.411743 
                        C88.712830,982.741150 84.184494,979.162292 79.740112,980.101685 
                        C77.232468,980.631836 76.225510,980.827759 76.200493,983.173828 
                        C76.141937,988.665283 76.151726,994.157776 76.188225,999.649536 
                        C76.195885,1000.801575 76.282990,1002.055786 78.626373,1002.301697 
                        C81.907707,996.496521 77.260323,988.864563 81.614929,982.928894 
                        C84.452576,984.251648 84.198662,986.351929 84.226700,988.283203 
                        C84.282249,992.110596 84.255455,995.939148 84.311668,999.766541 
                        C84.329063,1000.950439 84.469666,1002.275085 86.068733,1002.255676 
                        C87.624222,1002.236694 87.835922,1000.926208 87.859978,999.743347 
                        C87.937775,995.916626 87.854904,992.085022 88.006454,988.262085 
                        C88.086815,986.234985 87.669151,983.762573 91.093636,983.051453 
                        C94.536674,989.048889 90.138641,996.543152 94.795494,1002.353516 
                        C95.875305,994.927795 97.257729,987.581909 94.782394,980.206238 
                        C94.666641,979.861450 93.957962,979.715576 92.810211,979.411743 
                        M111.684448,998.352783 
                        C111.670097,993.190186 111.668007,988.027527 111.633469,982.865051 
                        C111.623909,981.436707 111.306335,980.027832 109.494545,980.161133 
                        C107.891365,980.279114 108.023888,981.731140 107.993431,982.862427 
                        C107.881447,987.022461 107.886375,991.186768 107.704880,995.343262 
                        C107.640076,996.827515 107.308189,998.676025 105.453392,998.755737 
                        C103.260681,998.850037 102.897141,996.925537 102.850853,995.217285 
                        C102.751633,991.555969 102.884987,987.886841 102.726555,984.229370 
                        C102.655907,982.598511 103.526001,979.909607 100.757835,979.969604 
                        C98.407173,980.020630 99.185028,982.508850 99.138985,984.010010 
                        C99.026711,987.670044 99.087143,991.336853 99.141037,995.000061 
                        C99.253906,1002.672119 99.764717,1003.079346 107.101028,1001.473877 
                        C109.243362,1008.010742 101.583466,1004.767944 100.156944,1008.574585 
                        C102.983971,1010.227722 105.861115,1010.097290 108.595253,1009.102539 
                        C110.845612,1008.283752 111.562691,1006.099365 111.637428,1003.795959 
                        C111.686035,1002.298340 111.670158,1000.798706 111.684448,998.352783 M43.132484,979.493225 
                        C41.432003,979.972839 40.139015,980.928162 39.581860,982.666199 C39.265961,983.651611 39.185596,984.707764 40.142117,985.367371 C40.884068,985.879089 41.780918,985.745605 42.391609,985.038757 C43.721588,983.499268 45.210110,981.378479 46.969051,984.134705 C48.375038,986.337891 46.317410,987.831055 44.607586,988.875183 C41.851089,990.558472 39.296417,992.340454 38.560230,995.751404 C37.738899,999.556946 40.627716,1003.647705 43.564724,1002.318298 C46.196537,1001.127014 48.227253,1002.235474 51.100075,1002.536377 C52.015041,997.110718 51.602840,991.852905 51.537086,986.652771 C51.466125,981.041138 49.748402,979.582520 43.132484,979.493225 M67.655396,987.970337 
                        C64.098747,990.358093 59.950611,992.290588 60.366940,997.675659 C60.605488,1000.761414 62.161098,1003.461914 65.240547,1002.270630 C67.965843,1001.216370 70.216164,1002.195618 72.811638,1002.302490 C72.811638,995.952515 73.110542,989.856873 72.698761,983.809631 C72.454445,980.221802 68.710083,978.298462 65.149406,979.532227 C62.003574,980.622314 60.349773,982.715393 61.901073,986.103210 C64.617332,986.674255 64.432030,983.677979 65.872787,983.405212 C70.003014,982.623169 69.352715,984.940125 67.655396,987.970337 M54.290031,994.341187 
                        C54.916542,997.003906 52.815674,1000.506165 56.563435,1002.510620 C58.961208,996.418335 58.220562,976.732422 54.288414,973.465210 C54.288414,980.813538 54.288414,987.098877 54.290031,994.341187 z"
                      />
                      
                      {/* TRACÉ DU COEUR SCOLAIRE DU TOGO */}
                      <path
                        fill="url(#togoNationalGrad)"
                        opacity="0.95"
                        stroke="none"
                        d="
                        M594.853394,736.344299 
                        C597.896179,743.438904 598.402344,749.816162 593.005981,755.769409 
                        C590.230286,758.831665 592.253601,761.766663 594.278503,764.255615 
                        C598.692444,769.681030 603.240112,774.999512 607.800903,780.303406 
                        C615.996277,789.834045 620.767456,800.720825 621.353027,813.384521 
                        C621.498962,816.539001 620.589233,818.150085 617.261414,818.918640 C591.277832,824.919556 566.109863,833.716064 540.683167,841.616455 C536.798767,842.823303 533.669250,843.852844 532.163269,838.714478 C531.631775,836.901123 530.062927,836.170410 528.219238,836.304077 C518.028870,837.042664 512.186768,831.253784 508.029449,822.915222 C507.063934,820.978638 505.870056,819.111450 505.218323,817.072571 C504.003754,813.272949 501.650513,811.705322 497.714630,812.284851 C492.703522,813.022827 488.977356,811.002563 486.327850,806.777466 C485.142700,804.887451 483.495422,803.785828 481.321991,802.962463 C470.242310,798.765442 463.281769,791.242249 462.906738,778.832031 C462.794373,775.113953 460.998505,772.166809 458.983643,769.283081 C455.440552,764.212097 451.913452,759.165222 451.582397,752.641113 C451.452881,750.088135 449.238464,749.152893 447.372589,748.099548 C443.772858,746.067444 441.519562,743.096985 441.268463,738.952209 C440.920837,733.213684 439.164124,727.898743 437.204163,722.555969 C435.016785,716.593201 435.637878,713.522034 440.912170,710.627380 C447.708954,706.897095 449.532562,700.810242 450.543243,694.131470 C451.962677,684.751892 452.772614,675.311707 452.895355,665.800659 C452.943878,662.044800 451.353699,660.340393 447.970856,660.612183 C441.027679,661.170105 437.955597,657.008728 436.246124,651.324158 C434.464386,645.398987 433.551300,639.329895 434.592865,633.097534 C435.080658,630.178833 436.204865,627.595215 438.536987,625.800415 C442.475342,622.769470 444.079163,618.488953 445.596191,614.014648 C450.591034,599.283264 450.705963,584.316711 448.288574,569.137695 C447.321533,563.065735 446.432861,556.934082 446.198883,550.803284 C445.819183,540.854736 450.340088,533.278381 458.510468,527.645813 C463.744080,524.037842 464.040253,522.606079 461.192383,516.843689 C458.611816,511.622162 455.740326,506.544952 453.039062,501.382172 C451.941742,499.284943 449.935547,498.409668 447.984070,497.510834 C432.283508,490.279419 423.956818,476.430267 416.405853,462.013885 C414.280945,457.956940 416.419220,453.979675 421.184143,452.086426 C424.574402,450.739410 428.166321,449.896301 431.675934,448.854187 C434.548462,448.001251 435.618378,446.298706 435.030334,443.213562 C434.053040,438.086609 432.354492,433.198608 430.051544,428.595306 C425.914917,420.326691 425.755463,411.965027 428.644104,403.404785 C431.464691,395.046234 434.457855,386.746033 437.289734,378.391235 C439.794464,371.001678 439.103882,368.058960 434.323578,364.746185 C427.865540,360.270752 422.628662,360.284821 416.958527,364.794281 C416.828278,364.897827 416.711365,365.018036 416.583221,365.124420 C412.435608,368.567871 407.846283,371.156158 402.400482,368.990631 C396.882233,366.796295 395.850861,361.408417 394.859344,356.288818 C394.545807,354.669983 394.653412,352.967957 394.586609,351.303284 C394.337646,345.096588 395.912994,343.068848 401.930908,341.333771 C405.798981,340.218567 409.841888,340.965454 413.654755,340.232391 C414.437775,338.062714 413.094391,336.796326 412.088715,335.597260 C408.163452,330.917084 407.674286,325.478546 409.229156,320.023499 C411.643951,311.551483 411.688660,302.977112 411.770660,294.301208 C411.910431,279.515442 410.328430,264.650024 413.574829,249.974258 C414.230927,247.008286 412.871490,244.438065 410.964417,242.184555 C408.920258,239.768997 406.804169,237.406586 405.380890,234.535797 C404.158691,232.070694 401.790161,231.652237 399.455414,231.506287 C391.128906,230.985840 385.867126,226.731079 383.489014,218.789261 C380.770233,209.709732 374.869446,204.140152 365.586884,201.819244 C360.502075,200.547882 355.945435,197.900772 353.096527,193.246811 C349.274200,187.002655 348.982666,180.655624 353.463257,174.547134 C356.199768,170.816452 357.616028,166.863083 357.850555,162.109070 C358.138214,156.277954 360.444427,150.752075 362.682922,145.390518 C364.537750,140.947815 363.223297,138.931107 358.783722,138.040436 C353.077179,136.895569 347.453766,135.263626 341.710724,134.397705 C337.658142,133.786667 336.595398,132.007996 337.710083,128.350037 C338.048859,127.238373 338.383453,126.105423 338.528992,124.958008 C339.926361,113.940353 341.180573,116.469368 348.777893,118.011467 C376.826050,123.704659 404.816589,129.686081 432.898560,135.204041 C438.268127,136.259140 441.333313,137.743912 439.510956,143.758194 C439.395935,144.137711 439.769684,144.665329 439.979858,145.324173 C443.804626,145.576614 447.296143,144.072937 450.364777,142.445099 C461.317780,136.634827 472.981964,137.449432 484.591522,138.296143 C495.591003,139.098358 495.233521,139.403732 495.447418,150.591705 C495.652039,161.294968 492.165924,170.548767 485.924316,178.889893 C482.685364,183.218399 481.672607,187.675308 482.789673,192.944977 C484.566772,201.328293 483.105469,209.646423 480.547089,217.554443 C478.307434,224.477295 480.389740,228.577377 485.983795,232.664017 C508.058014,248.789978 530.642639,264.147003 553.785400,278.680115 C557.192017,280.819397 559.172729,283.162872 559.446350,287.314240 C560.726868,306.747681 562.310059,326.166473 560.370728,345.647308 C559.851929,350.858185 559.765137,355.965851 562.977112,360.548950 C563.627258,361.476654 564.117188,362.660919 564.257507,363.780029 C566.350281,380.462372 577.282532,392.016632 588.101685,403.224335 C595.299072,410.680176 598.158936,418.989746 598.325989,428.825226 C599.270752,484.447449 598.645081,540.085388 599.544067,595.699097 C600.147400,633.021179 600.268494,670.327148 600.083923,707.643555 C600.046509,715.202515 600.015869,715.334106 592.795288,716.068176 C589.419312,716.411377 588.975159,717.900391 589.911865,720.733276 C591.583069,725.788025 593.115479,730.888550 594.853394,736.344299"
                      />

                      {/* TRACÉ DU COEUR SCOLAIRE DU TOGO - Partie 2 */}
                      <path
                        fill="url(#togoNationalGrad)"
                        opacity="0.9"
                        stroke="none"
                        d="
                        M365.180328,132.132812 
                        C372.712494,135.305725 373.460175,136.949356 370.877472,144.711517 C370.351898,146.291016 369.917877,147.917465 369.223663,149.421677 C364.507446,159.641357 366.043518,171.820892 358.730560,181.380997 C356.476532,184.327545 358.356415,188.475159 361.392914,191.209045 C363.673370,193.262253 366.350586,194.630524 369.284393,195.343491 C380.205292,197.997452 386.899384,205.059830 390.149902,215.508682 C391.935120,221.247360 395.569061,223.879562 401.473236,224.071899 C404.456604,224.169083 407.656708,224.618256 409.596130,227.265594 C413.022247,231.942245 416.304382,236.733902 419.437256,241.611984 C421.092804,244.189804 421.812988,247.275558 421.134155,250.269913 C418.145630,263.452698 419.417969,276.811890 419.308411,290.105164 C419.220612,300.757019 419.798401,311.413940 416.520691,321.806793 C415.430664,325.263123 416.145233,328.640930 418.486725,331.702850 C419.983124,333.659668 421.191010,335.938232 422.069244,338.247162 C424.387939,344.343109 421.851532,348.018921 415.378754,348.206848 C412.881683,348.279358 410.374451,348.100403 407.882935,348.237396 C405.681305,348.358490 402.651520,347.655365 402.344513,350.986115 C402.012146,354.592407 401.707336,358.679474 404.859436,361.212067 C407.230194,363.116943 409.505127,360.928711 411.497742,359.406677 C421.280121,351.934326 429.862701,351.932831 439.776215,359.397614 C446.732574,364.635712 447.820984,371.475525 443.643738,382.894501 C440.499084,391.490906 437.213562,400.040161 434.995575,408.951141 C433.788025,413.802734 433.893280,418.439941 435.987793,423.080109 C438.522217,428.694916 440.944580,434.397797 442.211456,440.449738 C444.165436,449.784149 441.751740,453.537628 432.676239,456.503204 C429.767914,457.453583 426.387634,457.302765 423.532410,460.165314 C431.391754,472.005920 437.270111,485.422974 451.956421,491.006439 C454.967804,492.151306 457.534363,493.977173 459.120026,496.936310 C461.794006,501.926422 464.643494,506.828491 467.155853,511.898041 C472.592377,522.868042 471.913605,528.717773 461.830872,534.631592 C455.993805,538.055237 453.499664,543.745728 453.738464,550.280701 C453.956451,556.246826 454.691742,562.235596 455.723083,568.122559 C458.774750,585.542358 457.791351,602.591187 451.793732,619.286682 C450.718994,622.278442 449.856140,625.716248 447.329742,627.540833 C441.243103,631.936707 441.655792,637.893250 442.302155,644.130798 C443.013672,650.997131 443.976562,652.065430 450.832489,653.242371 C457.152008,654.327209 460.212799,657.047424 460.326080,662.278809 C460.600891,674.965149 459.623749,687.576904 457.015839,700.003662 C455.652313,706.500793 453.131744,712.422913 446.678650,715.707458 C443.807312,717.168823 443.969086,719.560181 445.044189,722.135010 C446.978210,726.766785 448.427979,731.511841 448.590210,736.593262 C448.678406,739.356506 450.218201,741.191711 452.681183,742.376892 C456.043030,743.994629 458.746490,746.678833 458.872772,750.306335 C459.093201,756.638245 462.576477,761.202271 465.847687,765.998657 C468.416168,769.764709 470.348328,773.704773 470.565002,778.418579 C470.990204,787.669739 475.228424,793.017029 484.232605,795.804688 C486.877991,796.623779 489.331329,797.731812 490.716858,800.140625 C492.909576,803.952942 495.996185,805.128601 500.284882,804.798706 C505.727905,804.380066 509.375397,806.925598 511.268890,812.281250 C512.423340,815.546509 514.374878,818.528259 515.948364,821.647400 C518.458557,826.623413 522.403687,829.022095 528.052185,828.713196 C531.822937,828.507080 535.373779,829.112976 537.852112,832.489563 C539.093140,834.180298 540.748413,833.627441 542.396240,833.117432 C565.138123,826.078552 587.721558,818.510437 610.796204,812.581543 C612.963623,812.024658 613.754761,810.874390 613.309448,808.575256 C612.286987,803.296326 610.620789,798.292053 607.978271,793.587524 C603.192993,785.068115 595.707825,778.715881 589.969299,770.950073 C583.974854,762.837952 581.642761,755.890991 588.207947,748.994019 C590.207642,746.893188 589.512573,744.480347 588.727966,741.965210 C586.059937,733.412842 582.210510,725.175476 581.660767,716.040710 C581.395020,711.624573 583.186829,708.827271 587.813477,708.796936 C591.101074,708.775452 592.256104,707.123230 592.398132,704.225159 C592.504089,702.063904 592.637207,699.900696 592.641663,697.738159 C592.712158,663.423462 592.869263,629.120911 591.897339,594.798950 C590.874207,558.671448 592.000793,522.501221 591.099060,486.349335 C590.729736,471.541992 591.493835,456.708984 591.593811,441.886627 C591.695740,426.780151 589.444519,413.174255 577.067322,401.780548 C567.054626,392.563385 558.630554,381.024078 557.228943,366.282166 C557.138672,365.332062 556.640625,364.339630 556.094116,363.527100 C552.525391,358.220978 552.015930,352.285889 552.808167,346.236633 C555.163330,328.252930 552.396423,310.307617 552.592773,292.343445 C552.635376,288.450745 551.142029,285.466003 547.386536,283.434875 C542.711243,280.906189 538.327148,277.822845 533.897034,274.859894 C514.652832,261.988861 495.232300,249.376144 477.074097,234.944824 C472.121643,231.008804 470.826630,226.610199 472.332062,220.498276 C474.311249,212.462921 477.285461,204.282532 475.530457,195.935394 C473.660217,187.040161 475.570099,179.690689 481.036224,172.605057 C486.054291,166.100250 488.383667,158.478256 487.771729,150.118332 C487.648102,148.429062 487.810822,146.470810 485.548950,146.285995 C476.290894,145.529526 466.989899,143.936783 457.925812,147.652344 C449.496582,151.107681 440.865417,153.950012 432.320648,156.180756 C430.357910,154.057281 431.405914,152.215393 431.555420,150.476990 C432.200500,142.976410 431.909943,142.709671 424.745972,141.291519 C408.917664,138.158234 393.118958,134.875656 377.304413,131.672653 C367.304077,129.647232 357.296967,127.655441 347.292877,125.648582 C347.186920,126.072159 347.080963,126.495735 346.975006,126.919319 C352.799286,128.563141 358.623535,130.206955 365.180328,132.132812 z"
                      />

                      {/* TRACÉ DES ÎLOTS ET DETAILS DE FRONTIÈRE */}
                      <path d="M930.939148,25.646000 C936.751465,28.870855 939.200989,33.455074 938.004028,38.266235 C936.763733,43.251694 932.185059,46.854969 927.098145,46.848862 C922.208435,46.842991 917.951599,43.473732 916.565247,38.512291 C914.264465,30.278410 921.548401,23.524313 930.939148,25.646000 M921.434998,33.225410 C920.346863,37.547344 921.520264,41.005661 925.941589,42.326706 C929.289917,43.327145 931.714172,41.265503 933.063843,38.296833 C934.512451,35.110554 933.369507,32.286388 930.689941,30.440300 C927.168213,28.013992 924.109131,29.165676 921.434998,33.225410 z" fill="url(#togoNationalGrad)" opacity="0.85" />
                      <path d="M871.957275,26.683865 C877.130127,23.902359 881.707275,24.361914 885.576172,28.205227 C888.758728,31.366745 889.814819,35.318432 888.095886,39.672722 C886.416077,43.927704 883.266418,46.514767 878.679749,46.750671 C873.957703,46.993542 870.328674,44.901913 868.112061,40.611916 C865.949036,36.425529 866.675903,32.560230 869.494507,28.979063 C870.105103,28.203295 870.908142,27.578945 871.957275,26.683865 M881.157959,30.142584 C877.566833,28.189009 874.736877,29.266068 872.556091,32.435078 C870.853821,34.908798 870.879211,37.501217 872.810547,39.821350 C875.253296,42.755764 878.203186,43.721954 881.554016,41.261074 C885.231812,38.560001 885.260803,34.998665 881.157959,30.142584 z" fill="url(#togoNationalGrad)" opacity="0.85" />
                      <path d="M911.641235,43.141876 C906.446106,47.661438 900.474304,47.813316 896.142029,43.907322 C892.207642,40.360104 891.490540,34.480232 894.420898,29.794641 C897.105164,25.502522 903.025330,23.707727 908.101379,25.783979 C909.672241,26.426489 912.117371,26.928013 910.995361,29.452435 C910.086853,31.496277 908.380615,30.553396 906.725281,29.941032 C902.509155,28.381414 898.912292,29.795784 897.579102,33.270901 C896.307434,36.585373 897.960205,40.671097 901.331116,41.986408 C903.968994,43.015690 906.479370,43.104939 907.511597,39.820293 C907.282654,39.379505 907.221008,39.221561 907.127075,39.085968 C906.058594,37.543144 902.230896,39.208370 902.938599,36.086990 C903.511597,33.559761 906.297302,34.852829 908.116882,34.647068 C910.731323,34.351421 912.289429,35.481659 912.158569,38.307789 C912.089661,39.795784 911.938904,41.279991 911.641235,43.141876 z" fill="url(#togoNationalGrad)" opacity="0.85" />
                      <path d="M857.832642,25.012753 C859.444397,25.051252 860.610046,25.022280 861.759033,25.147188 C863.135071,25.296789 864.517883,25.695053 864.447693,27.432430 C864.388733,28.891344 863.173950,29.287926 861.949280,29.286081 C858.763428,29.281281 858.142761,31.230978 858.199463,33.881012 C858.263245,36.861061 858.249390,39.844650 858.183411,42.824799 C858.150330,44.317940 858.100098,46.064651 855.959839,45.969032 C853.937439,45.878681 853.827271,44.179398 853.792908,42.675800 C853.728577,39.861385 853.715820,37.043598 853.774902,34.229179 C853.831116,31.552710 853.729492,29.131561 850.042480,29.237644 C848.790100,29.273680 847.706299,28.716238 847.675842,27.256948 C847.637329,25.416918 849.094788,25.191317 850.424988,25.123201 C852.738831,25.004709 855.060730,25.041653 857.832642,25.012753 z" fill="url(#togoNationalGrad)" opacity="0.85" />
                      <path d="M42.817642,995.342773 C43.516121,993.146667 44.802551,992.115051 46.846470,991.491760 C48.313648,994.296570 48.561241,996.948486 45.858650,998.477478 C43.511677,999.805237 42.833096,997.754456 42.817642,995.342773 z" fill="url(#togoNationalGrad)" opacity="0.85" />
                      <path d="M69.247429,995.979614 C68.775101,997.928772 68.026741,999.177490 66.142601,998.868713 C65.049583,998.689575 64.364517,997.788269 64.344467,996.767578 C64.292389,994.116516 65.783638,992.605896 68.094910,991.846680 C69.720383,992.918274 69.110718,994.364075 69.247429,995.979614 z" fill="url(#togoNationalGrad)" opacity="0.85" />
                    </g>

                    {/* VILLES STRATÉGIQUES - Noeuds d'Ondes Lumineuses sur coordonnés de votre carte */}
                    {/* Dapaong */}
                    <g transform="translate(410, 160)">
                      <circle r="22" fill="#F59E0B" className="animate-ping opacity-25" />
                      <circle r="12" fill="#F59E0B" className="opacity-40" />
                      <circle r="6" fill="#F59E0B" />
                    </g>

                    {/* Kara */}
                    <g transform="translate(480, 380)">
                      <circle r="24" fill="#10B981" className="animate-ping opacity-25" />
                      <circle r="13" fill="#10B981" className="opacity-40" />
                      <circle r="7" fill="#10B981" />
                    </g>

                    {/* Sokodé */}
                    <g transform="translate(480, 520)">
                      <circle r="22" fill="#EF4444" className="animate-ping opacity-25" />
                      <circle r="12" fill="#EF4444" className="opacity-40" />
                      <circle r="6" fill="#EF4444" />
                    </g>

                    {/* Atakpamé */}
                    <g transform="translate(490, 680)">
                      <circle r="22" fill="#10B981" className="animate-ping opacity-25" />
                      <circle r="12" fill="#10B981" className="opacity-40" />
                      <circle r="6" fill="#10B981" />
                    </g>

                    {/* Lomé */}
                    <g transform="translate(540, 820)">
                      <circle r="28" fill="#F59E0B" className="animate-ping opacity-30" />
                      <circle r="16" fill="#F59E0B" className="opacity-40" />
                      <circle r="9" fill="#F59E0B" />
                    </g>
                  </svg>

                  {/* Villes de révision flottantes sur la carte officielle */}
                  <div className="absolute top-[12%] right-[40%] text-[8px] font-bold font-mono px-1.5 py-0.5 bg-slate-900/80 text-yellow-400 rounded-sm border border-yellow-400/20 shadow-xs pointer-events-none">Dapaong</div>
                  <div className="absolute top-[32%] right-[32%] text-[8px] font-bold font-mono px-1.5 py-0.5 bg-slate-900/80 text-emerald-400 rounded-sm border border-emerald-400/20 shadow-xs pointer-events-none">Kara</div>
                  <div className="absolute top-[48%] right-[32%] text-[8px] font-bold font-mono px-1.5 py-0.5 bg-slate-900/80 text-rose-400 rounded-sm border border-rose-400/20 shadow-xs pointer-events-none">Sokodé</div>
                  <div className="absolute top-[64%] right-[30%] text-[8px] font-bold font-mono px-1.5 py-0.5 bg-slate-900/80 text-emerald-400 rounded-sm border border-emerald-400/20 shadow-xs pointer-events-none">Atakpamé</div>
                  <div className="absolute bottom-[16%] right-[22%] text-[9px] font-extrabold font-mono px-2 py-0.5 bg-slate-900/90 text-yellow-400 rounded border border-yellow-400/40 shadow-xs pointer-events-none tracking-wide animate-pulse">LOMÉ</div>
                </div>

              </div>

              {/* Étiquette d'illustration */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Régions des Savanes au Golfe</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle className="h-3 w-3" /> Serveur National Synchrone
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ============================================================
         SELECTION DE NIVEAU SCOLAIRE
         ============================================================ */}
      <div className="bg-white dark:bg-slate-900/20 border-y border-slate-200/60 dark:border-slate-800/80 py-16 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white">
              Choisis ton niveau scolaire
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Accède instantanément au programme officiel conforme aux exigences
              du ministère de l'éducation nationale du Togo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((lvl) => {
              const countStr = getSubjectCountStr(lvl.id);
              let badgeColor =
                "bg-blue-100 text-blue-850 dark:bg-blue-900/30 dark:text-blue-300";
              if (lvl.id === "premiere") {
                badgeColor =
                  "bg-amber-100 text-amber-850 dark:bg-amber-900/30 dark:text-amber-300";
              } else if (lvl.id === "terminale") {
                badgeColor =
                  "bg-emerald-100 text-emerald-850 dark:bg-emerald-900/30 dark:text-emerald-300";
              }

              return (
                <div
                  key={lvl.id}
                  id={`lvl-card-${lvl.id}`}
                  onClick={() => onSelectLevel(lvl.id)}
                  className="group relative bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6.5 text-left shadow-xs hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-400/40 cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`inline-flex px-3 py-1 ${badgeColor} text-xs font-bold rounded-full mb-4`}>
                    {lvl.name}
                  </div>
                  <h3 className="font-display text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {lvl.id === "terminale"
                      ? "Terminale (A, C, D)"
                      : lvl.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
                    {lvl.id === "terminale"
                      ? "Baccalaureat II. L'année décisive pour décrocher ton diplôme et entamer tes études supérieures au Togo."
                      : lvl.id === "premiere"
                        ? "Baccalauréat I (Probatoire). Prépare les bases rigoureuses de toutes les matières scientifiques et littéraires."
                        : "Tranche d'orientation et d'entrée au lycée. Consolidation de toutes les méthodologies de composition."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <span>{countStr}</span>
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
         CHAPITRES ET LEÇONS POPULAIRES
         ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="space-y-4 mb-12 text-left">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BookMarked className="h-4 w-4" />
            Ressources Recommandées
          </div>
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white">
            Leçons & Chapitres Populaires
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            Explore les notions clés indispensables, consultées par des milliers
            d'élèves togolais cette semaine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularLessons.map((lesson, idx) => {
            const IconComponent =
              lesson.icon === "Calculator"
                ? Calculator
                : lesson.icon === "Atom"
                  ? Atom
                  : lesson.icon === "FlaskConical"
                    ? FlaskConical
                    : BookOpen;
            return (
              <div
                key={idx}
                onClick={() => {
                  const rawLevel = lesson.level || "terminale";
                  const levelSlug = rawLevel
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]/g, "");
                  if (onSelectChapter && lesson.chapterId) {
                    onSelectChapter(lesson.chapterId, levelSlug);
                  } else {
                    onSelectLevel(levelSlug);
                  }
                }}
                className="group relative bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-slate-400">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-full">
                    {lesson.level}
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {lesson.title}
                </h4>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="font-bold">{lesson.subject}</span>
                  <span className="flex items-center gap-1 font-mono font-bold text-slate-500 dark:text-slate-400">
                    <Users className="h-3.5 w-3.5" /> {lesson.students}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
         BANNIÈRE DE MISE EN VALEUR PREMIUM (Bento Style & Adaptatif)
         ============================================================ */}
      <div className="relative overflow-hidden bg-slate-100/50 dark:bg-slate-900/40 text-slate-900 dark:text-white py-20 lg:py-24 border-y border-slate-200 dark:border-slate-900 transition-colors duration-300">
        
        {/* Cercles de lumière flous en arrière-plan */}
        <div className="absolute top-1/2 -left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none transition-opacity" />
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none transition-opacity" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-full blur-3xl pointer-events-none transition-opacity" />

        {/* Motif de grille discret pour donner de la texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Colonne gauche : Textes et Boutons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide transition-colors">
                <GraduationCap className="h-4 w-4 text-yellow-500 dark:text-yellow-400 animate-pulse" />
                Plateforme d'Excellence Togolaise
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight transition-colors">
                Prends le contrôle de ta{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-emerald-600 to-sky-600 dark:from-yellow-400 dark:via-emerald-400 dark:to-sky-400">
                  réussite scolaire
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed transition-colors">
                Crée ton espace étudiant gratuit pour configurer ta série d'examen, 
                suivre ta progression en direct, sauvegarder tes chapitres favoris 
                et recevoir des astuces méthodologiques par SMS ou Telegram.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onSelectLevel("terminale")}
                  className="group relative px-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold rounded-xl shadow-[0_4px_20px_rgba(234,179,8,0.35)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Créer mon espace élève
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button
                  onClick={onEnterAdmin}
                  className="px-6 py-3.5 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 font-bold border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs dark:shadow-none transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Tableau des Professeurs
                </button>
              </div>
            </div>

            {/* Colonne droite : Grille Bento interactive (Cartes Premium) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative select-none">
              
              {/* Carte 1 : Statistiques d'audience */}
              <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-xl transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 group">
                <div className="h-9 w-9 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 transition-colors">+12 000</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">Élèves connectés à travers tout le Togo</div>
              </div>

              {/* Carte 2 : Séries & Examens */}
              <div className="col-span-1 bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-xl transition-all duration-300 hover:border-sky-500/40 hover:-translate-y-1 group mt-0 sm:mt-4">
                <div className="h-9 w-9 bg-sky-50 dark:bg-sky-500/10 rounded-lg flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400 group-hover:bg-sky-100 dark:group-hover:bg-sky-500/20 transition-colors">
                  <Award className="h-5 w-5" />
                </div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors">Séries A, C, D, E</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">Contenus officiels conformes au programme</div>
              </div>

              {/* Carte 3 : Notification SMS simulée */}
              <div className="col-span-2 sm:col-span-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800/80 p-4.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-xl transition-all duration-300 hover:border-yellow-500/30 hover:-translate-y-1 group">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2.5 mb-2.5 transition-colors">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                    <Smartphone className="h-3.5 w-3.5 text-amber-500 dark:text-yellow-400 animate-pulse" />
                    <span>Conseil Méthodo • Togo SMS</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono transition-colors">À l'instant</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed transition-colors">
                  "Astuce de révision : Pour ton épreuve de Mathématiques (Série D), revois l'exercice d'application sur les suites géométriques disponible sur EduTogo !"
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ============================================================
         FOOTER
         ============================================================ */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/70 py-12 text-sm text-slate-500 dark:text-slate-400 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-black text-slate-900 dark:text-white flex items-center">
                Edu<span className="text-emerald-500">Togo</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Plateforme nationale de révision académique, facilitant l'accès
              gratuit à de l'aide scolaire d'excellence pour tous les élèves
              togolais du lycée.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-slate-200 mb-3 font-display text-xs uppercase tracking-wider">
              Classes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectLevel("seconde")}
                  className="hover:text-emerald-600 font-semibold cursor-pointer"
                >
                  Lycée - Seconde
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectLevel("premiere")}
                  className="hover:text-emerald-600 font-semibold cursor-pointer"
                >
                  Lycée - Première
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectLevel("terminale")}
                  className="hover:text-emerald-600 font-semibold cursor-pointer"
                >
                  Lycée - Terminale (BAC II)
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-slate-200 mb-3 font-display text-xs uppercase tracking-wider">
              Ressources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectLevel("terminale")}
                  className="hover:text-emerald-600 font-semibold cursor-pointer"
                >
                  Cours de Mathématiques
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectLevel("terminale")}
                  className="hover:text-emerald-600 font-semibold cursor-pointer"
                >
                  Annales du BAC Togo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectLevel("terminale")}
                  className="hover:text-emerald-600 font-semibold cursor-pointer"
                >
                  Quiz & Évaluations
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-slate-200 mb-3 font-display text-xs uppercase tracking-wider">
              Contacts & Légal
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <span className="hover:text-emerald-600 block">Lomé, Togo</span>
              </li>
              <li>
                <span className="hover:text-emerald-600 block">
                  contact@edutogo.tg
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-600 block">
                  Mentions Légales & CGU
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © 2026 EduTogo. Plateforme Éducative Togolaise. Tous droits
            réservés.
          </p>
          <div className="flex gap-4">
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold rounded">
              TOGO PROPRE
            </span>
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-400 font-bold rounded">
              MINISTÈRE DE TUTELLE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};