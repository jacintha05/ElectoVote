// server/localAuth.ts
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "changeme";

// Mock users table (replace with DB lookup)
const users = [{ id: 1, username: "admin", password: "password123" }];

// Login endpoint
authRouter.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Middleware to protect routes
export function authMiddleware(req: any, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// Get current user
authRouter.get("/user", authMiddleware, (req: any, res: Response) => {
  res.json({ user: req.user });
});

export default authRouter;
