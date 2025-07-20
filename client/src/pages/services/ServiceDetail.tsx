import React from 'react';
import { useRoute } from 'wouter';
import { useEffect, useState } from 'react';
import { Link } from 'wouter';

const serviceDetails = {
  automation: {
    name: 'Industrial Automation',
    desc: 'Cutting-edge automation solutions for modern industries. We provide design, implementation, and support for automation systems tailored to your needs.',
  },
  consulting: {
    name: 'Consulting',
    desc: 'Expert advice to optimize your business processes. Our consultants help you achieve operational excellence and sustainable growth.',
  },
  'project-management': {
    name: 'Project Management',
    desc: 'End-to-end project management for complex industrial projects. We ensure timely delivery and quality outcomes.',
  },
};

const ServiceDetail: React.FC = () => {
  const [match, params] = useRoute('/services/:slug');
  const [service, setService] = useState<{ name: string; desc: string } | null>(null);

  useEffect(() => {
    if (params?.slug && serviceDetails[params.slug as keyof typeof serviceDetails]) {
      setService(serviceDetails[params.slug as keyof typeof serviceDetails]);
    } else {
      setService(null);
    }
  }, [params]);

  if (!service) {
    return <div className="max-w-2xl mx-auto py-12 px-4 text-center text-gray-600">Service not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">{service.name}</h1>
      <p className="text-lg text-gray-700 mb-8">{service.desc}</p>
      <Link href="/contact" className="inline-block px-6 py-3 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors font-semibold">Get this Service</Link>
    </div>
  );
};

export default ServiceDetail; 