import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const client = {
  name: 'Client User',
  pan: 'FGHIJ5678K',
  aadhaar: '9876 5432 1098',
  contact: 'client@example.com',
  address: '456 Client Avenue, Client City, 54321',
  userId: 'clientuser01',
};

const ClientProfileDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Client Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>User ID:</strong> {client.userId}</p>
          <p><strong>PAN:</strong> {client.pan}</p>
          <p><strong>Aadhaar:</strong> {client.aadhaar}</p>
          <p><strong>Contact:</strong> {client.contact}</p>
          <p><strong>Address:</strong> {client.address}</p>
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

export default ClientProfileDemo;