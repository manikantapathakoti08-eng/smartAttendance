'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop' |
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  glass?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  glass = false,
  className,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary';
  const variantClasses = 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal hover:border-slate-300';
  
  const classes = cn(
    baseClasses,
    variantClasses,
    error ? 'border-red-500 focus:ring-red-500' : undefined,
    icon ? 'pl-11' : undefined,
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-500 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        <motion.input
          className={classes}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
          value={typeof props.value === 'number' && isNaN(props.value) ? '' : props.value}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
