import {
  type User,
  type UpsertUser,
  type Contract,
  type InsertContract,
  type ContractComment,
  type InsertContractComment,
  type EmployeePermission,
  type InsertEmployeePermission,
} from "@shared/schema";
import { MockStorage } from "./mockStorage";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User management
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  updateUserRole(userId: string, role: string): Promise<User>;
  updateUserProfile(userId: string, data: Partial<User>): Promise<User>;
  
  // Contract operations
  getContract(id: number): Promise<Contract | undefined>;
  getContractsByClient(clientId: string): Promise<Contract[]>;
  getContractsByEmployee(employeeId: string): Promise<Contract[]>;
  getAllContracts(): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, data: Partial<Contract>): Promise<Contract>;
  deleteContract(id: number): Promise<void>;
  
  // Contract comments
  getContractComments(contractId: number): Promise<ContractComment[]>;
  addContractComment(comment: InsertContractComment): Promise<ContractComment>;
  updateContractComment(id: number, data: Partial<ContractComment>): Promise<ContractComment>;
  deleteContractComment(id: number): Promise<void>;
  
  // Employee permissions
  getEmployeePermissions(employeeId: string): Promise<EmployeePermission[]>;
  getContractPermissions(contractId: number): Promise<EmployeePermission[]>;
  setEmployeePermission(permission: InsertEmployeePermission): Promise<EmployeePermission>;
  updateEmployeePermission(id: number, data: Partial<EmployeePermission>): Promise<EmployeePermission>;
  removeEmployeePermission(id: number): Promise<void>;
  
  // Dashboard stats
  getContractStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  }>;
  getClientContractCount(clientId: string): Promise<number>;
  getEmployeeContractCount(employeeId: string): Promise<number>;
}

// Use mock storage for development
const mockStorage = new MockStorage();
export const storage = mockStorage;
