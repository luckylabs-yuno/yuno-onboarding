// src/components/ui/ErrorMessage.jsx
import React from 'react'
import { cn } from '../../lib/utils'

export const ErrorMessage = ({ message, className }) => {
  if (!message) return null

  return (
    <div className={cn(
      'bg-red-500/10 border border-yuno-error-primary/20 text-yuno-error-light px-4 py-3 rounded-lg',
      className
    )}>
      <p className="text-sm">{message}</p>
    </div>
  )
}

export const SuccessMessage = ({ message, className }) => {
  if (!message) return null

  return (
    <div className={cn(
      'bg-emerald-500/10 border border-yuno-success-primary/20 text-yuno-success-light px-4 py-3 rounded-lg',
      className
    )}>
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default ErrorMessage