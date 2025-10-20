"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Search } from "lucide-react"

export default function AdvancedSearchPage() {
  const [formData, setFormData] = useState({
    allWords: "",
    exactPhrase: "",
    anyWords: "",
    noneWords: "",
    journal: "all",
    articleType: "all",
    dateFrom: "",
    dateTo: "",
    openAccessOnly: false,
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? e.target.checked : value,
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()

    // Combine all search terms into a single query parameter
    let searchQuery = ""
    if (formData.allWords) searchQuery += formData.allWords + " "
    if (formData.exactPhrase) searchQuery += `"${formData.exactPhrase}" `
    if (formData.anyWords) searchQuery += formData.anyWords + " "
    if (formData.noneWords) searchQuery += "-" + formData.noneWords + " "

    if (searchQuery.trim()) params.append("q", searchQuery.trim())
    
    // Add filter parameters
    if (formData.journal !== "all") params.append("journal", formData.journal)
    if (formData.articleType !== "all") params.append("type", formData.articleType)
    if (formData.dateFrom) params.append("from", formData.dateFrom)
    if (formData.dateTo) params.append("to", formData.dateTo)
    if (formData.openAccessOnly) params.append("openAccess", "true")

    window.location.href = `/search?${params.toString()}`
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Advanced Search</h1>
              <p className="text-gray-600">Use advanced search to find exactly what you're looking for</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              {/* All Words */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">All of these words</label>
                <input
                  type="text"
                  name="allWords"
                  value={formData.allWords}
                  onChange={handleChange}
                  placeholder="e.g., cancer treatment therapy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <p className="text-xs text-gray-500 mt-1">Results will contain all of these words</p>
              </div>

              {/* Exact Phrase */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">This exact phrase</label>
                <input
                  type="text"
                  name="exactPhrase"
                  value={formData.exactPhrase}
                  onChange={handleChange}
                  placeholder='e.g., "clinical trial"'
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <p className="text-xs text-gray-500 mt-1">Results will contain this exact phrase</p>
              </div>

              {/* Any Words */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Any of these words</label>
                <input
                  type="text"
                  name="anyWords"
                  value={formData.anyWords}
                  onChange={handleChange}
                  placeholder="e.g., diagnosis OR screening OR detection"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <p className="text-xs text-gray-500 mt-1">Results will contain at least one of these words</p>
              </div>

              {/* None Words */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">None of these words</label>
                <input
                  type="text"
                  name="noneWords"
                  value={formData.noneWords}
                  onChange={handleChange}
                  placeholder="e.g., animal testing"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <p className="text-xs text-gray-500 mt-1">Results will not contain these words</p>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Journal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Journal</label>
                  <select
                    name="journal"
                    value={formData.journal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="all">All Journals</option>
                    <option value="the-lancet">The Lancet</option>
                    <option value="lancet-oncology">Lancet Oncology</option>
                    <option value="lancet-psychiatry">Lancet Psychiatry</option>
                  </select>
                </div>

                {/* Article Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Article Type</label>
                  <select
                    name="articleType"
                    value={formData.articleType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="all">All Types</option>
                    <option value="article">Article</option>
                    <option value="comment">Comment</option>
                    <option value="news">News</option>
                    <option value="review">Review</option>
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">From Date</label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={formData.dateFrom}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">To Date</label>
                  <input
                    type="date"
                    name="dateTo"
                    value={formData.dateTo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Open Access Checkbox */}
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="openAccessOnly"
                    checked={formData.openAccessOnly}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-900">Open Access articles only</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                  <Search size={18} />
                  Search
                </button>
                <button
                  type="reset"
                  onClick={() =>
                    setFormData({
                      allWords: "",
                      exactPhrase: "",
                      anyWords: "",
                      noneWords: "",
                      journal: "all",
                      articleType: "all",
                      dateFrom: "",
                      dateTo: "",
                      openAccessOnly: false,
                    })
                  }
                  className="bg-white border-2 border-emerald-500 text-emerald-500 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-300"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Help Section */}
            <div className="mt-12 bg-gray-100 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Search Tips</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Use quotation marks for exact phrases: "clinical trial"</li>
                <li>• Use OR to search for any of multiple words: diagnosis OR screening</li>
                <li>• Use minus sign to exclude words: cancer -animal</li>
                <li>• Combine filters to narrow down your search results</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
