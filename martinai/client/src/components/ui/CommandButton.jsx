import React from 'react';

export default function CommandButton({ 
  children, 
  variant = 'default', 
  size = 'md', 
  onClick,
  className = '',
  ...props 
}) {
  const variantStyles = {
    default: 'bg-border text-text hover:bg-opacity-90',
    highlight: 'bg-highlight text-background hover:bg-opacity-90 shadow-glow',
    optimizer: 'bg-optimizer text-background hover:bg-opacity-90',
    predictive: 'bg-predictive text-background hover:bg-opacity-90',
    rules: 'bg-rules text-background hover:bg-opacity-90',
    outline: 'bg-transparent border border-border text-text hover:border-highlight'
  };
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        rounded font-medium transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
} 