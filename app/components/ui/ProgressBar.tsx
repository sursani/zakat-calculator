"use client";

import React from 'react';

type ProgressBarProps = {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps?: number[];
};

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep, onStepClick, completedSteps = [] }) => {
  const percentage = ((currentStep) / (steps.length - 1)) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          const isCompleted = completedSteps.includes(index);
          const maxCompletedStep = completedSteps.length ? Math.max(...completedSteps) : -1;
          const isClickable = index <= Math.min(currentStep + 1, maxCompletedStep + 1);
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center"
              onClick={() => isClickable ? onStepClick(index) : null}
              style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
            >
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium shadow-md
                  ${isCurrent 
                    ? 'bg-primary-600 text-white ring-4 ring-primary-200 dark:ring-primary-700/30 dark:bg-primary-600 dark:text-white' 
                    : isCompleted
                      ? 'bg-primary-400 text-white border-2 border-primary-500 dark:bg-primary-700 dark:text-white dark:border-primary-600' 
                      : isActive && isClickable
                        ? 'bg-primary-300 text-white border-2 border-primary-400 dark:bg-primary-800 dark:text-white dark:border-primary-700'
                        : 'bg-secondary-300 text-secondary-800 border border-secondary-400 dark:bg-secondary-700 dark:text-secondary-300 dark:border-secondary-600'
                  }
                  transition-all duration-200 ease-in-out ${isClickable ? 'transform hover:scale-105' : 'opacity-70'}
                `}
                aria-current={isCurrent ? "step" : undefined}
                data-state={isCurrent ? "active" : isCompleted ? "completed" : "inactive"}
              >
                {index + 1}
              </div>
              <span 
                className={`
                  mt-2 text-sm font-semibold whitespace-nowrap
                  ${isCurrent 
                    ? 'text-primary-900 dark:text-white font-bold' 
                    : isCompleted
                      ? 'text-primary-800 dark:text-primary-300' 
                      : isClickable
                        ? 'text-secondary-700 dark:text-secondary-400'
                        : 'text-secondary-500 dark:text-secondary-600'
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