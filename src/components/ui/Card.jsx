// src/components/ui/Card.jsx
import React from 'react'
import { cn } from '../../lib/utils'

export const Card = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn('yuno-card', className)} 
      {...props}
    >
      {children}
    </div>
  )
}

export default Card