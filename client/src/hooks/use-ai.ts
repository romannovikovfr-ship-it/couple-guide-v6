import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

type AnalyzeReactionInput = {
  situation: string;
  partnerSaid: string;
  myReaction: string;
};

export function useAnalyzeReaction() {
  return useMutation({
    mutationFn: async (data: AnalyzeReactionInput) => {
      const validated = api.ai.analyzeReaction.input.parse(data);
      const res = await fetch(api.ai.analyzeReaction.path, {
        method: api.ai.analyzeReaction.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to analyze reaction");
      return api.ai.analyzeReaction.responses[200].parse(await res.json());
    },
  });
}
