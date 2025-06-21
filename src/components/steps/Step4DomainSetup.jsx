// src/components/steps/Step4DomainSetup.jsx
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import Button from '../ui/Button'
import { ErrorMessage } from '../ui/ErrorMessage'
import { Globe, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

// Updated domain validation schema - simplified and flexible (matching your existing)
const domainSchema = z.object({
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

const Step4DomainSetup = () => {
  const { state, actions } = useOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scrapingStatus, setScrapingStatus] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(domainSchema),
    mode: 'onChange',
    defaultValues: {
      domain: state.siteData.domain || '',
      allConfirmations: false
    }
  })

  const watchedDomain = watch('domain')

  // Update context when domain changes
  useEffect(() => {
    if (watchedDomain && watchedDomain !== state.siteData.domain) {
      actions.setSiteData({ domain: watchedDomain })
    }
  }, [watchedDomain, actions, state.siteData.domain])

  // Poll scraping status if we have a site ID
  useEffect(() => {
    let interval
    if (state.siteData.siteId && state.siteData.scrapingStatus === 'in_progress') {
      interval = setInterval(async () => {
        const status = await actions.getSiteStatus(state.siteData.siteId)
        if (status && status.scraping_status !== 'in_progress') {
          setScrapingStatus(status)
          clearInterval(interval)
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [state.siteData.siteId, state.siteData.scrapingStatus, actions])

  const onSubmit = async (data) => {
    console.log('🚀 Domain form submitted:', data)
    setIsSubmitting(true)
    actions.clearError()

    try {
      // Create site and start scraping (using your existing context method)
      console.log('🌐 Creating site for domain:', data.domain)
      const response = await actions.createSite(data.domain, {
        ownershipConfirmed: data.allConfirmations,
        scrapingConsent: data.allConfirmations,
        termsAccepted: data.allConfirmations
      })
      console.log('✅ Site created successfully:', response)

      // Show success and move to next step after a brief delay
      setTimeout(() => {
        actions.nextStep()
      }, 2000)
      
    } catch (error) {
      console.error('❌ Failed to create site:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Debug current state
  console.log('🔍 Step4 Debug:', {
    currentStep: state.currentStep,
    domain: state.siteData.domain,
    siteId: state.siteData.siteId,
    scrapingStatus: state.siteData.scrapingStatus,
    isValid,
    isSubmitting,
    loading: state.loading,
    error: state.error
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yuno-gradient-main rounded-full flex items-center justify-center shadow-yuno-primary yuno-float">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Add Your Website
            </h1>
            <p className="text-yuno-text-secondary text-lg">
              Let's connect your website to Yuno
            </p>
            <p className="text-yuno-text-muted text-sm max-w-md mx-auto">
              We'll analyze your website content to create a personalized chatbot
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="space-y-6">
          <div className="space-y-6">
            {/* Domain Input */}
            <div className="space-y-2">
              <Input
                {...register('domain')}
                type="text"
                label="Website Domain"
                placeholder="www.example.com or example.com"
                required
                error={!!errors.domain}
                description={errors.domain?.message}
                autoComplete="url"
                autoFocus
              />
              <p className="text-xs text-yuno-text-muted">
                📝 You can enter your domain with or without https:// (e.g., www.example.com, example.com, or https://example.com)
              </p>
            </div>

            {/* Single Confirmation Checkbox */}
            <div className="space-y-4">
              <div className="bg-yuno-bg-secondary/30 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    {...register('allConfirmations')}
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-yuno-blue-primary bg-yuno-bg-secondary border-gray-600 rounded focus:ring-yuno-blue-primary focus:ring-2"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-yuno-text-secondary">
                      I confirm the following:
                    </label>
                    <ul className="text-xs text-yuno-text-muted mt-2 space-y-1 ml-4">
                      <li>• I own this website or have authorization to add a chatbot</li>
                      <li>• I consent to website content analysis for chatbot training</li>
                      <li>• I accept the terms of service and privacy policy</li>
                    </ul>
                    {errors.allConfirmations && (
                      <p className="text-yuno-error-primary text-xs mt-2">{errors.allConfirmations.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {state.error && (
              <ErrorMessage message={state.error} />
            )}

            {/* Scraping Status */}
            {state.siteData.scrapingStatus === 'in_progress' && (
              <div className="bg-yuno-blue-primary/10 border border-yuno-blue-primary/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="yuno-spinner w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-yuno-blue-light">
                      Analyzing your website content...
                    </p>
                    <p className="text-xs text-yuno-text-muted">
                      Progress: {state.siteData.scrapingProgress || 0}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {scrapingStatus && scrapingStatus.scraping_status === 'completed' && (
              <div className="bg-yuno-success-primary/10 border border-yuno-success-primary/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-yuno-success-primary" />
                  <div>
                    <p className="text-sm font-medium text-yuno-success-light">
                      Website analysis completed!
                    </p>
                    <p className="text-xs text-yuno-text-muted">
                      {scrapingStatus.pages_scraped} pages processed successfully
                    </p>
                  </div>
                </div>
              </div>
            )}

            {scrapingStatus && scrapingStatus.scraping_status === 'failed' && (
              <div className="bg-yuno-warning-primary/10 border border-yuno-warning-primary/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yuno-warning-primary" />
                  <div>
                    <p className="text-sm font-medium text-yuno-warning-light">
                      Partial analysis completed
                    </p>
                    <p className="text-xs text-yuno-text-muted">
                      Some pages couldn't be accessed, but you can still proceed
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full text-lg py-4"
              loading={isSubmitting || state.loading}
              disabled={!isValid || isSubmitting || state.loading}
            >
              {isSubmitting || state.loading ? (
                state.siteData.scrapingStatus === 'in_progress' ? 
                  'Analyzing website...' : 
                  'Creating your site...'
              ) : (
                <>
                  Start Website Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Info Section */}
          <div className="pt-4 border-t border-gray-600/30">
            <div className="flex items-start space-x-3 text-sm text-yuno-text-muted">
              <div className="w-5 h-5 bg-yuno-blue-primary/20 rounded-full flex items-center justify-center mt-0.5">
                <Globe className="w-3 h-3 text-yuno-blue-primary" />
              </div>
              <div>
                <p className="font-medium text-yuno-text-secondary">What happens next?</p>
                <p>We'll scan your website content, create AI embeddings, and prepare your chatbot knowledge base.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Step4DomainSetup