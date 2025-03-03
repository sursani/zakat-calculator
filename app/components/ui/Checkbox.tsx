"use client";

import React, { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  helperText?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${className}`}
              {...props}
            />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-700">{label}</label>
            {helperText && !error && (
              <p className="text-gray-500">{helperText}</p>
            )}
            {error && (
              <p className="text-red-600">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox; 