import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// List notes for a specific crisis
export function useCrisisNotes(crisisId: number) {
  return useQuery({
    queryKey: [api.notes.list.path, crisisId],
    queryFn: async () => {
      const url = buildUrl(api.notes.list.path, { id: crisisId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch notes");
      return api.notes.list.responses[200].parse(await res.json());
    },
    enabled: !!crisisId,
  });
}

// Create a new note
export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ crisisId, content }: { crisisId: number; content: string }) => {
      // Validate with schema that omits crisisId (it comes from URL param in real API, but we pass it for context here)
      const input = { content };
      const validated = api.notes.create.input.parse(input);
      
      const url = buildUrl(api.notes.create.path, { id: crisisId });
      const res = await fetch(url, {
        method: api.notes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create note");
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.notes.list.path, variables.crisisId] 
      });
    },
  });
}
