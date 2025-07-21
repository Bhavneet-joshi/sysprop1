import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AdminNewContractDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Contract</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Contract Name</Label>
              <Input id="name" placeholder="Enter contract name" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter contract description" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" placeholder="Enter contract duration" />
            </div>
            <div>
              <Label htmlFor="file">Link Word/Excel File from SharePoint</Label>
              <Input id="file" type="file" />
            </div>
            <div>
              <Label htmlFor="employees">Assign to Employees</Label>
              <Input id="employees" placeholder="Enter employee names" />
            </div>
            <div>
              <Label htmlFor="clients">Assign to Clients</Label>
              <Input id="clients" placeholder="Enter client names" />
            </div>
            <Button type="submit">Create Contract</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewContractDemo;