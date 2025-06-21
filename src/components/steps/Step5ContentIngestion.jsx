// src/components/steps/Step5ContentIngestion.jsx
import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import Button from '../ui/Button'
import { ErrorMessage } from '../ui/ErrorMessage'
import { Upload, ArrowRight, FileText, Image, Mail, Phone, MapPin, User, Building, Check } from 'lucide-react'

// Updated content ingestion validation - support email is required
const contentSchema = z.object({
  fallbackInfo: z.object({
    companyName: z.string().optional(),
    supportEmail: z
      .string()
      .min(1, 'Support email is required')
      .email('Please enter a valid email address'),
    supportPhone: z.string().optional(),
    address: z.string().optional(),
    supportPersonName: z.string().optional()
  }),
  textContent: z.string().optional(),
})

const FileUploadZone = ({ onFilesChange, files }) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    const validFiles = newFiles.filter(file => {
      // Check file size (25MB limit)
      if (file.size > 25 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 25MB`)
        return false
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not supported. Please upload PDF, DOC, DOCX, or TXT files.`)
        return false
      }
      
      return true
    })
    
    onFilesChange([...files, ...validFiles])
    
    // Store files globally for validation
    if (typeof window !== 'undefined') {
      window.uploadedFiles = [...files, ...validFiles]
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
    
    // Update global files
    if (typeof window !== 'undefined') {
      window.uploadedFiles = newFiles
    }
  }

  const getFileIcon = (fileType) => {
    return <FileText className="w-4 h-4 text-yuno-blue-primary" />
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragActive 
            ? 'border-yuno-blue-primary bg-yuno-blue-primary/10' 
            : 'border-gray-600/30 hover:border-yuno-blue-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-yuno-gradient-main rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-white">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-yuno-text-muted mt-1">
              Supports PDF, DOC, DOCX, and TXT files up to 25MB each
            </p>
            <p className="text-xs text-yuno-text-muted mt-2">
              📁 Upload documents like FAQs, product guides, or policies to improve your chatbot's knowledge
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-yuno-text-secondary">
            Uploaded Files ({files.length})
          </h4>
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-yuno-bg-secondary/50 rounded-lg border border-gray-600/30"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yuno-blue-primary/20 rounded-lg flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-yuno-text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="text-yuno-error-primary hover:text-yuno-error-light transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Step5ContentIngestion = () => {
  const { state, actions } = useOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState([])
  const [skipOptionalInfo, setSkipOptionalInfo] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: zodResolver(contentSchema),
    mode: 'onChange',
    defaultValues: {
      textContent: state.contentData.textContent || '',
      fallbackInfo: {
        companyName: state.contentData.fallbackInfo?.companyName || '',
        supportEmail: state.contentData.fallbackInfo?.supportEmail || '',
        supportPhone: state.contentData.fallbackInfo?.supportPhone || '',
        address: state.contentData.fallbackInfo?.address || '',
        supportPersonName: state.contentData.fallbackInfo?.supportPersonName || ''
      }
    }
  })

  const watchedTextContent = watch('textContent')

  const onSubmit = async (data) => {
    console.log('🚀 Content form submitted:', data)
    console.log('📁 Files to upload:', files)
    setIsSubmitting(true)
    actions.clearError()

    try {
      // Prepare content data
      const contentData = {
        textContent: data.textContent,
        files: files,
        fallbackInfo: data.fallbackInfo
      }

      console.log('📤 Uploading content:', contentData)
      await actions.uploadContent(contentData)
      console.log('✅ Content uploaded successfully')

      // Move to next step
      setTimeout(() => {
        actions.nextStep()
      }, 1500)
      
    } catch (error) {
      console.error('❌ Failed to upload content:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Initialize global files for validation
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.uploadedFiles = files
    }
  }, [files])

  // Debug current state
  console.log('🔍 Step5 Debug:', {
    currentStep: state.currentStep,
    siteId: state.siteData.siteId,
    textContentLength: watchedTextContent?.length || 0,
    filesCount: files.length,
    isValid,
    isSubmitting,
    loading: state.loading,
    error: state.error
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 yuno-particles">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yuno-gradient-main rounded-full flex items-center justify-center shadow-yuno-primary yuno-float">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Enhance Your Content
            </h1>
            <p className="text-yuno-text-secondary text-lg">
              Add contact information and additional content to improve your chatbot
            </p>
            <p className="text-yuno-text-muted text-sm max-w-md mx-auto">
              This helps your chatbot provide accurate responses and redirect visitors when needed
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Contact Information - MOVED TO TOP */}
          <Card className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Building className="w-5 h-5 mr-2 text-yuno-blue-primary" />
                Contact Information
              </h3>
              <p className="text-sm text-yuno-text-muted">
                <span className="text-yuno-error-primary">*</span> Support email is required. Other information is optional but helps provide better support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register('fallbackInfo.supportEmail')}
                type="email"
                label="Support Email *"
                placeholder="support@yourcompany.com"
                required
                error={!!errors.fallbackInfo?.supportEmail}
                description={errors.fallbackInfo?.supportEmail?.message}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 border-t border-gray-600/30"></div>
              <span className="text-sm text-yuno-text-muted">Optional Information</span>
              <div className="flex-1 border-t border-gray-600/30"></div>
            </div>

            {/* Optional Contact Fields */}
            {!skipOptionalInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  {...register('fallbackInfo.companyName')}
                  label="Company Name"
                  placeholder="Your Company Name"
                  error={!!errors.fallbackInfo?.companyName}
                  description={errors.fallbackInfo?.companyName?.message}
                />

                <Input
                  {...register('fallbackInfo.supportPhone')}
                  type="tel"
                  label="Support Phone"
                  placeholder="+1 (555) 123-4567"
                  error={!!errors.fallbackInfo?.supportPhone}
                  description={errors.fallbackInfo?.supportPhone?.message}
                />

                <Input
                  {...register('fallbackInfo.supportPersonName')}
                  label="Support Contact Name"
                  placeholder="John Doe"
                  error={!!errors.fallbackInfo?.supportPersonName}
                  description={errors.fallbackInfo?.supportPersonName?.message}
                />

                <div className="md:col-span-2">
                  <Input
                    {...register('fallbackInfo.address')}
                    label="Business Address"
                    placeholder="123 Main St, City, State, Country"
                    error={!!errors.fallbackInfo?.address}
                    description={errors.fallbackInfo?.address?.message}
                  />
                </div>
              </div>
            )}

            {/* Skip Optional Info Option */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="skipOptional"
                checked={skipOptionalInfo}
                onChange={(e) => setSkipOptionalInfo(e.target.checked)}
                className="w-4 h-4 text-yuno-blue-primary bg-yuno-bg-secondary border-gray-600 rounded focus:ring-yuno-blue-primary focus:ring-2"
              />
              <label htmlFor="skipOptional" className="text-sm text-yuno-text-secondary">
                Skip optional information for now (you can add it later in dashboard)
              </label>
            </div>
          </Card>

          {/* Content Upload Section */}
          <Card className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-yuno-blue-primary" />
                Additional Content (Optional)
              </h3>
              <p className="text-sm text-yuno-text-muted">
                Add extra information to make your chatbot smarter and more helpful
              </p>
            </div>

            {/* Text Content Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yuno-text-secondary mb-2">
                  Add Text Content
                </label>
                <textarea
                  {...register('textContent')}
                  placeholder="Paste any additional information about your business, products, services, FAQs, or policies here..."
                  className="w-full h-32 px-4 py-3 bg-yuno-bg-secondary/50 border border-gray-600/30 rounded-lg text-white placeholder-yuno-text-muted focus:outline-none focus:ring-2 focus:ring-yuno-blue-primary focus:border-yuno-blue-primary resize-vertical"
                />
                <p className="text-xs text-yuno-text-muted mt-2">
                  💡 Examples: Product descriptions, company policies, frequently asked questions, or any other relevant information
                </p>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yuno-text-secondary mb-2">
                  Upload Documents
                </label>
                <FileUploadZone files={files} onFilesChange={setFiles} />
                <p className="text-xs text-yuno-text-muted mt-2">
                  📄 Upload documents like user manuals, FAQ documents, or product catalogs to enhance your chatbot's knowledge
                </p>
              </div>
            </div>

            {/* Content Benefits */}
            <div className="bg-yuno-blue-primary/10 border border-yuno-blue-primary/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-yuno-blue-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yuno-blue-light">
                    Why add additional content?
                  </p>
                  <ul className="text-xs text-yuno-text-muted mt-2 space-y-1">
                    <li>• More accurate responses to customer questions</li>
                    <li>• Better understanding of your products and services</li>
                    <li>• Reduced need for human intervention</li>
                    <li>• Improved customer satisfaction</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {state.error && (
            <ErrorMessage message={state.error} />
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="text-lg py-4 px-8"
              loading={isSubmitting || state.loading}
              disabled={!isValid || isSubmitting || state.loading}
            >
              {isSubmitting || state.loading ? (
                'Processing content...'
              ) : (
                <>
                  Continue to Widget Setup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Processing Status */}
          {(isSubmitting || state.loading) && (
            <Card className="bg-yuno-blue-primary/10 border-yuno-blue-primary/20">
              <div className="flex items-center space-x-3">
                <div className="yuno-spinner w-5 h-5" />
                <div>
                  <p className="text-sm font-medium text-yuno-blue-light">
                    Processing your content...
                  </p>
                  <p className="text-xs text-yuno-text-muted">
                    {files.length > 0 && `Analyzing ${files.length} file(s) and `}
                    creating AI embeddings for better responses
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step5ContentIngestion