// src/lib/utils.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for merging Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date to YYYY-MM-DD for input fields
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Clean and normalize domain URL
export const normalizeDomain = (domain) => {
  let cleaned = domain.trim().toLowerCase()
  
  // Remove protocol if present
  cleaned = cleaned.replace(/^https?:\/\//, '')
  
  // Remove www if present
  cleaned = cleaned.replace(/^www\./, '')
  
  // Remove trailing slash
  cleaned = cleaned.replace(/\/$/, '')
  
  // Add https protocol back
  return `https://${cleaned}`
}

// Extract domain name from URL
export const extractDomainName = (url) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace(/^www\./, '')
  } catch {
    return url
  }
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Sleep function for delays
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch (err) {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

// Format error message
export const formatError = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error?.message) return error.error.message
  return 'An unexpected error occurred'
}

// Get country list for select dropdown
export const getCountries = () => [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AT', label: 'Austria' },
  { value: 'BE', label: 'Belgium' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'KE', label: 'Kenya' },
  { value: 'EG', label: 'Egypt' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'PE', label: 'Peru' },
  { value: 'TH', label: 'Thailand' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'PH', label: 'Philippines' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'KR', label: 'South Korea' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'IE', label: 'Ireland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'GR', label: 'Greece' },
  { value: 'TR', label: 'Turkey' },
  { value: 'RU', label: 'Russia' },
  { value: 'CN', label: 'China' },
  { value: 'OTHER', label: 'Other' }
]

// Validate password strength
export const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  const score = Object.values(checks).filter(Boolean).length
  
  return {
    score,
    checks,
    strength: score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong',
    isValid: checks.length && checks.uppercase && checks.lowercase && checks.number
  }
}

// Format time duration
export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

// Local storage helpers with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// Session storage helpers
export const sessionStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to sessionStorage:', error)
      return false
    }
  },
  
  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from sessionStorage:', error)
      return false
    }
  }
}

// URL helpers
export const url = {
  addParams: (baseUrl, params) => {
    const url = new URL(baseUrl)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, value)
      }
    })
    return url.toString()
  },
  
  removeParams: (baseUrl, paramsToRemove) => {
    const url = new URL(baseUrl)
    paramsToRemove.forEach(param => url.searchParams.delete(param))
    return url.toString()
  },
  
  getParam: (param) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  }
}

// Animation helpers
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  }
}

// Color helpers
export const colors = {
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },
  
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  },
  
  addAlpha: (hex, alpha) => {
    const rgb = colors.hexToRgb(hex)
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : hex
  }
}

// Form validation helpers
export const validation = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },
  
  phone: (phone) => {
    const regex = /^\+?[1-9]\d{1,14}$/
    return regex.test(phone.replace(/\s/g, ''))
  },
  
  url: (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
  
  domain: (domain) => {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
    return regex.test(domain)
  }
}

// Device detection
export const device = {
  isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isTablet: () => /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent),
  isDesktop: () => !device.isMobile() && !device.isTablet(),
  
  getOS: () => {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf("Win") !== -1) return "Windows"
    if (userAgent.indexOf("Mac") !== -1) return "macOS"
    if (userAgent.indexOf("Linux") !== -1) return "Linux"
    if (userAgent.indexOf("Android") !== -1) return "Android"
    if (userAgent.indexOf("like Mac") !== -1) return "iOS"
    return "Unknown"
  }
}

// Performance helpers
export const performance = {
  measure: (name, fn) => {
    const start = Date.now()
    const result = fn()
    const end = Date.now()
    console.log(`${name} took ${end - start}ms`)
    return result
  },
  
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

// Constants
export const CONSTANTS = {
  STEPS: {
    EMAIL: 1,
    OTP: 2,
    PROFILE: 3,
    DOMAIN: 4,
    CONTENT: 5,
    WIDGET: 6
  },
  
  STEP_NAMES: {
    1: 'Email',
    2: 'Verification',
    3: 'Profile',
    4: 'Website',
    5: 'Content',
    6: 'Widget'
  },
  
  FILE_TYPES: {
    PDF: 'application/pdf',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    TXT: 'text/plain'
  },
  
  MAX_FILE_SIZE: 25 * 1024 * 1024, // 25MB
  MAX_FILES: 10,
  
  OTP_LENGTH: 6,
  OTP_EXPIRY: 10 * 60 * 1000, // 10 minutes
  
  SCRAPING_STATUSES: {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress', 
    COMPLETED: 'completed',
    FAILED: 'failed'
  }
}