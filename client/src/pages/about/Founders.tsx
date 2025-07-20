import React from 'react';

const Founders: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">About the Founders</h1>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <img src="/founder-placeholder.jpg" alt="Founder" className="w-40 h-40 rounded-full object-cover shadow mb-6 md:mb-0" />
        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Mr. A. Visionary</h2>
          <p className="text-gray-700 mb-2">Founder & Chairman</p>
          <p className="text-gray-600 mb-4">Mr. Visionary is the driving force behind HLSG Industries, with a passion for innovation and a commitment to excellence. Under his leadership, the company has grown into a leader in its field.</p>
          <h2 className="text-xl font-semibold text-blue-800 mb-2 mt-8">Ms. B. Innovator</h2>
          <p className="text-gray-700 mb-2">Co-Founder & CEO</p>
          <p className="text-gray-600">Ms. Innovator brings a wealth of experience and a forward-thinking approach to HLSG Industries, ensuring the company remains at the forefront of industry advancements.</p>
        </div>
      </div>
    </div>
  );
};

export default Founders; 