// src/App.jsx
import React from 'react'
import { OnboardingProvider, useOnboarding } from './contexts/OnboardingContext'
import StepIndicator from './components/StepIndicator'
import Step1EmailEntry from './components/steps/Step1EmailEntry'
import Step2OTPVerification from './components/steps/Step2OTPVerification'
import Step3ProfileSetup from './components/steps/Step3ProfileSetup'
import Step4DomainSetup from './components/steps/Step4DomainSetup'
import Step5ContentIngestion from './components/steps/Step5ContentIngestion'
import Step6WidgetInstallation from './components/steps/Step6WidgetInstallation'
import Step7Completion from './components/steps/Step7Completion'
import DebugPanel from './components/DebugPanel'
import './index.css'

// Layout component with step indicator
const OnboardingLayout = ({ children, showStepIndicator = true }) => {
  return (
    <div className="min-h-screen bg-yuno-bg-primary">
      {showStepIndicator && (
        <div className="sticky top-0 z-50 bg-yuno-bg-primary/80 backdrop-blur-lg border-b border-gray-600/30">
          <div className="container mx-auto px-4 py-6">
            <StepIndicator />
          </div>
        </div>
      )}
      
      <main className={showStepIndicator ? 'pt-0' : ''}>
        {children}
      </main>
    </div>
  )
}

// Step renderer component - this is the key fix!
const StepRenderer = () => {
  const { state } = useOnboarding()
  const { currentStep } = state

  console.log('🎯 StepRenderer: Rendering step', currentStep)

  // Render the appropriate step based on currentStep state
  switch (currentStep) {
    case 1:
      return (
        <OnboardingLayout showStepIndicator={false}>
          <Step1EmailEntry />
        </OnboardingLayout>
      )
    
    case 2:
      return (
        <OnboardingLayout showStepIndicator={false}>
          <Step2OTPVerification />
        </OnboardingLayout>
      )
    
    case 3:
      return (
        <OnboardingLayout>
          <Step3ProfileSetup />
        </OnboardingLayout>
      )
    
    case 4:
      return (
        <OnboardingLayout>
          <Step4DomainSetup />
        </OnboardingLayout>
      )
    
    case 5:
      return (
        <OnboardingLayout>
          <Step5ContentIngestion />
        </OnboardingLayout>
      )
    
    case 6:
      return (
        <OnboardingLayout>
          <Step6WidgetInstallation />
        </OnboardingLayout>
      )
    
    case 7:
      return (
        <OnboardingLayout showStepIndicator={false}>
          <Step7Completion />
        </OnboardingLayout>
      )
    
    default:
      console.error('Unknown step:', currentStep)
      return (
        <OnboardingLayout showStepIndicator={false}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-white">Unknown Step</h1>
              <p className="text-yuno-text-secondary">Step {currentStep} not found</p>
              <button 
                onClick={() => window.location.reload()} 
                className="yuno-btn-primary"
              >
                Reload
              </button>
            </div>
          </div>
        </OnboardingLayout>
      )
  }
}

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-yuno-bg-primary flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-yuno-error-primary rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
              <p className="text-yuno-text-secondary">
                We're sorry, but something unexpected happened.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="yuno-btn-primary px-6 py-3"
              >
                Reload Page
              </button>
              
              <p className="text-sm text-yuno-text-muted">
                If the problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Main App component
const App = () => {
  return (
    <ErrorBoundary>
      <OnboardingProvider>
        <div className="App">
          <DebugPanel />
          <StepRenderer />
        </div>
      </OnboardingProvider>
    </ErrorBoundary>
  )
}

export default App