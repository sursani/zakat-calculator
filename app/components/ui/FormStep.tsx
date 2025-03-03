"use client";

import React from 'react';
import Button from './Button';

interface FormStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  isNextDisabled?: boolean;
}

const FormStep: React.FC<FormStepProps> = ({
  title,
  description,
  children,
  onNext,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
  nextButtonText = 'Next',
  previousButtonText = 'Previous',
  isNextDisabled = false,
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary-800 mb-2">{title}</h2>
        {description && <p className="text-gray-700 text-base">{description}</p>}
      </div>
      
      <div className="mb-10">
        {children}
      </div>
      
      <div className="flex justify-between pt-4 border-t border-gray-100">
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
            size="md"
          >
            {previousButtonText}
          </Button>
        )}
        
        {isFirstStep && <div />}
        
        {!isLastStep ? (
          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            size="md"
          >
            {nextButtonText}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            variant="primary"
            size="md"
          >
            Calculate Zakat
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormStep; 