import React, { ReactNode, HTMLAttributes } from 'react';
import Surface from './Surface';

export interface SectionCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  statusBadge?: ReactNode;
  noPadding?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  action,
  statusBadge,
  children,
  noPadding = false,
  className = '',
  ...props
}) => {
  const hasHeader = title || subtitle || action || statusBadge;

  return (
    <Surface
      elevation="card"
      padding="none"
      className={`overflow-hidden transition-all duration-200 border-slate-200 ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              {title && (
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
            {statusBadge && <div className="shrink-0">{statusBadge}</div>}
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </Surface>
  );
};

export default SectionCard;
