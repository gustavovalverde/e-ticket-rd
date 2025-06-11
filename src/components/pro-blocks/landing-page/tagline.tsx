import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const taglineVariants = cva(
  "flex items-center justify-center text-sm font-medium w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-background border shadow-xs px-2.5 rounded-md h-7",
        ghost: "bg-transparent text-muted-foreground",
        white: "text-white",
      },
    },
    defaultVariants: {
      variant: "ghost",
    },
  }
);

interface TaglineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof taglineVariants> {
  asChild?: boolean;
}

function Tagline({
  className,
  variant,
  asChild = false,
  children,
  ...props
}: TaglineProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp className={cn(taglineVariants({ variant, className }))} {...props}>
      {children}
    </Comp>
  );
}

export { Tagline, taglineVariants };
