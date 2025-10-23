"use client"

import AdvancedSearch from "../../components/advanced-search"

export default function AdvancedSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Advanced Article Search
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search through our comprehensive database of published research articles with advanced filtering options
          </p>
        </div>

        {/* Search Component */}
        <div className="mb-8">
          <AdvancedSearch />
        </div>
      </div>
    </div>
  )
}