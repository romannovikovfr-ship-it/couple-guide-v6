import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// List all guides
export function useGuides() {
  return useQuery({
    queryKey: [api.guides.list.path],
    queryFn: async () => {
      const res = await fetch(api.guides.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch guides");
      return api.guides.list.responses[200].parse(await res.json());
    },
  });
}

// Get single guide
export function useGuide(id: number) {
  return useQuery({
    queryKey: [api.guides.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.guides.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch guide");
      return api.guides.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
