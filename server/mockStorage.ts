import { type User, type Contract, type ContractComment, type EmployeePermission } from "@shared/schema";

// Mock data for development
const mockUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    profileImageUrl: "",
    panNumber: null,
    aadhaarNumber: null,
    contactNumber: null,
    address: null,
    employeeId: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "employee-1",
    email: "employee@example.com",
    firstName: "John",
    lastName: "Employee",
    role: "employee",
    employeeId: "EMP001",
    profileImageUrl: "",
    panNumber: null,
    aadhaarNumber: null,
    contactNumber: null,
    address: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "client-1",
    email: "client@example.com",
    firstName: "Jane",
    lastName: "Client",
    role: "client",
    profileImageUrl: "",
    panNumber: null,
    aadhaarNumber: null,
    contactNumber: null,
    address: null,
    employeeId: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockContracts: Contract[] = [
  {
    id: 1,
    name: "Software Development Agreement",
    description: "Development of a web application",
    clientId: "client-1",
    assignedEmployeeId: "employee-1",
    status: "active",
    contractDate: new Date("2024-01-15"),
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-06-20"),
    contractValue: 50000,
    pdfUrl: "",
    pdfContent: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Consulting Services Contract",
    description: "IT consulting services",
    clientId: "client-1",
    assignedEmployeeId: "employee-1",
    status: "in_progress",
    contractDate: new Date("2024-01-10"),
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-03-15"),
    contractValue: 25000,
    pdfUrl: "",
    pdfContent: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockComments: ContractComment[] = [
  {
    id: 1,
    contractId: 1,
    userId: "employee-1",
    comment: "Initial review completed",
    lineNumber: null,
    isResolved: false,
    parentCommentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class MockStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return mockUsers.find(user => user.id === id);
  }

  async upsertUser(userData: Partial<User>): Promise<User> {
    const existingUser = mockUsers.find(user => user.id === userData.id);
    if (existingUser) {
      Object.assign(existingUser, userData, { updatedAt: new Date() });
      return existingUser;
    } else {
      const newUser = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      mockUsers.push(newUser);
      return newUser;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return [...mockUsers];
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return mockUsers.filter(user => user.role === role);
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = role as any;
      user.updatedAt = new Date();
      return user;
    }
    throw new Error("User not found");
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      Object.assign(user, data, { updatedAt: new Date() });
      return user;
    }
    throw new Error("User not found");
  }

  // Contract operations
  async getContract(id: number): Promise<Contract | undefined> {
    return mockContracts.find(contract => contract.id === id);
  }

  async getContractsByClient(clientId: string): Promise<Contract[]> {
    return mockContracts.filter(contract => contract.clientId === clientId);
  }

  async getContractsByEmployee(employeeId: string): Promise<Contract[]> {
    return mockContracts.filter(contract => contract.assignedEmployeeId === employeeId);
  }

  async getAllContracts(): Promise<Contract[]> {
    return [...mockContracts];
  }

  async createContract(contractData: Partial<Contract>): Promise<Contract> {
    const newContract = {
      id: mockContracts.length + 1,
      ...contractData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Contract;
    mockContracts.push(newContract);
    return newContract;
  }

  async updateContract(id: number, data: Partial<Contract>): Promise<Contract> {
    const contract = mockContracts.find(c => c.id === id);
    if (contract) {
      Object.assign(contract, data, { updatedAt: new Date() });
      return contract;
    }
    throw new Error("Contract not found");
  }

  async deleteContract(id: number): Promise<void> {
    const index = mockContracts.findIndex(c => c.id === id);
    if (index !== -1) {
      mockContracts.splice(index, 1);
    }
  }

  // Contract comments
  async getContractComments(contractId: number): Promise<ContractComment[]> {
    return mockComments.filter(comment => comment.contractId === contractId);
  }

  async addContractComment(commentData: Partial<ContractComment>): Promise<ContractComment> {
    const newComment = {
      id: mockComments.length + 1,
      ...commentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ContractComment;
    mockComments.push(newComment);
    return newComment;
  }

  async updateContractComment(id: number, data: Partial<ContractComment>): Promise<ContractComment> {
    const comment = mockComments.find(c => c.id === id);
    if (comment) {
      Object.assign(comment, data, { updatedAt: new Date() });
      return comment;
    }
    throw new Error("Comment not found");
  }

  async deleteContractComment(id: number): Promise<void> {
    const index = mockComments.findIndex(c => c.id === id);
    if (index !== -1) {
      mockComments.splice(index, 1);
    }
  }

  // Employee permissions (simplified for mock)
  async getEmployeePermissions(employeeId: string): Promise<EmployeePermission[]> {
    return [];
  }

  async getContractPermissions(contractId: number): Promise<EmployeePermission[]> {
    return [];
  }

  async setEmployeePermission(permission: Partial<EmployeePermission>): Promise<EmployeePermission> {
    return {} as EmployeePermission;
  }

  async updateEmployeePermission(id: number, data: Partial<EmployeePermission>): Promise<EmployeePermission> {
    return {} as EmployeePermission;
  }

  async removeEmployeePermission(id: number): Promise<void> {
    // Mock implementation
  }

  // Dashboard stats
  async getContractStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  }> {
    const total = mockContracts.length;
    const active = mockContracts.filter(c => c.status === "active").length;
    const completed = mockContracts.filter(c => c.status === "completed").length;
    const cancelled = mockContracts.filter(c => c.status === "cancelled").length;
    
    return { total, active, completed, cancelled };
  }

  async getClientContractCount(clientId: string): Promise<number> {
    return mockContracts.filter(c => c.clientId === clientId).length;
  }

  async getEmployeeContractCount(employeeId: string): Promise<number> {
    return mockContracts.filter(c => c.assignedEmployeeId === employeeId).length;
  }
} 