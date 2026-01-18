import { z } from 'zod';
import { insertUserCrisisSchema, insertCrisisNoteSchema, user_crises, crisis_guides, crisis_notes } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  guides: {
    list: {
      method: 'GET' as const,
      path: '/api/guides',
      responses: {
        200: z.array(z.custom<typeof crisis_guides.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/guides/:id',
      responses: {
        200: z.custom<typeof crisis_guides.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  crises: {
    list: {
      method: 'GET' as const,
      path: '/api/crises',
      responses: {
        200: z.array(z.custom<typeof user_crises.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/crises',
      input: insertUserCrisisSchema,
      responses: {
        201: z.custom<typeof user_crises.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/crises/:id',
      responses: {
        200: z.custom<typeof user_crises.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    updateProgress: {
      method: 'PATCH' as const,
      path: '/api/crises/:id/progress',
      input: z.object({ stepIndex: z.number(), isResolved: z.boolean().optional() }),
      responses: {
        200: z.custom<typeof user_crises.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  notes: {
    list: {
      method: 'GET' as const,
      path: '/api/crises/:id/notes',
      responses: {
        200: z.array(z.custom<typeof crisis_notes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/crises/:id/notes',
      input: insertCrisisNoteSchema.omit({ crisisId: true }), // crisisId from param
      responses: {
        201: z.custom<typeof crisis_notes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  ai: {
    analyzeReaction: {
      method: 'POST' as const,
      path: '/api/ai/analyze-reaction',
      input: z.object({
        situation: z.string(),
        partnerSaid: z.string(),
        myReaction: z.string(),
      }),
      responses: {
        200: z.object({
          analysis: z.string(),
          suggestion: z.string(),
          betterResponse: z.string(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
