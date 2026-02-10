"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex w-14 shrink-0 items-center rounded-full p-1 shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "group bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[28px] data-[state=unchecked]:translate-x-0 block relative",
        )}
      >
        <X className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 text-input dark:text-background/80 size-3 group-data-[state=checked]:hidden" />
        <Check className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 text-primary size-3 group-data-[state=unchecked]:hidden" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
