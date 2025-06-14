
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "ghost"
    | "subtle"
    | "danger"
    | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 px-4 py-2 min-h-12";

    const variantClasses = {
      default: "bg-redCross text-white hover:bg-red-700 focus-visible:ring-redCross",
      primary: "bg-redCross text-white hover:bg-red-700 focus-visible:ring-redCross",
      secondary:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 focus-visible:ring-gray-300",
      ghost: "bg-transparent text-black hover:bg-gray-100 border border-gray-300 focus-visible:ring-gray-300",
      subtle: "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 focus-visible:ring-gray-300",
      danger: "bg-red-100 text-redCross hover:bg-red-200 border border-red-300 focus-visible:ring-redCross",
      outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-300"
      tile: "bg-white text-gray-700 shadow hover:bg-gray-50 hover:shadow-md focus-visible:ring-gray-300"
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
