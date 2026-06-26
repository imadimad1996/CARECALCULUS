import React, { HTMLAttributes } from 'react';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'subtle' | 'card' | 'floating';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Surface: React.FC<SurfaceProps> = ({
  children,
  elevation = 'card',
  padding = 'md',
  interactive = false,
  className = '',
  ...props
}) => {
  const elevationStyles = {
    flat: 'bg-transparent border-0 shadow-none',
    subtle: 'bg-slate-50 border border-slate-100 shadow-none',
    card: 'bg-white border border-slate-200/80 shadow-sm',
    floating: 'bg-white border border-slate-200 shadow-xl'
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-[1px] cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-xl text-slate-800 ${elevationStyles[elevation]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Surface;
