import React from "react";

interface LightspaceLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  glow?: boolean;
}

export const LightspaceLogo: React.FC<LightspaceLogoProps> = ({
  className = "w-10 h-10",
  showText = false,
  textClassName = "text-[10px] font-sans font-medium text-pink-300 tracking-[0.25em] uppercase mt-1",
  glow = true,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img
        src="/lightspace-logo.png"
        alt="LIGHTSPACE Logo"
        className={`w-full h-full object-contain transition-transform duration-300 ${
          glow ? "filter drop-shadow-[0_0_14px_rgba(244,143,177,0.5)]" : ""
        }`}
      />
      {showText && (
        <span className={textClassName}>
          LIGHTSPACE
        </span>
      )}
    </div>
  );
};
