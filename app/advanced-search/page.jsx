"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdvancedSearch from "../../components/advanced-search"

export default function AdvancedSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
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
                Advanced Article Search
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search through our comprehensive database of published research articles with advanced filtering options
            </p>
          </div>
        </div>

        {/* Search Component */}
        <div className="mb-8">
          <AdvancedSearch />
        </div>
      </div>
    </div>
  )
}