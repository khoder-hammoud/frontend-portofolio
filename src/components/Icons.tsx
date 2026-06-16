import React from 'react';

export const WhatsAppIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M16 14.5c-.3-.2-.8-.4-1-.5-.2-.1-.4-.2-.6.1s-.6.8-.8 1c-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.3.3-.6.1-.3 0-.5-.1-.7-.1-.2-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-.8.8-.8 2 0 1.2.8 2.3 1 2.4.1.2 1.6 2.5 4 3.5.6.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.6-.3z" />
  </svg>
);
