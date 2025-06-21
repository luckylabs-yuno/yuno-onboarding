// src/components/steps/Step2OTPVerification.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema } from '../../lib/validation'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { Card } from '../ui/Card'
import Button from '../ui/Button'
import { ErrorMessage, SuccessMessage } from '../ui/ErrorMessage'
import { Shield, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react'
import { apiService, TokenManager } from '../../lib/api'

const OTPInput = ({ value, onChange, disabled }) => {
  const inputRefs = useRef([])
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  // Initialize OTP from value prop
  useEffect(() => {
    if (value && value.length <= 6) {
      const otpArray = value.split('')
      const paddedOtp = [...otpArray, ...Array(6 - otpArray.length).fill('')]
      setOtp(paddedOtp)
    }
  }, [value])

  // Update parent component when OTP changes
  useEffect(() => {
    const otpString = otp.join('')
    if (onChange) {
      onChange(otpString)
    }
  }, [otp, onChange])

  const handleChange = (index, digit) => {
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return

    const newOtp = [...otp]
    newOtp[index] = digit

    setOtp(newOtp)

    // Auto-focus next input if digit was entered
    if (digit && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus()
      }, 10)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newOtp = [...otp]
      
      if (otp[index]) {
        // Clear current field
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        // Move to previous field and clear it
        newOtp[index - 1] = ''
        setOtp(newOtp)
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus()
        }, 10)
      }
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }

    // Handle direct digit input
    if (/^\d$/.test(e.key)) {
      e.preventDefault()
      handleChange(index, e.key)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length > 0) {
      const pastedArray = pastedData.split('')
      const newOtp = [...pastedArray, ...Array(6 - pastedArray.length).fill('')]
      setOtp(newOtp)
      
      // Focus the next empty field or the last field
      const nextIndex = Math.min(pastedData.length, 5)
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus()
      }, 10)
    }
  }

  const handleClick = (index) => {
    // Focus the clicked input
    inputRefs.current[index]?.focus()
  }

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={() => {}} // Handled by onKeyDown to prevent double input
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onClick={() => handleClick(index)}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-semibold yuno-input focus:scale-110 transition-transform"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  )
}

const Step2OTPVerification = () => {
  const { state, actions } = useOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [otpValue, setOtpValue] = useState('')
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  const {
    handleSubmit,
    formState: { isValid },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
    defaultValues: {
      otp: ''
    }
  })

  // Start countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Set initial countdown when component mounts
  useEffect(() => {
    setCountdown(60) // 60 seconds
  }, [])

  // Update form value when OTP changes
  useEffect(() => {
    setValue('otp', otpValue)
  }, [otpValue, setValue])

  const onSubmit = async () => {
    if (otpValue.length !== 6) {
      console.log('❌ OTP length invalid:', otpValue.length)
      return
    }

    console.log('🚀 Submitting OTP:', otpValue)
    setIsSubmitting(true)
    actions.clearError()

    try {
      console.log('📧 Verifying OTP for:', state.email)
      
      // Call backend API directly
      const result = await apiService.verifyOTP(state.email, otpValue)
      
      if (result.success) {
        console.log('✅ OTP verified successfully')
        
        // Store temp token for next step
        TokenManager.setTempToken(result.data.temp_token)
        
        // Update onboarding state
        actions.setEmailVerified(true)
        
        setVerificationSuccess(true)
        
        // Show success message briefly before proceeding
        setTimeout(() => {
          console.log('⏭️ Moving to next step...')
          actions.setCurrentStep(3)
        }, 1500)
      } else {
        console.error('❌ OTP verification failed:', result.message)
        actions.setError(result.message || 'Invalid verification code')
      }
      
    } catch (error) {
      console.error('❌ Failed to verify OTP:', error)
      actions.setError(error.message || 'Verification failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    console.log('🔄 Resending OTP to:', state.email)
    setIsResending(true)
    actions.clearError()

    try {
      // Call backend API directly
      const result = await apiService.sendOTP(state.email)
      
      if (result.success) {
        setCountdown(60) // Reset countdown
        setOtpValue('') // Clear current OTP
        console.log('✅ OTP resent successfully')
      } else {
        console.error('❌ Failed to resend OTP:', result.message)
        actions.setError(result.message || 'Failed to resend code')
      }
    } catch (error) {
      console.error('❌ Failed to resend OTP:', error)
      actions.setError(error.message || 'Failed to resend code')
    } finally {
      setIsResending(false)
    }
  }

  const handleBackToEmail = () => {
    actions.setCurrentStep(1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 yuno-particles">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yuno-gradient-main rounded-full flex items-center justify-center shadow-yuno-primary yuno-float">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Check Your Email
            </h1>
            <p className="text-yuno-text-secondary text-lg">
              We sent a 6-digit code to
            </p>
            <p className="text-yuno-blue-light font-medium">
              {state.email}
            </p>
            <p className="text-yuno-text-muted text-sm">
              Enter the code below to verify your email address
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="space-y-6">
          {verificationSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yuno-success-primary rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <SuccessMessage message="Email verified successfully! Redirecting..." />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-yuno-text-secondary text-center">
                  Enter 6-digit verification code
                </label>
                
                <OTPInput
                  value={otpValue}
                  onChange={setOtpValue}
                  disabled={isSubmitting || verificationSuccess}
                />
              </div>

              {state.error && (
                <ErrorMessage message={state.error} />
              )}

              <Button
                type="submit"
                className="w-full text-lg py-4"
                loading={isSubmitting}
                disabled={otpValue.length !== 6 || isSubmitting || verificationSuccess}
              >
                {isSubmitting ? (
                  'Verifying...'
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Resend Section */}
          {!verificationSuccess && (
            <div className="pt-4 border-t border-gray-600/30 text-center space-y-3">
              <p className="text-sm text-yuno-text-muted">
                Didn't receive the code?
              </p>
              
              {countdown > 0 ? (
                <p className="text-sm text-yuno-text-secondary">
                  Resend code in {countdown} seconds
                </p>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  loading={isResending}
                  disabled={isResending}
                  className="text-yuno-blue-light hover:text-yuno-blue-primary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Code
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Back Button */}
        {!verificationSuccess && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleBackToEmail}
              className="text-yuno-text-muted hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Email
            </Button>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center text-sm text-yuno-text-muted space-y-2">
          <p>
            Check your spam folder if you don't see the email
          </p>
          <p>
            The code expires in 10 minutes
          </p>
        </div>
      </div>
    </div>
  )
}

export default Step2OTPVerification