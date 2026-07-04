import * as React from "react"
import { Button as HeroButton } from "@heroui/react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  let color = "default"
  let heroVariant = "solid"
  
  switch (variant) {
    case "destructive":
    case "neon-pink":
      color = "danger"
      break
    case "neon-blue":
      color = "secondary" // Violet/Purple in our CSS themes
      break
    case "neon-green":
      color = "success" // Green
      break
    case "neon-yellow":
      color = "warning" // Yellow/Gold
      break
    case "outline":
      heroVariant = "bordered"
      break
    case "ghost":
      heroVariant = "light"
      break
    case "secondary":
      color = "default"
      heroVariant = "flat"
      break
    case "default":
    default:
      color = "secondary"
      break
  }

  const colorClasses = {
    default: "bg-gh-bg-active text-gh-text",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-danger text-white",
  }

  let sizeName = "md"
  if (size === "sm") sizeName = "sm"
  if (size === "lg") sizeName = "lg"

  return (
    <HeroButton
      ref={ref}
      color={color}
      variant={heroVariant}
      size={sizeName}
      radius="full"
      className={cn(
        "font-barlow tracking-wider uppercase font-semibold h-9 px-5 transition-all",
        heroVariant === "solid" && colorClasses[color],
        size === "sm" && "h-8 px-4",
        size === "lg" && "h-11 px-8 text-sm",
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
