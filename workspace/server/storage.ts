import {
  users,
  voters,
  candidates,
  votes,
  type User,
  type UpsertUser,
  type Voter,
  type InsertVoter,
  type Candidate,
  type InsertCandidate,
  type Vote,
  type InsertVote,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Voter operations
  getVoter(id: string): Promise<Voter | undefined>;
  getVoterByVotingId(votingId: string): Promise<Voter | undefined>;
  createVoter(voter: InsertVoter): Promise<Voter>;
  updateVoterVotedStatus(id: string): Promise<void>;
  
  // Candidate operations
  getCandidate(id: string): Promise<Candidate | undefined>;
  getCandidateByEmail(email: string): Promise<Candidate | undefined>;
  getCandidateByEmailAndPhone(email: string, phone: string): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  getAllCandidates(): Promise<Candidate[]>;
  incrementCandidateVotes(id: string): Promise<void>;
  
  // Vote operations
  createVote(vote: InsertVote): Promise<Vote>;
  getTotalVotes(): Promise<number>;
  hasVoterVoted(voterId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Voter operations
  async getVoter(id: string): Promise<Voter | undefined> {
    const [voter] = await db.select().from(voters).where(eq(voters.id, id));
    return voter;
  }

  async getVoterByVotingId(votingId: string): Promise<Voter | undefined> {
    const [voter] = await db.select().from(voters).where(eq(voters.votingId, votingId));
    return voter;
  }

  async createVoter(voterData: InsertVoter): Promise<Voter> {
    const [voter] = await db.insert(voters).values(voterData).returning();
    return voter;
  }

  async updateVoterVotedStatus(id: string): Promise<void> {
    await db.update(voters).set({ hasVoted: true }).where(eq(voters.id, id));
  }

  // Candidate operations
  async getCandidate(id: string): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate;
  }

  async getCandidateByEmail(email: string): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.email, email));
    return candidate;
  }

  async getCandidateByEmailAndPhone(email: string, phone: string): Promise<Candidate | undefined> {
    const [candidate] = await db
      .select()
      .from(candidates)
      .where(sql`${candidates.email} = ${email} AND ${candidates.phone} = ${phone}`);
    return candidate;
  }

  async createCandidate(candidateData: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db.insert(candidates).values(candidateData).returning();
    return candidate;
  }

  async getAllCandidates(): Promise<Candidate[]> {
    return await db.select().from(candidates).orderBy(desc(candidates.voteCount));
  }

  async incrementCandidateVotes(id: string): Promise<void> {
    await db
      .update(candidates)
      .set({ voteCount: sql`${candidates.voteCount} + 1` })
      .where(eq(candidates.id, id));
  }

  // Vote operations
  async createVote(voteData: InsertVote): Promise<Vote> {
    const [vote] = await db.insert(votes).values(voteData).returning();
    return vote;
  }

  async getTotalVotes(): Promise<number> {
    const [result] = await db.select({ count: sql`count(*)` }).from(votes);
    return Number(result.count);
  }

  async hasVoterVoted(voterId: string): Promise<boolean> {
    const [vote] = await db.select().from(votes).where(eq(votes.voterId, voterId)).limit(1);
    return !!vote;
  }
}

export const storage = new DatabaseStorage();
