// src/contexts/OnboardingContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import {apiClient} from '../lib/api.js'

const OnboardingContext = createContext()

// Check if we're in mock mode (same logic as your api.js)
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL

// Action types
const ACTIONS = {
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_EMAIL: 'SET_EMAIL',
  SET_EMAIL_VERIFIED: 'SET_EMAIL_VERIFIED',
  SET_TEMP_TOKEN: 'SET_TEMP_TOKEN',
  SET_PASSWORD_SET: 'SET_PASSWORD_SET', // NEW: Track if password is set
  SET_SITE_DATA: 'SET_SITE_DATA',
  SET_CONTENT_DATA: 'SET_CONTENT_DATA',
  SET_WIDGET_DATA: 'SET_WIDGET_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
  LOAD_SAVED_STATE: 'LOAD_SAVED_STATE'
}

// Updated initial state - removed userProfile
const initialState = {
  currentStep: 1,
  email: '',
  isEmailVerified: false,
  tempToken: null,
  isPasswordSet: false, // NEW: Track password setup
  siteData: {
    siteId: null,
    domain: '',
    scrapingStatus: 'pending',
    scrapingProgress: 0
  },
  contentData: {
    textContent: '',
    uploadedFiles: [],
    fallbackInfo: {
      companyName: '',
      supportEmail: '',
      supportPhone: '',
      address: '',
      supportPersonName: ''
    },
    processingStatus: 'pending'
  },
  widgetData: {
    isVerified: false,
    verificationUrl: '',
    scriptTag: ''
  },
  loading: false,
  error: null
}

// Reducer function
function onboardingReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_STEP:
      return { ...state, currentStep: action.payload }
    
    case ACTIONS.SET_EMAIL:
      return { ...state, email: action.payload }
    
    case ACTIONS.SET_EMAIL_VERIFIED:
      return { ...state, isEmailVerified: action.payload }
    
    case ACTIONS.SET_TEMP_TOKEN:
      return { ...state, tempToken: action.payload }
    
    case ACTIONS.SET_PASSWORD_SET:
      return { ...state, isPasswordSet: action.payload }
    
    case ACTIONS.SET_SITE_DATA:
      return { 
        ...state, 
        siteData: { ...state.siteData, ...action.payload }
      }
    
    case ACTIONS.SET_CONTENT_DATA:
      return { 
        ...state, 
        contentData: { ...state.contentData, ...action.payload }
      }
    
    case ACTIONS.SET_WIDGET_DATA:
      return { 
        ...state, 
        widgetData: { ...state.widgetData, ...action.payload }
      }
    
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    case ACTIONS.RESET_STATE:
      return { ...initialState }
    
    case ACTIONS.LOAD_SAVED_STATE:
      return { ...state, ...action.payload }
    
    default:
      return state
  }
}

// Context provider component
export const OnboardingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  // Load saved state from sessionStorage on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('yuno-onboarding-state')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: ACTIONS.LOAD_SAVED_STATE, payload: parsedState })
      } catch (error) {
        console.error('Failed to load saved onboarding state:', error)
      }
    }
  }, [])

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      currentStep: state.currentStep,
      email: state.email,
      isEmailVerified: state.isEmailVerified,
      isPasswordSet: state.isPasswordSet, // NEW: Save password status
      siteData: state.siteData,
      contentData: state.contentData,
      widgetData: state.widgetData
    }
    sessionStorage.setItem('yuno-onboarding-state', JSON.stringify(stateToSave))
  }, [state])

  // Action creators
  const actions = {
    setCurrentStep: (step) => {
      dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: step })
    },

    setEmail: (email) => {
      dispatch({ type: ACTIONS.SET_EMAIL, payload: email })
    },

    setEmailVerified: (verified) => {
      dispatch({ type: ACTIONS.SET_EMAIL_VERIFIED, payload: verified })
    },

    setTempToken: (token) => {
      dispatch({ type: ACTIONS.SET_TEMP_TOKEN, payload: token })
    },

    setPasswordSet: (isSet) => {
      dispatch({ type: ACTIONS.SET_PASSWORD_SET, payload: isSet })
    },

    setSiteData: (siteData) => {
      dispatch({ type: ACTIONS.SET_SITE_DATA, payload: siteData })
    },

    setContentData: (contentData) => {
      dispatch({ type: ACTIONS.SET_CONTENT_DATA, payload: contentData })
    },

    setWidgetData: (widgetData) => {
      dispatch({ type: ACTIONS.SET_WIDGET_DATA, payload: widgetData })
    },

    setLoading: (loading) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: loading })
    },

    setError: (error) => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error })
    },

    clearError: () => {
      dispatch({ type: ACTIONS.CLEAR_ERROR })
    },

    resetState: () => {
      dispatch({ type: ACTIONS.RESET_STATE })
      sessionStorage.removeItem('yuno-onboarding-state')
    },

    // Combined actions for complex operations
    nextStep: async () => {
      if (state.currentStep < 7) {
        const nextStep = state.currentStep + 1
        dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: nextStep })
        
        // Save progress to backend - BUT ONLY IF NOT IN MOCK MODE
        if (!IS_MOCK_MODE) {
          try {
            await apiClient.completeOnboardingStep(state.currentStep, {
              email: state.email,
              step: nextStep
            })
          } catch (error) {
            console.error('Failed to save step progress:', error)
            // Don't fail the step progression for this
          }
        } else {
          console.log('🎭 MOCK: Step progress saved locally only (mock mode)')
        }
      }
    },

    goToStep: (step) => {
      if (step >= 1 && step <= 7) {
        dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: step })
      }
    },

    // API integration actions
    sendOTP: async (email) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.sendOTP(email)
        dispatch({ type: ACTIONS.SET_EMAIL, payload: email })
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    verifyOTP: async (email, otp) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.verifyOTP(email, otp)
        dispatch({ type: ACTIONS.SET_EMAIL_VERIFIED, payload: true })
        dispatch({ type: ACTIONS.SET_TEMP_TOKEN, payload: response.session_token })
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    // UPDATED: Simplified to only handle password
    completeSignup: async (passwordData) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.completeSignup(passwordData, state.tempToken)
        dispatch({ type: ACTIONS.SET_PASSWORD_SET, payload: true })
        
        // Store Supabase token
        if (response.access_token) {
          localStorage.setItem('supabase_token', response.access_token)
        }
        
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    // Step 4: Create Site
    createSite: async (domain, confirmations) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.createSite(domain, confirmations)
        dispatch({ 
          type: ACTIONS.SET_SITE_DATA, 
          payload: { 
            siteId: response.site_id,
            domain: domain,
            scrapingStatus: 'in_progress',
            scrapingProgress: 0
          }
        })
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    // Get site status for polling
    getSiteStatus: async (siteId) => {
      try {
        const response = await apiClient.getSiteStatus(siteId)
        dispatch({ 
          type: ACTIONS.SET_SITE_DATA, 
          payload: { 
            scrapingStatus: response.scraping_status,
            scrapingProgress: response.scraping_progress || 0
          }
        })
        return response
      } catch (error) {
        console.error('Failed to get site status:', error)
        return null
      }
    },

    // Step 5: Upload Content
    uploadContent: async (contentData) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const uploads = []
        
        // Upload text content if provided
        if (contentData.textContent && contentData.textContent.trim()) {
          const textResponse = await apiClient.uploadText(state.siteData.siteId, contentData.textContent)
          uploads.push(textResponse)
        }
        
        // Upload files if provided
        if (contentData.files && contentData.files.length > 0) {
          for (const file of contentData.files) {
            const fileResponse = await apiClient.uploadFile(state.siteData.siteId, file)
            uploads.push(fileResponse)
          }
        }

        // Save fallback info
        if (contentData.fallbackInfo) {
          await apiClient.saveFallbackInfo(state.siteData.siteId, contentData.fallbackInfo)
        }
        
        dispatch({ 
          type: ACTIONS.SET_CONTENT_DATA, 
          payload: { 
            ...contentData,
            uploadedFiles: uploads,
            processingStatus: 'processing'
          }
        })
        
        return uploads
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    // Step 6: Generate Widget Script
    generateWidget: async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.generateWidget(state.siteData.siteId)
        dispatch({ 
          type: ACTIONS.SET_WIDGET_DATA, 
          payload: { 
            scriptTag: response.script_tag
          }
        })
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    // Step 6: Verify Widget Installation
    verifyWidget: async (pageUrl) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.verifyWidget(state.siteData.siteId, pageUrl)
        dispatch({ 
          type: ACTIONS.SET_WIDGET_DATA, 
          payload: { 
            isVerified: response.verified,
            verificationUrl: pageUrl
          }
        })
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    }
  }

  const value = {
    state,
    actions,
    // Computed properties
    canProceedToNextStep: () => {
      switch (state.currentStep) {
        case 1:
          return state.email && !state.loading
        case 2:
          return state.isEmailVerified && !state.loading
        case 3:
          return state.isPasswordSet && !state.loading // UPDATED: Check password instead of profile
        case 4:
          return state.siteData.siteId && !state.loading
        case 5:
          return state.contentData.fallbackInfo?.supportEmail && !state.loading // UPDATED: Only require support email
        case 6:
          return state.widgetData.isVerified && !state.loading
        default:
          return false
      }
    },
    
    getStepTitle: (step) => {
      const titles = {
        1: 'Enter Your Email',
        2: 'Verify Your Email',
        3: 'Set Your Password', // UPDATED: Changed from profile to password
        4: 'Add Your Website', 
        5: 'Add Contact Info',  // UPDATED: Changed focus to contact info
        6: 'Install Widget',
        7: 'Complete Setup'
      }
      return titles[step] || 'Unknown Step'
    },

    isStepCompleted: (step) => {
      switch (step) {
        case 1:
          return !!state.email
        case 2:
          return state.isEmailVerified
        case 3:
          return state.isPasswordSet // UPDATED: Check password instead of profile
        case 4:
          return !!state.siteData.siteId
        case 5:
          return !!state.contentData.fallbackInfo?.supportEmail // UPDATED: Only require support email
        case 6:
          return state.widgetData.isVerified
        default:
          return false
      }
    }
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

export default OnboardingContext