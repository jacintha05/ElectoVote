import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRouter, { authMiddleware } from "./localAuth";

import { sendVoteNotification } from "./emailService";
import { insertVoterSchema, insertCandidateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (local auth system)
  app.use("/api/auth", authRouter);

  // Authenticated route to get user info
  app.get("/api/auth/user", authMiddleware, async (req: any, res) => {
    try {
      const userId = req.user?.id; // Adjust depending on how req.user is set
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ---------------- Voter routes ----------------
  app.post("/api/voters/register", async (req, res) => {
    try {
      const validatedData = insertVoterSchema.parse(req.body);

      const existingVoter = await storage.getVoterByVotingId(validatedData.votingId);
      if (existingVoter) {
        return res.status(400).json({ message: "Voting ID already registered" });
      }

      const voter = await storage.createVoter(validatedData);
      res.json(voter);
    } catch (error) {
      console.error("Error registering voter:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register voter" });
    }
  });

  app.post("/api/voters/login", async (req, res) => {
    try {
      const { votingId, name } = req.body;

      if (!votingId || !name) {
        return res.status(400).json({ message: "Voting ID and name are required" });
      }

      const voter = await storage.getVoterByVotingId(votingId);
      if (!voter || voter.name !== name) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json(voter);
    } catch (error) {
      console.error("Error logging in voter:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  // ---------------- Candidate routes ----------------
  app.post("/api/candidates/register", async (req, res) => {
    try {
      const validatedData = insertCandidateSchema.parse(req.body);

      const existingCandidate = await storage.getCandidateByEmail(validatedData.email);
      if (existingCandidate) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const candidate = await storage.createCandidate(validatedData);
      res.json(candidate);
    } catch (error) {
      console.error("Error registering candidate:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register candidate" });
    }
  });

  app.post("/api/candidates/login", async (req, res) => {
    try {
      const { email, phone } = req.body;

      if (!email || !phone) {
        return res.status(400).json({ message: "Email and phone are required" });
      }

      const candidate = await storage.getCandidateByEmailAndPhone(email, phone);
      if (!candidate) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json(candidate);
    } catch (error) {
      console.error("Error logging in candidate:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  app.get("/api/candidates", async (req, res) => {
    try {
      const candidates = await storage.getAllCandidates();
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const candidate = await storage.getCandidate(id);

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.json(candidate);
    } catch (error) {
      console.error("Error fetching candidate:", error);
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  // ---------------- Vote routes ----------------
  app.post("/api/votes", async (req, res) => {
    try {
      const { voterId, candidateId } = req.body;

      if (!voterId || !candidateId) {
        return res.status(400).json({ message: "Voter ID and Candidate ID are required" });
      }

      const hasVoted = await storage.hasVoterVoted(voterId);
      if (hasVoted) {
        return res.status(400).json({ message: "Voter has already cast their vote" });
      }

      const voter = await storage.getVoter(voterId);
      const candidate = await storage.getCandidate(candidateId);

      if (!voter || !candidate) {
        return res.status(404).json({ message: "Voter or candidate not found" });
      }

      const vote = await storage.createVote({ voterId, candidateId });
      await storage.incrementCandidateVotes(candidateId);
      await storage.updateVoterVotedStatus(voterId);

      try {
        await sendVoteNotification(candidate.name, candidate.email, voter.name);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      res.json({
        message: "Vote cast successfully",
        vote,
        emailSent: true,
      });
    } catch (error) {
      console.error("Error casting vote:", error);
      res.status(500).json({ message: "Failed to cast vote" });
    }
  });

  // ---------------- Statistics routes ----------------
  app.get("/api/stats", async (req, res) => {
    try {
      const totalVotes = await storage.getTotalVotes();
      const candidates = await storage.getAllCandidates();

      res.json({
        totalVotes,
        totalCandidates: candidates.length,
        candidates: candidates.map((c) => ({
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          partyName: c.partyName,
          voteCount: c.voteCount,
          percentage:
            totalVotes > 0
              ? ((c.voteCount || 0) / totalVotes * 100).toFixed(1)
              : "0.0",
        })),
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
