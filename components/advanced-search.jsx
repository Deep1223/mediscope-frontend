"use client"

import { useState } from "react"
import {
  Search,
  X,
  Calendar,
  Tag,
  FileText,
  BookOpen,
  Code,
  Award
} from "lucide-react"
import TagPicker from "./ui/tag-picker"

export default function AdvancedSearch() {
  const [filters, setFilters] = useState({
    title: "",
    journal: "",
    articleType: "",
    keywords: [],
    badgeType: "",
    dateRange: [],
    journalCode: ""
  })
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const filterOptions = {
    journals: [
      { id: "AyushVeda Ayurveda", name: "AyushVeda Ayurveda" },
      { id: "AyushVeda Yoga", name: "AyushVeda Yoga" },
      { id: "AyushVeda Naturopathy", name: "AyushVeda Naturopathy" },
      { id: "AyushVeda Homeopathy", name: "AyushVeda Homeopathy" },
      { id: "AyushVeda Unani", name: "AyushVeda Unani" },
      { id: "AyushVeda Siddha", name: "AyushVeda Siddha" },
      { id: "AyushVeda Global Health", name: "AyushVeda Global Health" }
    ],
    articleTypes: [
      { id: "Original Research", name: "Original Research" },
      { id: "Review Article", name: "Review Article" },
      { id: "Commentary", name: "Commentary" },
      { id: "Case Report", name: "Case Report" },
      { id: "Letter to the Editor", name: "Letter to the Editor" },
      { id: "Editorial", name: "Editorial" },
      { id: "Clinical Trial", name: "Clinical Trial" },
      { id: "Meta-Analysis", name: "Meta-Analysis" }
    ],
    journalCodes: [
      { id: "Technology", name: "Technology" },
      { id: "Cardiology", name: "Cardiology" },
      { id: "Medicine", name: "Medicine" },
      { id: "Pediatrics", name: "Pediatrics" },
      { id: "Oncology", name: "Oncology" },
      { id: "Psychiatry", name: "Psychiatry" },
      { id: "Ayurveda", name: "Ayurveda" },
      { id: "Yoga", name: "Yoga" },
      { id: "Naturopathy", name: "Naturopathy" },
      { id: "Homeopathy", name: "Homeopathy" },
      { id: "Unani", name: "Unani" },
      { id: "Siddha", name: "Siddha" },
      { id: "Global Health", name: "Global Health" }
    ],
    badgeTypes: [
      { id: "Research", name: "Research" },
      { id: "Open Access", name: "Open Access" },
      { id: "Comment", name: "Comment" },
      { id: "News", name: "News" },
      { id: "Review", name: "Review" }
    ]
  }

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleKeywordsChange = (newKeywords) => {
    setFilters((prev) => ({ ...prev, keywords: newKeywords }))
  }

  const handleDateRangeChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      dateRange:
        field === "startDate"
          ? [value, prev.dateRange[1] || ""]
          : [prev.dateRange[0] || "", value]
    }))
  }

  const clearFilters = () => {
    setFilters({
      title: "",
      journal: "",
      articleType: "",
      keywords: [],
      badgeType: "",
      dateRange: [],
      journalCode: ""
    })
    setResults([])
    setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 })
    setError(null)
  }

  const hasActiveFilters = () => {
    return (
      filters.title ||
      filters.journal ||
      filters.articleType ||
      filters.keywords.length > 0 ||
      filters.badgeType ||
      filters.dateRange.some((date) => date) ||
      filters.journalCode
    )
  }

  const fetchFilteredResults = async (page = 1, limit = 10) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters.title) params.append("title", filters.title)
      if (filters.journal) params.append("journal", filters.journal)
      if (filters.articleType) params.append("articleType", filters.articleType)
      if (filters.keywords.length > 0)
        params.append("keywords", filters.keywords.join(","))
      if (filters.badgeType) params.append("badgeType", filters.badgeType)
      if (filters.journalCode) params.append("journalCode", filters.journalCode)
      if (filters.dateRange[0] && filters.dateRange[1]) {
        params.append("date", JSON.stringify(filters.dateRange))
      }

      params.append("page", page)
      params.append("limit", limit)

      const res = await fetch(
        `https://brockersbackend.finnovationz.com/api/article/public/filters?${params.toString()}`
      )
      const data = await res.json()

      if (data.success) {
        // ✅ match backend response structure
        setResults(data.data.articles || [])
        setPagination(data.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0
        })
      } else {
        setResults([])
        setError(data.message || "Error fetching results")
      }
    } catch (err) {
      console.error("❌ Error fetching results:", err)
      setResults([])
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchFilteredResults()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* Search Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="text-emerald-600" size={24} />
          Search Articles
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Filters Section */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                Title
              </label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Filter by title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Journal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-600" />
                Journal
              </label>
              <select
                value={filters.journal}
                onChange={(e) => handleInputChange("journal", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Journals</option>
                {filterOptions.journals.map((journal) => (
                  <option key={journal.id} value={journal.id}>
                    {journal.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Article Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                Article Type
              </label>
              <select
                value={filters.articleType}
                onChange={(e) => handleInputChange("articleType", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Types</option>
                {filterOptions.articleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Badge Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Award size={16} className="text-emerald-600" />
                Badge Type
              </label>
              <select
                value={filters.badgeType}
                onChange={(e) => handleInputChange("badgeType", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Badge Types</option>
                {filterOptions.badgeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Journal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Code size={16} className="text-emerald-600" />
                Journal Code
              </label>
              <select
                value={filters.journalCode}
                onChange={(e) => handleInputChange("journalCode", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Codes</option>
                {filterOptions.journalCodes.map((code) => (
                  <option key={code.id} value={code.id}>
                    {code.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag size={16} className="text-emerald-600" />
              Keywords
            </label>
            <TagPicker
              tags={filters.keywords}
              onTagsChange={handleKeywordsChange}
              placeholder="Add keywords..."
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-600" />
              Publication Date Range
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                value={filters.dateRange[0] || ""}
                onChange={(e) =>
                  handleDateRangeChange("startDate", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                value={filters.dateRange[1] || ""}
                onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          {hasActiveFilters() && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <X size={16} /> Clear Filters
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search size={16} /> Search Articles
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {results.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">
              Showing {results.length} of {pagination.totalItems} articles
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {results.map((article) => (
                <div
                  key={article._id}
                  className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg text-gray-900">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {article.journal} | {article.articleType}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
