import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertUserCrisis } from "@shared/schema";

// List user's crises
export function useCrises() {
  return useQuery({
    queryKey: [api.crises.list.path],
    queryFn: async () => {
      const res = await fetch(api.crises.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch crises");
      return api.crises.list.responses[200].parse(await res.json());
    },
  });
}

// Get single crisis
export function useCrisis(id: number) {
  return useQuery({
    queryKey: [api.crises.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.crises.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch crisis");
      return api.crises.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Start a new crisis session
export function useCreateCrisis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertUserCrisis) => {
      const validated = api.crises.create.input.parse(data);
      const res = await fetch(api.crises.create.path, {
        method: api.crises.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.crises.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create crisis session");
      }
      return api.crises.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.crises.list.path] });
    },
  });
}

// Update progress (step index or resolution status)
export function useUpdateCrisisProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stepIndex, isResolved }: { id: number, stepIndex: number, isResolved?: boolean }) => {
      const url = buildUrl(api.crises.updateProgress.path, { id });
      const res = await fetch(url, {
        method: api.crises.updateProgress.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepIndex, isResolved }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update progress");
      return api.crises.updateProgress.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.crises.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.crises.get.path, data.id] });
    },
  });
}
