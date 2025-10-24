"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleCard from "@/components/article-card"
import { ChevronLeft, ChevronRight, X, Search as SearchIcon } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [allArticles, setAllArticles] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
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

  // Fetch all articles once
  const fetchAllArticles = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://brockersbackend.finnovationz.com/api/article/public/articles?limit=100&sortBy=date&sortOrder=desc')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      if (data.success && data.data?.articles) {
        const transformed = data.data.articles.map(article => ({
          id: article._id,
          _id: article._id,
          title: article.title,
          excerpt: article.excerpt,
          image: article.image || "/placeholder.jpg",
          badge: article.keywords?.[0]?.toUpperCase() || "RESEARCH",
          badgeType: article.badgeType || article.badgetype || "research",
          journal: article.journal,
          journalCode: article.journalCode || article.journalcode,
          keywords: Array.isArray(article.keywords) 
            ? article.keywords 
            : typeof article.keywords === "string" 
            ? article.keywords.split(",").map(k => k.trim()) 
            : [],
          authors: Array.isArray(article.authors)
            ? article.authors
            : typeof article.authors === "string"
            ? article.authors.split(",").map(a => a.trim())
            : [],
          date: new Date(article.date || article.recordinfo?.entryTime).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
          }),
          link: `/article/${article._id}`,
          type: "research",
          articletype: article.articletype || "Original Research",
          status: article.status,
          entryTime: article.recordinfo?.entryTime || article.date,
          date: article.date
        }))
        setAllArticles(transformed)
      } else {
        setAllArticles([])
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setAllArticles([])
    } finally {
      setLoading(false)
    }
  }

  // Frontend filtering function
  const filterArticles = () => {
    let filtered = [...allArticles]

    // Filter by search query (title and authors)
    if (query) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(article => {
        const titleMatch = article.title && typeof article.title === 'string' 
          ? article.title.toLowerCase().includes(searchLower) 
          : false
        const authorMatch = article.authors?.some(author => {
          if (typeof author === 'string' && author.trim()) {
            return author.toLowerCase().includes(searchLower)
          } else if (typeof author === 'object' && author && author.name && typeof author.name === 'string') {
            return author.name.toLowerCase().includes(searchLower)
          }
          return false
        })
        return titleMatch || authorMatch
      })
    }

    // Apply additional filters from URL params
    const params = parseSearchParams()
    
    if (params.title) {
      const titleLower = params.title.toLowerCase()
      filtered = filtered.filter(article => 
        article.title && article.title.toLowerCase().includes(titleLower)
      )
    }

    if (params.journal) {
      filtered = filtered.filter(article => article.journal === params.journal)
    }

    if (params.articleType) {
      filtered = filtered.filter(article => article.articletype === params.articleType)
    }

    if (params.keywords && params.keywords.length > 0) {
      filtered = filtered.filter(article => {
        if (!article.keywords || article.keywords.length === 0) return false
        return params.keywords.some(keyword => {
          const keywordLower = keyword.toLowerCase().trim()
          return article.keywords.some(articleKeyword => {
            if (typeof articleKeyword === 'string') {
              return articleKeyword.toLowerCase().includes(keywordLower)
            }
            return false
          })
        })
      })
    }

    if (params.badgeType) {
      filtered = filtered.filter(article => 
        article.badgeType?.toLowerCase() === params.badgeType.toLowerCase()
      )
    }

    if (params.journalCode) {
      filtered = filtered.filter(article => 
        article.journalCode?.toLowerCase() === params.journalCode.toLowerCase()
      )
    }

    if (params.dateRange && params.dateRange.length === 2) {
      const [startDate, endDate] = params.dateRange
      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        filtered = filtered.filter(article => {
          const articleDate = new Date(article.entryTime || article.date)
          return articleDate >= start && articleDate <= end
        })
      }
    }

    // Filter by status (only published articles)
    filtered = filtered.filter(article => article.status === '1' || article.status === 1)

    setFilteredResults(filtered)
    
    // Update pagination
    const totalPages = Math.ceil(filtered.length / resultsPerPage)
    setPagination({
      currentPage: 1,
      totalPages: totalPages,
      totalArticles: filtered.length,
      hasNextPage: totalPages > 1,
      hasPrevPage: false,
      limit: resultsPerPage
    })
  }

  // Initial load: fetch all articles
  useEffect(() => {
    fetchAllArticles()
  }, [])

  // When articles are loaded or search params change, apply filtering
  useEffect(() => {
    if (allArticles.length > 0) {
      filterArticles()
    }
  }, [allArticles, searchParams])

  const removeFilter = (filterKey) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.delete(filterKey)
    currentParams.set('page', 1) // Reset to first page on filter change
    router.push(`/search?${currentParams.toString()}`)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Get paginated results
  const getPaginatedResults = () => {
    const startIndex = (currentPage - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    return filteredResults.slice(startIndex, endIndex)
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
              {filteredResults.length} results found
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
            ) : filteredResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getPaginatedResults().map((article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
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
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              currentPage === pageNum
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
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={currentPage >= pagination.totalPages}
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
