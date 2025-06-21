// Add this temporary component to test OTP verification
// src/components/OTPDebugTest.jsx

import React, { useState } from 'react'

const OTPDebugTest = () => {
  const [email, setEmail] = useState('test@example.com')
  const [otp, setOtp] = useState('')
  const [results, setResults] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const testOTPVerification = async () => {
    setIsLoading(true)
    setResults({})

    try {
      console.log('🧪 Testing OTP verification with:', { email, otp })
      
      const response = await fetch('https://api.helloyuno.com/onboarding/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({ 
          email: email, 
          otp_code: otp 
        })
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('📥 Response data:', data)

      setResults({
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
        success: response.ok && data.success
      })

    } catch (error) {
      console.error('❌ Test failed:', error)
      setResults({
        error: error.message,
        success: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendOTPFirst = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://api.helloyuno.com/onboarding/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
      
      const data = await response.json()
      console.log('📧 OTP sent:', data)
      alert(`OTP sent to ${email}. Check your email and enter the code.`)
    } catch (error) {
      console.error('❌ Failed to send OTP:', error)
      alert('Failed to send OTP: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '600px' }}>
      <h2>🧪 OTP Verification Debug Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '250px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>OTP Code:</label>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength="6"
            style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
          />
        </div>
        
        <div>
          <button 
            onClick={sendOTPFirst} 
            disabled={isLoading}
            style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            1. Send OTP First
          </button>
          
          <button 
            onClick={testOTPVerification} 
            disabled={isLoading || !otp}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            2. Test OTP Verification
          </button>
        </div>
      </div>

      {isLoading && <p>🔄 Testing...</p>}

      {Object.keys(results).length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: results.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${results.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px'
        }}>
          <h3>📊 Test Results:</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(results, null, 2)}
          </pre>
          
          {results.data && (
            <div style={{ marginTop: '10px' }}>
              <strong>Key Info:</strong>
              <ul>
                <li><strong>HTTP Status:</strong> {results.status}</li>
                <li><strong>Success Field:</strong> {results.data.success ? '✅ true' : '❌ false'}</li>
                <li><strong>Message:</strong> {results.data.message}</li>
                {results.data.data && <li><strong>Temp Token:</strong> {results.data.data.temp_token ? 'Present' : 'Missing'}</li>}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>First click "Send OTP First" to get a real OTP in your email</li>
          <li>Enter the 6-digit code you received</li>
          <li>Click "Test OTP Verification" to see the exact API response</li>
          <li>Check the browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  )
}

export default OTPDebugTest