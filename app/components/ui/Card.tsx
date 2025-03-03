"use client";

import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  className = '',
  footer,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          {title && <h3 className="text-lg font-semibold text-primary-700">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-700">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">{footer}</div>
      )}
    </div>
  );
};

export default Card; 