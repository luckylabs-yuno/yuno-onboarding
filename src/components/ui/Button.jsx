// src/components/ui/Button.jsx
import React from 'react'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  loading = false,
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-yuno disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'yuno-btn-primary',
    secondary: 'yuno-btn-secondary',
    ghost: 'text-yuno-text-secondary hover:text-white hover:bg-white/10 border border-transparent',
    outline: 'border border-yuno-glass-border bg-transparent hover:bg-white/10 text-white'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    default: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <div className="yuno-spinner w-4 h-4 mr-2" />
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

// src/components/ui/Input.jsx
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

// src/components/ui/Card.jsx
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

// src/components/ui/LoadingSpinner.jsx
export const LoadingSpinner = ({ size = 'default', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={cn('yuno-spinner', sizes[size], className)} />
  )
}

// src/components/ui/ErrorMessage.jsx
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

// src/components/ui/SuccessMessage.jsx
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

// src/components/ui/Select.jsx
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

// src/components/ui/FileUpload.jsx
export const FileUpload = ({ 
  onFilesChange, 
  acceptedTypes = '.pdf,.doc,.docx,.txt',
  maxFiles = 10,
  maxSize = 25 * 1024 * 1024, // 25MB
  className 
}) => {
  const [dragActive, setDragActive] = React.useState(false)
  const [files, setFiles] = React.useState([])
  const fileInputRef = React.useRef(null)

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).slice(0, maxFiles)
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
        return false
      }
      return true
    })
    
    setFiles(validFiles)
    onFilesChange(validFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer',
          dragActive 
            ? 'border-yuno-blue-primary bg-yuno-blue-primary/10' 
            : 'border-gray-600/30 hover:border-yuno-blue-primary/50'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-yuno-gradient-main rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-white">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-yuno-text-muted mt-1">
              Supports PDF, DOC, DOCX, TXT files up to {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-yuno-text-secondary">
            Uploaded Files ({files.length})
          </h4>
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-yuno-bg-secondary/50 rounded-lg border border-gray-600/30"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yuno-blue-primary/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yuno-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-yuno-text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="text-yuno-error-primary hover:text-yuno-error-light transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Button