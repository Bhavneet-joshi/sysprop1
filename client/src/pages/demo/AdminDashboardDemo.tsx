import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const recentContracts = [
  { name: 'Contract D', value: '$5000', duration: '6 months' },
  { name: 'Contract E', value: '$12000', duration: '12 months' },
  { name: 'Contract F', value: '$7500', duration: '24 months' },
];

const AdminDashboardDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">125</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contracts by Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">50</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contracts by Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">75</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open/In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">30</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentContracts.map((contract) => (
                  <TableRow key={contract.name}>
                    <TableCell>{contract.name}</TableCell>
                    <TableCell>{contract.value}</TableCell>
                    <TableCell>{contract.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardDemo;