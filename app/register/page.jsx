"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Check, ArrowLeft, User, Mail, Lock, Building, Stethoscope, Users } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
    specialty: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const specialties = [
    "General Medicine",
    "Surgery",
    "Cardiology",
    "Oncology",
    "Neurology",
    "Psychiatry",
    "Pediatrics",
    "Obstetrics & Gynecology",
    "Infectious Diseases",
    "Public Health",
    "Digital Health",
    "Medical Technology",
    "Other",
  ]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.institution.trim()) newErrors.institution = "Institution is required"
    if (!formData.specialty) newErrors.specialty = "Specialty is required"
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms"
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    if (errors[name]) setErrors({ ...errors, [name]: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage("Registration successful! Redirecting to login...")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Info */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Join MediScope</h2>
                <p className="text-white/90 text-sm">Medical Research Platform</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={16} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Publish Your Research</h3>
                  <p className="text-white/80 text-sm">Share your medical research with the global healthcare community</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Connect with Experts</h3>
                  <p className="text-white/80 text-sm">Network with leading medical professionals and researchers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building size={16} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Access Resources</h3>
                  <p className="text-white/80 text-sm">Get access to exclusive research tools and publication resources</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <p className="text-sm text-white/90">
                "MediScope has revolutionized how we share and access medical research. The platform makes it easy to connect with peers and publish groundbreaking work."
              </p>
              <p className="text-xs text-white/70 mt-2">- Dr. Sarah Chen, Stanford Medical School</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join our community of medical researchers and authors</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                  {successMessage}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800 mb-3">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white ${
                        errors.firstName ? "border-red-500" : "border-gray-200 focus:border-emerald-500"
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                    {errors.firstName}
                  </p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-800 mb-3">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white ${
                        errors.lastName ? "border-red-500" : "border-gray-200 focus:border-emerald-500"
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                    {errors.lastName}
                  </p>}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white ${
                      errors.email ? "border-red-500" : "border-gray-200 focus:border-emerald-500"
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                  {errors.email}
                </p>}
              </div>

              {/* Institution Field */}
              <div>
                <label htmlFor="institution" className="block text-sm font-semibold text-gray-800 mb-3">
                  Institution / Organization
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Building size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white ${
                      errors.institution ? "border-red-500" : "border-gray-200 focus:border-emerald-500"
                    }`}
                    placeholder="Your institution name"
                  />
                </div>
                {errors.institution && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                  {errors.institution}
                </p>}
              </div>

              {/* Specialty Field */}
              <div>
                <label htmlFor="specialty" className="block text-sm font-semibold text-gray-800 mb-3">
                  Medical Specialty
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Stethoscope size={18} className="text-gray-400" />
                  </div>
                  <select
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white ${
                      errors.specialty ? "border-red-500" : "border-gray-200 focus:border-emerald-500"
                    }`}
                  >
                    <option value="">Select your specialty</option>
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.specialty && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                  {errors.specialty}
                </p>}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white ${
                        errors.password ? "border-red-500" : "border-gray-200 focus:border-emerald-500"
                      }`}
                      placeholder="Min 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                    {errors.password}
                  </p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-3">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-200 focus:border-emerald-500"
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors duration-300"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                    {errors.confirmPassword}
                  </p>}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-1"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeTerms && <p className="text-red-500 text-sm flex items-center gap-1">
                <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                {errors.agreeTerms}
              </p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
