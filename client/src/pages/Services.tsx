import React from 'react';
import { Link } from 'wouter';

const services = [
  { name: 'Industrial Automation', desc: 'Cutting-edge automation solutions for modern industries.', slug: 'automation' },
  { name: 'Consulting', desc: 'Expert advice to optimize your business processes.', slug: 'consulting' },
  { name: 'Project Management', desc: 'End-to-end project management for complex industrial projects.', slug: 'project-management' },
];

const Services: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Our Services</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map(service => (
          <Link key={service.slug} href={`/services/${service.slug}`} className="block bg-blue-50 rounded-lg p-6 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">{service.name}</h2>
            <p className="text-gray-600">{service.desc}</p>
            <span className="inline-block mt-4 text-blue-700 underline">Learn more</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
