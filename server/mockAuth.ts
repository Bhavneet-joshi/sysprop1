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
      secure: false, // Set to false for development
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Mock login endpoint
  app.get("/api/login", (req, res) => {
    // For development, automatically log in as admin
    const mockUser = {
      claims: {
        sub: "admin-1",
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "User",
        profile_image_url: "",
      },
      access_token: "mock-token",
      refresh_token: "mock-refresh-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };

    req.session.user = mockUser;
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