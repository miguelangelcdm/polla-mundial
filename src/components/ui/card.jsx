import * as React from "react"
import { Card as HeroCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@heroui/react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, variant, ...props }, ref) => (
  <HeroCard
    ref={ref}
    classNames={{
      base: cn(
        "border border-gh-border bg-gh-bg-light backdrop-blur-md text-gh-text shadow-md relative overflow-hidden transition-all duration-300 rounded-2xl",
        variant === "glow-blue" && "glow-blue",
        variant === "glow-green" && "glow-green",
        variant === "glow-pink" && "glow-pink",
        variant === "glow-yellow" && "glow-yellow",
        className
      )
    }}
    {...props}
  />
))
Card.displayName = "Card"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
