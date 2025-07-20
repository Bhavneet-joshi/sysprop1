import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Extend session interface
declare module "express-session" {
  interface SessionData {
    user?: any;
  }
}

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // false for local dev, true for HTTPS in prod
      sameSite: "lax", // or "none" if using HTTPS and cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Mock login endpoint
  app.get("/api/login", async (req, res) => {
    // Accept ?user=admin-1, ?user=client-1, ?user=employee-1
    let userId = req.query.user || "admin-1";
    if (Array.isArray(userId)) userId = userId[0];
    userId = String(userId);
    let mockUser = await storage.getUser(userId);
    if (!mockUser) {
      // fallback to admin if not found
      mockUser = await storage.getUser("admin-1");
    }
    req.session.user = {
      ...mockUser,
      access_token: "mock-token",
      refresh_token: "mock-refresh-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };
    res.redirect("/");
  });

  // Mock logout endpoint
  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  // Mock callback endpoint
  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.session.user as any;

  if (!user || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    // Mock user for the request
    req.user = user;
    return next();
  }

  // Token expired, redirect to login
  return res.status(401).json({ message: "Unauthorized" });
}; 