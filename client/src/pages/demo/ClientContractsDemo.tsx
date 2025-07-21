import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const contracts = [
  {
    name: 'Contract A',
    description: 'This is a description for Contract A.',
    date: '2024-01-15',
    period: '12 months',
  },
  {
    name: 'Contract B',
    description: 'This is a description for Contract B.',
    date: '2024-02-20',
    period: '24 months',
  },
  {
    name: 'Contract C',
    description: 'This is a description for Contract C.',
    date: '2024-03-10',
    period: '6 months',
  },
];

const ClientContractsDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Contracts</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
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
                  <TableCell>
                    <Button variant="outline">View</Button>
                    <Button variant="link" className="ml-2">Download PDF</Button>
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

export default ClientContractsDemo;