import React from 'react';

const Company: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">About the Company</h1>
      <div className="mb-8">
        {/* Placeholder for 3D logo animation */}
        <div className="w-full flex justify-center items-center mb-6">
          <div className="w-40 h-40 bg-gradient-to-br from-blue-200 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-4xl font-bold text-white">Logo</span>
          </div>
        </div>
        <p className="text-gray-700 text-center mb-4">Each element of our logo represents a core value of HLSG Industries. As the animation plays, each part appears with an explanation, culminating in the complete logo.</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li><b>Circle:</b> Unity and global reach.</li>
          <li><b>Blue Gradient:</b> Innovation and trust.</li>
          <li><b>Central Icon:</b> Our commitment to excellence.</li>
        </ul>
        <p className="text-gray-600 text-center">Together, these elements form the HLSG Industries logo, symbolizing our mission to build the future.</p>
      </div>
    </div>
  );
};

export default Company; 