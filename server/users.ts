import { storage } from "./storage";

export async function getAllUsers() {
  return await storage.getAllUsers();
}

export async function getUser(userId: string) {
  return await storage.getUser(userId);
}

export async function getUsersByRole(role: "client" | "employee" | "admin") {
  return await storage.getUsersByRole(role);
}

export async function updateUserRole(userId: string, role: "client" | "employee" | "admin") {
  return await storage.updateUserRole(userId, role);
}

export async function updateUserProfile(userId: string, profileData: any) {
  return await storage.updateUserProfile(userId, profileData);
}

export async function createEmployee(employeeData: any) {
  return await storage.upsertUser({ ...employeeData, role: "employee" });
}

export async function createUser(userData: any) {
  return await storage.upsertUser(userData);
}