import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const comments = [
  {
    user: 'Client A',
    timestamp: '2024-07-20 10:30 AM',
    comment: 'Please clarify section 2.1.',
  },
  {
    user: 'Employee B',
    timestamp: '2024-07-20 11:00 AM',
    comment: 'Section 2.1 refers to the terms of service.',
  },
];

const ClientContractViewDemo: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">View Contract</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contract PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-96 flex items-center justify-center">
                <p>PDF Viewer Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://github.com/shadcn.png`} />
                      <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{comment.user}</p>
                      <p className="text-sm text-gray-500">{comment.timestamp}</p>
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Textarea placeholder="Add a comment..." />
                <Button className="mt-2">Submit</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientContractViewDemo;