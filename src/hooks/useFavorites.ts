import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFavorites, removeFavorite } from "@/lib/favorites";

export function useFavorites() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeFavorite(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return { ...list, remove };
}