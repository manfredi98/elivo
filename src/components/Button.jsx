import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-elivo-blue text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl`;
      case 'secondary':
        return `${baseStyles} bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500`;
      case 'success':
        return `${baseStyles} bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-lg hover:shadow-xl`;
      case 'danger':
        return `${baseStyles} bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg hover:shadow-xl`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-lg hover:shadow-xl`;
      case 'outline':
        return `${baseStyles} border-2 border-elivo-blue text-elivo-blue hover:bg-elivo-blue hover:text-white focus:ring-blue-500`;
      case 'ghost':
        return `${baseStyles} text-elivo-blue hover:bg-blue-50 focus:ring-blue-500`;
      default:
        return `${baseStyles} bg-elivo-blue text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'xl':
        return 'px-10 py-5 text-xl';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const LoadingSpinner = () => (
    <motion.div
      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${getVariantStyles()} ${getSizeStyles()} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      whileFocus={{ scale: 1.02 }}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && (
          <LoadingSpinner />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        {!loading && children && (
          <span>{children}</span>
        )}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </div>
    </motion.button>
  );
};

export default Button;

