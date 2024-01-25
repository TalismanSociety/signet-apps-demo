import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, suffix, ...props }, ref) => {
    return (
      <div className="w-full">
        {label !== undefined && (
          <label className="flex items-center space-x-3 mb-1">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </label>
        )}
        <div className="flex items-center w-full h-10 rounded-md border border-input bg-background ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
          <input
            type={type}
            className={cn(
              "h-full w-full px-3 py-2 text-sm border-none bg-transparent placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix !== undefined && <div className="pr-3 pl-2">{suffix}</div>}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
