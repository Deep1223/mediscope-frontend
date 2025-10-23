"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, X, Calendar, Tag, FileText, BookOpen, Code, Award } from "lucide-react"
import TagPicker from "./ui/tag-picker"
import { getFilterOptions } from "../lib/api-utils"

export default function AdvancedSearch() {
    const router = useRouter()
    const [filters, setFilters] = useState({
        title: "",
        journal: "",
        articleType: "",
        keywords: [],
        badgeType: "",
        dateRange: [],
        journalCode: ""
    })

    const [filterOptions, setFilterOptions] = useState({
        journals: [],
        articleTypes: [],
        journalCodes: [],
        badgeTypes: []
    })

    const [isLoading, setIsLoading] = useState(false)

    // Load filter options on component mount
    useEffect(() => {
        loadFilterOptions()
    }, [])

  const loadFilterOptions = async () => {
    try {
      const response = await getFilterOptions()
      if (response.success) {
        setFilterOptions({
          journals: response.data.journals || [],
          articleTypes: response.data.articleTypes || [],
          journalCodes: response.data.journalCodes || [],
          badgeTypes: response.data.badgeTypes || []
        })
      }
    } catch (error) {
      console.error('Error loading filter options:', error)
      // Ensure filter options are initialized even if API fails
      setFilterOptions({
        journals: [],
        articleTypes: [],
        journalCodes: [],
        badgeTypes: []
      })
    }
  }

    const handleInputChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleKeywordsChange = (newKeywords) => {
        setFilters(prev => ({
            ...prev,
            keywords: newKeywords
        }))
    }

    const handleDateRangeChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            dateRange: field === 'startDate'
                ? [value, prev.dateRange[1] || '']
                : [prev.dateRange[0] || '', value]
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
    }

    const hasActiveFilters = () => {
        return (
            filters.title ||
            filters.journal ||
            filters.articleType ||
            filters.keywords.length > 0 ||
            filters.badgeType ||
            filters.dateRange.some(date => date) ||
            filters.journalCode
        )
    }

    const performSearch = () => {
        setIsLoading(true)

        // Build query parameters
        const queryParams = new URLSearchParams()

        if (filters.title) queryParams.append('title', filters.title)
        if (filters.journal) queryParams.append('journal', filters.journal)
        if (filters.articleType) queryParams.append('articleType', filters.articleType)
        if (filters.keywords.length > 0) queryParams.append('keywords', filters.keywords.join(','))
        if (filters.badgeType) queryParams.append('badgeType', filters.badgeType)
        if (filters.dateRange[0] && filters.dateRange[1]) {
            queryParams.append('dateRange', filters.dateRange.join(','))
        }
        if (filters.journalCode) queryParams.append('journalCode', filters.journalCode)

        // Redirect to search page with filters
        const searchUrl = `/search?${queryParams.toString()}`
        router.push(searchUrl)

        setIsLoading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        performSearch()
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
                {/* Advanced Filters */}
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Title Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FileText size={16} className="text-emerald-600" />
                                Title
                            </label>
                            <input
                                type="text"
                                value={filters.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Filter by title..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>

                        {/* Journal Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <BookOpen size={16} className="text-emerald-600" />
                                Journal
                            </label>
                            <select
                                value={filters.journal}
                                onChange={(e) => handleInputChange('journal', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="">All Journals</option>
                                {
                                    filterOptions.journals?.length > 0 && (
                                        filterOptions.journals.map((journal) => (
                                            <option key={journal} value={journal}>
                                                {journal}
                                            </option>
                                        ))
                                    )
                                }
                            </select>
                        </div>

                        {/* Article Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FileText size={16} className="text-emerald-600" />
                                Article Type
                            </label>
                            <select
                                value={filters.articleType}
                                onChange={(e) => handleInputChange('articleType', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                {filterOptions.articleTypes?.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )) || []}
                            </select>
                        </div>

                        {/* Badge Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Award size={16} className="text-emerald-600" />
                                Badge Type
                            </label>
                            <select
                                value={filters.badgeType}
                                onChange={(e) => handleInputChange('badgeType', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="">All Badge Types</option>
                                {filterOptions.badgeTypes?.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                )) || []}
                            </select>
                        </div>

                        {/* Journal Code Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Code size={16} className="text-emerald-600" />
                                Journal Code
                            </label>
                            <select
                                value={filters.journalCode}
                                onChange={(e) => handleInputChange('journalCode', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="">All Codes</option>
                                {filterOptions.journalCodes?.map((code) => (
                                    <option key={code} value={code}>
                                        {code}
                                    </option>
                                )) || []}
                            </select>
                        </div>
                    </div>

                    {/* Keywords Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Tag size={16} className="text-emerald-600" />
                            Keywords
                        </label>
                        <TagPicker
                            tags={filters.keywords}
                            onTagsChange={handleKeywordsChange}
                            placeholder="Add keywords to filter by..."
                            maxTags={10}
                        />
                    </div>

                    {/* Date Range Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-emerald-600" />
                            Publication Date Range
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={filters.dateRange[0] || ''}
                                    onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={filters.dateRange[1] || ''}
                                    onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        {hasActiveFilters() && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <X size={16} />
                                Clear Filters
                            </button>
                        )}
                        <span className="text-sm text-gray-500">
                            {hasActiveFilters() ? 'Filters applied' : 'No filters applied'}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search size={16} />
                                Search Articles
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
