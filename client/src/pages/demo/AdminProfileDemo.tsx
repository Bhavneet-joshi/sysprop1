import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const admin = {
  name: 'Admin User',
  pan: 'ABCDE1234F',
  aadhaar: '1234 5678 9012',
  contact: 'admin@example.com',
  address: '123 Admin Street, Admin City, 12345',
};

const AdminProfileDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{admin.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>PAN:</strong> {admin.pan}</p>
          <p><strong>Aadhaar:</strong> {admin.aadhaar}</p>
          <p><strong>Contact:</strong> {admin.contact}</p>
          <p><strong>Address:</strong> {admin.address}</p>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfileDemo;