import React, { ReactNode } from 'react';

interface TextHeadingProps {
  level?: 'h1' | 'h2';
  children: ReactNode;
  border?: boolean;
  color?: string; // Tailwind class string
  barColor?: string; // Tailwind class string
}

export default function TextHeading({
  level = 'h1',
  children,
  border = false,
  color = 'text-biscay-600',
  barColor = 'bg-apple-500',
}: TextHeadingProps) {
  const Tag = level === 'h2' ? 'h2' : 'h1';

  return (
    <div className="inline-block">
      <Tag className={`${color} relative mb-6 inline-block md:mb-10`}>
        {children}
        {border && (
          <div
            className={`${barColor} d-block mt-4 h-[.25em] rounded-full`}
            style={{ width: '87%' }}
          />
        )}
      </Tag>
    </div>
  );
}
