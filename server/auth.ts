import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type Express, type Request, type Response, type NextFunction } from "express";

const SALT_ROUNDS = 10;

// Mock OTP storage
const otpStore: Record<string, { code: string; expiresAt: Date; channel: string; isVerified: boolean }> = {};

export async function generateOtp(userId: string, channel: "email" | "mobile") {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  otpStore[userId + channel] = { code: otpCode, expiresAt, channel, isVerified: false };
  console.log(`OTP for user ${userId} on channel ${channel}: ${otpCode}`);
  return { otpCode };
}

export async function verifyOtp(userId: string, otpCode: string, channel: "email" | "mobile") {
  const otp = otpStore[userId + channel];
  if (!otp || otp.isVerified || new Date() > otp.expiresAt || otp.code !== otpCode) {
    return false;
  }
  otp.isVerified = true;
  return true;
}

export async function registerUser(email: string, contactNumber: string, password: string) {
  const existingUser = (await storage.getAllUsers()).find(u => u.email === email);
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await storage.upsertUser({ email, contactNumber, passwordHash });
  return { userId: user.id };
}

export async function loginUser(email: string, password: string) {
  const user = (await storage.getAllUsers()).find(u => u.email === email);
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "15m",
  });
  return { user, token };
}

export function isAuthenticated(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || "dev-secret", (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = { ...user, claims: { sub: user.id } };
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export async function forgotPassword(email: string) {
  const user = (await storage.getAllUsers()).find(u => u.email === email);
  if (!user) {
    // To prevent user enumeration, we don't want to reveal if the user exists or not.
    // In a real application, you would log this event for monitoring purposes.
    return;
  }
  await generateOtp(user.id, "email");
}

export async function resetPassword(email: string, otp: string, password: string) {
  const user = (await storage.getAllUsers()).find(u => u.email === email);
  if (!user) {
    throw new Error("Invalid email or OTP.");
  }
  const isOtpValid = await verifyOtp(user.id, otp, "email");
  if (!isOtpValid) {
    throw new Error("Invalid email or OTP.");
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await storage.upsertUser({ ...user, passwordHash });
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid old password.");
  }
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await storage.upsertUser({ ...user, passwordHash });
}