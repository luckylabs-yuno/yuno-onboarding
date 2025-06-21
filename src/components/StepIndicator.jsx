// src/components/StepIndicator.jsx
import React from 'react'
import { cn } from '../lib/utils'
import { useOnboarding } from '../contexts/OnboardingContext'
import { Check, Mail, Shield, Globe, Upload, Code } from 'lucide-react'

const StepIndicator = ({ className }) => {
  const { state, actions, isStepCompleted } = useOnboarding() // ✅ Fixed: get isStepCompleted from context
  const { currentStep } = state

  const steps = [
    {
      number: 1,
      title: 'Email',
      description: 'Enter your email',
      icon: Mail
    },
    {
      number: 2,
      title: 'Verify',
      description: 'Confirm your email',
      icon: Shield
    },
    {
      number: 3,
      title: 'Profile',
      description: 'Create your profile',
      icon: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      number: 4,
      title: 'Website',
      description: 'Add your domain',
      icon: Globe
    },
    {
      number: 5,
      title: 'Content',
      description: 'Upload content',
      icon: Upload
    },
    {
      number: 6,
      title: 'Widget',
      description: 'Install widget',
      icon: Code
    }
  ]

  const getStepStatus = (stepNumber) => {
    if (isStepCompleted(stepNumber)) return 'completed' // ✅ Fixed: call from context
    if (stepNumber === currentStep) return 'active'
    if (stepNumber < currentStep) return 'completed'
    return 'inactive'
  }

  const handleStepClick = (stepNumber) => {
    // Allow navigation to completed steps or current step
    if (stepNumber <= currentStep || isStepCompleted(stepNumber)) { // ✅ Fixed: call from context
      actions.goToStep(stepNumber)
    }
  }

  // Debug logging
  console.log('🔍 StepIndicator Debug:', {
    currentStep,
    availableFunctions: {
      'actions.goToStep': typeof actions.goToStep,
      'isStepCompleted': typeof isStepCompleted,
      'state': typeof state
    }
  })

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Step Indicator */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIdx) => {
              const status = getStepStatus(step.number)
              const Icon = step.icon
              const isClickable = step.number <= currentStep || isStepCompleted(step.number)

              return (
                <li key={step.number} className="relative flex-1">
                  {/* Connecting Line */}
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2">
                      <div 
                        className={cn(
                          'h-full transition-all duration-500',
                          status === 'completed' || (stepIdx < currentStep - 1)
                            ? 'bg-yuno-gradient-main' 
                            : 'bg-gray-600/30'
                        )}
                      />
                    </div>
                  )}

                  {/* Step Button */}
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={!isClickable}
                    className={cn(
                      'relative flex flex-col items-center group focus-yuno',
                      isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                    )}
                  >
                    {/* Step Circle */}
                    <div 
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 mb-2',
                        status === 'completed' && 'yuno-step-completed border-yuno-success-primary',
                        status === 'active' && 'yuno-step-active border-transparent',
                        status === 'inactive' && 'yuno-step-inactive',
                        isClickable && 'group-hover:scale-110 group-hover:shadow-lg'
                      )}
                    >
                      {status === 'completed' ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Step Text */}
                    <div className="text-center">
                      <p className={cn(
                        'text-sm font-medium transition-colors',
                        status === 'active' && 'text-white',
                        status === 'completed' && 'text-yuno-success-light',
                        status === 'inactive' && 'text-gray-400'
                      )}>
                        {step.title}
                      </p>
                      <p className="text-xs text-yuno-text-muted mt-1">
                        {step.description}
                      </p>
                    </div>

                    {/* Active Step Glow */}
                    {status === 'active' && (
                      <div className="absolute inset-0 rounded-full bg-yuno-gradient-main opacity-20 blur-xl -z-10" />
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full',
              getStepStatus(currentStep) === 'active' && 'yuno-step-active',
              getStepStatus(currentStep) === 'completed' && 'yuno-step-completed'
            )}>
              {getStepStatus(currentStep) === 'completed' ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className="text-sm font-medium">{currentStep}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Step {currentStep} of {steps.length}
              </p>
              <p className="text-xs text-yuno-text-muted">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-yuno-text-muted">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-yuno-gradient-main h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Mobile Step Navigation */}
        <div className="flex items-center justify-center space-x-1 mb-4">
          {steps.map((step) => {
            const status = getStepStatus(step.number)
            const isClickable = step.number <= currentStep || isStepCompleted(step.number)
            
            return (
              <button
                key={step.number}
                onClick={() => handleStepClick(step.number)}
                disabled={!isClickable}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  status === 'completed' && 'bg-yuno-success-primary',
                  status === 'active' && 'bg-white w-6',
                  status === 'inactive' && 'bg-gray-600'
                )}
                aria-label={`Go to step ${step.number}: ${step.title}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StepIndicator