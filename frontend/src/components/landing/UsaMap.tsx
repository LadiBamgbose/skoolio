import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { USAMap } from '@mirawision/usa-map-react';

const UsaMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // List of state codes to highlight (customize this array with your states)
  const highlightedStates = [
    'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI',
    'NJ', 'VA', 'WA', 'AZ', 'MA', 'IN', 'TN', 'MO', 'MD', 'WI'
  ];

  // Inject gradient after map renders
  useEffect(() => {
    const applyGradient = () => {
      const mapSvg = mapContainerRef.current?.querySelector('svg');
      if (!mapSvg) return;

      // Create or get defs element
      let defs = mapSvg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        mapSvg.insertBefore(defs, mapSvg.firstChild);
      }

      // Remove existing gradient if present
      const existingGradient = defs.querySelector('#gradient-states');
      if (existingGradient) {
        existingGradient.remove();
      }

      // Create gradient
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', 'gradient-states');
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%');
      gradient.setAttribute('y2', '100%');

      const stops = [
        { offset: '0%', color: '#3b82f6' },
        { offset: '50%', color: '#06b6d4' },
        { offset: '100%', color: '#2563eb' }
      ];

      stops.forEach(stop => {
        const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stopElement.setAttribute('offset', stop.offset);
        stopElement.setAttribute('stop-color', stop.color);
        gradient.appendChild(stopElement);
      });

      defs.appendChild(gradient);

      // Apply gradient to all paths that are highlighted states
      const allPaths = mapSvg.querySelectorAll('path');
      allPaths.forEach(path => {
        const stateCode = path.getAttribute('data-state-code') || 
                         path.getAttribute('data-name') ||
                         path.getAttribute('id');
        if (stateCode && highlightedStates.includes(stateCode.toUpperCase())) {
          path.setAttribute('fill', 'url(#gradient-states)');
        }
      });
    };

    // Try immediately and also after a delay to catch async rendering
    applyGradient();
    const timeoutId = setTimeout(applyGradient, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Create custom states - we'll override with gradient in useEffect
  const customStates = highlightedStates.reduce<Record<string, { fill: string }>>((acc, state) => ({
    ...acc,
    [state]: {
      fill: '#3b82f6'
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
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.3 }}
        >
          <h2 
            className="text-4xl font-extrabold sm:text-5xl lg:text-6xl opacity-60"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4, #2563eb)",
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Trusted by teachers in {highlightedStates.length} states
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-2xl text-gray-500 sm:mt-5 sm:text-3xl">
            Join thousands of schools and educators across the country
          </p>
        </motion.div>
        <motion.div 
          className="max-w-6xl mx-auto" 
          ref={mapContainerRef}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <USAMap 
            defaultState={defaultState}
            customStates={customStates}
            mapSettings={{
              width: '100%',
              height: 540,
              title: 'States where Skoolio is trusted'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default UsaMap;
