"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { UserProfile } from "../types";
import { getSupabaseClient } from "./supabase";
import {
    bucketFromStoragePath,
    getSignedUrl,
    uploadStorageFile,
} from "./supabaseFunctions";

export type UseProfileAvatarOptions = {
  user: UserProfile;
  handleUpdateUser?: (updatedUser: UserProfile) => Promise<void> | void;
  onUploadSuccess?: (updatedUser: UserProfile, avatarUrl: string | null) => void;
  onUploadError?: (message: string) => void;
};

export function useProfileAvatar({
  user,
  handleUpdateUser,
  onUploadSuccess,
  onUploadError,
}: UseProfileAvatarOptions) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAvatar() {
      if (!user.avatarUrl) {
        setAvatarSrc(null);
        return;
      }

      try {
        const bucket = bucketFromStoragePath(user.avatarUrl);
        const url = await getSignedUrl(bucket, user.avatarUrl);
        if (active) setAvatarSrc(url);
      } catch (error) {
        console.error("[useProfileAvatar] loadAvatar", error);
        if (active) setAvatarSrc(null);
      }
    }

    loadAvatar();

    return () => {
      active = false;
    };
  }, [user.avatarUrl]);

  const handleAvatarUpload = useCallback(() => {
    avatarInputRef.current?.click();
  }, []);

  const normalizeFileName = useCallback((name: string): string => {
    return name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_.]/g, "")
      .toLowerCase();
  }, []);

  const handleAvatarFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!handleUpdateUser || !user.id) return;

      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploadingAvatar(true);
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          onUploadError?.("Configuration Supabase manquante.");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) {
          onUploadError?.("Vous devez être connecté pour téléverser un avatar.");
          return;
        }

        const sanitized = normalizeFileName(file.name);
        const path = `${userId}/${Date.now()}-${sanitized}`;
        const uploadResult = await uploadStorageFile("avatars", path, file);

        if (!uploadResult) {
          onUploadError?.("Impossible de téléverser la photo de profil.");
          return;
        }

        const updatedUser: UserProfile = {
          ...user,
          avatarUrl: uploadResult.path,
        };

        await handleUpdateUser(updatedUser);
        const loadedUrl = uploadResult.publicUrl || uploadResult.signedUrl || null;
        setAvatarSrc(loadedUrl);
        onUploadSuccess?.(updatedUser, loadedUrl);
      } catch (error) {
        console.error("[useProfileAvatar] upload error", error);
        onUploadError?.("Une erreur est survenue lors du téléversement de l'avatar.");
      } finally {
        setIsUploadingAvatar(false);
        if (avatarInputRef.current) {
          avatarInputRef.current.value = "";
        }
      }
    },
    [handleUpdateUser, normalizeFileName, onUploadError, onUploadSuccess, user],
  );

  return {
    avatarSrc,
    isUploadingAvatar,
    avatarInputRef,
    handleAvatarUpload,
    handleAvatarFile,
  };
}
