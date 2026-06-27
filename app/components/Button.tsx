import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * You can pass fully custom widths and heights via className, e.g., "w-32 h-12"
   */
  className?: string;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", fullWidth = false, children, ...props }, ref) => {
    // These states align precisely with the colors from globals.css
    // Enabled: bg-primary-500
    // Hover: hover:bg-primary-600
    // Pressed: active:bg-primary-800
    // Focused: focus:ring-4 focus:ring-primary-500/50 (creating the offset-like glow) or focus-visible with offset
    // Disabled: disabled:bg-primary-300
    const baseStyles =
      "inline-flex items-center justify-center font-semibold text-white rounded-md transition-all duration-200";

    const colorStyles =
      "bg-primary-500 hover:bg-primary-600 active:bg-primary-800 disabled:bg-primary-300 disabled:cursor-not-allowed";

    const focusStyles =
      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white";

    const defaultSizingStyles = "px-6 py-3";

    const combinedClasses = [
      baseStyles,
      colorStyles,
      focusStyles,
      defaultSizingStyles,
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
