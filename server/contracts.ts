import { db } from "./db";
import { contracts, contractComments, employeePermissions } from "@shared/schema";
import { eq, count } from "drizzle-orm";

export async function getAllContracts() {
  return await db.query.contracts.findMany();
}

export async function getContract(contractId: number) {
  return await db.query.contracts.findFirst({
    where: eq(contracts.id, contractId),
  });
}

export async function getContractsByClient(clientId: string) {
  return await db.query.contracts.findMany({
    where: eq(contracts.clientId, clientId),
  });
}

export async function getContractsByEmployee(employeeId: string) {
  return await db.query.contracts.findMany({
    where: eq(contracts.assignedEmployeeId, employeeId),
  });
}

export async function createContract(contractData: any) {
  const [newContract] = await db.insert(contracts).values(contractData).returning();
  return newContract;
}

export async function updateContract(contractId: number, contractData: any) {
  await db.update(contracts).set(contractData).where(eq(contracts.id, contractId));
  return await getContract(contractId);
}

export async function deleteContract(contractId: number) {
  await db.delete(contracts).where(eq(contracts.id, contractId));
}

export async function getContractComments(contractId: number) {
  return await db.query.contractComments.findMany({
    where: eq(contractComments.contractId, contractId),
  });
}

export async function addContractComment(commentData: any) {
  const [newComment] = await db.insert(contractComments).values(commentData).returning();
  return newComment;
}

export async function updateContractComment(commentId: number, commentData: any) {
  await db.update(contractComments).set(commentData).where(eq(contractComments.id, commentId));
  return await db.query.contractComments.findFirst({
    where: eq(contractComments.id, commentId),
  });
}

export async function deleteContractComment(commentId: number) {
  await db.delete(contractComments).where(eq(contractComments.id, commentId));
}

export async function getContractStats() {
  // This is a placeholder. In a real application, you would write a more
  // complex query to get the contract stats.
  return {
    total: await db.select({ count: count() }).from(contracts),
  };
}

export async function getClientContractCount(clientId: string) {
  // This is a placeholder. In a real application, you would write a more
  // complex query to get the client contract count.
  const [result] = await db.select({ count: count() }).from(contracts).where(eq(contracts.clientId, clientId));
  return result.count;
}

export async function getEmployeeContractCount(employeeId: string) {
  // This is a placeholder. In a real application, you would write a more
  // complex query to get the employee contract count.
  const [result] = await db.select({ count: count() }).from(contracts).where(eq(contracts.assignedEmployeeId, employeeId));
  return result.count;
}

export async function getEmployeePermissions(employeeId: string) {
  return await db.query.employeePermissions.findMany({
    where: eq(employeePermissions.employeeId, employeeId),
  });
}

export async function setEmployeePermission(permissionData: any) {
  const [newPermission] = await db.insert(employeePermissions).values(permissionData).returning();
  return newPermission;
}