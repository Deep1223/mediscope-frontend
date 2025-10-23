"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Upload, X, AlertCircle, CheckCircle, ArrowLeft, FileText, Users, FileImage, CheckSquare, Send, Eye, Download } from "lucide-react"
import TagPicker from "../../components/ui/tag-picker"
import { submitResearchArticle } from "../../lib/api-utils"

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="h-[300px] border border-lancet-border rounded-lg flex items-center justify-center text-gray-500">Loading editor...</div>
})

export default function SubmitResearchPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    journalid: "",
    journal: "",
    articletypeid: "",
    articletype: "",
    keywords: [],
    excerpt: "",
    image: null,
    badgetypeid: "",
    badgetype: "",
    date: "",
    journalcodeid: "",
    journalcode: "",
    status: 1,

    // Step 2: Authors
    authors: [{ name: "", email: "", affiliation: "" }],
  })

  const [errors, setErrors] = useState({})
  const [uploadProgress, setUploadProgress] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [dataLoaded, setDataLoaded] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false)
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)

  // Jodit editor configuration
  const joditConfig = {
    readonly: false,
    height: 300,
    placeholder: "Enter your detailed research content here...",
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    // Paste configuration - Fixed copy-paste issues
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_only_text",
    processPasteHTML: false,
    processPasteFromWord: false,
    // Enable paste plugin explicitly
    plugins: [
      "paste",
      "clipboard"
    ],
    // Clipboard configuration
    clipboard: {
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_only_text"
    },
    buttons: [
      "source", "|",
      "bold", "italic", "underline", "|",
      "ul", "ol", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "table", "link", "|",
      "align", "undo", "redo", "|",
      "hr", "eraser", "copyformat", "|",
      "symbol", "fullsize", "print", "about"
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    filebrowser: {
      ajax: {
        url: "/api/upload"
      }
    }
  }


  // Generate unique ID for the submission
  const generateId = () => {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    return `id_${timestamp}_${randomStr}`
  }

  // Convert file to base64 for storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  // Convert base64 back to file object
  const base64ToFile = (base64String, filename, mimeType) => {
    const arr = base64String.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mimeType || mime })
  }

  // Upload image to server
  const uploadImage = async (file) => {
    try {
      setImageUploading(true)
      
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch('https://brockersbackend.finnovationz.com/api/article/upload', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        setUploadedImageUrl(result.imageUrl)
        return result.imageUrl
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    } finally {
      setImageUploading(false)
    }
  }


  // Set data loaded to true on component mount
  useEffect(() => {
    setDataLoaded(true)
  }, [])


  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [previewUrl, imagePreviewUrl])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showFilePreviewModal) {
          setShowFilePreviewModal(false)
        }
        if (showImagePreviewModal) {
          setShowImagePreviewModal(false)
        }
      }
    }

    if (showFilePreviewModal || showImagePreviewModal) {
      document.addEventListener('keydown', handleEscKey)
      return () => document.removeEventListener('keydown', handleEscKey)
    }
  }, [showFilePreviewModal, showImagePreviewModal])

  const journals = [
    { id: 1, name: "AyushVeda Ayurveda" },
    { id: 2, name: "AyushVeda Yoga" },
    { id: 3, name: "AyushVeda Naturopathy" },
    { id: 4, name: "AyushVeda Homeopathy" },
    { id: 5, name: "AyushVeda Unani" },
    { id: 6, name: "AyushVeda Siddha" },
    { id: 7, name: "AyushVeda Global Health" },
  ]

  const articleTypes = [
    { id: 1, name: "Original Research" },
    { id: 2, name: "Review Article" },
    { id: 3, name: "Commentary" },
    { id: 4, name: "Case Report" },
    { id: 5, name: "Letter to the Editor" },
    { id: 6, name: "Editorial" },
    { id: 7, name: "Clinical Trial" },
    { id: 8, name: "Meta-Analysis" },
  ]

  const badgeTypes = [
    { id: 1, name: "Research" },
    { id: 2, name: "Open Access" },
    { id: 3, name: "Comment" },
    { id: 4, name: "News" },
    { id: 5, name: "Review" },
  ]

  const journalCodes = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Cardiology" },
    { id: 3, name: "Medicine" },
    { id: 4, name: "Pediatrics" },
    { id: 5, name: "Oncology" },
    { id: 6, name: "Psychiatry" },
    { id: 7, name: "Ayurveda" },
    { id: 8, name: "Yoga" },
    { id: 9, name: "Naturopathy" },
    { id: 10, name: "Homeopathy" },
    { id: 11, name: "Unani" },
    { id: 12, name: "Siddha" },
    { id: 13, name: "Global Health" },
  ]


  // Email regex validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required"
      if (!formData.journalid) newErrors.journal = "Journal selection is required"
      if (!formData.articletypeid) newErrors.articleType = "Article type is required"
      if (!formData.keywords || formData.keywords.length === 0) newErrors.keywords = "At least one badge label is required"
      if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required"
      if (!formData.badgetypeid) newErrors.badgeType = "Badge type is required"
      if (!formData.date.trim()) newErrors.date = "Publication date is required"
      if (!formData.journalcodeid) newErrors.journalCode = "Journal code is required"
    }

    if (step === 2) {
      formData.authors.forEach((author, index) => {
        if (!author.name.trim()) newErrors[`author_${index}_name`] = "Author name is required"
        if (!author.email.trim()) {
          newErrors[`author_${index}_email`] = "Email is required"
        } else if (!emailRegex.test(author.email)) {
          newErrors[`author_${index}_email`] = "Please enter a valid email address"
        }
        if (!author.affiliation.trim()) newErrors[`author_${index}_affiliation`] = "Affiliation is required"
      })
    }

    if (step === 3) {
      // No validation needed for review step
    }


    return newErrors
  }

  const handleNextStep = () => {
    const newErrors = validateStep(currentStep)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  const handleDropdownChange = (e, fieldType) => {
    const { value } = e.target
    const selectedOption = getSelectedOption(value, fieldType)
    
    if (selectedOption) {
      setFormData({ 
        ...formData, 
        [`${fieldType}id`]: selectedOption.id,
        [fieldType]: selectedOption.name
      })
    } else {
      setFormData({ 
        ...formData, 
        [`${fieldType}id`]: "",
        [fieldType]: ""
      })
    }
    
    if (errors[fieldType]) setErrors({ ...errors, [fieldType]: "" })
  }

  const getSelectedOption = (value, fieldType) => {
    const options = {
      journal: journals,
      articletype: articleTypes,
      badgetype: badgeTypes,
      journalcode: journalCodes
    }
    return options[fieldType]?.find(option => option.id.toString() === value)
  }

  const handleAuthorChange = (index, field, value) => {
    const newAuthors = [...formData.authors]
    newAuthors[index][field] = value
    setFormData({ ...formData, authors: newAuthors })
    if (errors[`author_${index}_${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`author_${index}_${field}`]
      setErrors(newErrors)
    }
  }

  const addAuthor = () => {
    setFormData({
      ...formData,
      authors: [...formData.authors, { name: "", email: "", affiliation: "" }],
    })
  }

  const removeAuthor = (index) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index),
    })
  }

  const handleFileUpload = (e, fileType) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      // Validate file type for manuscript uploads (images only)
      if (fileType === "manuscript" || fileType === "image") {
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/tiff']
        if (!allowedImageTypes.includes(file.type)) {
          alert(`Invalid file type. Please upload only image files (JPG, PNG, GIF, WebP, TIFF).`)
          return
        }
      }

      // Validate file size - limit to 3MB for images
      if (fileType === "image") {
        const maxSize = 3 * 1024 * 1024 // 3MB in bytes
        if (file.size > maxSize) {
          alert(`Image file is too large. Please upload an image smaller than 3MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
          return
        }
      }

      // Validate file size - limit to 3MB for manuscripts as well
      if (fileType === "manuscript") {
        const maxSize = 3 * 1024 * 1024 // 3MB in bytes
        if (file.size > maxSize) {
          alert(`Manuscript file is too large. Please upload a file smaller than 3MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
          return
        }
      }

      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[file.name] || 0
          if (current >= 100) {
            clearInterval(interval)
            return prev
          }
          return { ...prev, [file.name]: current + Math.random() * 30 }
        })
      }, 200)

      if (fileType === "manuscript") {
        setFormData({ ...formData, manuscript: file })
        // Create preview URL for image files
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          setPreviewUrl(url)
        }
      } else if (fileType === "image") {
        console.log('Uploading image file:', file)
        setFormData(prev => {
          const newData = { ...prev, image: file }
          console.log('Updated formData.image:', newData.image)
          return newData
        })
        // Create preview URL for featured image
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          console.log('Setting imagePreviewUrl:', url)
          console.log('File details:', { name: file.name, type: file.type, size: file.size })
          setImagePreviewUrl(url)
          // Force re-render by setting a small delay
          setTimeout(() => {
            console.log('imagePreviewUrl after setState:', url)
          }, 100)
        }
        
        // Automatically upload the image when selected
        uploadImage(file).then((imageUrl) => {
          console.log('Image uploaded successfully:', imageUrl)
          setFormData(prev => ({ ...prev, imageUrl: imageUrl }))
        }).catch((error) => {
          console.error('Failed to upload image:', error)
          alert(`Failed to upload image: ${error.message}`)
        })
      }
    })
  }

  const removeFile = (fileType, index) => {
    if (fileType === "manuscript") {
      setFormData({ ...formData, manuscript: null })
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      setShowPreview(false)
    } else if (fileType === "image") {
      setFormData({ ...formData, image: null, imageUrl: null })
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
        setImagePreviewUrl(null)
      }
      setUploadedImageUrl(null)
      setShowImagePreviewModal(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all steps before submission
    const step1Errors = validateStep(1)
    const step2Errors = validateStep(2)
    
    const allErrors = { ...step1Errors, ...step2Errors }
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      // Go to first step with errors
      setCurrentStep(1)
      return
    }

    // Show loading state
    setSuccessMessage("")
    
    try {
      // Create the final submission data with the required format
      const submissionData = {
        _id: generateId(),
        ...formData,
        status: 1, // Mark as submitted and approved for top listing
        recordinfo: {
          entryBy: "1760636856216", // You can make this dynamic
          entryTime: new Date().toISOString(),
          updateBy: "1760636856216", // Updated by same user on submission
          updateTime: new Date().toISOString()
        }
      }
      
      // Use uploaded image URL if available, otherwise use File object
      if (formData.imageUrl) {
        // If we have an uploaded URL, we'll send it as a string field
        submissionData.imageUrl = formData.imageUrl
        // Remove the File object since we're using the URL
        delete submissionData.image
      }
      
      // Submit to API
      console.log('Submitting research data to API:', submissionData)
      const response = await submitResearchArticle(submissionData)
      
      if (response.success) {
        setSuccessMessage("Submission successful! Your research has been submitted for review.")
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      } else {
        throw new Error(response.error || 'Submission failed')
      }
      
    } catch (error) {
      console.error('Submission error:', error)
      setSuccessMessage("")
      alert(`Submission failed: ${error.message}. Please try again.`)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
          <Link 
            href="/" 
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Submit Your Research
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Complete all steps to submit your manuscript for review and publication</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: "Basic Info", icon: FileText },
              { step: 2, label: "Authors", icon: Users },
              { step: 3, label: "Review", icon: CheckSquare }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${
                      step <= currentStep 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg" 
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle size={24} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>
                  <span className={`text-xs font-medium mt-2 transition-colors duration-300 ${
                    step <= currentStep ? "text-emerald-600" : "text-gray-500"
                  }`}>
                    {label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                      step < currentStep 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold">{successMessage}</p>
                <p className="text-sm text-emerald-600 mt-1">Redirecting to home page...</p>
              </div>
            </div>
          </div>
        )}



        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-lancet-dark mb-6">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                    errors.title ? "border-red-500" : "border-lancet-border"
                  }`}
                  placeholder="Enter your manuscript title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-lancet-dark mb-2">Select Journal <span className="text-red-500">*</span></label>
                  <select
                    name="journal"
                    value={formData.journalid}
                    onChange={(e) => handleDropdownChange(e, 'journal')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                      errors.journal ? "border-red-500" : "border-lancet-border"
                    }`}
                  >
                    <option value="">Choose a journal</option>
                    {journals.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                  {errors.journal && <p className="text-red-500 text-sm mt-1">{errors.journal}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-lancet-dark mb-2">Article Type <span className="text-red-500">*</span></label>
                  <select
                    name="articleType"
                    value={formData.articletypeid}
                    onChange={(e) => handleDropdownChange(e, 'articletype')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                      errors.articleType ? "border-red-500" : "border-lancet-border"
                    }`}
                  >
                    <option value="">Choose article type</option>
                    {articleTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.articleType && <p className="text-red-500 text-sm mt-1">{errors.articleType}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Badge<span className="text-red-500">*</span></label>
                <TagPicker
                  tags={formData.keywords}
                  onTagsChange={(newTags) => {
                    setFormData({ ...formData, keywords: newTags })
                    if (errors.keywords) setErrors({ ...errors, keywords: "" })
                  }}
                  placeholder="Type badge labels and press Enter to add (e.g., OPEN ACCESS, RESEARCH, BREAKTHROUGH)"
                  maxTags={10}
                  error={!!errors.keywords}
                />
                {errors.keywords && <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Excerpt <span className="text-red-500">*</span></label>
                <div className={`border rounded-lg overflow-hidden ${
                    errors.excerpt ? "border-red-500" : "border-lancet-border"
                }`}>
                  <JoditEditor
                    defaultValue={formData.excerpt}
                    config={joditConfig}
                    onBlur={(content) => {
                      setFormData({ ...formData, excerpt: content })
                      if (errors.excerpt) setErrors({ ...errors, excerpt: "" })
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {formData.excerpt ? formData.excerpt.replace(/<[^>]*>/g, '').split(" ").filter((w) => w).length : 0} words
                  </p>
                  {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Badge Type <span className="text-red-500">*</span></label>
                <select
                  name="badgeType"
                  value={formData.badgetypeid}
                  onChange={(e) => handleDropdownChange(e, 'badgetype')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                    errors.badgeType ? "border-red-500" : "border-lancet-border"
                  }`}
                >
                  <option value="">Choose badge type</option>
                  {badgeTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.badgeType && <p className="text-red-500 text-sm mt-1">{errors.badgeType}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-lancet-dark mb-2">Publication Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                      errors.date ? "border-red-500" : "border-lancet-border"
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-lancet-dark mb-2">Journal Code <span className="text-red-500">*</span></label>
                  <select
                    name="journalCode"
                    value={formData.journalcodeid}
                    onChange={(e) => handleDropdownChange(e, 'journalcode')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                      errors.journalCode ? "border-red-500" : "border-lancet-border"
                    }`}
                  >
                    <option value="">Choose journal code</option>
                    {journalCodes.map((code) => (
                      <option key={code.id} value={code.id}>
                        {code.name}
                      </option>
                    ))}
                  </select>
                  {errors.journalCode && <p className="text-red-500 text-sm mt-1">{errors.journalCode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Featured Image</label>
                <div className="border-2 border-dashed border-lancet-border rounded-lg p-8 text-center hover:border-lancet-blue transition cursor-pointer">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.tiff"
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-lancet-blue mx-auto mb-2" />
                    <p className="text-lancet-dark font-medium">Click to upload featured image</p>
                    <p className="text-gray-500 text-sm">JPG, PNG, GIF, WebP, TIFF (max 3 MB)</p>
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-700 text-sm font-medium">{formData.image.name}</span>
                      <div className="flex items-center gap-2">
                        {imageUploading && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </span>
                        )}
                        {uploadedImageUrl && !imageUploading && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            <CheckCircle size={14} />
                            Uploaded
                          </span>
                        )}
                        {!uploadedImageUrl && !imageUploading && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            <CheckCircle size={14} />
                            Ready
                          </span>
                        )}
                        {formData.image.type.startsWith('image/') && (
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Opening modal, imagePreviewUrl:', imagePreviewUrl)
                              console.log('formData.image:', formData.image)
                              setShowImagePreviewModal(true)
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <Eye size={14} />
                            Preview
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile("image")}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {(formData.image.size / 1024 / 1024).toFixed(2)} MB • {formData.image.type}
                    </div>
                    {uploadedImageUrl && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Uploaded URL:</span> {uploadedImageUrl}
                      </div>
                    )}
                    {!uploadedImageUrl && !imageUploading && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Status:</span> Will be uploaded when selected
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Content & Authors */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-lancet-dark mb-6">Authors</h2>


              {/* Authors Section */}
              <div>
                <h3 className="text-lg font-semibold text-lancet-dark mb-4">Authors</h3>

              {formData.authors.map((author, index) => (
                <div key={index} className="p-4 border border-lancet-border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lancet-dark">Author {index + 1}</h3>
                    {formData.authors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAuthor(index)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-lancet-dark mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={author.name}
                        onChange={(e) => handleAuthorChange(index, "name", e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                          errors[`author_${index}_name`] ? "border-red-500" : "border-lancet-border"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors[`author_${index}_name`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`author_${index}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-lancet-dark mb-2">Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        value={author.email}
                        onChange={(e) => handleAuthorChange(index, "email", e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                          errors[`author_${index}_email`] ? "border-red-500" : "border-lancet-border"
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors[`author_${index}_email`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`author_${index}_email`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-lancet-dark mb-2">Affiliation <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={author.affiliation}
                      onChange={(e) => handleAuthorChange(index, "affiliation", e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                        errors[`author_${index}_affiliation`] ? "border-red-500" : "border-lancet-border"
                      }`}
                      placeholder="University/Institution name"
                    />
                    {errors[`author_${index}_affiliation`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`author_${index}_affiliation`]}</p>
                    )}
                  </div>
                </div>
              ))}

              <button type="button" onClick={addAuthor} className="btn btn-lancet-outline px-4 py-2 text-sm">
                + Add Another Author
              </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-lancet-dark mb-6">Review & Submit</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Please review your submission</p>
                  <p>Make sure all information is accurate before submitting. Click "Submit Research" below to submit your research.</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Step 1: Basic Information */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FileText size={20} />
                      Step 1: Basic Information
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
              <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{formData.title || "Not provided"}</p>
                </div>
              <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Journal</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{formData.journal || "Not selected"}</p>
                      </div>
                      </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Article Type</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{formData.articletype || "Not selected"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Labels</label>
                        <div className="bg-gray-50 p-3 rounded-lg border min-h-[48px]">
                          {formData.keywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {formData.keywords.map((keyword, index) => (
                                <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                                  {keyword}
                                </span>
                    ))}
                  </div>
                          ) : (
                            <p className="text-gray-500">No badge labels added</p>
                )}
              </div>
                </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <div className="bg-gray-50 p-4 rounded-lg border min-h-[120px]">
                      {formData.excerpt ? (
                        <div 
                          className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                          dangerouslySetInnerHTML={{ __html: formData.excerpt }}
                        />
                      ) : (
                        <p className="text-gray-500">No excerpt provided</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge Type</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{formData.badgetype || "Not selected"}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{formData.date || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Journal Code</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">{formData.journalcode || "Not selected"}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      {formData.image ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileImage className="text-emerald-600" size={20} />
                              <div>
                                <p className="font-medium text-gray-900">{formData.image.name}</p>
                                <p className="text-sm text-gray-500">
                                  {(formData.image.size / 1024 / 1024).toFixed(2)} MB • {formData.image.type}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {formData.image.type.startsWith('image/') && (
                                <button
                                  type="button"
                                  onClick={() => setShowImagePreviewModal(true)}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                                >
                                  <Eye size={14} />
                                  Preview
                                </button>
                              )}
                              {uploadedImageUrl ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Uploaded
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  Local
                                </span>
                              )}
                            </div>
                          </div>
                          {uploadedImageUrl && (
                            <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                              <span className="font-medium">Uploaded URL:</span> {uploadedImageUrl}
                            </div>
                          )}
                          {!uploadedImageUrl && (
                            <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                              <span className="font-medium">Status:</span> Local file - will be uploaded with form submission
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">No image uploaded</p>
                      )}
                    </div>
                  </div>
              </div>
              </div>

                {/* Step 2: Authors */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Users size={20} />
                      Step 2: Authors ({formData.authors.length})
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {formData.authors.map((author, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg border">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">Author {index + 1}</h4>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <p className="text-gray-900 bg-white p-3 rounded-lg border">{author.name || "Not provided"}</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <p className="text-gray-900 bg-white p-3 rounded-lg border">{author.email || "Not provided"}</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Affiliation</label>
                            <p className="text-gray-900 bg-white p-3 rounded-lg border">{author.affiliation || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* File Preview Modal */}
          {showFilePreviewModal && formData.manuscript && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                e.preventDefault()
                setShowFilePreviewModal(false)
              }}
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">File Preview</h3>
                  <div className="flex items-center gap-3">
                    <a
                      href={previewUrl}
                      download={formData.manuscript.name}
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 text-sm rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowFilePreviewModal(false)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                          </div>
                        </div>
                <div className="p-6 bg-gray-50 max-h-[70vh] overflow-auto">
                  {formData.manuscript.type.startsWith('image/') ? (
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="File Preview"
                        className="max-w-full h-auto max-h-[60vh] rounded-lg shadow-lg"
                      />
                      </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500 mb-2">Preview not available for this file type</p>
                      <p className="text-sm text-gray-400">
                        File: {formData.manuscript.name} ({(formData.manuscript.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                  </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                      <span className="font-medium">File:</span> {formData.manuscript.name}
                </div>
                <div>
                      <span className="font-medium">Size:</span> {(formData.manuscript.size / 1024 / 1024).toFixed(2)} MB
                </div>
                    <div>
                      <span className="font-medium">Type:</span> {formData.manuscript.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Featured Image Preview Modal */}
          {showImagePreviewModal && formData.image && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                e.preventDefault()
                setShowImagePreviewModal(false)
              }}
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Featured Image Preview</h3>
                  <div className="flex items-center gap-3">
                    <a
                      href={imagePreviewUrl}
                      download={formData.image.name}
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 text-sm rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowImagePreviewModal(false)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 max-h-[70vh] overflow-auto">
                  <div className="flex justify-center">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Featured Image Preview"
                        className="max-w-full h-auto max-h-[60vh] rounded-lg shadow-lg"
                        onLoad={() => console.log('Image loaded successfully')}
                        onError={() => console.log('Image failed to load')}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <FileImage className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500 mb-2">Image preview not available</p>
                        <p className="text-sm text-gray-400">imagePreviewUrl: {imagePreviewUrl || 'null'}</p>
                        <p className="text-sm text-gray-400">formData.image: {formData.image ? 'exists' : 'null'}</p>
                        <p className="text-sm text-gray-400">showImagePreviewModal: {showImagePreviewModal ? 'true' : 'false'}</p>
                        <button
                          onClick={() => {
                            console.log('formData.image type:', typeof formData.image)
                            console.log('formData.image constructor:', formData.image?.constructor?.name)
                            console.log('formData.image instanceof File:', formData.image instanceof File)
                            if (formData.image && formData.image instanceof File) {
                              const url = URL.createObjectURL(formData.image)
                              console.log('Creating new URL:', url)
                              setImagePreviewUrl(url)
                            } else {
                              console.log('formData.image is not a File object:', formData.image)
                            }
                          }}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Retry Image Load
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                      <span className="font-medium">File:</span> {formData.image.name}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {formData.image.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
              Previous
            </button>

            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={handleNextStep} 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                Next
                <ArrowLeft size={20} className="rotate-180" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <Send size={20} />
                Submit Research
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
