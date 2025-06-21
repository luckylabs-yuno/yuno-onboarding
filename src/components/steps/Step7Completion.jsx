// src/components/steps/Step7Completion.jsx
import React, { useEffect, useState } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { CheckCircle, ExternalLink, ArrowRight, Globe, MessageCircle, BarChart3, Settings, Sparkles } from 'lucide-react'

const Step7Completion = () => {
  const { state, actions } = useOnboarding()
  const [showConfetti, setShowConfetti] = useState(false)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Show confetti effect
    setShowConfetti(true)
    
    // Start countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          redirectToDashboard()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const redirectToDashboard = () => {
    window.location.href = 'https://dashboard.helloyuno.com'
  }

  const setupSummary = [
    {
      icon: Globe,
      title: 'Website Connected',
      value: state.siteData.domain || 'Your website',
      status: 'completed'
    },
    {
      icon: MessageCircle,
      title: 'Content Processed',
      value: `${(state.contentData.uploadedFiles?.length || 0) + (state.contentData.textContent ? 1 : 0)} sources`,
      status: 'completed'
    },
    {
      icon: CheckCircle,
      title: 'Widget Installed',
      value: state.widgetData.isVerified ? 'Verified' : 'Ready to install',
      status: state.widgetData.isVerified ? 'completed' : 'pending'
    }
  ]

  const nextSteps = [
    {
      icon: BarChart3,
      title: 'Monitor Performance',
      description: 'Track chat analytics, lead conversion, and user engagement',
      action: 'View Analytics'
    },
    {
      icon: Settings,
      title: 'Customize Settings',
      description: 'Adjust chatbot behavior, appearance, and response settings',
      action: 'Open Settings'
    },
    {
      icon: MessageCircle,
      title: 'Test Your Chatbot',
      description: 'Try out conversations and see how Yuno responds to visitors',
      action: 'Start Testing'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-4xl space-y-8 animate-fade-in relative z-10">
        {/* Success Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              🎉 Congratulations!
            </h1>
            <div className="space-y-2">
              <p className="text-xl md:text-2xl text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-semibold">
                Your Yuno AI Chatbot is Ready!
              </p>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                You've successfully set up your intelligent chatbot. Yuno is now ready to engage with your website visitors, answer questions, and capture leads 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Setup Summary */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            Setup Complete
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {setupSummary.map((item, index) => {
              const Icon = item.icon
              return (
                <div 
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-900/30 rounded-lg"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.value}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                </div>
              )
            })}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            What's Next?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div 
                  key={index}
                  className="bg-gray-900/30 rounded-lg p-6 hover:bg-gray-900/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-white">{step.title}</h4>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                  <div className="flex items-center text-blue-400 text-sm group-hover:text-blue-300 transition-colors">
                    <span>{step.action}</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dashboard CTA */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-8 text-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Access Your Dashboard
              </h3>
              <p className="text-gray-300">
                Manage your chatbot, view analytics, and optimize performance from your personalized dashboard.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={redirectToDashboard}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center mx-auto"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              
              <p className="text-sm text-gray-400">
                Auto-redirecting in {countdown} seconds...
                <button 
                  onClick={() => setCountdown(0)} 
                  className="text-blue-400 hover:text-blue-300 ml-2 underline"
                >
                  Skip wait
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div className="bg-gray-800/30 rounded-lg p-6">
            <h4 className="font-semibold text-white mb-2">Need Help?</h4>
            <p className="text-gray-400 text-sm mb-4">
              Check our documentation or contact support
            </p>
            <button className="text-blue-400 hover:text-blue-300 text-sm underline">
              Visit Help Center
            </button>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-6">
            <h4 className="font-semibold text-white mb-2">Share Feedback</h4>
            <p className="text-gray-400 text-sm mb-4">
              Help us improve Yuno with your thoughts
            </p>
            <button className="text-blue-400 hover:text-blue-300 text-sm underline">
              Send Feedback
            </button>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold text-white">🚀 Fun Fact</h4>
            <p className="text-gray-300">
              You're now part of the growing community of businesses using AI to enhance customer experience. 
              Your chatbot is ready to handle unlimited conversations and help convert visitors into customers!
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-gray-400">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">∞</div>
                <div className="text-gray-400">Conversations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">💼</div>
                <div className="text-gray-400">Lead Capture</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step7Completion