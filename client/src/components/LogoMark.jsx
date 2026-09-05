import React from 'react';

export default function LogoMark({ className = '', size = 40 }) {
  return (
    <img
      src="/logo.png"
      alt="Task Flow Logo"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
