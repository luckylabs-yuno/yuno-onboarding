// src/components/ui/Input.jsx
import React from 'react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  error = false,
  label,
  description,
  required = false,
  ...props 
}, ref) => {
  const inputId = React.useId()

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-yuno-text-secondary"
        >
          {label}
          {required && <span className="text-yuno-error-primary ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={cn(
          'yuno-input w-full',
          error && 'yuno-error',
          className
        )}
        ref={ref}
        {...props}
      />
      {description && (
        <p className="text-xs text-yuno-text-muted">{description}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input