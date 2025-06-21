// src/components/DebugPanel.jsx
import React, { useState } from 'react'
import { useOnboarding } from '../contexts/OnboardingContext'
import { Eye, EyeOff, RotateCcw, SkipForward, SkipBack } from 'lucide-react'

const DebugPanel = () => {
  const { state, actions } = useOnboarding()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Only show in development
  if (import.meta.env.PROD) return null

  const handleStepJump = (step) => {
    actions.goToStep(step)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all onboarding data?')) {
      actions.resetState()
    }
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'null'
    if (typeof value === 'boolean') return value.toString()
    if (typeof value === 'object') return JSON.stringify(value, null, 1)
    return value.toString()
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-50"
        title="Show Debug Panel"
      >
        <Eye className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="yuno-debug-panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="font-semibold text-purple-400">Debug Panel</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Hide Debug Panel"
          >
            <EyeOff className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleStepJump(Math.max(1, state.currentStep - 1))}
            disabled={state.currentStep <= 1}
            className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <SkipBack className="w-3 h-3" />
          </button>
          
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">
            Step {state.currentStep}/7
          </span>
          
          <button
            onClick={() => handleStepJump(Math.min(7, state.currentStep + 1))}
            disabled={state.currentStep >= 7}
            className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Step"
          >
            <SkipForward className="w-3 h-3" />
          </button>
          
          <button
            onClick={handleReset}
            className="p-1 hover:bg-gray-700 rounded transition-colors text-red-400"
            title="Reset All Data"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Step Jumper */}
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map(step => (
            <button
              key={step}
              onClick={() => handleStepJump(step)}
              className={`w-6 h-6 text-xs rounded transition-colors ${
                step === state.currentStep
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
              title={`Go to Step ${step}`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {/* State Details */}
      {isExpanded && (
        <div className="space-y-3 border-t border-gray-600 pt-3">
          {/* Core State */}
          <div>
            <div className="text-xs font-semibold text-gray-400 mb-1">Core State</div>
            <div className="space-y-1 text-xs">
              <div>Email: <span className="text-blue-400">{state.email || 'None'}</span></div>
              <div>Verified: <span className={state.isEmailVerified ? 'text-green-400' : 'text-red-400'}>{state.isEmailVerified.toString()}</span></div>
              <div>Loading: <span className={state.loading ? 'text-yellow-400' : 'text-gray-400'}>{state.loading.toString()}</span></div>
              {state.error && (
                <div className="text-red-400 text-xs break-words">Error: {state.error}</div>
              )}
            </div>
          </div>

          {/* Profile Data */}
          {(state.userProfile.name || state.userProfile.country) && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-1">Profile</div>
              <div className="space-y-1 text-xs">
                {state.userProfile.name && (
                  <div>Name: <span className="text-blue-400">{state.userProfile.name}</span></div>
                )}
                {state.userProfile.country && (
                  <div>Country: <span className="text-blue-400">{state.userProfile.country}</span></div>
                )}
                {state.userProfile.dateOfBirth && (
                  <div>DOB: <span className="text-blue-400">{state.userProfile.dateOfBirth}</span></div>
                )}
              </div>
            </div>
          )}

          {/* Site Data */}
          {(state.siteData.siteId || state.siteData.domain) && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-1">Site Data</div>
              <div className="space-y-1 text-xs">
                {state.siteData.siteId && (
                  <div>Site ID: <span className="text-green-400">{state.siteData.siteId}</span></div>
                )}
                {state.siteData.domain && (
                  <div>Domain: <span className="text-blue-400">{state.siteData.domain}</span></div>
                )}
                <div>
                  Scraping: <span className={
                    state.siteData.scrapingStatus === 'completed' ? 'text-green-400' :
                    state.siteData.scrapingStatus === 'in_progress' ? 'text-yellow-400' :
                    state.siteData.scrapingStatus === 'failed' ? 'text-red-400' :
                    'text-gray-400'
                  }>
                    {state.siteData.scrapingStatus}
                  </span>
                </div>
                {state.siteData.scrapingProgress > 0 && (
                  <div>Progress: <span className="text-yellow-400">{state.siteData.scrapingProgress}%</span></div>
                )}
              </div>
            </div>
          )}

          {/* Content Data */}
          {(state.contentData.uploadedFiles.length > 0 || state.contentData.textContent) && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-1">Content</div>
              <div className="space-y-1 text-xs">
                {state.contentData.uploadedFiles.length > 0 && (
                  <div>Files: <span className="text-green-400">{state.contentData.uploadedFiles.length}</span></div>
                )}
                {state.contentData.textContent && (
                  <div>Text: <span className="text-green-400">{state.contentData.textContent.length} chars</span></div>
                )}
                {state.contentData.fallbackInfo?.supportEmail && (
                  <div>Support: <span className="text-blue-400">{state.contentData.fallbackInfo.supportEmail}</span></div>
                )}
              </div>
            </div>
          )}

          {/* Widget Data */}
          {(state.widgetData.scriptTag || state.widgetData.isVerified) && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-1">Widget</div>
              <div className="space-y-1 text-xs">
                <div>
                  Verified: <span className={state.widgetData.isVerified ? 'text-green-400' : 'text-red-400'}>
                    {state.widgetData.isVerified.toString()}
                  </span>
                </div>
                {state.widgetData.verificationUrl && (
                  <div>URL: <span className="text-blue-400 break-words">{state.widgetData.verificationUrl}</span></div>
                )}
                {state.widgetData.scriptTag && (
                  <div>Script: <span className="text-green-400">Generated</span></div>
                )}
              </div>
            </div>
          )}

          {/* Environment Info */}
          <div>
            <div className="text-xs font-semibold text-gray-400 mb-1">Environment</div>
            <div className="space-y-1 text-xs">
              <div>Mode: <span className="text-purple-400">
                {import.meta.env.VITE_MOCK_API === 'true' ? 'Mock' : 'Live'}
              </span></div>
              <div>API: <span className="text-purple-400">
                {import.meta.env.VITE_API_BASE_URL || 'Default'}
              </span></div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-600 pt-2 mt-3">
        <div className="text-xs text-gray-500">
          Dev Mode • {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default DebugPanel