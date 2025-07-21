import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const recentAgreements = [
  { name: 'Agreement X', client: 'Client A', date: '2024-07-01' },
  { name: 'Agreement Y', client: 'Client B', date: '2024-06-15' },
  { name: 'Agreement Z', client: 'Client C', date: '2024-05-20' },
];

const EmployeeDashboardDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Assigned Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">8</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agreement Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAgreements.map((agreement) => (
                <TableRow key={agreement.name}>
                  <TableCell>{agreement.name}</TableCell>
                  <TableCell>{agreement.client}</TableCell>
                  <TableCell>{agreement.date}</TableCell>
                  <TableCell>
                    <Button variant="link">View Contract</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button>View All Assigned Contracts</Button>
      </div>
    </div>
  );
};

export default EmployeeDashboardDemo;