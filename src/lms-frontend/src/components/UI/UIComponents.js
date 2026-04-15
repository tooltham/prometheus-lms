import React from 'react';
import './UIComponents.css';

export const NPUButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`npu-btn npu-btn-${variant} npu-btn-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const NPUCard = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`npu-card shadow-premium ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="npu-card-header">
          {title && <h3 className="npu-card-title">{title}</h3>}
          {subtitle && <p className="npu-card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="npu-card-body">
        {children}
      </div>
    </div>
  );
};
