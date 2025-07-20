import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["client", "employee", "admin"]);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  passwordHash: varchar("password_hash").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("client"),
  panNumber: varchar("pan_number"),
  aadhaarNumber: varchar("aadhaar_number"),
  contactNumber: varchar("contact_number"),
  address: text("address"),
  employeeId: varchar("employee_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contract status enum
export const contractStatusEnum = pgEnum("contract_status", [
  "Draft",
  "In Review",
  "Reviewed",
  "Pending for Client Review",
  "Client Reviewed",
  "Final Reviewed - Sign Pending",
  "Final Reviewed - Signed",
  "Modified - in Review",
  "Modified - Reviewed",
  "Modified - Pending for Client Review",
  "Modified - Client Reviewed",
  "Modified - Sign Pending",
  "Modified - Signed",
]);

// Contracts table
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  clientId: varchar("client_id").references(() => users.id),
  createdBy: varchar("created_by").references(() => users.id),
  assignedEmployeeId: varchar("assigned_employee_id").references(() => users.id),
  status: contractStatusEnum("status").default("Draft"),
  contractDate: date("contract_date").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  contractValue: integer("contract_value"),
  pdfUrl: varchar("pdf_url"),
  pdfContent: text("pdf_content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contract comments table
export const contractComments = pgTable("contract_comments", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").references(() => contracts.id),
  userId: varchar("user_id").references(() => users.id),
  lineNumber: integer("line_number"),
  comment: text("comment").notNull(),
  isResolved: boolean("is_resolved").default(false),
  parentCommentId: integer("parent_comment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employee permissions table
export const employeePermissions = pgTable("employee_permissions", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id").references(() => users.id),
  contractId: integer("contract_id").references(() => contracts.id),
  canRead: boolean("can_read").default(true),
  canWrite: boolean("can_write").default(false),
  canEdit: boolean("can_edit").default(false),
  canDelete: boolean("can_delete").default(false),
  isReviewer: boolean("is_reviewer").default(false),
  isPreparer: boolean("is_preparer").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Permissions table
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
});

// Role-Permissions mapping table
export const rolePermissions = pgTable("role_permissions", {
  role: userRoleEnum("role").notNull(),
  permissionId: integer("permission_id").references(() => permissions.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Activity Logs table
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  activityType: varchar("activity_type").notNull(),
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  deviceInfo: text("device_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

// OTPs table
export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  otpCode: varchar("otp_code").notNull(),
  channel: varchar("channel").notNull(), // 'email' or 'mobile'
  expiresAt: timestamp("expires_at").notNull(),
  isVerified: boolean("is_verified").default(false),
});

// User Sessions table
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  isActive: boolean("is_active").default(true),
});


// Relations
export const usersRelations = relations(users, ({ many }) => ({
  clientContracts: many(contracts, { relationName: "clientContracts" }),
  employeeContracts: many(contracts, { relationName: "employeeContracts" }),
  comments: many(contractComments),
  permissions: many(employeePermissions),
  activityLogs: many(userActivityLogs),
  otps: many(otps),
  sessions: many(userSessions),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  client: one(users, {
    fields: [contracts.clientId],
    references: [users.id],
    relationName: "clientContracts",
  }),
  creator: one(users, {
    fields: [contracts.createdBy],
    references: [users.id],
    relationName: "creator"
  }),
  assignedEmployee: one(users, {
    fields: [contracts.assignedEmployeeId],
    references: [users.id],
    relationName: "employeeContracts",
  }),
  comments: many(contractComments),
  permissions: many(employeePermissions),
}));

export const contractCommentsRelations = relations(contractComments, ({ one }) => ({
  contract: one(contracts, {
    fields: [contractComments.contractId],
    references: [contracts.id],
  }),
  user: one(users, {
    fields: [contractComments.userId],
    references: [users.id],
  }),
}));

export const employeePermissionsRelations = relations(employeePermissions, ({ one }) => ({
  employee: one(users, {
    fields: [employeePermissions.employeeId],
    references: [users.id],
  }),
  contract: one(contracts, {
    fields: [employeePermissions.contractId],
    references: [contracts.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type InsertContractComment = typeof contractComments.$inferInsert;
export type ContractComment = typeof contractComments.$inferSelect;
export type InsertEmployeePermission = typeof employeePermissions.$inferInsert;
export type EmployeePermission = typeof employeePermissions.$inferSelect;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertContractSchema = createInsertSchema(contracts);
export const insertContractCommentSchema = createInsertSchema(contractComments);
export const insertEmployeePermissionSchema = createInsertSchema(employeePermissions);

// Extended schemas for forms
export const registerUserSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(8),
  panNumber: z.string().length(10),
  aadhaarNumber: z.string().length(12),
  contactNumber: z.string().min(10),
  address: z.string().min(10),
});

export const contractFormSchema = insertContractSchema.extend({
  clientId: z.string().min(1),
  assignedEmployeeId: z.string().optional(),
  contractDate: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const commentFormSchema = insertContractCommentSchema.extend({
  comment: z.string().min(1),
  lineNumber: z.number().optional(),
});
