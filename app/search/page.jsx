"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleCard from "@/components/article-card"
import { ChevronLeft, ChevronRight, X, Search as SearchIcon } from "lucide-react"
import { getPublishedArticles } from "../../lib/api-utils"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState([])
  const [pagination, setPagination] = useState({})

  const resultsPerPage = 12

  const parseSearchParams = () => {
    const params = {}
    const filters = []

    // Iterate over all search parameters
    searchParams.forEach((value, key) => {
      if (key === 'page' || key === 'limit' || key === 'sortBy' || key === 'sortOrder') {
        params[key] = value
      } else if (key === 'keywords') {
        params[key] = value.split(',')
        filters.push({ label: 'Keywords', value: value.split(',').join(', '), key: 'keywords' })
      } else if (key === 'dateRange') {
        params[key] = value.split(',')
        filters.push({ label: 'Date Range', value: value.split(',').join(' to '), key: 'dateRange' })
      } else if (key === 'title') {
        params[key] = value
        filters.push({ label: 'Title', value: value, key: 'title' })
      } else if (key === 'journal') {
        params[key] = value
        filters.push({ label: 'Journal', value: value, key: 'journal' })
      } else if (key === 'articleType') {
        params[key] = value
        filters.push({ label: 'Article Type', value: value, key: 'articleType' })
      } else if (key === 'badgeType') {
        params[key] = value
        filters.push({ label: 'Badge Type', value: value, key: 'badgeType' })
      } else if (key === 'journalCode') {
        params[key] = value
        filters.push({ label: 'Journal Code', value: value, key: 'journalCode' })
      }
    })
    
    setActiveFilters(filters)
    return params
  }

  const fetchArticles = async (params) => {
    setLoading(true)
    try {
      const response = await getPublishedArticles(params)
      if (response.success) {
        setResults(response.data.articles)
        setPagination(response.data.pagination)
      } else {
        setResults([])
        setPagination({})
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setResults([])
      setPagination({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const params = parseSearchParams()
    fetchArticles(params)
  }, [searchParams])

  const removeFilter = (filterKey) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.delete(filterKey)
    currentParams.set('page', 1) // Reset to first page on filter change
    router.push(`/search?${currentParams.toString()}`)
  }

  const handlePageChange = (newPage) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.set('page', newPage)
    router.push(`/search?${currentParams.toString()}`)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <SearchIcon className="text-emerald-600" size={28} />
              Search Results
            </h1>
            <p className="text-gray-600">
              {pagination.totalArticles || results.length} results found
              {query && (
                <>
                  {" "}for{" "}
                  <span className="font-semibold text-emerald-600">"{query}"</span>
                </>
              )}
            </p>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Active Filters:</h2>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full border border-emerald-200"
                  >
                    <span className="font-semibold">{filter.label}:</span> {filter.value}
                    <button
                      onClick={() => removeFilter(filter.key)}
                      className="text-emerald-600 hover:text-emerald-900 focus:outline-none"
                      aria-label={`Remove ${filter.label} filter`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                <p className="mt-4 text-gray-600">Loading results...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i
                        } else {
                          pageNum = pagination.currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              pagination.currentPage === pageNum
                                ? "bg-emerald-500 text-white"
                                : "border border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                      disabled={!pagination.hasNextPage}
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
                <p className="text-gray-600 text-lg">No results found</p>
                <p className="text-gray-500 mt-2">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
