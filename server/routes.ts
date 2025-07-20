import type { Express } from "express";
import { createServer, type Server } from "http";
import * as users from "./users";
import * as contractsController from "./contracts";
import {
  isAuthenticated,
  registerUser,
  generateOtp,
  verifyOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "./auth";
import { z } from "zod";
import {
  insertContractSchema,
  insertContractCommentSchema,
  insertEmployeePermissionSchema,
  contractFormSchema,
  commentFormSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await users.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User management routes
  app.get('/api/users', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const allUsers = await users.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/auth/register/send-otp', async (req, res) => {
    try {
      const { email, contactNumber } = req.body;
      // In a real app, you would first create a temporary user record
      // or handle the user creation after OTP verification.
      // For simplicity, we'll assume a user record is created first.
      const { userId } = await registerUser(email, contactNumber, "temporary-password");

      await generateOtp(userId, "email");
      await generateOtp(userId, "mobile");

      res.json({ message: "OTPs sent successfully.", userId });
    } catch (error) {
      console.error("Error sending OTPs:", error);
      res.status(500).json({ message: "Failed to send OTPs" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await loginUser(email, password);
      // In a real app, you would set a session cookie here.
      res.json(user);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(401).json({ message: "Invalid email or password" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    // In a real app with session management, you would destroy the session here.
    // For this stateless setup, we just confirm the logout action.
    res.json({ message: "Logged out successfully." });
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      await forgotPassword(email);
      res.json({ message: "Password reset OTP sent." });
    } catch (error) {
      console.error("Error sending password reset OTP:", error);
      res.status(500).json({ message: "Failed to send password reset OTP" });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { email, otp, password } = req.body;
      await resetPassword(email, otp, password);
      res.json({ message: "Password reset successfully." });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(400).json({ message: "Failed to reset password" });
    }
  });

  app.post('/api/auth/change-password', isAuthenticated, async (req: any, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;
      await changePassword(userId, oldPassword, newPassword);
      res.json({ message: "Password changed successfully." });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(400).json({ message: "Failed to change password" });
    }
  });

  app.post('/api/auth/register/verify-otp', async (req, res) => {
    try {
      const { userId, emailOtp, mobileOtp, password } = req.body;

      const isEmailOtpValid = await verifyOtp(userId, emailOtp, "email");
      const isMobileOtpValid = await verifyOtp(userId, mobileOtp, "mobile");

      if (isEmailOtpValid && isMobileOtpValid) {
        // In a real app, you would update the user's password here.
        // For simplicity, we are not updating the password in this step.
        res.json({ message: "User registered successfully." });
      } else {
        res.status(400).json({ message: "Invalid OTPs." });
      }
    } catch (error) {
      console.error("Error verifying OTPs:", error);
      res.status(500).json({ message: "Failed to verify OTPs" });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const user = await users.createUser({
        email,
        passwordHash: password,
        role,
      });
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get('/api/users/role/:role', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const usersByRole = await users.getUsersByRole(req.params.role);
      res.json(usersByRole);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put('/api/users/:id/role', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const { role } = req.body;
      const updatedUser = await users.updateUserRole(req.params.id, role);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.put('/api/users/:id/profile', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      const updatedUser = await users.updateUserProfile(req.params.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  app.post('/api/users/employee', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      const employee = await users.createEmployee(req.body);
      res.json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  // Contract routes
  app.get('/api/contracts', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      let contracts;

      if (currentUser?.role === 'admin') {
        contracts = await contractsController.getAllContracts();
      } else if (currentUser?.role === 'client') {
        contracts = await contractsController.getContractsByClient(req.user.id);
      } else if (currentUser?.role === 'employee') {
        contracts = await contractsController.getContractsByEmployee(req.user.id);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get('/api/contracts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await contractsController.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      const currentUser = await users.getUser(req.user.id);
      
      // Check access permissions
      if (currentUser?.role === 'admin' || 
          contract.clientId === req.user.claims.sub || 
          contract.assignedEmployeeId === req.user.claims.sub) {
        res.json(contract);
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post('/api/contracts', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const validatedData = contractFormSchema.parse(req.body);
      const newContract = await contractsController.createContract(validatedData);
      res.json(newContract);
    } catch (error) {
      console.error("Error creating contract:", error);
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.put('/api/contracts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await contractsController.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      const currentUser = await users.getUser(req.user.id);
      
      // Check permissions
      if (currentUser?.role !== 'admin' && 
          contract.assignedEmployeeId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedContract = await contractsController.updateContract(contractId, req.body);
      res.json(updatedContract);
    } catch (error) {
      console.error("Error updating contract:", error);
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  app.delete('/api/contracts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const contractId = parseInt(req.params.id);
      await contractsController.deleteContract(contractId);
      res.json({ message: "Contract deleted successfully" });
    } catch (error) {
      console.error("Error deleting contract:", error);
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  // Contract comments routes
  app.get('/api/contracts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await contractsController.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      const currentUser = await users.getUser(req.user.id);
      
      // Check access permissions
      if (currentUser?.role === 'admin' || 
          contract.clientId === req.user.claims.sub || 
          contract.assignedEmployeeId === req.user.claims.sub) {
        const comments = await contractsController.getContractComments(contractId);
        res.json(comments);
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.error("Error fetching contract comments:", error);
      res.status(500).json({ message: "Failed to fetch contract comments" });
    }
  });

  app.post('/api/contracts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await contractsController.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      const currentUser = await users.getUser(req.user.id);
      
      // Check access permissions
      if (currentUser?.role === 'admin' || 
          contract.clientId === req.user.claims.sub || 
          contract.assignedEmployeeId === req.user.claims.sub) {
        
        const validatedData = commentFormSchema.parse({
          ...req.body,
          contractId,
          userId: req.user.claims.sub,
        });
        
        const comment = await contractsController.addContractComment(validatedData);
        res.json(comment);
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.error("Error adding contract comment:", error);
      res.status(500).json({ message: "Failed to add contract comment" });
    }
  });

  app.put('/api/comments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await contractsController.updateContractComment(commentId, req.body);
      res.json(comment);
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });

  app.delete('/api/comments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const commentId = parseInt(req.params.id);
      await contractsController.deleteContractComment(commentId);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Dashboard stats routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      
      if (currentUser?.role === 'admin') {
        const stats = await contractsController.getContractStats();
        res.json(stats);
      } else if (currentUser?.role === 'client') {
        const count = await contractsController.getClientContractCount(req.user.id);
        res.json({ contractCount: count });
      } else if (currentUser?.role === 'employee') {
        const count = await contractsController.getEmployeeContractCount(req.user.id);
        res.json({ contractCount: count });
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Employee permissions routes
  app.get('/api/permissions/employee/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const permissions = await contractsController.getEmployeePermissions(req.params.id);
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching employee permissions:", error);
      res.status(500).json({ message: "Failed to fetch employee permissions" });
    }
  });

  app.post('/api/permissions', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await users.getUser(req.user.id);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const validatedData = insertEmployeePermissionSchema.parse(req.body);
      const permission = await contractsController.setEmployeePermission(validatedData);
      res.json(permission);
    } catch (error) {
      console.error("Error setting employee permission:", error);
      res.status(500).json({ message: "Failed to set employee permission" });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      // Basic validation
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Simulate sending email
      console.log('--- New Contact Form Submission ---');
      console.log(`From: ${name} <${email}>`);
      console.log('To: info@hlsgindustries.com');
      console.log('Message:');
      console.log(message);
      console.log('------------------------------------');

      // In a real application, you would integrate an email service like Nodemailer here.
      // For example:
      // await sendEmail({
      //   to: 'info@hlsgindustries.com',
      //   from: email,
      //   subject: `New message from ${name}`,
      //   text: message,
      // });

      res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ message: 'Failed to send message.' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
