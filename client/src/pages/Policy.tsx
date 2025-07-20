import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const policies = [
  {
    title: 'Privacy Policy',
    description: 'We are committed to protecting your privacy. Read our full privacy policy for details on how we handle your data.',
    link: '/docs/privacy-policy.pdf',
  },
  {
    title: 'Data Protection Policy',
    description: 'Your data security is our priority. Learn more about our data protection practices in the document below.',
    link: '/docs/data-protection-policy.pdf',
  },
  {
    title: 'Terms of Service',
    description: 'Read the terms and conditions for using our services and website.',
    link: '/docs/terms-of-service.pdf',
  },
];

const Policy: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 dark:bg-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Our Policies</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Transparency and trust are at the core of our operations. Here you can find our key legal and data policies.
        </p>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {policies.map((policy) => (
              <Card key={policy.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{policy.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{policy.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <a href={policy.link} download>Download PDF</a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Policy;
