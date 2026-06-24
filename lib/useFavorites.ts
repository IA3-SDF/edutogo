import { useCallback, useEffect, useState } from "react";
import { UserFavorite } from "../types";
import { fetchUserFavorites, toggleFavorite } from "./supabaseFunctions";

interface UseFavoritesReturn {
  favorites: UserFavorite[];
  isFavorite: (resourceId: string, resourceType: string) => boolean;
  toggleFavoriteState: (
    resourceId: string,
    resourceType: "course" | "exercise" | "quiz" | "evaluation",
  ) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook personnalisé pour gérer les favoris de l'utilisateur
 * Charge les favoris au montage et fournit des fonctions pour les modifier
 */
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les favoris au montage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userFavorites = await fetchUserFavorites();
        setFavorites(userFavorites);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des favoris";
        setError(errorMessage);
        console.error("[EduTogo] Erreur chargement favoris:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Vérifier si une ressource est en favori
  const isFavorite = useCallback(
    (resourceId: string, resourceType: string): boolean => {
      return favorites.some(
        (fav) => fav.resourceId === resourceId && fav.resourceType === resourceType,
      );
    },
    [favorites],
  );

  // Basculer l'état favori (ajouter ou retirer)
  const toggleFavoriteState = useCallback(
    async (
      resourceId: string,
      resourceType: "course" | "exercise" | "quiz" | "evaluation",
    ): Promise<boolean> => {
      try {
        const result = await toggleFavorite(resourceId, resourceType);
        
        if (result === null) {
          setError("Impossible de modifier le favori");
          return false;
        }

        // Mettre à jour l'état local
        setFavorites((prev) => {
          if (result) {
            // Ajouter le favori
            return [
              ...prev,
              {
                resourceId,
                resourceType,
                createdAt: new Date().toISOString(),
              },
            ];
          } else {
            // Retirer le favori
            return prev.filter(
              (fav) =>
                !(
                  fav.resourceId === resourceId &&
                  fav.resourceType === resourceType
                ),
            );
          }
        });

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification du favori";
        setError(errorMessage);
        console.error("[EduTogo] Erreur toggle favori:", err);
        return false;
      }
    },
    [],
  );

  return {
    favorites,
    isFavorite,
    toggleFavoriteState,
    isLoading,
    error,
  };
}
