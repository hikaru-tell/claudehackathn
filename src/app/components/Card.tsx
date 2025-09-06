import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ title, children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      onClick={onClick}
    >
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}
