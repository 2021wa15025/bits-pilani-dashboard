"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full transition-all duration-200",
          "data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2",
          "bg-gray-200 dark:bg-gray-700",
          "shadow-inner",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute transition-all duration-300 ease-out",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500",
            "shadow-sm",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block size-5 shrink-0 rounded-full transition-all duration-200",
            "border-2 border-white dark:border-gray-800",
            "bg-blue-600 dark:bg-blue-500",
            "shadow-lg hover:shadow-xl",
            "ring-0 focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:outline-none",
            "hover:scale-110 active:scale-95",
            "disabled:pointer-events-none disabled:opacity-50",
            "cursor-grab active:cursor-grabbing",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
