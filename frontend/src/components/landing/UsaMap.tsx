import React from 'react';
import { USAMap } from '@mirawision/usa-map-react';

const UsaMap: React.FC = () => {
  // List of state codes to highlight (customize this array with your states)
  const highlightedStates = [
    'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI',
    'NJ', 'VA', 'WA', 'AZ', 'MA', 'IN', 'TN', 'MO', 'MD', 'WI'
  ];

  // Create custom states with blue color for highlighted states
  const customStates = highlightedStates.reduce<Record<string, { fill: string }>>((acc, state) => ({
    ...acc,
    [state]: {
      fill: '#3b82f6' // blue-500 from Tailwind
    }
  }), {});

  // Default state settings
  const defaultState = {
    fill: '#e5e7eb', // gray-200 from Tailwind
    onClick: (stateCode: string) => {
      console.log(`Clicked on ${stateCode}`);
      // You can add custom click handling logic here
    }
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted in {highlightedStates.length} States
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Join thousands of schools and educators across the country
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <USAMap 
            defaultState={defaultState}
            customStates={customStates}
            mapSettings={{
              width: '100%',
              height: 400,
              title: 'States where Skoolio is trusted'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UsaMap;
