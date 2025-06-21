// src/lib/validation.js
import { z } from 'zod'

// Step 1: Email validation
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .transform(email => email.toLowerCase().trim())
})

// Step 2: OTP validation
export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers')
})

// Step 3: Password setup validation (UPDATED - removed profile fields)
export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Legacy profile schema (keep for backward compatibility if needed)
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .transform(name => name.trim()),
  
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(date => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 13 && age <= 120
    }, 'You must be between 13 and 120 years old'),
  
  country: z
    .string()
    .min(1, 'Please select your country'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Step 4: Domain validation - FIXED
export const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Website domain is required')
    .transform(domain => {
      // Clean and normalize the domain
      let cleanDomain = domain.trim().toLowerCase()
      
      // Remove protocol if present
      cleanDomain = cleanDomain.replace(/^https?:\/\//, '')
      
      // Remove trailing slash
      cleanDomain = cleanDomain.replace(/\/$/, '')
      
      // Add https protocol
      return `https://${cleanDomain}`
    })
    .refine(domain => {
      try {
        const url = new URL(domain)
        // Basic domain pattern check - more flexible
        const hostname = url.hostname
        return hostname.includes('.') && hostname.length > 3
      } catch {
        return false
      }
    }, 'Please enter a valid website domain (e.g., example.com or www.example.com)'),
  
  allConfirmations: z
    .boolean()
    .refine(val => val === true, 'You must accept all confirmations to proceed')
})

// Step 5: Content upload validation - UPDATED to make content optional, support email required
export const contentSchema = z.object({
  fallbackInfo: z.object({
    companyName: z.string().optional(),
    supportEmail: z
      .string()
      .min(1, 'Support email is required')
      .email('Please enter a valid email address'),
    supportPhone: z.string().optional(),
    address: z.string().optional(),
    supportPersonName: z.string().optional()
  }),
  textContent: z.string().optional(),
  files: z
    .array(z.instanceof(File))
    .optional()
    .refine(files => !files || files.length <= 10, 
      'You can upload a maximum of 10 files')
    .refine(files => !files || files.every(file => file.size <= 25 * 1024 * 1024), 
      'Each file must be smaller than 25MB')
    .refine(files => !files || files.every(file => 
      ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)
    ), 'Only PDF, DOC, DOCX, and TXT files are allowed')
})
// Removed the refine that required content or files - now both are optional

// Step 6: Widget verification
export const widgetSchema = z.object({
  pageUrl: z
    .string()
    .min(1, 'Page URL is required')
    .transform(url => {
      let cleanUrl = url.trim().toLowerCase()
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl
      }
      return cleanUrl
    })
    .refine(url => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }, 'Please enter a valid page URL')
})

// Utility validation functions
export const validateStep = (step, data) => {
  switch (step) {
    case 1:
      return emailSchema.safeParse(data)
    case 2:
      return otpSchema.safeParse(data)
    case 3:
      return passwordSchema.safeParse(data) // UPDATED - now uses passwordSchema
    case 4:
      return domainSchema.safeParse(data)
    case 5:
      return contentSchema.safeParse(data)
    case 6:
      return widgetSchema.safeParse(data)
    default:
      return { success: false, error: { issues: [{ message: 'Invalid step' }] } }
  }
}

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  domain: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
}

// Error message helpers
export const getFieldError = (errors, fieldName) => {
  return errors?.find(error => error.path.includes(fieldName))?.message
}

export const formatValidationErrors = (errors) => {
  if (!errors?.issues) return []
  
  return errors.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message
  }))
}