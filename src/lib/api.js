// src/lib/api.js - Updated with Step 5-6 integration

const IS_MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true' || !import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.helloyuno.com'

const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))
const generateMockId = () => Math.random().toString(36).substr(2, 9)

export class TokenManager {
  static setTempToken(token) {
    sessionStorage.setItem('yuno_temp_token', token);
  }

  static getTempToken() {
    return sessionStorage.getItem('yuno_temp_token');
  }

  static clearTempToken() {
    sessionStorage.removeItem('yuno_temp_token');
  }

  static setAccessToken(token) {
    localStorage.setItem('yuno_access_token', token);
  }

  static getAccessToken() {
    return localStorage.getItem('yuno_access_token');
  }

  static clearAccessToken() {
    localStorage.removeItem('yuno_access_token');
  }

  static clearAllTokens() {
    this.clearTempToken();
    this.clearAccessToken();
  }
}

export const apiClient = {
  // Auth endpoints
  async sendOTP(email) {
    if (IS_MOCK_MODE) {
      await mockDelay(1500)
      return { success: true, message: 'OTP sent successfully' }
    }

    const response = await fetch(`${API_BASE_URL}/onboarding/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to send OTP')
    }

    return await response.json()
  },

  async verifyOTP(email, otp) {
    if (IS_MOCK_MODE) {
      await mockDelay(1500)
      if (otp.length === 6) {
        return { valid: true, session_token: 'mock_session_token_' + generateMockId() }
      } else {
        throw new Error('Invalid OTP')
      }
    }

    const response = await fetch(`${API_BASE_URL}/onboarding/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp_code: otp })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Invalid OTP')
    }
    if (!data.success) {
      throw new Error(data.message || 'OTP verification failed')
    }

    return {
      valid: true,
      session_token: data.data.temp_token
    }
  },

  async completeSignup(passwordData, tempToken) {
    if (IS_MOCK_MODE) {
      await mockDelay(2000)
      return {
        success: true,
        user_id: 'mock_user_' + generateMockId(),
        access_token: 'mock_access_token_' + generateMockId()
      }
    }

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
    return {
      success: true,
      user_id: data.data.user_id,
      access_token: data.data.access_token
    }
  },

  async createSite(domain, confirmations) {
    if (IS_MOCK_MODE) {
      await mockDelay(2000)
      return {
        site_id: 'mock_site_' + generateMockId(),
        domain: domain,
        scraping_status: 'in_progress'
      }
    }

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
    return {
      site_id: data.data.site_id,
      domain: data.data.domain,
      scraping_status: data.data.scraping_status
    }
  },

  async getSiteStatus(siteId) {
    if (IS_MOCK_MODE) {
      await mockDelay(1000)
      return { scraping_status: 'completed', scraping_progress: 100 }
    }

    const response = await fetch(`${API_BASE_URL}/onboarding/scraping-status/${siteId}`)
    if (!response.ok) {
      throw new Error('Failed to get site status')
    }

    const data = await response.json()
    return data.data
  },

  // NEW: Step 5 - Content Management
  async uploadText(siteId, textContent) {
    if (IS_MOCK_MODE) {
      await mockDelay(2000)
      return { upload_id: 'mock_upload_' + generateMockId(), status: 'processing' }
    }

    const accessToken = TokenManager.getAccessToken()
    const response = await fetch(`${API_BASE_URL}/onboarding/upload-text`, {
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

    return await response.json()
  },

  async uploadFile(siteId, file) {
    if (IS_MOCK_MODE) {
      await mockDelay(3000)
      return { upload_id: 'mock_upload_' + generateMockId(), status: 'processing' }
    }

    const accessToken = TokenManager.getAccessToken()
    const formData = new FormData()
    formData.append('site_id', siteId)
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/onboarding/upload-file`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to upload file')
    }

    return await response.json()
  },

  async updateContactInfo(siteId, contactInfo) {
    if (IS_MOCK_MODE) {
      await mockDelay(1000)
      return { success: true }
    }

    const accessToken = TokenManager.getAccessToken()
    const response = await fetch(`${API_BASE_URL}/onboarding/update-contact-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        site_id: siteId,
        contact_info: contactInfo
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to update contact info')
    }

    return await response.json()
  },

  // NEW: Step 6 - Widget Management
  async generateWidget(accessToken) {
    if (IS_MOCK_MODE) {
      await mockDelay(1500)
      return {
        scriptTag: `<script src="https://cdn.helloyuno.com/yuno.js" site_id="mock_site_123" defer></script>`,
        siteId: 'mock_site_123'
      }
    }

    const response = await fetch(`${API_BASE_URL}/onboarding/generate-widget-script`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to generate widget')
    }

    const data = await response.json()
    return {
      scriptTag: data.data.widget_script,
      siteId: data.data.site_id
    }
  },

  async verifyWidget(pageUrl) {
    if (IS_MOCK_MODE) {
      await mockDelay(2000)
      return { verified: true, message: 'Widget verified successfully' }
    }

    const accessToken = TokenManager.getAccessToken()
    const response = await fetch(`${API_BASE_URL}/onboarding/verify-widget`, {
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
    return data.data
  },

  // NEW: Resume Functionality
  async getUserState() {
    if (IS_MOCK_MODE) {
      await mockDelay(500)
      return {
        current_step: 1,
        email: 'mock@example.com',
        session_data: {}
      }
    }

    const accessToken = TokenManager.getAccessToken()
    const response = await fetch(`${API_BASE_URL}/onboarding/get-user-state`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to get user state')
    }

    return await response.json()
  },

  async updateStep(step, sessionData) {
    if (IS_MOCK_MODE) {
      await mockDelay(500)
      return { success: true }
    }

    const accessToken = TokenManager.getAccessToken()
    const response = await fetch(`${API_BASE_URL}/onboarding/update-step`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ step, session_data: sessionData })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to update step')
    }

    return await response.json()
  },

  async completeOnboarding() {
    if (IS_MOCK_MODE) {
      await mockDelay(1000)
      return { success: true, redirect_url: 'https://dashboard.helloyuno.com' }
    }

    const accessToken = TokenManager.getAccessToken()
    const response = await fetch(`${API_BASE_URL}/onboarding/complete`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to complete onboarding')
    }

    return await response.json()
  }
}

export const apiService = apiClient
export default apiClient