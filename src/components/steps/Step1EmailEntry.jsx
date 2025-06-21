// src/components/steps/Step1EmailEntry.jsx
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emailSchema } from '../../lib/validation'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import Button from '../ui/Button'
import { ErrorMessage } from '../ui/ErrorMessage'
import { Mail, ArrowRight } from 'lucide-react'
import { apiClient} from '../../lib/api'

const Step1EmailEntry = () => {
  const { state, actions } = useOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: {
      email: state.email || ''
    }
  })

  const watchedEmail = watch('email')

  // Update context when email changes
  useEffect(() => {
    if (watchedEmail && watchedEmail !== state.email) {
      actions.setEmail(watchedEmail)
    }
  }, [watchedEmail, actions, state.email])

  // Restore email value if it exists in state
  useEffect(() => {
    if (state.email) {
      setValue('email', state.email)
    }
  }, [state.email, setValue])

  const onSubmit = async (data) => {
    console.log('🚀 Form submitted with data:', data)
    setIsSubmitting(true)
    actions.clearError()

    try {
      // Call backend API directly instead of actions.sendOTP
      console.log('📧 Sending OTP to:', data.email)
      const result = await apiClient.sendOTP(data.email)
      
      if (result.success) {
        console.log('✅ OTP sent successfully')
        
        // Update onboarding state
        actions.setEmail(data.email)
        
        // Move to next step
        console.log('⏭️ Moving to next step...')
        actions.setCurrentStep(2)
        console.log('✅ Step advanced successfully')
      } else {
        // Handle API error
        actions.setError(result.message || 'Failed to send verification code')
        console.error('❌ API Error:', result.message)
      }
      
    } catch (error) {
      console.error('❌ Failed to send OTP:', error)
      actions.setError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Debug current state
  console.log('🔍 Step1 Debug:', {
    currentStep: state.currentStep,
    email: state.email,
    isValid,
    isSubmitting,
    loading: state.loading,
    error: state.error
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
      <div className="w-full max-w-lg space-y-12 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-yuno-gradient-main rounded-full flex items-center justify-center shadow-yuno-primary yuno-float">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Welcome to <span className="text-gradient-yuno">Yuno</span>
            </h1>
            <p className="text-yuno-text-secondary text-xl">
              Let's get started with your AI chatbot
            </p>
            <p className="text-yuno-text-muted text-base max-w-md mx-auto">
              Enter your email address to begin your free trial
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('email')}
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              required
              error={!!errors.email}
              description={errors.email?.message}
              className="text-lg py-4 h-14"
              autoComplete="email"
              autoFocus
            />

            {state.error && (
              <ErrorMessage message={state.error} />
            )}

            <Button
              type="submit"
              className="w-full text-lg py-4 h-14"
              loading={isSubmitting || state.loading}
              disabled={!isValid || isSubmitting || state.loading}
            >
              {isSubmitting || state.loading ? (
                'Sending verification code...'
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="pt-4 border-t border-gray-600/30 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-yuno-text-muted">
              <div className="w-5 h-5 bg-yuno-success-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-yuno-success-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>7-day free trial</span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-yuno-text-muted">
              <div className="w-5 h-5 bg-yuno-success-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-yuno-success-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>No credit card required</span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-yuno-text-muted">
              <div className="w-5 h-5 bg-yuno-success-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-yuno-success-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Setup in minutes</span>
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

export default Step1EmailEntry