"use client";

import React from 'react';

type ProgressBarProps = {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep, onStepClick }) => {
  const percentage = ((currentStep) / (steps.length - 1)) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center"
              onClick={() => onStepClick(index)}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium shadow-md
                  ${isCurrent 
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-700/30 dark:bg-blue-500 dark:text-white' 
                    : isActive 
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 dark:bg-blue-700 dark:text-white dark:border-blue-600' 
                      : 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                  }
                  transition-all duration-200 ease-in-out transform hover:scale-105
                `}
              >
                {index + 1}
              </div>
              <span 
                className={`
                  mt-2 text-sm font-medium whitespace-nowrap
                  ${isCurrent 
                    ? 'text-blue-700 dark:text-white' 
                    : isActive 
                      ? 'text-blue-600 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="relative w-full">
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 rounded-full shadow-inner dark:bg-gray-700"></div>
        <div 
          className="absolute top-0 left-0 h-2 rounded-full shadow-lg bg-blue-500 dark:bg-blue-500 transition-all duration-500 ease-in-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 