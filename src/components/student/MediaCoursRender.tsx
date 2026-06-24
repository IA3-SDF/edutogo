"use client";

import {
    AlertTriangle,
    Film,
    Maximize2,
    Music,
    RotateCw,
    X,
} from "lucide-react";
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { bucketFromStoragePath, getSignedUrl } from "../../../lib/supabaseFunctions";

export type CourseMediaType = "image" | "audio" | "video";

export interface MediaCoursRenderProps {
  /** Soit un chemin de stockage stable (ex: "media/terminale/xxx.png"),
   *  soit — pour compatibilité avec les anciens cours — une URL déjà signée. */
  url: string;
  type: CourseMediaType;
  name?: string;
}

// ──────────────────────────────────────────────────────────────────────────
// Résolution de la source réelle (signed URL fraîche)
// ──────────────────────────────────────────────────────────────────────────

const SIGNED_URL_TTL = 60 * 60 * 24; // 24h, aligné sur MediaAssetUploader

type ResolveStatus = "loading" | "ready" | "error";

function isDirectUrl(raw: string): boolean {
  return /^(https?:|blob:|data:)/i.test(raw);
}

/** Extrait {bucket, path} d'une URL signée Supabase déjà construite, pour
 *  pouvoir la régénérer si elle a expiré (cas des cours rédigés avant le
 *  correctif, où l'URL — et non le chemin — était gravée dans la balise). */
function extractSignedPath(rawUrl: string): { bucket: string; path: string } | null {
  const match = rawUrl.match(/\/storage\/v1\/object\/sign\/([^/]+)\/([^?]+)/);
  if (!match) return null;
  return { bucket: match[1], path: decodeURIComponent(match[2]) };
}

interface ResolvedMediaSrc {
  src: string | null;
  status: ResolveStatus;
  /** Relance la résolution depuis zéro (bouton "Réessayer"). */
  retry: () => void;
  /** À attacher sur onError du <img>/<video>/<audio> : tente une re-signature
   *  automatique une seule fois avant d'afficher l'état d'erreur définitif. */
  handleLoadError: () => void;
}

function useResolvedMediaSrc(rawValue: string): ResolvedMediaSrc {
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<ResolveStatus>("loading");
  const hasAttemptedResign = useRef(false);

  const resolve = useCallback(async () => {
    if (!rawValue) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    hasAttemptedResign.current = false;

    if (!isDirectUrl(rawValue)) {
      // Format courant : un chemin de stockage stable → toujours signé à neuf.
      const bucket = bucketFromStoragePath(rawValue);
      try {
        const signed = await getSignedUrl(bucket, rawValue, SIGNED_URL_TTL);
        if (signed) {
          setSrc(signed);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("[EduTogo] Échec de signature du média :", err);
        setStatus("error");
      }
      return;
    }

    // Format historique : une URL (signée ou publique) déjà construite.
    // On l'essaie directement ; handleLoadError gère la régénération si
    // elle a expiré (cas le plus fréquent pour les anciens cours).
    setSrc(rawValue);
    setStatus("ready");
  }, [rawValue]);

  useEffect(() => {
    resolve();
  }, [resolve]);

  const handleLoadError = useCallback(async () => {
    if (hasAttemptedResign.current) {
      setStatus("error");
      return;
    }
    hasAttemptedResign.current = true;

    const extracted = isDirectUrl(rawValue) ? extractSignedPath(rawValue) : null;
    if (!extracted) {
      setStatus("error");
      return;
    }

    try {
      const refreshed = await getSignedUrl(
        extracted.bucket,
        extracted.path,
        SIGNED_URL_TTL,
      );
      if (refreshed) {
        setSrc(refreshed);
        setStatus("ready");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("[EduTogo] Échec de re-signature du média :", err);
      setStatus("error");
    }
  }, [rawValue]);

  return { src, status, retry: resolve, handleLoadError };
}

// ──────────────────────────────────────────────────────────────────────────
// États partagés (chargement / erreur)
// ──────────────────────────────────────────────────────────────────────────

const LoadingState: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <div
    className={`flex items-center justify-center gap-2 text-(--color-text-faint) ${
      compact ? "py-3" : "absolute inset-0"
    }`}
  >
    <RotateCw className="h-4 w-4 animate-spin" />
    <span className="text-[10px] font-bold uppercase tracking-wide">
      Chargement du média…
    </span>
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void; compact?: boolean }> = ({
  onRetry,
  compact,
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 text-center ${
      compact ? "py-5" : "absolute inset-0"
    }`}
  >
    <AlertTriangle className="h-5 w-5 text-(--color-danger)" />
    <p className="text-[10px] font-bold text-(--color-text-muted) max-w-[220px]">
      Ce média est introuvable ou son lien a expiré.
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-1 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1 text-[9px] font-bold text-(--color-text) hover:bg-(--color-surface-alt) cursor-pointer"
    >
      <RotateCw className="h-3 w-3" /> Réessayer
    </button>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// Overlay plein écran
// ──────────────────────────────────────────────────────────────────────────

interface OverlayProps {
  src: string;
  type: CourseMediaType;
  name?: string;
  initialTime?: number;
  onClose: () => void;
}

const MediaFullscreenOverlay: React.FC<OverlayProps> = ({
  src,
  type,
  name,
  initialTime = 0,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleLoadedMetadata = useCallback(() => {
    if (mediaRef.current && initialTime > 0) {
      try {
        mediaRef.current.currentTime = initialTime;
      } catch {
        // certains navigateurs refusent le seek avant un play()
      }
    }
  }, [initialTime]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le média"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white p-2.5 transition-colors cursor-pointer"
      >
        <X className="h-5 w-5" />
      </button>

      {name && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 max-w-[60%] truncate rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white/80">
          {name}
        </div>
      )}

      {type === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name || "Média du cours"}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />
      )}

      {type === "video" && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl rounded-2xl bg-black shadow-2xl overflow-hidden"
          style={{ aspectRatio: "16 / 9", maxHeight: "85vh" }}
        >
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            controls
            autoPlay
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      )}

      {type === "audio" && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <Music className="h-9 w-9 text-white" />
          </div>
          <p className="truncate text-sm font-bold text-white">
            {name || "Piste audio"}
          </p>
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={src}
            controls
            autoPlay
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full"
          />
        </div>
      )}
    </div>,
    document.body,
  );
};

// ──────────────────────────────────────────────────────────────────────────
// Composant principal
// ──────────────────────────────────────────────────────────────────────────

export const MediaCoursRender: React.FC<MediaCoursRenderProps> = ({
  url,
  type,
  name,
}) => {
  const { src, status, retry, handleLoadError } = useResolvedMediaSrc(url);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedTime, setSavedTime] = useState(0);
  const inlineMediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(
    null,
  );

  const displayName =
    name || url.split("/").pop()?.split("?")[0] || "Média";

  const openFullscreen = useCallback(() => {
    if (inlineMediaRef.current && (type === "video" || type === "audio")) {
      setSavedTime(inlineMediaRef.current.currentTime || 0);
    }
    setIsExpanded(true);
  }, [type]);

  const closeFullscreen = useCallback(() => setIsExpanded(false), []);

  if (!url) return null;

  // ── IMAGE ────────────────────────────────────────────────────────────
  if (type === "image") {
    return (
      <>
        <div className="relative my-5 w-full overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface-alt) min-h-[140px]">
          {status === "loading" && <LoadingState />}
          {status === "error" && <ErrorState onRetry={retry} />}
          {status === "ready" && src && (
            <button
              type="button"
              onClick={openFullscreen}
              className="group relative block w-full cursor-zoom-in"
              aria-label={`Agrandir l'image ${displayName}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={displayName}
                loading="lazy"
                onError={handleLoadError}
                className="max-h-[420px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.015]"
              />
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Maximize2 className="h-3 w-3" /> Agrandir
              </span>
            </button>
          )}
        </div>
        {isExpanded && src && (
          <MediaFullscreenOverlay
            src={src}
            type={type}
            name={displayName}
            onClose={closeFullscreen}
          />
        )}
      </>
    );
  }

  // ── VIDÉO ────────────────────────────────────────────────────────────
  // Conteneur "aspect-video" : la hauteur se calcule automatiquement à
  // partir de la largeur disponible (comme un embed YouTube), donc le
  // rendu s'adapte à tout périphérique sans jamais déborder ni s'écraser.
  if (type === "video") {
    return (
      <>
        <div className="relative my-5 w-full overflow-hidden rounded-2xl border border-(--color-border) bg-black shadow-sm">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            {status === "loading" && <LoadingState />}
            {status === "error" && <ErrorState onRetry={retry} />}
            {status === "ready" && src && (
              <video
                ref={inlineMediaRef as React.RefObject<HTMLVideoElement>}
                src={src}
                controls
                playsInline
                preload="metadata"
                onError={handleLoadError}
                onDoubleClick={openFullscreen}
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}
          </div>

          {status === "ready" && (
            <>
              <span className="pointer-events-none absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                <Film className="h-3 w-3" /> Vidéo
              </span>
              <button
                type="button"
                onClick={openFullscreen}
                aria-label="Afficher la vidéo en plein écran"
                title="Agrandir (ou double-cliquez sur la vidéo)"
                className="absolute top-2.5 right-2.5 z-10 rounded-full bg-black/55 p-2 text-white transition-colors hover:bg-black/75 cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
        {isExpanded && src && (
          <MediaFullscreenOverlay
            src={src}
            type={type}
            name={displayName}
            initialTime={savedTime}
            onClose={closeFullscreen}
          />
        )}
      </>
    );
  }

  // ── AUDIO ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="relative my-5 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface-alt) p-3.5 shadow-sm min-h-[64px]">
        {status === "loading" && <LoadingState compact />}
        {status === "error" && <ErrorState onRetry={retry} compact />}
        {status === "ready" && src && (
          <div
            onDoubleClick={openFullscreen}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-accent-soft)">
              <Music className="h-5 w-5 text-(--color-accent)" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-xs font-bold text-(--color-text)"
                title={displayName}
              >
                {displayName}
              </p>
              <audio
                ref={inlineMediaRef as React.RefObject<HTMLAudioElement>}
                src={src}
                controls
                preload="metadata"
                onError={handleLoadError}
                className="mt-1 h-8 w-full"
              />
            </div>
            <button
              type="button"
              onClick={openFullscreen}
              aria-label="Afficher la piste audio en plein écran"
              title="Agrandir (ou double-cliquez sur la carte)"
              className="shrink-0 cursor-pointer rounded-full p-2 text-(--color-text-muted) transition-colors hover:bg-(--color-accent-soft) hover:text-(--color-accent)"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {isExpanded && src && (
        <MediaFullscreenOverlay
          src={src}
          type={type}
          name={displayName}
          initialTime={savedTime}
          onClose={closeFullscreen}
        />
      )}
    </>
  );
};

export default MediaCoursRender;