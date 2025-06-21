// src/components/steps/Step3ProfileSetup.jsx
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { validatePasswordStrength } from '../../lib/utils'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import Button from '../ui/Button'
import { ErrorMessage } from '../ui/ErrorMessage'
import { Lock, ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react'
import { apiService, TokenManager } from '../../lib/api'

// Simplified password-only schema (updated to match backend expectations)
const passwordSchema = z.object({
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

const PasswordStrengthIndicator = ({ password }) => {
  const strength = validatePasswordStrength(password)
  
  if (!password) return null

  const getStrengthColor = () => {
    switch (strength.strength) {
      case 'weak': return 'bg-yuno-error-primary'
      case 'medium': return 'bg-yuno-warning-primary'
      case 'strong': return 'bg-yuno-success-primary'
      default: return 'bg-gray-600'
    }
  }

  const getStrengthText = () => {
    switch (strength.strength) {
      case 'weak': return 'Weak'
      case 'medium': return 'Medium'
      case 'strong': return 'Strong'
      default: return ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-yuno-text-muted">Password strength</span>
        <span className={`text-xs font-medium ${
          strength.strength === 'weak' ? 'text-yuno-error-primary' :
          strength.strength === 'medium' ? 'text-yuno-warning-primary' :
          'text-yuno-success-primary'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.score ? getStrengthColor() : 'bg-gray-600/30'
            }`}
          />
        ))}
      </div>
      
      <div className="space-y-1">
        {Object.entries(strength.checks).map(([check, passed]) => (
          <div key={check} className="flex items-center space-x-2 text-xs">
            {passed ? (
              <Check className="w-3 h-3 text-yuno-success-primary" />
            ) : (
              <X className="w-3 h-3 text-gray-400" />
            )}
            <span className={passed ? 'text-yuno-success-light' : 'text-gray-400'}>
              {check === 'length' && '8+ characters'}
              {check === 'uppercase' && 'Uppercase letter'}
              {check === 'lowercase' && 'Lowercase letter'}
              {check === 'number' && 'Number'}
              {check === 'special' && 'Special character'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const Step3ProfileSetup = () => {
  const { state, actions } = useOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const watchedPassword = watch('password')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    actions.clearError()

    try {
      // Get temp token from previous step
      const tempToken = TokenManager.getTempToken()
      if (!tempToken) {
        actions.setError('Session expired. Please start over.')
        return
      }

      console.log('🔐 Creating account with password...')
      
      // Call backend API directly - only send password (name, DOB, country are optional now)
      const result = await apiService.completeProfile({ password: data.password }, tempToken)

      if (result.success) {
        console.log('✅ Account created successfully')
        
        // Store access token for remaining steps
        TokenManager.setAccessToken(result.data.access_token)
        TokenManager.clearTempToken() // Clear temp token
        
        // Store user info
        localStorage.setItem('yuno_user_id', result.data.user_id)
        
        // Update onboarding state
        actions.setPasswordSet(true)
        
        // Show success briefly before proceeding
        setTimeout(() => {
          console.log('⏭️ Moving to next step...')
          actions.setCurrentStep(4)
        }, 1000)
      } else {
        console.error('❌ Account creation failed:', result.message)
        actions.setError(result.message || 'Failed to create account')
      }
      
    } catch (error) {
      console.error('❌ Failed to set password:', error)
      actions.setError(error.message || 'Account creation failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Secure Your Account
            </h1>
            <p className="text-yuno-text-secondary text-lg">
              Create a strong password for your Yuno account
            </p>
            <p className="text-yuno-text-muted text-sm">
              You're almost ready! Just set up your password to continue.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Create a strong password"
                  required
                  error={!!errors.password}
                  description={errors.password?.message}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-yuno-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              <PasswordStrengthIndicator password={watchedPassword} />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                error={!!errors.confirmPassword}
                description={errors.confirmPassword?.message}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-yuno-text-muted hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {state.error && (
              <ErrorMessage message={state.error} />
            )}

            <Button
              type="submit"
              className="w-full text-lg py-4"
              loading={isSubmitting || state.loading}
              disabled={!isValid || isSubmitting || state.loading}
            >
              {isSubmitting || state.loading ? (
                'Setting up your account...'
              ) : (
                <>
                  Continue to Website Setup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Security Note */}
          <div className="pt-4 border-t border-gray-600/30">
            <div className="flex items-start space-x-3 text-sm text-yuno-text-muted">
              <div className="w-5 h-5 bg-yuno-blue-primary/20 rounded-full flex items-center justify-center mt-0.5">
                <Lock className="w-3 h-3 text-yuno-blue-primary" />
              </div>
              <div>
                <p className="font-medium text-yuno-text-secondary">Your password is secure</p>
                <p>We use industry-standard encryption to protect your account</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-yuno-text-muted">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-yuno-blue-light hover:text-yuno-blue-primary transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-yuno-blue-light hover:text-yuno-blue-primary transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Step3ProfileSetup