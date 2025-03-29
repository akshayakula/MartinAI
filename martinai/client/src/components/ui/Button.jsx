import React from 'react';

export const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  onClick, 
  className = '',
  icon,
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-background-lighter border-border hover:bg-background-light text-text-primary',
    primary: 'bg-highlight border-highlight text-background hover:bg-opacity-90',
    optimizer: 'bg-button-optimizer border-button-optimizer text-background hover:bg-opacity-90',
    predictive: 'bg-button-predictive border-button-predictive text-background hover:bg-opacity-90',
    rules: 'bg-button-rules border-button-rules text-background hover:bg-opacity-90',
    danger: 'bg-danger border-danger text-white hover:bg-opacity-90',
    ghost: 'bg-transparent hover:bg-background-lighter text-text-primary'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        border rounded-md font-medium transition-all 
        focus:outline-none focus:ring-2 focus:ring-highlight
        flex items-center justify-center
        ${variantClasses[variant] || variantClasses.default}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}; 