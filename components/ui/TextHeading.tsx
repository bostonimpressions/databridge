import React, { ReactNode } from "react";

interface TextHeadingProps {
  level?: "h1" | "h2";
  children: ReactNode;
  border?: boolean;
  color?: string;      // Tailwind class string
  barColor?: string;   // Tailwind class string
}

export default function TextHeading(
  {
    level = "h1",
    children,
    border = true,
    color = "text-biscay-600",
    barColor = "bg-nugreen-500",
  }: TextHeadingProps) {
  const Tag = level === "h2" ? "h2" : "h1";

  return (
    <div className="inline-block">
      <Tag className={`${color} relative inline-block mb-6 md:mb-10`}>
        {children}
        {border && (
          <div
            className={`${barColor} d-block mt-4 h-[.25em] rounded-full`}
            style={{ width: "87%" }}
          />
        )}
      </Tag>


    </div>
  );
}
