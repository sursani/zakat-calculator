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
                    ? 'bg-primary-600 text-white ring-4 ring-primary-200 dark:ring-primary-700/30 dark:bg-primary-600 dark:text-white' 
                    : isActive 
                      ? 'bg-primary-400 text-white border-2 border-primary-500 dark:bg-primary-700 dark:text-white dark:border-primary-600' 
                      : 'bg-secondary-300 text-secondary-800 border border-secondary-400 dark:bg-secondary-700 dark:text-secondary-300 dark:border-secondary-600'
                  }
                  transition-all duration-200 ease-in-out transform hover:scale-105
                `}
                aria-current={isCurrent ? "step" : undefined}
                data-state={isCurrent ? "active" : isActive ? "completed" : "inactive"}
              >
                {index + 1}
              </div>
              <span 
                className={`
                  mt-2 text-sm font-semibold whitespace-nowrap
                  ${isCurrent 
                    ? 'text-primary-900 dark:text-white font-bold' 
                    : isActive 
                      ? 'text-primary-800 dark:text-primary-300' 
                      : 'text-secondary-700 dark:text-secondary-400'
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
        <div className="absolute top-0 left-0 w-full h-2 bg-secondary-200 rounded-full shadow-inner dark:bg-secondary-700"></div>
        <div 
          className="absolute top-0 left-0 h-2 rounded-full shadow-lg bg-primary-600 dark:bg-primary-600 transition-all duration-500 ease-in-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 