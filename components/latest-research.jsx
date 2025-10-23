"use client"

import { useState, useEffect } from "react"
import ArticleCard from "./article-card"
import { Search, X } from "lucide-react"
import { getLatestResearchData } from "../lib/research-utils"

export default function LatestResearch() {
  const [selectedJournal, setSelectedJournal] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [allArticles, setAllArticles] = useState([])

  // Load research data on component mount
  useEffect(() => {
    const researchData = getLatestResearchData()
    setAllArticles(researchData)
  }, [])

  const filteredArticles = allArticles.filter((article) => {
    const matchesJournal = selectedJournal === "all" || article.journalCode === selectedJournal
    const matchesType = selectedType === "all" || article.type === selectedType
    const matchesSearch =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.authors.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesJournal && matchesType && matchesSearch
  })

  const handleReset = () => {
    setSelectedJournal("all")
    setSelectedType("all")
    setSearchTerm("")
  }

    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Modern Section Header */}
          <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Research Hub</span>
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
          </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Latest Research
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Explore the latest peer-reviewed research articles from AyushVeda Publications
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-4">
              {/* Search Box */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">Search Articles</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Journal Filter */}
              <div className="filter-group">
                <h4 className="filter-group-title">Journal</h4>
                {[
                  { value: "all", label: "All Journals" },
                  { value: "ayurveda", label: "AyushVeda Ayurveda" },
                  { value: "yoga", label: "AyushVeda Yoga" },
                  { value: "naturopathy", label: "AyushVeda Naturopathy" },
                  { value: "homeopathy", label: "AyushVeda Homeopathy" },
                  { value: "unani", label: "AyushVeda Unani" },
                  { value: "siddha", label: "AyushVeda Siddha" },
                ].map((option) => (
                  <div key={option.value} className="filter-option">
                    <input
                      type="radio"
                      id={`journal-${option.value}`}
                      name="journal"
                      value={option.value}
                      checked={selectedJournal === option.value}
                      onChange={(e) => setSelectedJournal(e.target.value)}
                      className="cursor-pointer"
                    />
                    <label htmlFor={`journal-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Article Type Filter */}
              <div className="filter-group">
                <h4 className="filter-group-title">Article Type</h4>
                {[
                  { value: "all", label: "All Types" },
                  { value: "research", label: "Research" },
                ].map((option) => (
                  <div key={option.value} className="filter-option">
                    <input
                      type="radio"
                      id={`type-${option.value}`}
                      name="type"
                      value={option.value}
                      checked={selectedType === option.value}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="cursor-pointer"
                    />
                    <label htmlFor={`type-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Reset Button */}
              <button onClick={handleReset} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm mt-6">
                Reset Filters
              </button>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {filteredArticles.length > 0 ? (
              <>
                {/* Results Count */}
                <div className="mb-6 text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredArticles.length}</span> of{" "}
                  <span className="font-semibold">{allArticles.length}</span> articles
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </div>

                {/* View More Button */}
                <div className="text-center">
                  <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">View More Research</button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                <Search size={32} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No articles found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms or filters</p>
                <button
                  onClick={handleReset}
                  className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
