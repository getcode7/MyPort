import { ReactNode, memo } from 'react';

interface SafeLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  download?: boolean;
}

export const SafeLink = memo(({ href, children, className = '', download }: SafeLinkProps) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  const isMailTo = href.startsWith('mailto:');
  const isPhone = href.startsWith('tel:');
  
  // Para links externos
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  
  // Para email
  if (isMailTo) {
    return (
      <a
        href={href}
        className={className}
      >
        {children}
      </a>
    );
  }
  
  // Para telefone
  if (isPhone) {
    return (
      <a
        href={href}
        className={className}
      >
        {children}
      </a>
    );
  }
  
  // Links internos
  return (
    <a
      href={href}
      className={className}
      download={download}
    >
      {children}
    </a>
  );
});

SafeLink.displayName = 'SafeLink';