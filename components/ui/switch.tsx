"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base switch container with proper contrast
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-gray-300 transition-all duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Unchecked state (OFF) - gray background
        "data-[state=unchecked]:bg-gray-200 data-[state=unchecked]:border-gray-300",
        // Checked state (ON) - blue background  
        "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
        // Dark mode
        "dark:data-[state=unchecked]:bg-gray-700 dark:data-[state=unchecked]:border-gray-600",
        "dark:data-[state=checked]:bg-blue-600 dark:data-[state=checked]:border-blue-600",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // White thumb that moves and is always visible
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0",
          "transition-transform duration-200 ease-in-out",
          // Position: left when unchecked, right when checked
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          // Dark mode - keep white but add border for visibility
          "dark:bg-white dark:border dark:border-gray-300",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
