"use client";

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, fullWidth = false, className = '', ...props }, ref) => {
    const inputClasses = `
      block w-full rounded-md border border-gray-300 px-4 py-2.5 
      placeholder:text-gray-400 focus:outline-none focus:ring-2 
      focus:ring-primary-500 focus:border-primary-500 shadow-sm
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
      ${className}
    `;

    const containerClasses = fullWidth ? 'w-full' : '';

    return (
      <div className={`mb-4 ${containerClasses}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 