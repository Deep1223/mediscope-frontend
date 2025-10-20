"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Upload, X, AlertCircle, CheckCircle, ArrowLeft, FileText, Users, FileImage, CheckSquare, Send } from "lucide-react"

export default function SubmitResearchPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [publishingOption, setPublishingOption] = useState(null)
  const [showPublishingOptions, setShowPublishingOptions] = useState(false)

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    journal: "",
    articleType: "",
    keywords: "",

    // Step 2: Authors
    authors: [{ name: "", email: "", affiliation: "", isCorresponding: false }],

    // Step 3: Manuscript
    manuscript: null,
    abstract: "",

    // Step 4: Files
    figures: [],
    tables: [],
    supplementary: null,

    // Step 5: Submission
    conflictOfInterest: "",
    ethicsApproval: false,
    dataAvailability: "",
    agreeTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [uploadProgress, setUploadProgress] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [dataLoaded, setDataLoaded] = useState(false)

  // localStorage key
  const STORAGE_KEY = 'submitresearch'

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData.formData || formData)
        setCurrentStep(parsedData.currentStep || 1)
        setPublishingOption(parsedData.publishingOption || null)
        setDataLoaded(true)
        
        // Show a brief notification that data was loaded
        setTimeout(() => setDataLoaded(false), 3000)
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever formData, currentStep, or publishingOption changes
  useEffect(() => {
    // Create a copy of formData without file objects (files can't be stored in localStorage)
    const formDataForStorage = {
      ...formData,
      manuscript: formData.manuscript ? { name: formData.manuscript.name, size: formData.manuscript.size, type: formData.manuscript.type } : null,
      figures: formData.figures.map(file => ({ name: file.name, size: file.size, type: file.type })),
      tables: formData.tables.map(file => ({ name: file.name, size: file.size, type: file.type })),
      supplementary: formData.supplementary ? { name: formData.supplementary.name, size: formData.supplementary.size, type: formData.supplementary.type } : null
    }

    const dataToSave = {
      formData: formDataForStorage,
      currentStep,
      publishingOption,
      timestamp: new Date().toISOString()
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [formData, currentStep, publishingOption])

  const journals = [
    "MediScope Medicine",
    "MediScope Technology",
    "MediScope Cardiology",
    "MediScope Oncology",
    "MediScope Psychiatry",
    "MediScope Pediatrics",
    "MediScope Global Health",
  ]

  const articleTypes = [
    "Original Research",
    "Review Article",
    "Commentary",
    "Case Report",
    "Letter to the Editor",
    "Editorial",
    "Clinical Trial",
    "Meta-Analysis",
  ]

  const publishingOptions = [
    {
      id: "mediscope-standard",
      title: "MediScope Standard",
      description: "Submit to our peer-reviewed journals",
      icon: "🏆",
      details: "Full editorial support, expert peer review, and global distribution through MediScope Publications",
    },
  ]

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required"
      if (!formData.journal) newErrors.journal = "Journal selection is required"
      if (!formData.articleType) newErrors.articleType = "Article type is required"
      if (!formData.keywords.trim()) newErrors.keywords = "Keywords are required"
    }

    if (step === 2) {
      formData.authors.forEach((author, index) => {
        if (!author.name.trim()) newErrors[`author_${index}_name`] = "Author name is required"
        if (!author.email.trim()) newErrors[`author_${index}_email`] = "Email is required"
        if (!author.affiliation.trim()) newErrors[`author_${index}_affiliation`] = "Affiliation is required"
      })
    }

    if (step === 3) {
      if (!formData.manuscript) newErrors.manuscript = "Manuscript file is required"
      if (!formData.abstract.trim()) newErrors.abstract = "Abstract is required"
      if (formData.abstract.split(" ").length > 250) newErrors.abstract = "Abstract must be under 250 words"
    }

    if (step === 5) {
      if (!formData.conflictOfInterest.trim())
        newErrors.conflictOfInterest = "Conflict of interest statement is required"
      if (!formData.ethicsApproval) newErrors.ethicsApproval = "Ethics approval confirmation is required"
      if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms"
      if (!publishingOption) newErrors.publishingOption = "Please select a publishing option"
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
      authors: [...formData.authors, { name: "", email: "", affiliation: "", isCorresponding: false }],
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
      } else if (fileType === "figures") {
        setFormData({ ...formData, figures: [...formData.figures, file] })
      } else if (fileType === "tables") {
        setFormData({ ...formData, tables: [...formData.tables, file] })
      } else if (fileType === "supplementary") {
        setFormData({ ...formData, supplementary: file })
      }
    })
  }

  const removeFile = (fileType, index) => {
    if (fileType === "figures") {
      setFormData({ ...formData, figures: formData.figures.filter((_, i) => i !== index) })
    } else if (fileType === "tables") {
      setFormData({ ...formData, tables: formData.tables.filter((_, i) => i !== index) })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateStep(5)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Save final submission data to localStorage
    const finalSubmissionData = {
      formData,
      currentStep,
      publishingOption,
      submissionDate: new Date().toISOString(),
      status: 'submitted'
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalSubmissionData))
      console.log('Final submission data saved to localStorage with key:', STORAGE_KEY)
    } catch (error) {
      console.error('Error saving final submission to localStorage:', error)
    }
    
    setSuccessMessage("Submission successful! Your research has been submitted for review and saved to localStorage.")
    setTimeout(() => {
      window.location.href = "/"
    }, 2000)
  }

  // Function to check if there's saved data
  const hasSavedData = () => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    return savedData !== null
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
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-6"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
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
              { step: 3, label: "Manuscript", icon: FileText },
              { step: 4, label: "Files", icon: FileImage },
              { step: 5, label: "Review", icon: CheckSquare }
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
                {index < 4 && (
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
                <p className="text-sm text-emerald-600 mt-1">Redirecting to your dashboard...</p>
              </div>
            </div>
          </div>
        )}

        {/* Auto-save indicator */}
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Your progress is automatically saved and will be preserved after submission
          </p>
        </div>

        {/* Data loaded notification */}
        {dataLoaded && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-center">
            <p className="text-sm font-medium">✓ Previous form data has been restored</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-lancet-dark mb-6">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Manuscript Title *</label>
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
                  <label className="block text-sm font-medium text-lancet-dark mb-2">Select Journal *</label>
                  <select
                    name="journal"
                    value={formData.journal}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                      errors.journal ? "border-red-500" : "border-lancet-border"
                    }`}
                  >
                    <option value="">Choose a journal</option>
                    {journals.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                  {errors.journal && <p className="text-red-500 text-sm mt-1">{errors.journal}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-lancet-dark mb-2">Article Type *</label>
                  <select
                    name="articleType"
                    value={formData.articleType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                      errors.articleType ? "border-red-500" : "border-lancet-border"
                    }`}
                  >
                    <option value="">Choose article type</option>
                    {articleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.articleType && <p className="text-red-500 text-sm mt-1">{errors.articleType}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Keywords (comma-separated) *</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                    errors.keywords ? "border-red-500" : "border-lancet-border"
                  }`}
                  placeholder="e.g., cancer, immunotherapy, clinical trial"
                />
                {errors.keywords && <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Authors */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-lancet-dark mb-6">Authors</h2>

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
                      <label className="block text-sm font-medium text-lancet-dark mb-2">Full Name *</label>
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
                      <label className="block text-sm font-medium text-lancet-dark mb-2">Email *</label>
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
                    <label className="block text-sm font-medium text-lancet-dark mb-2">Affiliation *</label>
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

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={author.isCorresponding}
                      onChange={(e) => handleAuthorChange(index, "isCorresponding", e.target.checked)}
                      className="w-4 h-4 rounded border-lancet-border"
                    />
                    <span className="text-sm text-gray-600">Corresponding author</span>
                  </label>
                </div>
              ))}

              <button type="button" onClick={addAuthor} className="btn btn-lancet-outline px-4 py-2 text-sm">
                + Add Another Author
              </button>
            </div>
          )}

          {/* Step 3: Manuscript */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-lancet-dark mb-6">Manuscript</h2>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Abstract (max 250 words) *</label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  rows="6"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                    errors.abstract ? "border-red-500" : "border-lancet-border"
                  }`}
                  placeholder="Enter your abstract here..."
                />
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">{formData.abstract.split(" ").filter((w) => w).length} words</p>
                  {errors.abstract && <p className="text-red-500 text-sm">{errors.abstract}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">
                  Upload Manuscript (PDF or DOCX) *
                </label>
                <div className="border-2 border-dashed border-lancet-border rounded-lg p-8 text-center hover:border-lancet-blue transition cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => handleFileUpload(e, "manuscript")}
                    className="hidden"
                    id="manuscript-upload"
                  />
                  <label htmlFor="manuscript-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-lancet-blue mx-auto mb-2" />
                    <p className="text-lancet-dark font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm">PDF or DOCX (max 50 MB)</p>
                  </label>
                </div>
                {formData.manuscript && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <span className="text-green-700 text-sm">{formData.manuscript.name}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, manuscript: null })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                {errors.manuscript && <p className="text-red-500 text-sm mt-2">{errors.manuscript}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Supporting Files */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-lancet-dark mb-6">Supporting Files</h2>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Figures (Optional)</label>
                <div className="border-2 border-dashed border-lancet-border rounded-lg p-8 text-center hover:border-lancet-blue transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.tiff,.gif"
                    onChange={(e) => handleFileUpload(e, "figures")}
                    className="hidden"
                    id="figures-upload"
                  />
                  <label htmlFor="figures-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-lancet-blue mx-auto mb-2" />
                    <p className="text-lancet-dark font-medium">Click to upload figures</p>
                    <p className="text-gray-500 text-sm">JPG, PNG, TIFF (max 50 MB total)</p>
                  </label>
                </div>
                {formData.figures.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.figures.map((file, index) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
                      >
                        <span className="text-blue-700 text-sm">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile("figures", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">Tables (Optional)</label>
                <div className="border-2 border-dashed border-lancet-border rounded-lg p-8 text-center hover:border-lancet-blue transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => handleFileUpload(e, "tables")}
                    className="hidden"
                    id="tables-upload"
                  />
                  <label htmlFor="tables-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-lancet-blue mx-auto mb-2" />
                    <p className="text-lancet-dark font-medium">Click to upload tables</p>
                    <p className="text-gray-500 text-sm">XLSX, XLS, CSV (max 50 MB total)</p>
                  </label>
                </div>
                {formData.tables.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.tables.map((file, index) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
                      >
                        <span className="text-blue-700 text-sm">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile("tables", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-lancet-dark mb-2">
                  Supplementary Materials (Optional)
                </label>
                <div className="border-2 border-dashed border-lancet-border rounded-lg p-8 text-center hover:border-lancet-blue transition cursor-pointer">
                  <input
                    type="file"
                    accept=".zip,.rar,.7z"
                    onChange={(e) => handleFileUpload(e, "supplementary")}
                    className="hidden"
                    id="supplementary-upload"
                  />
                  <label htmlFor="supplementary-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-lancet-blue mx-auto mb-2" />
                    <p className="text-lancet-dark font-medium">Click to upload supplementary files</p>
                    <p className="text-gray-500 text-sm">ZIP, RAR, 7Z (max 100 MB)</p>
                  </label>
                </div>
                {formData.supplementary && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <span className="text-green-700 text-sm">{formData.supplementary.name}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, supplementary: null })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-lancet-dark mb-6">Review & Submit</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Please review your submission</p>
                  <p>Make sure all information is accurate before submitting.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lancet-dark mb-2">Manuscript Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Title:</span> {formData.title}
                    </p>
                    <p>
                      <span className="font-medium">Journal:</span> {formData.journal}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {formData.articleType}
                    </p>
                    <p>
                      <span className="font-medium">Authors:</span> {formData.authors.length}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lancet-dark mb-4">Select Publishing Option *</h3>

                  <div className="space-y-3">
                    {publishingOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                          publishingOption === option.id
                            ? "border-lancet-blue bg-blue-50"
                            : "border-lancet-border hover:border-lancet-blue"
                        }`}
                        onClick={() => {
                          setPublishingOption(option.id)
                          if (errors.publishingOption) {
                            setErrors({ ...errors, publishingOption: "" })
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">{option.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lancet-dark">{option.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                            <p className="text-xs text-gray-500">{option.details}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${
                              publishingOption === option.id
                                ? "border-lancet-blue bg-lancet-blue"
                                : "border-lancet-border"
                            }`}
                          >
                            {publishingOption === option.id && <CheckCircle size={20} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.publishingOption && <p className="text-red-500 text-sm mt-2">{errors.publishingOption}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-lancet-dark mb-2">
                    Conflict of Interest Statement *
                  </label>
                  <textarea
                    name="conflictOfInterest"
                    value={formData.conflictOfInterest}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition ${
                      errors.conflictOfInterest ? "border-red-500" : "border-lancet-border"
                    }`}
                    placeholder="Declare any conflicts of interest..."
                  />
                  {errors.conflictOfInterest && (
                    <p className="text-red-500 text-sm mt-1">{errors.conflictOfInterest}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-lancet-dark mb-2">Data Availability Statement</label>
                  <textarea
                    name="dataAvailability"
                    value={formData.dataAvailability}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-lancet-border rounded-lg focus:outline-none focus:ring-2 focus:ring-lancet-blue/50 transition"
                    placeholder="Describe how data can be accessed..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ethicsApproval}
                      onChange={(e) => setFormData({ ...formData, ethicsApproval: e.target.checked })}
                      className="w-4 h-4 rounded border-lancet-border mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that this research has received appropriate ethics approval and all participants gave
                      informed consent *
                    </span>
                  </label>
                  {errors.ethicsApproval && <p className="text-red-500 text-sm">{errors.ethicsApproval}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 rounded border-lancet-border mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the submission terms and conditions and confirm this is original work *
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}
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

            {currentStep < 5 ? (
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
                type="submit" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <Send size={20} />
                Submit Manuscript
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
