import React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "accent"
}

export default function Spinner({ 
  size = "md", 
  color = "primary", 
  className, 
  ...props 
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("animate-spin rounded-full border-2 border-background border-r-foreground", {
        "w-4 h-4 border-2": size === "sm",
        "w-8 h-8 border-3": size === "md",
        "w-12 h-12 border-4": size === "lg",
        "border-r-primary": color === "primary",
        "border-r-secondary": color === "secondary",
        "border-r-accent": color === "accent",
      }, className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}