// src/components/ui/Select.jsx
import React from 'react'
import { cn } from '../../lib/utils'

export const Select = React.forwardRef(({ 
  className, 
  options = [],
  placeholder = 'Select an option',
  label,
  required = false,
  error = false,
  ...props 
}, ref) => {
  const selectId = React.useId()

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-yuno-text-secondary"
        >
          {label}
          {required && <span className="text-yuno-error-primary ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'yuno-input w-full cursor-pointer',
          error && 'yuno-error',
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
})

Select.displayName = 'Select'

export default Select