import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const employee = {
  name: 'Employee User',
  pan: 'KLMNO1234P',
  aadhaar: '1122 3344 5566',
  contact: 'employee@example.com',
  address: '789 Employee Lane, Employee City, 98765',
  employeeId: 'empuser01',
};

const EmployeeProfileDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{employee.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Employee ID:</strong> {employee.employeeId}</p>
          <p><strong>PAN:</strong> {employee.pan}</p>
          <p><strong>Aadhaar:</strong> {employee.aadhaar}</p>
          <p><strong>Contact:</strong> {employee.contact}</p>
          <p><strong>Address:</strong> {employee.address}</p>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button>Request Password Change</Button>
      </div>
    </div>
  );
};

export default EmployeeProfileDemo;