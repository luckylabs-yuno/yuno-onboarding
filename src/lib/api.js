// src/lib/api.js

// Check if we're in mock mode
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.helloyuno.com'

console.log('🔧 API Configuration:', {
  IS_MOCK_MODE,
  API_BASE_URL,
  env: import.meta.env
})

// Mock delay helper
const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

// Generate mock IDs
const generateMockId = () => Math.random().toString(36).substr(2, 9)

// Token Management (same as before but also exported separately)
export class TokenManager {
  static setTempToken(token) {
    sessionStorage.setItem('yuno_temp_token', token);
    console.log('🔐 Temp token stored');
  }

  static getTempToken() {
    const token = sessionStorage.getItem('yuno_temp_token');
    console.log('🔍 Retrieved temp token:', token ? 'exists' : 'not found');
    return token;
  }

  static clearTempToken() {
    sessionStorage.removeItem('yuno_temp_token');
    console.log('🗑️ Temp token cleared');
  }

  static setAccessToken(token) {
    localStorage.setItem('yuno_access_token', token);
    console.log('🔐 Access token stored');
  }

  static getAccessToken() {
    const token = localStorage.getItem('yuno_access_token');
    console.log('🔍 Retrieved access token:', token ? 'exists' : 'not found');
    return token;
  }

  static clearAccessToken() {
    localStorage.removeItem('yuno_access_token');
    console.log('🗑️ Access token cleared');
  }

  static clearAllTokens() {
    this.clearTempToken();
    this.clearAccessToken();
    console.log('🗑️ All tokens cleared');
  }
}

// API Client (compatible with your existing OnboardingContext)
export const apiClient = {
    // Auth endpoints
    async sendOTP(email) {
      if (IS_MOCK_MODE) {
        console.log('🎭 MOCK: Sending OTP to', email)
        await mockDelay(1500)
        return {
          success: true,
          message: 'OTP sent successfully'
        }
      }

      console.log('📧 Sending OTP to:', email)
      const response = await fetch(`${API_BASE_URL}/onboarding/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to send OTP')
      }

      const data = await response.json()
      console.log('✅ OTP sent successfully')
      return data
    },

    async verifyOTP(email, otp) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Verifying OTP', { email, otp })
      await mockDelay(1500)
      
      // Mock validation - accept "123456" or any 6-digit code
      if (otp.length === 6) {
        return {
          valid: true,
          session_token: 'mock_session_token_' + generateMockId()
        }
      } else {
        throw new Error('Invalid OTP')
      }
    }

    console.log('🔍 Verifying OTP for:', email, 'OTP:', otp)
    const response = await fetch(`${API_BASE_URL}/onboarding/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp_code: otp })
    })

    console.log('📡 OTP Response Status:', response.status)
    
    // Get the response data first
    const data = await response.json()
    console.log('📥 OTP Response Data:', data)

    if (!response.ok) {
      // The backend returns error details in data.message
      throw new Error(data.message || 'Invalid OTP')
    }

    // Check if the response indicates success
    if (!data.success) {
      throw new Error(data.message || 'OTP verification failed')
    }

    console.log('✅ OTP verified successfully')
    
    // Return in format expected by your context
    return {
      valid: true,
      session_token: data.data.temp_token
    }
  },

  async completeSignup(passwordData, tempToken) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Completing signup', { passwordData })
      await mockDelay(2000)
      return {
        success: true,
        user_id: 'mock_user_' + generateMockId(),
        access_token: 'mock_access_token_' + generateMockId()
      }
    }

    console.log('🔐 Creating account...')
    const response = await fetch(`${API_BASE_URL}/onboarding/complete-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify(passwordData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create account')
    }

    const data = await response.json()
    console.log('✅ Account created successfully')
    return {
      success: true,
      user_id: data.data.user_id,
      access_token: data.data.access_token
    }
  },

  // Site management
  async createSite(domain, confirmations) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Creating site', { domain, confirmations })
      await mockDelay(2000)
      return {
        site_id: 'mock_site_' + generateMockId(),
        domain: domain,
        scraping_status: 'in_progress'
      }
    }

    console.log('🌐 Creating site for domain:', domain)
    const accessToken = TokenManager.getAccessToken()
    
    const response = await fetch(`${API_BASE_URL}/onboarding/setup-domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ domain })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create site')
    }

    const data = await response.json()
    console.log('✅ Site created successfully')
    return {
      site_id: data.data.site_id,
      domain: data.data.domain,
      scraping_status: data.data.scraping_status
    }
  },

  async getSiteStatus(siteId) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Getting site status', siteId)
      await mockDelay(1000)
      return {
        scraping_status: 'completed',
        scraping_progress: 100
      }
    }

    console.log('📊 Getting site status for:', siteId)
    const accessToken = TokenManager.getAccessToken()
    
    const response = await fetch(`${API_BASE_URL}/sites/${siteId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to get site status')
    }

    const data = await response.json()
    return data.data
  },

  // Content management
  async uploadText(siteId, textContent) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Uploading text content', { siteId, contentLength: textContent.length })
      await mockDelay(2000)
      return {
        upload_id: 'mock_upload_' + generateMockId(),
        status: 'processing'
      }
    }

    console.log('📝 Uploading text content for site:', siteId)
    const accessToken = TokenManager.getAccessToken()
    
    const response = await fetch(`${API_BASE_URL}/content/upload-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        site_id: siteId,
        content: textContent
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to upload text content')
    }

    const data = await response.json()
    console.log('✅ Text content uploaded successfully')
    return data.data
  },

  async uploadFile(siteId, file) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Uploading file', { siteId, fileName: file.name })
      await mockDelay(3000)
      return {
        upload_id: 'mock_upload_' + generateMockId(),
        status: 'processing'
      }
    }

    console.log('📄 Uploading file for site:', siteId, 'File:', file.name)
    const accessToken = TokenManager.getAccessToken()
    
    const formData = new FormData()
    formData.append('site_id', siteId)
    formData.append('files', file)

    const response = await fetch(`${API_BASE_URL}/content/upload-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to upload file')
    }

    const data = await response.json()
    console.log('✅ File uploaded successfully')
    return data.data
  },

  async saveFallbackInfo(siteId, fallbackInfo) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Saving fallback info', { siteId, fallbackInfo })
      await mockDelay(1000)
      return { success: true }
    }

    console.log('💾 Saving fallback info for site:', siteId)
    const accessToken = TokenManager.getAccessToken()
    
    const response = await fetch(`${API_BASE_URL}/content/fallback-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        site_id: siteId,
        fallback_info: fallbackInfo
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to save fallback info')
    }

    const data = await response.json()
    console.log('✅ Fallback info saved successfully')
    return data
  },

  // Widget management
  async generateWidget(siteId) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Generating widget for site', siteId)
      await mockDelay(1500)
      return {
        scriptTag: `<script src="https://cdn.helloyuno.com/yuno.js" site_id="${siteId}" defer></script>`,
        siteId: siteId
      }
    }

    console.log('🎨 Generating widget for site:', siteId)
    const accessToken = TokenManager.getAccessToken()
    
    const response = await fetch(`${API_BASE_URL}/sites/${siteId}/widget-script`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to generate widget')
    }

    const data = await response.json()
    console.log('✅ Widget generated successfully')
    return {
      scriptTag: data.data.script_tag,
      siteId: data.data.site_id
    }
  },

  async verifyWidget(siteId, pageUrl) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Verifying widget', { siteId, pageUrl })
      await mockDelay(2000)
      return {
        verified: true,
        message: 'Widget verified successfully'
      }
    }

    console.log('🔍 Verifying widget for site:', siteId, 'URL:', pageUrl)
    const accessToken = TokenManager.getAccessToken()
    
    const response = await fetch(`${API_BASE_URL}/sites/${siteId}/verify-widget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ page_url: pageUrl })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to verify widget')
    }

    const data = await response.json()
    console.log('✅ Widget verification completed')
    return data.data
  },

  // Utility endpoints
  async completeOnboardingStep(currentStep, data) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Completing onboarding step', { currentStep, data })
      await mockDelay(500)
      return { success: true }
    }

    console.log('📝 Saving onboarding step progress:', currentStep)
    const response = await fetch(`${API_BASE_URL}/onboarding/complete-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: currentStep,
        data: data
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to save step progress')
    }

    const data_result = await response.json()
    console.log('✅ Step progress saved')
    return data_result
  },

  async getOnboardingState(email) {
    if (IS_MOCK_MODE) {
      console.log('🎭 MOCK: Getting onboarding state for', email)
      await mockDelay(500)
      return {
        current_step: 1,
        email: email,
        session_data: {}
      }
    }

    console.log('📊 Getting onboarding state for:', email)
    const response = await fetch(`${API_BASE_URL}/onboarding/status?email=${encodeURIComponent(email)}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to get onboarding state')
    }

    const data = await response.json()
    return data.data
  }
}

// Also export as apiService for compatibility with new components
export const apiService = apiClient

// Default export for backward compatibility
export default apiClient