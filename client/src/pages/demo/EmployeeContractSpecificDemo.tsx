import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const contract = {
  name: 'Contract X',
  description: 'This is a detailed description of Contract X, including all its terms and conditions.',
  date: '2024-07-01',
  duration: '12 months',
};

const EmployeeContractSpecificDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contract Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>{contract.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Description:</strong> {contract.description}</p>
          <p><strong>Date:</strong> {contract.date}</p>
          <p><strong>Duration:</strong> {contract.duration}</p>
        </CardContent>
      </Card>
      <div className="mt-4 space-x-2">
        <Button>Edit Contract</Button>
        <Button>Reply to Client Comments</Button>
        <Button>Add New Comments</Button>
        <Button>Open Online</Button>
        <Button>Open on Desktop</Button>
        <Button variant="destructive">Delete Contract</Button>
        <Button>Add New Lines to Contract</Button>
      </div>
    </div>
  );
};

export default EmployeeContractSpecificDemo;