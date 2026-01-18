import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  user_crises, crisis_guides, crisis_notes,
  type UserCrisis, type CrisisGuide, type CrisisNote,
  type InsertUserCrisis, type InsertCrisisNote
} from "@shared/schema";

export interface IStorage {
  // Guides
  getCrisisGuides(): Promise<CrisisGuide[]>;
  getCrisisGuide(id: number): Promise<CrisisGuide | undefined>;
  
  // User Crises
  getUserCrises(userId: string): Promise<UserCrisis[]>;
  getUserCrisis(id: number): Promise<UserCrisis | undefined>;
  createUserCrisis(userId: string, crisis: InsertUserCrisis): Promise<UserCrisis>;
  updateCrisisProgress(id: number, stepIndex: number, isResolved?: boolean): Promise<UserCrisis>;
  
  // Notes
  getCrisisNotes(crisisId: number): Promise<CrisisNote[]>;
  createCrisisNote(note: InsertCrisisNote): Promise<CrisisNote>;
}

export class DatabaseStorage implements IStorage {
  // Guides
  async getCrisisGuides(): Promise<CrisisGuide[]> {
    return await db.select().from(crisis_guides);
  }

  async getCrisisGuide(id: number): Promise<CrisisGuide | undefined> {
    const [guide] = await db.select().from(crisis_guides).where(eq(crisis_guides.id, id));
    return guide;
  }

  // User Crises
  async getUserCrises(userId: string): Promise<UserCrisis[]> {
    return await db.select().from(user_crises)
      .where(eq(user_crises.userId, userId))
      .orderBy(desc(user_crises.createdAt));
  }

  async getUserCrisis(id: number): Promise<UserCrisis | undefined> {
    const [crisis] = await db.select().from(user_crises).where(eq(user_crises.id, id));
    return crisis;
  }

  async createUserCrisis(userId: string, crisis: InsertUserCrisis): Promise<UserCrisis> {
    const [newCrisis] = await db.insert(user_crises)
      .values({ ...crisis, userId })
      .returning();
    return newCrisis;
  }

  async updateCrisisProgress(id: number, stepIndex: number, isResolved?: boolean): Promise<UserCrisis> {
    const values: any = { currentStepIndex: stepIndex };
    if (isResolved !== undefined) values.isResolved = isResolved;
    
    const [updated] = await db.update(user_crises)
      .set(values)
      .where(eq(user_crises.id, id))
      .returning();
    return updated;
  }

  // Notes
  async getCrisisNotes(crisisId: number): Promise<CrisisNote[]> {
    return await db.select().from(crisis_notes)
      .where(eq(crisis_notes.crisisId, crisisId))
      .orderBy(desc(crisis_notes.createdAt));
  }

  async createCrisisNote(note: InsertCrisisNote): Promise<CrisisNote> {
    const [newNote] = await db.insert(crisis_notes)
      .values(note)
      .returning();
    return newNote;
  }
}

export const storage = new DatabaseStorage();
