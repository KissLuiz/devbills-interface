import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  hover?: boolean;
  glowEffect?: CardEffect;
  redcard?: boolean;
  greencard?: boolean;
  className?: string;
}

export enum CardEffect {
  GLOWUP= "glowup",
  GLOWDOWN = "glowdown",
}

const Card = ({
  children,
  title,
  subtitle,
  icon,
  hover = false,
  glowEffect,
  redcard,
  greencard,
  className,
}: CardProps) => {
  return (
    <div
      className={`bg-gray-900 rounded-xl cursor-pointer border border-gray-700 p-6 shadow-md transition-all
        ${hover ? "hover:shadow-lg hover:border-primary-500 hover:-translate-y-0.5" : ""}
        ${glowEffect === CardEffect.GLOWUP ? "glowup" : ""}
        ${glowEffect === CardEffect.GLOWDOWN ? "glowdown" : ""}
        ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center space-x-3 mb-4">
          {icon && (
            <div className={`p-2 rounded-xl flex items-center justify-center ${redcard ? "bg-red-500/10" : ''} ${greencard ? "bg-primary-500/10" : ''} ${glowEffect === CardEffect.GLOWUP ? "bg-primary-500/10" : ""} ${glowEffect === CardEffect.GLOWDOWN ? "bg-red-500/10" : ""} `}>
              {icon}
            </div>
          )}

          {(title || subtitle) && (
              <div>
                {title && <h3 className="text-lg font-medium">{title}</h3>}
                {subtitle && (
                  <p className="text-sm text-gray-400">{subtitle}</p>
                )}
              </div>
            )}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;
