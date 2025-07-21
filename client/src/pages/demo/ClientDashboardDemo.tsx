import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const recentAgreements = [
  { name: 'Agreement 1', date: '2024-07-01' },
  { name: 'Agreement 2', date: '2024-06-15' },
  { name: 'Agreement 3', date: '2024-05-20' },
  { name: 'Agreement 4', date: '2024-04-10' },
  { name: 'Agreement 5', date: '2024-03-05' },
];

const ClientDashboardDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Number of Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">12</p>
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
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAgreements.map((agreement) => (
                <TableRow key={agreement.name}>
                  <TableCell>{agreement.name}</TableCell>
                  <TableCell>{agreement.date}</TableCell>
                  <TableCell>
                    <Button variant="link">View PDF</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button>View All Contracts</Button>
        <Button className="ml-2">Request New Contract</Button>
      </div>
    </div>
  );
};

export default ClientDashboardDemo;