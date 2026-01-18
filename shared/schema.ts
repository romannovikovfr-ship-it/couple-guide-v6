import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Export Auth & Chat models
export * from "./models/auth";
export * from "./models/chat";

// === TABLE DEFINITIONS ===

// Pre-defined guides for different types of relationship crises
export const crisis_guides = pgTable("crisis_guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g. "Heated Argument", "Trust Broken", "Silent Treatment"
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  steps: jsonb("steps").$type<Array<{title: string, content: string}>>().notNull(), 
  createdAt: timestamp("created_at").defaultNow(),
});

// User's active crisis sessions
export const user_crises = pgTable("user_crises", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // specific reference logic handled in app code or assumed from auth
  guideId: integer("guide_id").references(() => crisis_guides.id), // Can be null if custom/general
  title: text("title").notNull(),
  description: text("description"),
  currentStepIndex: integer("current_step_index").default(0),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Journal/Notes for each crisis to track thoughts/feelings
export const crisis_notes = pgTable("crisis_notes", {
  id: serial("id").primaryKey(),
  crisisId: integer("crisis_id").notNull().references(() => user_crises.id),
  content: text("content").notNull(),
  sentiment: text("sentiment"), // AI analysis result
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertCrisisGuideSchema = createInsertSchema(crisis_guides).omit({ id: true, createdAt: true });
export const insertUserCrisisSchema = createInsertSchema(user_crises).omit({ id: true, createdAt: true, currentStepIndex: true, isResolved: true });
export const insertCrisisNoteSchema = createInsertSchema(crisis_notes).omit({ id: true, createdAt: true });

// === TYPES ===

export type CrisisGuide = typeof crisis_guides.$inferSelect;
export type UserCrisis = typeof user_crises.$inferSelect;
export type CrisisNote = typeof crisis_notes.$inferSelect;

export type InsertCrisisGuide = z.infer<typeof insertCrisisGuideSchema>;
export type InsertUserCrisis = z.infer<typeof insertUserCrisisSchema>;
export type InsertCrisisNote = z.infer<typeof insertCrisisNoteSchema>;
