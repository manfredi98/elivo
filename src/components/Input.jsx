import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  icon,
  ...props
}, ref) => {
  const hasError = !!error;
  const hasValue = value && value.length > 0;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={name}
          className={`block text-sm font-medium transition-colors duration-200 ${
            hasError 
              ? 'text-red-600' 
              : hasValue 
                ? 'text-elivo-blue' 
                : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={`transition-colors duration-200 ${
              hasError 
                ? 'text-red-500' 
                : hasValue 
                  ? 'text-elivo-blue' 
                  : 'text-gray-400'
            }`}>
              {icon}
            </div>
          </div>
        )}
        
        <motion.input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${hasError 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : hasValue
                ? 'border-elivo-blue focus:ring-elivo-yellow focus:border-elivo-blue'
                : 'border-gray-300 focus:ring-elivo-yellow focus:border-elivo-blue'
            }
            ${className}
          `}
          whileFocus={{ scale: 1.02 }}
          whileHover={{ scale: disabled ? 1 : 1.01 }}
          {...props}
        />
        
        {hasValue && !hasError && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </div>
      
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-1 text-red-600 text-sm"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
