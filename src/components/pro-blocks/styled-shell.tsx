"use client";

import * as React from "react";

import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface StyledShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StyledShell = React.forwardRef<HTMLDivElement, StyledShellProps>(
  ({ className, children, ...props }, ref) => {
    // Properties derived from JSON:
    // padding: spacing/6 -> p-6
    // border-radius: border-radius/rounded-lg -> rounded-lg
    // border-width: border-width/border -> border
    // background-color: base/background -> bg-background
    // border-color: base/border -> border-border

    // Mobile JSON is identical to Desktop, so styles are consistent across breakpoints.

    return (
      <div
        ref={ref}
        className={cn(
          "bg-background border-border rounded-lg border p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StyledShell.displayName = "StyledShell";

export default StyledShell;
