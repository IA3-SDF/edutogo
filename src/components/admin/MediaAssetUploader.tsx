import React, { useState } from "react";
import { UploadCloud, Image, Music, Film, Copy, Trash, RefreshCw } from "lucide-react";
import { Chapter, Asset } from "../../../types";
import { supabase } from "../../../lib/supabaseClient";

interface MediaAssetUploaderProps {
  currentChapter: Chapter;
  selectedChapterId: string;
  onAddAsset: (
    chapterId: string,
    name: string,
    type: "image" | "audio" | "video",
    url: string,
    size?: string,
    storagePath?: string,
  ) => Promise<boolean>;
  onDeleteAsset: (chapterId: string, assetId: string) => Promise<void>;
  showToast: (msg: string) => void;
}

const normalizeFileName = (name: string): string =>
  name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_.]/g, "")
    .toLowerCase();

export const MediaAssetUploader: React.FC<MediaAssetUploaderProps> = ({
  currentChapter,
  selectedChapterId,
  onAddAsset,
  onDeleteAsset,
  showToast,
}) => {
  const [uploadName, setUploadName] = useState<string>("");
  const [uploadType, setUploadType] = useState<"image" | "audio" | "video">("image");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const detectType = (file: File): "image" | "audio" | "video" => {
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.startsWith("video/")) return "video";
    return "image";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setUploadName(nameWithoutExt);
      setUploadFile(file);
      const detectedType = detectType(file);
      setUploadType(detectedType);
      showToast(`Média "${file.name}" détecté (${detectedType}). Cliquez sur Téléverser.`);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      showToast("Sélectionnez d'abord un fichier à téléverser.");
      return;
    }
    if (!selectedChapterId) {
      showToast("Sélectionnez d'abord un chapitre.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const sanitized = normalizeFileName(uploadFile.name);
    const filePath = `media/${selectedChapterId}/${Date.now()}-${sanitized}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, uploadFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[EduTogo] Upload média échoué :", uploadError);
      showToast("Échec du téléversement vers le bucket media.");
      setIsUploading(false);
      setUploadProgress(0);
      return;
    }

    setUploadProgress(60);

    const { data: signedData, error: signedError } = await supabase.storage
      .from("media")
      .createSignedUrl(filePath, 60 * 60 * 24);

    const finalUrl =
      signedError || !signedData?.signedUrl ? filePath : signedData.signedUrl;

    await onAddAsset(
      selectedChapterId,
      uploadName,
      uploadType,
      finalUrl,
      `${Math.round(uploadFile.size / 1024)} KB`,
      filePath,
    );

    setUploadName("");
    setUploadFile(null);
    setIsUploading(false);
    setUploadProgress(100);
    setTimeout(() => setUploadProgress(0), 500);
  };

  return (
    <div className="card p-5 rounded-2xl space-y-4 shadow-[var(--shadow-elevation-sm)]">
      <div className="border-b border-(--color-border) pb-3 text-left">
        <h3 className="text-xs font-bold text-(--color-text) uppercase flex items-center gap-1.5">
          <UploadCloud className="h-4 w-4 text-(--color-accent)" />
          <span>Assets &amp; Médias Académiques</span>
        </h3>
        <p className="text-[10px] text-(--color-text-muted) mt-0.5">
          Associez des fichiers sonores, images ou vidéos pour illustrer vos
          formules KaTeX.
        </p>
      </div>

      {/* Drag and drop form */}
      <div className="space-y-3.5">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`text-left border p-3.5 rounded-xl text-center space-y-2 relative transition-all duration-200 ${
            dragActive
              ? "border-(--color-accent) bg-(--color-accent-soft) scale-[1.01] shadow-md"
              : "bg-(--color-surface-alt) border-dashed border-(--color-border)"
          }`}
        >
          {isUploading ? (
            <div className="py-4 space-y-2">
              <RefreshCw className="mx-auto h-5 w-5 text-(--color-accent) animate-spin" />
              <p className="text-[10.5px] text-(--color-text) font-bold">
                Téléversement académique en cours...
              </p>
              <div className="w-full bg-(--color-border) h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-(--color-accent) h-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-(--color-text-faint)">
                {uploadProgress}%
              </span>
            </div>
          ) : (
            <>
              <label className="cursor-pointer block space-y-2">
                <UploadCloud
                  className={`mx-auto h-6 w-6 transition-colors ${
                    dragActive
                      ? "text-(--color-accent)"
                      : "text-(--color-border-strong)"
                  }`}
                />
                <div>
                  <p className="text-[11px] font-bold text-(--color-text-muted)">
                    Sélectionnez ou glissez un fichier média
                  </p>
                  <p className="text-[9px] text-(--color-text-faint)">
                    Compatible PNG, SVG, MP3, MP4
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,audio/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                    setUploadName(nameWithoutExt);
                    setUploadFile(file);
                    const type = detectType(file);
                    setUploadType(type);
                    showToast(`Média "${file.name}" prêt (${type}).`);
                  }}
                  className="hidden"
                />
              </label>

              <div className="space-y-2 pt-2 border-t border-(--color-border) text-left">
                <div>
                  <label className="text-[8.5px] font-black text-(--color-text-faint) uppercase block">
                    Nom convivial
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Graphique Loi Normale"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    className="input mt-0.5 p-1.5 text-[10px]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {(["image", "audio", "video"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUploadType(t)}
                      className={`p-1.5 rounded border text-[9px] font-bold transition-all ${
                        uploadType === t
                          ? "bg-(--color-accent-soft) text-(--color-accent) border-(--color-accent)"
                          : "bg-(--color-surface) border-(--color-border) text-(--color-text-muted)"
                      }`}
                    >
                      {t === "image" ? "Image" : t === "audio" ? "Audio (Sons)" : "Vidéo"}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!uploadName.trim() || !uploadFile}
                  onClick={handleUpload}
                  className="btn btn-primary w-full p-2 text-xs font-bold disabled:opacity-40"
                >
                  Lancer l'encodage &amp; Téléverser
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* List of uploaded assets for activeChapter */}
      <div className="space-y-2 mt-4 text-left">
        <h4 className="text-[10px] font-bold text-(--color-text-faint) uppercase tracking-wider">
          Médias liés à ce chapitre
        </h4>

        {!currentChapter.assets || currentChapter.assets.length === 0 ? (
          <p className="text-[10px] text-(--color-text-faint) italic py-2">
            Aucun média enregistré sur ce chapitre. Importez-en un pour éditer
            vos cours de manière enrichie.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {currentChapter.assets.map((asset) => (
              <div
                key={asset.id}
                className="p-2.5 bg-(--color-surface-alt) border border-(--color-border) rounded-xl flex items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {asset.type === "image" && (
                    <Image className="h-4 w-4 text-(--color-success) shrink-0" />
                  )}
                  {asset.type === "audio" && (
                    <Music className="h-4 w-4 text-(--color-warning) shrink-0" />
                  )}
                  {asset.type === "video" && (
                    <Film className="h-4 w-4 text-(--color-accent) shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-bold text-(--color-text) truncate"
                      title={asset.name}
                    >
                      {asset.name}
                    </p>
                    <p className="text-[8px] font-mono text-(--color-text-faint)">
                      {asset.size || "120 KB"} · {asset.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      // On grave le CHEMIN de stockage (stable) dans la balise,
                      // jamais l'URL signée (qui expire après 24h). C'est ce
                      // chemin que MediaCoursRender utilisera pour régénérer
                      // une URL signée fraîche à chaque lecture du cours.
                      const mediaRef = asset.storagePath || asset.url;
                      const tag = `[[media:${mediaRef}:${asset.type}]]`;
                      navigator.clipboard.writeText(tag);
                      showToast(
                        "Balise copiée dans le presse-papier ! Paste-la dans l'éditeur.",
                      );
                    }}
                    className="p-1 hover:bg-(--color-accent-soft) text-(--color-accent) rounded cursor-pointer"
                    title="Copier la balise d'implémentation KaTeX"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onDeleteAsset(selectedChapterId, asset.id)
                    }
                    className="p-1 hover:bg-(--color-danger-soft) text-(--color-danger) rounded cursor-pointer"
                    title="Retirer ce média"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};