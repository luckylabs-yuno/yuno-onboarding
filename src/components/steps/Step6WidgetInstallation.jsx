// src/components/steps/Step6WidgetInstallation.jsx - Complete Backend Integration
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import Button from '../ui/Button'
import { ErrorMessage, SuccessMessage } from '../ui/ErrorMessage'
import { 
  Code, 
  ArrowRight, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  Loader,
  AlertTriangle,
  Globe,
  RefreshCw,
  Monitor,
  Smartphone
} from 'lucide-react'

const widgetSchema = z.object({
  pageUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal(''))
})

const Step6WidgetInstallation = () => {
  const { state, actions } = useOnboarding()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [scriptTag, setScriptTag] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('general')
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: zodResolver(widgetSchema),
    mode: 'onChange',
    defaultValues: {
      pageUrl: ''
    }
  })

  const watchedPageUrl = watch('pageUrl')

  // Generate widget script on component mount
  useEffect(() => {
    const generateScript = async () => {
      if (!state.siteData.siteId || scriptTag) return
      
      setIsGenerating(true)
      try {
        console.log('🎨 Generating widget script for site:', state.siteData.siteId)
        const result = await actions.generateWidget()
        
        if (result.scriptTag) {
          setScriptTag(result.scriptTag)
          console.log('✅ Widget script generated successfully')
        }
      } catch (error) {
        console.error('❌ Failed to generate widget script:', error)
        // Fallback script if generation fails
        setScriptTag(`<script src="https://cdn.helloyuno.com/yuno.js" site_id="${state.siteData.siteId}" defer></script>`)
      } finally {
        setIsGenerating(false)
      }
    }

    generateScript()
  }, [state.siteData.siteId, actions, scriptTag])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = scriptTag
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleVerifyWidget = async (data) => {
    setIsVerifying(true)
    actions.clearError()

    try {
      console.log('🔍 Verifying widget installation at:', data.pageUrl)
      
      const result = await actions.verifyWidget(data.pageUrl)
      
      if (result.verified) {
        console.log('✅ Widget verified successfully')
        setVerificationSuccess(true)

        // Complete onboarding and redirect
        setTimeout(async () => {
          try {
            await actions.completeOnboarding()
            actions.setCurrentStep(7)
          } catch (error) {
            console.error('Failed to complete onboarding:', error)
            // Still proceed to completion step
            actions.setCurrentStep(7)
          }
        }, 2000)
      } else {
        actions.setError('Widget not found on the specified page. Please make sure you\'ve added the script correctly.')
      }
    } catch (error) {
      console.error('❌ Widget verification failed:', error)
      actions.setError(error.message || 'Failed to verify widget installation')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSkipVerification = async () => {
    console.log('⏭️ Skipping widget verification')
    setVerificationSuccess(true)
    
    // Update state as verified (for demo purposes)
    actions.setWidgetData({
      isVerified: true,
      verificationUrl: 'skipped'
    })

    setTimeout(async () => {
      try {
        await actions.completeOnboarding()
        actions.setCurrentStep(7)
      } catch (error) {
        console.error('Failed to complete onboarding:', error)
        actions.setCurrentStep(7)
      }
    }, 1500)
  }

  const installationSteps = [
    {
      step: 1,
      title: "Copy Script",
      description: "Copy the widget script to your clipboard",
      icon: Copy,
      completed: copied
    },
    {
      step: 2, 
      title: "Add to Website",
      description: "Paste the script in your website's <head> section",
      icon: Code,
      completed: copied
    },
    {
      step: 3,
      title: "Verify Installation", 
      description: "Test that your widget is working correctly",
      icon: CheckCircle,
      completed: verificationSuccess
    }
  ]

  const platforms = [
    { id: 'general', name: 'General HTML', icon: Globe },
    { id: 'wordpress', name: 'WordPress', icon: Monitor },
    { id: 'shopify', name: 'Shopify', icon: Smartphone },
    { id: 'squarespace', name: 'Squarespace', icon: Monitor },
    { id: 'wix', name: 'Wix', icon: Globe }
  ]

  const getInstructions = (platform) => {
    const instructions = {
      general: [
        "Open your website's HTML file",
        "Find the <head> section", 
        "Paste the script before the closing </head> tag",
        "Save and upload your changes"
      ],
      wordpress: [
        "Go to Appearance → Theme Editor",
        "Open header.php file",
        "Find the <head> section",
        "Paste the script before </head>",
        "Click Update File"
      ],
      shopify: [
        "Go to Online Store → Themes",
        "Click Actions → Edit Code",
        "Open theme.liquid file",
        "Paste script in <head> section",
        "Save changes"
      ],
      squarespace: [
        "Go to Settings → Advanced → Code Injection",
        "Paste the script in Header section",
        "Click Save"
      ],
      wix: [
        "Go to Settings → Custom Code",
        "Click + Add Custom Code",
        "Paste script and set to load in <head>",
        "Apply to all pages and Save"
      ]
    }
    return instructions[platform] || instructions.general
  }

  // Debug current state
  console.log('🔍 Step6 Debug:', {
    currentStep: state.currentStep,
    siteId: state.siteData.siteId,
    scriptTag: scriptTag ? 'exists' : 'not generated',
    isValid,
    isVerifying,
    loading: state.loading,
    error: state.error
  })

  if (verificationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
        <div className="w-full max-w-2xl">
          <Card className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-400">
                🎉 Widget Installation Complete!
              </h2>
              <p className="text-yuno-text-secondary text-lg">
                Your Yuno chatbot is now live and ready to help your visitors
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-yuno-text-secondary">What's Next?</h3>
              
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-blue-400 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Access Your Dashboard</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Manage conversations, customize appearance, and view analytics
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-blue-400 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Test Your Chatbot</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Visit your website and start a conversation with Yuno
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                    <span className="text-blue-400 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Enjoy Your Free Trial</p>
                    <p className="text-gray-400 text-sm mt-1">
                      7 days of full access to all features
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => actions.setCurrentStep(7)}
              className="w-full text-lg py-4"
            >
              Complete Setup
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yuno-gradient-main rounded-full flex items-center justify-center shadow-yuno-primary yuno-float">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Install Your Widget
            </h1>
            <p className="text-yuno-text-secondary text-lg">
              Just add this script to make it live on your website
            </p>
            <p className="text-yuno-text-muted text-sm max-w-md mx-auto">
              Copy the code below and add it to your website's HTML
            </p>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {installationSteps.map((item, index) => {
            const Icon = item.icon
            const isActive = index === 0 || item.completed
            const isCompleted = item.completed
            
            return (
              <div 
                key={item.step}
                className={`bg-gray-800/50 backdrop-blur-lg border rounded-xl p-6 transition-all duration-300 ${
                  isCompleted 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : isActive 
                      ? 'border-blue-500/50 bg-blue-500/10' 
                      : 'border-gray-600/30'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isCompleted ? 'text-green-400' : isActive ? 'text-blue-400' : 'text-gray-300'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Script Tag Card */}
        <Card className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-400" />
              Your Widget Script
            </h3>
            
            {isGenerating ? (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-yuno-text-muted">Generating your widget script...</p>
              </div>
            ) : (
              <div className="relative">
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-green-400">
                    {scriptTag || `<script src="https://cdn.helloyuno.com/yuno.js" site_id="${state.siteData.siteId}" defer></script>`}
                  </code>
                </div>
                
                <button
                  onClick={copyToClipboard}
                  className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            )}

            {copied && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Script copied to clipboard!</span>
              </div>
            )}
          </div>

          {/* Platform Instructions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-yuno-text-secondary">
              Installation Instructions
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPlatform === platform.id
                      ? 'bg-yuno-blue-primary text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30">
              <ol className="space-y-2">
                {getInstructions(selectedPlatform).map((step, index) => (
                  <li key={index} className="text-sm text-yuno-text-muted flex items-start">
                    <span className="inline-block w-6 h-6 bg-yuno-blue-primary/20 text-yuno-blue-primary rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Card>

        {/* Verification Card */}
        <Card className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Verify Installation
            </h3>
            
            <p className="text-yuno-text-muted">
              Enter a URL where you've installed the widget to verify it's working correctly.
            </p>

            <form onSubmit={handleSubmit(handleVerifyWidget)} className="space-y-4">
              <Input
                {...register('pageUrl')}
                type="url"
                label="Page URL to verify (optional)"
                placeholder="https://www.yourwebsite.com/page-with-widget"
                error={!!errors.pageUrl}
                description={errors.pageUrl?.message}
                icon={Globe}
                disabled={isVerifying}
              />

              {state.error && (
                <ErrorMessage message={state.error} />
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  loading={isVerifying}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Verifying Widget...
                    </>
                  ) : (
                    <>
                      Verify Widget Installation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkipVerification}
                  disabled={isVerifying}
                >
                  Skip verification for now
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-400 mb-1">Need help with installation?</p>
                <p className="text-blue-300">
                  Check our detailed installation guides or contact support if you encounter any issues.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Step6WidgetInstallation