import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const users = [
  { id: 1, name: 'Employee A', role: 'Preparer' },
  { id: 2, name: 'Employee B', role: 'Reviewer' },
  { id: 3, name: 'Client A', role: 'Client' },
];

const AdminUserManagementDemo: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm" className="ml-2">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Access Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Preparers</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Preparers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee-a">Employee A</SelectItem>
                  <SelectItem value="employee-c">Employee C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reviewers</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Reviewers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee-b">Employee B</SelectItem>
                  <SelectItem value="employee-d">Employee D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Permissions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagementDemo;