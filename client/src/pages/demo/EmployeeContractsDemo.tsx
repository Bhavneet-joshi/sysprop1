import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const contracts = [
  {
    name: 'Contract X',
    description: 'This is a description for Contract X.',
    date: '2024-07-01',
    period: '12 months',
    client: 'Client A',
  },
  {
    name: 'Contract Y',
    description: 'This is a description for Contract Y.',
    date: '2024-06-15',
    period: '24 months',
    client: 'Client B',
  },
  {
    name: 'Contract Z',
    description: 'This is a description for Contract Z.',
    date: '2024-05-20',
    period: '6 months',
    client: 'Client C',
  },
];

const EmployeeContractsDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Assigned Contracts</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Assigned Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input placeholder="Filter by client name" />
            <Input placeholder="Filter by date" type="date" />
            <Input placeholder="Filter by period" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.name}>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>{contract.description}</TableCell>
                  <TableCell>{contract.date}</TableCell>
                  <TableCell>{contract.period}</TableCell>
                  <TableCell>{contract.client}</TableCell>
                  <TableCell>
                    <Button variant="outline">View Contract</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeContractsDemo;