// src/contexts/OnboardingContext.jsx - FIXED Resume Logic
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { apiClient, TokenManager } from '../lib/api.js'

const OnboardingContext = createContext()
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL

const ACTIONS = {
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_EMAIL: 'SET_EMAIL',
  SET_EMAIL_VERIFIED: 'SET_EMAIL_VERIFIED',
  SET_TEMP_TOKEN: 'SET_TEMP_TOKEN',
  SET_PASSWORD_SET: 'SET_PASSWORD_SET',
  SET_SITE_DATA: 'SET_SITE_DATA',
  SET_CONTENT_DATA: 'SET_CONTENT_DATA',
  SET_WIDGET_DATA: 'SET_WIDGET_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
  LOAD_SAVED_STATE: 'LOAD_SAVED_STATE',
  SET_USER_DATA: 'SET_USER_DATA'
}

const initialState = {
  currentStep: 1,
  email: '',
  isEmailVerified: false,
  tempToken: null,
  isPasswordSet: false,
  userData: {
    userId: null,
    accessToken: null
  },
  siteData: {
    siteId: null,
    domain: '',
    scrapingStatus: 'pending',
    scrapingProgress: 0
  },
  contentData: {
    textContent: '',
    uploadedFiles: [],
    contactInfo: {
      companyName: '',
      supportEmail: '',
      supportPhone: '',
      address: '',
      supportPersonName: ''
    },
    processingStatus: 'pending',
    uploads: []
  },
  widgetData: {
    isVerified: false,
    verificationUrl: '',
    scriptTag: ''
  },
  loading: false,
  error: null
}

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
    case ACTIONS.SET_USER_DATA:
      return { ...state, userData: { ...state.userData, ...action.payload }}
    case ACTIONS.SET_SITE_DATA:
      return { ...state, siteData: { ...state.siteData, ...action.payload }}
    case ACTIONS.SET_CONTENT_DATA:
      return { ...state, contentData: { ...state.contentData, ...action.payload }}
    case ACTIONS.SET_WIDGET_DATA:
      return { ...state, widgetData: { ...state.widgetData, ...action.payload }}
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

export const OnboardingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  // FIXED: Resume functionality with correct session_data parsing
  useEffect(() => {
    const initializeState = async () => {
      const accessToken = TokenManager.getAccessToken()
      
      if (accessToken) {
        try {
          console.log('🔄 Attempting to resume session...')
          const userState = await apiClient.getUserState()
          
          console.log('📋 User state response:', userState)
          
          if (userState.success) {
            // FIXED: Use session_data.current_step instead of top-level current_step
            const sessionData = userState.session_data || {}
            const currentStep = sessionData.current_step || userState.current_step || 1
            
            console.log('📍 Resume Logic:', {
              topLevelStep: userState.current_step,
              sessionDataStep: sessionData.current_step,
              chosenStep: currentStep,
              siteId: sessionData.site_id,
              domain: sessionData.domain,
              profileCompleted: sessionData.profile_completed
            })

            // Determine step based on actual progress
            let actualStep = currentStep
            
            // Override step based on completion status
            if (sessionData.widget_verified) {
              actualStep = 7  // Completed
            } else if (sessionData.site_id && sessionData.content_complete) {
              actualStep = 6  // Widget installation
            } else if (sessionData.site_id) {
              actualStep = 5  // Content upload
            } else if (sessionData.profile_completed) {
              actualStep = 4  // Domain setup
            } else if (sessionData.otp_verified) {
              actualStep = 3  // Profile setup
            } else if (sessionData.otp_sent_at) {
              actualStep = 2  // OTP verification
            }

            console.log('🎯 Final determined step:', actualStep)

            dispatch({ type: ACTIONS.LOAD_SAVED_STATE, payload: {
              currentStep: actualStep,
              email: userState.email,
              isEmailVerified: !!sessionData.email_verified || !!sessionData.otp_verified,
              isPasswordSet: !!sessionData.profile_completed,
              userData: {
                userId: sessionData.user_id,
                accessToken: accessToken
              },
              siteData: {
                siteId: sessionData.site_id,
                domain: sessionData.domain || userState.profile?.domain,
                scrapingStatus: sessionData.site_id ? 'completed' : 'pending'
              },
              contentData: {
                contactInfo: {
                  supportEmail: sessionData.support_email || '',
                  companyName: sessionData.company_name || '',
                  supportPhone: sessionData.support_phone || '',
                  address: sessionData.address || '',
                  supportPersonName: sessionData.support_person_name || ''
                },
                processingStatus: sessionData.content_complete ? 'completed' : 'pending'
              },
              widgetData: {
                isVerified: !!sessionData.widget_verified,
                scriptTag: sessionData.widget_script || ''
              }
            }})

            console.log('✅ Session resumed successfully at step', actualStep)
          }
        } catch (error) {
          console.warn('❌ Failed to resume session:', error)
          TokenManager.clearAccessToken()
          
          // Fall back to sessionStorage
          const savedState = sessionStorage.getItem('yuno-onboarding-state')
          if (savedState) {
            try {
              const parsedState = JSON.parse(savedState)
              dispatch({ type: ACTIONS.LOAD_SAVED_STATE, payload: parsedState })
              console.log('📱 Loaded from sessionStorage instead')
            } catch (error) {
              console.error('Failed to load saved state:', error)
            }
          }
        }
      } else {
        // No access token, try sessionStorage
        const savedState = sessionStorage.getItem('yuno-onboarding-state')
        if (savedState) {
          try {
            const parsedState = JSON.parse(savedState)
            dispatch({ type: ACTIONS.LOAD_SAVED_STATE, payload: parsedState })
            console.log('📱 Loaded from sessionStorage (no token)')
          } catch (error) {
            console.error('Failed to load saved state:', error)
          }
        }
      }
    }

    initializeState()
  }, [])

  // Save state to sessionStorage
  useEffect(() => {
    const stateToSave = {
      currentStep: state.currentStep,
      email: state.email,
      isEmailVerified: state.isEmailVerified,
      isPasswordSet: state.isPasswordSet,
      siteData: state.siteData,
      contentData: state.contentData,
      widgetData: state.widgetData
    }
    sessionStorage.setItem('yuno-onboarding-state', JSON.stringify(stateToSave))
  }, [state])

  // FIXED: Use useCallback to prevent infinite loops
  const actions = useCallback(() => ({
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
      TokenManager.clearAllTokens()
      sessionStorage.removeItem('yuno-onboarding-state')
    },

    nextStep: async () => {
      if (state.currentStep < 7) {
        const nextStep = state.currentStep + 1
        dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: nextStep })
        
        if (!IS_MOCK_MODE) {
          try {
            await apiClient.updateStep(nextStep, {
              email: state.email,
              step: nextStep
            })
          } catch (error) {
            console.error('Failed to save step progress:', error)
          }
        }
      }
    },

    goToStep: (step) => {
      if (step >= 1 && step <= 7) {
        dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: step })
      }
    },

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

    completeSignup: async (passwordData) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.completeSignup(passwordData, state.tempToken)
        dispatch({ type: ACTIONS.SET_PASSWORD_SET, payload: true })
        
        if (response.access_token) {
          TokenManager.setAccessToken(response.access_token)
          dispatch({ type: ACTIONS.SET_USER_DATA, payload: {
            userId: response.user_id,
            accessToken: response.access_token
          }})
        }
        
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    createSite: async (domain, confirmations) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.createSite(domain, confirmations)
        dispatch({ type: ACTIONS.SET_SITE_DATA, payload: { 
          siteId: response.site_id,
          domain: domain,
          scrapingStatus: 'in_progress',
          scrapingProgress: 0
        }})
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    getSiteStatus: async (siteId) => {
      try {
        const response = await apiClient.getSiteStatus(siteId)
        dispatch({ type: ACTIONS.SET_SITE_DATA, payload: { 
          scrapingStatus: response.scraping_status,
          scrapingProgress: response.scraping_progress || 0
        }})
        return response
      } catch (error) {
        console.error('Failed to get site status:', error)
        return null
      }
    },

    uploadContent: async (contentData) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const uploads = []
        
        if (contentData.contactInfo && contentData.contactInfo.supportEmail) {
          await apiClient.updateContactInfo(state.siteData.siteId, contentData.contactInfo)
          dispatch({ type: ACTIONS.SET_CONTENT_DATA, payload: { 
            contactInfo: contentData.contactInfo 
          }})
        }
        
        if (contentData.textContent && contentData.textContent.trim()) {
          const textResponse = await apiClient.uploadText(state.siteData.siteId, contentData.textContent)
          uploads.push(textResponse)
        }
        
        if (contentData.files && contentData.files.length > 0) {
          for (const file of contentData.files) {
            const fileResponse = await apiClient.uploadFile(state.siteData.siteId, file)
            uploads.push(fileResponse)
          }
        }
        
        dispatch({ type: ACTIONS.SET_CONTENT_DATA, payload: { 
          textContent: contentData.textContent || '',
          uploadedFiles: contentData.files || [],
          uploads: uploads,
          processingStatus: 'processing'
        }})
        
        return uploads
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    generateWidget: async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.generateWidget()
        dispatch({ type: ACTIONS.SET_WIDGET_DATA, payload: { 
          scriptTag: response.scriptTag
        }})
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    verifyWidget: async (pageUrl) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.CLEAR_ERROR })
      
      try {
        const response = await apiClient.verifyWidget(pageUrl)
        dispatch({ type: ACTIONS.SET_WIDGET_DATA, payload: { 
          isVerified: response.verified,
          verificationUrl: pageUrl
        }})
        return response
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        throw error
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },

    completeOnboarding: async () => {
      try {
        await apiClient.completeOnboarding()
        dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: 7 })
      } catch (error) {
        console.error('Failed to complete onboarding:', error)
      }
    }
  }), [state])

  const value = {
    state,
    actions: actions(),
    canProceedToNextStep: () => {
      switch (state.currentStep) {
        case 1:
          return state.email && !state.loading
        case 2:
          return state.isEmailVerified && !state.loading
        case 3:
          return state.isPasswordSet && !state.loading
        case 4:
          return state.siteData.siteId && !state.loading
        case 5:
          return state.contentData.contactInfo?.supportEmail && !state.loading
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
        3: 'Set Your Password',
        4: 'Add Your Website',
        5: 'Add Contact Info',
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
          return state.isPasswordSet
        case 4:
          return !!state.siteData.siteId
        case 5:
          return !!state.contentData.contactInfo?.supportEmail
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

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

export default OnboardingContext