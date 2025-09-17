import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ========== Simple JWT Auth Middleware ==========
const JWT_SECRET = process.env.SESSION_SECRET || "changeme";

// Add a login route (temporary local auth)
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // TODO: Replace this with DB lookup (voters/candidates)
  if (username === "admin" && password === "password123") {
    const token = jwt.sign({ id: 1, username }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

function authMiddleware(req: Request & { user?: string | JwtPayload }, res: Response, next: NextFunction) {
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

// Example protected route
app.get("/api/auth/user", authMiddleware, (req: Request & { user?: string | JwtPayload }, res: Response) => {
  res.json({ user: req.user });
});
// =================================================

// API logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "127.0.0.1", () => {
    log(`serving on http://127.0.0.1:${port}`);
  });
})();
