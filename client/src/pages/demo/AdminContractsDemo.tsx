import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const contracts = [
  {
    name: 'Contract A',
    description: 'This is a description for Contract A.',
    date: '2024-01-15',
    duration: '12 months',
  },
  {
    name: 'Contract B',
    description: 'This is a description for Contract B.',
    date: '2024-02-20',
    duration: '24 months',
  },
  {
    name: 'Contract C',
    description: 'This is a description for Contract C.',
    date: '2024-03-10',
    duration: '6 months',
  },
];

const AdminContractsDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contracts</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.name}>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>{contract.description}</TableCell>
                  <TableCell>{contract.date}</TableCell>
                  <TableCell>{contract.duration}</TableCell>
                  <TableCell>
                    <Button variant="outline">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button className="mt-4">New Contract</Button>
    </div>
  );
};

export default AdminContractsDemo;