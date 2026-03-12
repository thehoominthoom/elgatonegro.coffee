import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-sm bg-card text-card-foreground",
        variant === "default" && "shadow-polaroid",
        variant === "bordered" && "border border-brand-black",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export { Card };
export type { CardProps };
