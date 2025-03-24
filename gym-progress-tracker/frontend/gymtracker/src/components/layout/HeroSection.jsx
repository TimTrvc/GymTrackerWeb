// HeroSection.jsx sollte so aussehen:
import React from 'react';

const HeroSection = ({ title, subtitle, button }) => {
  return (
    <div className="bg-indigo-700 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">{subtitle}</p>
        {button}
      </div>
    </div>
  );
};

export default HeroSection;
