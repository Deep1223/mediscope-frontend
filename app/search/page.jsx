"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleCard from "@/components/article-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    date: "all",
    journal: searchParams.get("journal") || "all",
    openAccess: searchParams.get("openAccess") === "true",
  })

  const resultsPerPage = 12

  useEffect(() => {
    // Simulate search results - in a real app, this would call an API
    setLoading(true)
    setTimeout(() => {
      const mockResults = Array.from({ length: 48 }, (_, i) => ({
        id: i + 1,
        title: `${query} - Research Article ${i + 1}`,
        excerpt: `This is a research article related to "${query}". It contains important findings and insights about the topic.`,
        image: `/placeholder.svg?height=200&width=300&query=medical research`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        type: ["Article", "Comment", "News", "Review"][Math.floor(Math.random() * 4)],
        journal: ["The Lancet", "Lancet Oncology", "Lancet Psychiatry"][Math.floor(Math.random() * 3)],
        openAccess: Math.random() > 0.7,
      }))
      setResults(mockResults)
      setLoading(false)
    }, 500)
  }, [query])

  const filteredResults = results.filter((result) => {
    if (filters.type !== "all" && result.type !== filters.type) return false
    if (filters.journal !== "all" && result.journal !== filters.journal) return false
    if (filters.openAccess && !result.openAccess) return false
    return true
  })

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const paginatedResults = filteredResults.slice(startIndex, startIndex + resultsPerPage)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
            <p className="text-gray-600">
              {filteredResults.length} results found for{" "}
              <span className="font-semibold text-emerald-600">"{query}"</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="filter-sidebar sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>

                {/* Type Filter */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Article Type</h4>
                  {["all", "Article", "Comment", "News", "Review"].map((type) => (
                    <div key={type} className="filter-option">
                      <input
                        type="radio"
                        id={`type-${type}`}
                        name="type"
                        value={type}
                        checked={filters.type === type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      />
                      <label htmlFor={`type-${type}`}>{type === "all" ? "All Types" : type}</label>
                    </div>
                  ))}
                </div>

                {/* Journal Filter */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Journal</h4>
                  {["all", "The Lancet", "Lancet Oncology", "Lancet Psychiatry"].map((journal) => (
                    <div key={journal} className="filter-option">
                      <input
                        type="radio"
                        id={`journal-${journal}`}
                        name="journal"
                        value={journal}
                        checked={filters.journal === journal}
                        onChange={(e) => setFilters({ ...filters, journal: e.target.value })}
                      />
                      <label htmlFor={`journal-${journal}`}>{journal === "all" ? "All Journals" : journal}</label>
                    </div>
                  ))}
                </div>

                {/* Date Filter */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Date Range</h4>
                  {["all", "week", "month", "year"].map((date) => (
                    <div key={date} className="filter-option">
                      <input
                        type="radio"
                        id={`date-${date}`}
                        name="date"
                        value={date}
                        checked={filters.date === date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                      />
                      <label htmlFor={`date-${date}`}>
                        {date === "all"
                          ? "All Time"
                          : date === "week"
                            ? "Past Week"
                            : date === "month"
                              ? "Past Month"
                              : "Past Year"}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Open Access Filter */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Access Type</h4>
                  <div className="filter-option">
                    <input
                      type="checkbox"
                      id="openAccess"
                      checked={filters.openAccess}
                      onChange={(e) => setFilters({ ...filters, openAccess: e.target.checked })}
                    />
                    <label htmlFor="openAccess">Open Access Only</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                  <p className="mt-4 text-gray-600">Loading results...</p>
                </div>
              ) : paginatedResults.length > 0 ? (
                <>
                  <div className="article-grid">
                    {paginatedResults.map((article) => (
                      <ArticleCard key={article.id} {...article} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-emerald-500 text-white"
                                : "border border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No results found for "{query}"</p>
                  <p className="text-gray-500 mt-2">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
