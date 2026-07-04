import * as React from "react"
import { TextField, Label, Input as HeroInput } from "@heroui/react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, label, ...props }, ref) => {
  if (label) {
    return (
      <TextField className="w-full flex flex-col gap-1.5 text-left">
        <Label className="text-xs font-semibold text-gh-text-muted uppercase tracking-wider font-barlow">
          {label}
        </Label>
        <HeroInput
          ref={ref}
          type={type}
          variant="bordered"
          radius="lg"
          className={cn("w-full", className)}
          {...props}
        />
      </TextField>
    )
  }

  return (
    <HeroInput
      ref={ref}
      type={type}
      variant="bordered"
      radius="lg"
      className={cn("w-full", className)}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
