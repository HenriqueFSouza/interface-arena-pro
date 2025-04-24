import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'

    return (
      <div className="relative flex flex-1 flex-col gap-1.5">
        {label && (
          <label className="text-sm text-neutral-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
            "focus-visible:outline-none ",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button type="button" className="absolute right-3 top-8 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
          </button>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input };

