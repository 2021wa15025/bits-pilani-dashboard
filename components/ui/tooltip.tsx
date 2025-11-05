"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-[99999] w-fit max-w-xs rounded-lg px-4 py-3 shadow-2xl border-2",
          className,
        )}
        style={{
          backgroundColor: 'rgb(0, 0, 0)',
          color: 'rgb(255, 255, 255)',
          border: '2px solid rgb(204, 204, 204)',
          opacity: '1',
          filter: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none'
        }}
        {...props}
      >
        <div style={{ 
          color: '#ffffff !important',
          fontSize: '14px',
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          <style>
            {`
              [data-slot="tooltip-content"] * {
                color: #ffffff !important;
              }
              [data-slot="tooltip-content"] p {
                color: #ffffff !important;
              }
              [data-slot="tooltip-content"] .text-sm {
                color: #ffffff !important;
              }
            `}
          </style>
          {children}
        </div>
        <TooltipPrimitive.Arrow className="fill-black z-[99999]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
