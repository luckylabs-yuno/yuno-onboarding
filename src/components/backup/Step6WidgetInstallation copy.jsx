// src/components/steps/Step6WidgetInstallation.jsx
import React, { useState, useEffect } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { Code, ArrowRight, Copy, CheckCircle, AlertCircle, ExternalLink, Monitor, Smartphone, Clock, Globe, Mail } from 'lucide-react'

// Inline VerifyLater component to avoid import issues
const Step6VerifyLater = () => {
  const { state } = useOnboarding()

  const handleGoToDashboard = () => {
    window.open('https://dashboard.helloyuno.com', '_blank')
  }

  const handleBackToLanding = () => {
    window.open('https://helloyuno.com', '_blank')
  }

  const scriptTag = state.widgetData.scriptTag || 
    `<script src="https://cdn.helloyuno.com/widget.js" site_id="${state.siteData.siteId || 'your_site_id'}" defer></script>`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag)
      alert('Script copied to clipboard!')
    } catch (error) {
      const textArea = document.createElement('textarea')
      textArea.value = scriptTag
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Script copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Setup Almost Complete!
            </h1>
            <p className="text-gray-300 text-lg">
              Your Yuno chatbot is ready - just install the widget when you're ready
            </p>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Don't worry, you can complete the widget installation anytime. Your chatbot settings are saved!
            </p>
          </div>
        </div>

        {/* Current Progress */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            What's Completed
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Email Verified</p>
                <p className="text-sm text-gray-400">{state.email || 'Your email'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Website Connected</p>
                <p className="text-sm text-gray-400">{state.siteData.domain || 'Your website'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Content Processed</p>
                <p className="text-sm text-gray-400">Ready to chat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Widget Script */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6">
          <h4 className="text-lg font-medium text-white flex items-center mb-4">
            <Code className="w-5 h-5 mr-2 text-blue-400" />
            Your Widget Script (Save this!)
          </h4>
          
          <div className="relative">
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code className="text-green-400">
                {scriptTag}
              </code>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-400" />
            How to Complete Setup Later
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                <span className="text-blue-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-white">Access Your Dashboard</p>
                <p className="text-gray-400 text-sm mt-1">
                  Visit dashboard.helloyuno.com and login with {state.email || 'your email'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                <span className="text-blue-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-white">Install Widget</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add the widget script to your website's HTML head section
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoToDashboard}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Go to Dashboard
          </button>
          
          <button
            onClick={handleBackToLanding}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            Back to Home Page
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Important Note */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center mt-1">
              <span className="text-yellow-400 text-sm">⚠️</span>
            </div>
            <div>
              <p className="font-medium text-yellow-400">Important Note</p>
              <p className="text-gray-300 text-sm mt-1">
                Your chatbot is ready, but won't be visible until you install the widget script on your website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Step6WidgetInstallation = () => {
  const { state, actions } = useOnboarding()
  const [copied, setCopied] = useState(false)
  const [verificationUrl, setVerificationUrl] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [scriptGenerated, setScriptGenerated] = useState(false)
  const [showVerifyLater, setShowVerifyLater] = useState(false)

// src/components/steps/Step6WidgetInstallation.jsx


const Step6WidgetInstallation = () => {
  const { state, actions } = useOnboarding()
  const [copied, setCopied] = useState(false)
  const [verificationUrl, setVerificationUrl] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [scriptGenerated, setScriptGenerated] = useState(false)
  const [showVerifyLater, setShowVerifyLater] = useState(false)

  // Generate widget script on component mount
  useEffect(() => {
    if (!scriptGenerated && state.siteData.siteId) {
      generateWidgetScript()
    }
  }, [state.siteData.siteId, scriptGenerated])

  const generateWidgetScript = async () => {
    try {
      console.log('🔧 Generating widget script...')
      await actions.generateWidget()
      setScriptGenerated(true)
    } catch (error) {
      console.error('❌ Failed to generate widget:', error)
    }
  }

  // Mock script tag if not generated yet
  const scriptTag = state.widgetData.scriptTag || 
    `<script src="https://cdn.helloyuno.com/widget.js" site_id="${state.siteData.siteId || 'your_site_id'}" defer></script>`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
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

  const handleVerifyWidget = async () => {
    if (!verificationUrl.trim()) {
      actions.setError('Please enter a URL to verify the widget installation')
      return
    }

    setIsVerifying(true)
    actions.clearError()

    try {
      console.log('🔍 Verifying widget installation...')
      const result = await actions.verifyWidget(verificationUrl)
      
      if (result.verified) {
        console.log('✅ Widget verified successfully!')
        // Auto-proceed to next step after 2 seconds
        setTimeout(() => {
          actions.nextStep()
        }, 2000)
      } else {
        actions.setError('Widget not detected on the specified page. Please ensure the script is properly installed.')
      }
    } catch (error) {
      console.error('❌ Widget verification failed:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyLater = () => {
    console.log('🕐 User chose to verify later')
    setShowVerifyLater(true)
  }

  // Render Verify Later page if selected
  if (showVerifyLater) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
        <div className="w-full max-w-4xl space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">
                Setup Almost Complete!
              </h1>
              <p className="text-gray-300 text-lg">
                Your Yuno chatbot is ready - just install the widget when you're ready
              </p>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Don't worry, you can complete the widget installation anytime. Your chatbot settings are saved!
              </p>
            </div>
          </div>

          {/* Current Progress */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              What's Completed
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Email Verified</p>
                  <p className="text-sm text-gray-400">{state.email || 'Your email'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Website Connected</p>
                  <p className="text-sm text-gray-400">{state.siteData.domain || 'Your website'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Content Processed</p>
                  <p className="text-sm text-gray-400">Ready to chat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget Script */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6">
            <h4 className="text-lg font-medium text-white flex items-center mb-4">
              <Code className="w-5 h-5 mr-2 text-blue-400" />
              Your Widget Script (Save this!)
            </h4>
            
            <div className="relative">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-green-400">
                  {scriptTag}
                </code>
              </div>
              
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {copied && (
              <div className="flex items-center space-x-2 text-green-400 text-sm mt-2">
                <CheckCircle className="w-4 h-4" />
                <span>Script copied to clipboard!</span>
              </div>
            )}
          </div>

          {/* How to Return */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-400" />
              How to Complete Setup Later
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-400 font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-white">Access Your Dashboard</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Visit dashboard.helloyuno.com and login with {state.email || 'your email'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-400 font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-white">Install Widget</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add the widget script to your website's HTML head section
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-400 font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-white">Start Fresh (Alternative)</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Return to helloyuno.com and click "Start Free Trial" - you'll skip to the widget step
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('https://dashboard.helloyuno.com', '_blank')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Go to Dashboard
            </button>
            
            <button
              onClick={() => window.open('https://helloyuno.com', '_blank')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              Back to Home Page
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center mt-1">
                <span className="text-yellow-400 text-sm">⚠️</span>
              </div>
              <div>
                <p className="font-medium text-yellow-400">Important Note</p>
                <p className="text-gray-300 text-sm mt-1">
                  Your chatbot is ready, but won't be visible until you install the widget script on your website.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Widget Setup Option */}
          <div className="text-center">
            <button
              onClick={() => setShowVerifyLater(false)}
              className="text-yuno-text-muted hover:text-white underline text-sm transition-colors"
            >
              ← Back to widget installation
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Regular widget installation page
  const installationSteps = [
    {
      step: 1,
      title: 'Copy the script tag',
      description: 'Copy the widget script provided below',
      icon: Copy
    },
    {
      step: 2,
      title: 'Add to your website',
      description: 'Paste the script in the <head> section of your HTML',
      icon: Code
    },
    {
      step: 3,
      title: 'Verify installation',
      description: 'Test that the widget loads correctly on your site',
      icon: CheckCircle
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Install Your Widget
            </h1>
            <p className="text-gray-300 text-lg">
              Add Yuno to your website with a simple script tag
            </p>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Your chatbot is ready! Just add this script to make it live on your website
            </p>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {installationSteps.map((item, index) => {
            const Icon = item.icon
            const isActive = index === 0 || (index === 1 && copied) || (index === 2 && state.widgetData.isVerified)
            const isCompleted = (index === 0 && copied) || (index === 1 && state.widgetData.isVerified) || (index === 2 && state.widgetData.isVerified)
            
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
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-400" />
              Your Widget Script
            </h3>
            
            <div className="relative">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-green-400">
                  {scriptTag}
                </code>
              </div>
              
              <button
                onClick={copyToClipboard}
                className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {copied && (
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Script copied to clipboard!</span>
              </div>
            )}
          </div>

          {/* Installation Instructions */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Installation Instructions</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Desktop Instructions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-400">
                  <Monitor className="w-4 h-4" />
                  <span className="font-medium">For Website/HTML</span>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-300">1. Open your website's HTML file</p>
                  <p className="text-sm text-gray-300">2. Find the <code className="bg-gray-800 px-1 rounded">&lt;head&gt;</code> section</p>
                  <p className="text-sm text-gray-300">3. Paste the script before the closing <code className="bg-gray-800 px-1 rounded">&lt;/head&gt;</code> tag</p>
                  <p className="text-sm text-gray-300">4. Save and upload your changes</p>
                </div>
              </div>

              {/* Platform Instructions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-medium">For Platforms</span>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-300"><strong>WordPress:</strong> Use a "Custom HTML" block or theme editor</p>
                  <p className="text-sm text-gray-300"><strong>Shopify:</strong> Add to theme.liquid in the &lt;head&gt; section</p>
                  <p className="text-sm text-gray-300"><strong>Squarespace:</strong> Use the Code Injection feature</p>
                  <p className="text-sm text-gray-300"><strong>Wix:</strong> Add via the HTML embed widget</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget Verification */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Verify Installation
            </h3>
            
            <p className="text-gray-300">
              Enter a URL where you've installed the widget to verify it's working correctly.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Page URL to verify
                </label>
                <input
                  type="url"
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  placeholder={`${state.siteData.domain || 'https://your-website.com'}/page-with-widget`}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {state.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{state.error}</p>
                </div>
              )}

              {state.widgetData.isVerified && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium">Widget verified successfully!</p>
                    <p className="text-green-300 text-sm mt-1">
                      Your Yuno chatbot is now live on your website. Proceeding to completion...
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleVerifyWidget}
                  disabled={!verificationUrl.trim() || isVerifying || state.widgetData.isVerified}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isVerifying ? (
                    <>
                      <div className="yuno-spinner w-5 h-5 mr-2" />
                      Verifying widget...
                    </>
                  ) : state.widgetData.isVerified ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verified! Proceeding...
                    </>
                  ) : (
                    <>
                      Verify Widget Installation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleVerifyLater}
                  disabled={isVerifying || state.widgetData.isVerified}
                  className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  I'll verify later
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="pt-4 border-t border-gray-600/30">
            <div className="flex items-start space-x-3 text-sm text-gray-400">
              <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                <ExternalLink className="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-300">Need help with installation?</p>
                <p>Check our detailed installation guides or contact support if you encounter any issues.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



  // Generate widget script on component mount
  useEffect(() => {
    if (!scriptGenerated && state.siteData.siteId) {
      generateWidgetScript()
    }
  }, [state.siteData.siteId, scriptGenerated])

  const generateWidgetScript = async () => {
    try {
      console.log('🔧 Generating widget script...')
      await actions.generateWidget()
      setScriptGenerated(true)
    } catch (error) {
      console.error('❌ Failed to generate widget:', error)
    }
  }

  // Mock script tag if not generated yet
  const scriptTag = state.widgetData.scriptTag || 
    `<script src="https://cdn.helloyuno.com/widget.js" site_id="${state.siteData.siteId}" defer></script>`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
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

  const handleVerifyWidget = async () => {
    if (!verificationUrl.trim()) {
      actions.setError('Please enter a URL to verify the widget installation')
      return
    }

    setIsVerifying(true)
    actions.clearError()

    try {
      console.log('🔍 Verifying widget installation...')
      const result = await actions.verifyWidget(verificationUrl)
      
      if (result.verified) {
        console.log('✅ Widget verified successfully!')
        // Auto-proceed to next step after 2 seconds
        setTimeout(() => {
          actions.nextStep()
        }, 2000)
      } else {
        actions.setError('Widget not detected on the specified page. Please ensure the script is properly installed.')
      }
    } catch (error) {
      console.error('❌ Widget verification failed:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyLater = () => {
    setShowVerifyLater(true)
  }

  const installationSteps = [
    {
      step: 1,
      title: 'Copy the script tag',
      description: 'Copy the widget script provided below',
      icon: Copy
    },
    {
      step: 2,
      title: 'Add to your website',
      description: 'Paste the script in the <head> section of your HTML',
      icon: Code
    },
    {
      step: 3,
      title: 'Verify installation',
      description: 'Test that the widget loads correctly on your site',
      icon: CheckCircle
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Install Your Widget
            </h1>
            <p className="text-gray-300 text-lg">
              Add Yuno to your website with a simple script tag
            </p>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Your chatbot is ready! Just add this script to make it live on your website
            </p>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {installationSteps.map((item, index) => {
            const Icon = item.icon
            const isActive = index === 0 || (index === 1 && copied) || (index === 2 && state.widgetData.isVerified)
            const isCompleted = (index === 0 && copied) || (index === 1 && state.widgetData.isVerified) || (index === 2 && state.widgetData.isVerified)
            
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
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-400" />
              Your Widget Script
            </h3>
            
            <div className="relative">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-green-400">
                  {scriptTag}
                </code>
              </div>
              
              <button
                onClick={copyToClipboard}
                className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {copied && (
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Script copied to clipboard!</span>
              </div>
            )}
          </div>

          {/* Installation Instructions */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Installation Instructions</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Desktop Instructions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-400">
                  <Monitor className="w-4 h-4" />
                  <span className="font-medium">For Website/HTML</span>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-300">1. Open your website's HTML file</p>
                  <p className="text-sm text-gray-300">2. Find the <code className="bg-gray-800 px-1 rounded">&lt;head&gt;</code> section</p>
                  <p className="text-sm text-gray-300">3. Paste the script before the closing <code className="bg-gray-800 px-1 rounded">&lt;/head&gt;</code> tag</p>
                  <p className="text-sm text-gray-300">4. Save and upload your changes</p>
                </div>
              </div>

              {/* Platform Instructions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-medium">For Platforms</span>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-300"><strong>WordPress:</strong> Use a "Custom HTML" block or theme editor</p>
                  <p className="text-sm text-gray-300"><strong>Shopify:</strong> Add to theme.liquid in the &lt;head&gt; section</p>
                  <p className="text-sm text-gray-300"><strong>Squarespace:</strong> Use the Code Injection feature</p>
                  <p className="text-sm text-gray-300"><strong>Wix:</strong> Add via the HTML embed widget</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget Verification */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Verify Installation
            </h3>
            
            <p className="text-gray-300">
              Enter a URL where you've installed the widget to verify it's working correctly.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Page URL to verify
                </label>
                <input
                  type="url"
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  placeholder={`${state.siteData.domain || 'https://your-website.com'}/page-with-widget`}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {state.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{state.error}</p>
                </div>
              )}

              {state.widgetData.isVerified && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium">Widget verified successfully!</p>
                    <p className="text-green-300 text-sm mt-1">
                      Your Yuno chatbot is now live on your website. Proceeding to completion...
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleVerifyWidget}
                  disabled={!verificationUrl.trim() || isVerifying || state.widgetData.isVerified}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isVerifying ? (
                    <>
                      <div className="yuno-spinner w-5 h-5 mr-2" />
                      Verifying widget...
                    </>
                  ) : state.widgetData.isVerified ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verified! Proceeding...
                    </>
                  ) : (
                    <>
                      Verify Widget Installation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleVerifyLater}
                  disabled={isVerifying || state.widgetData.isVerified}
                  className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  I'll verify later
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="pt-4 border-t border-gray-600/30">
            <div className="flex items-start space-x-3 text-sm text-gray-400">
              <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                <ExternalLink className="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-300">Need help with installation?</p>
                <p>Check our detailed installation guides or contact support if you encounter any issues.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step6WidgetInstallation
