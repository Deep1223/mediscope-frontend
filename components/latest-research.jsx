"use client"

import { useState, useEffect } from "react"
import ArticleCard from "./article-card"
import { Search, X, Loader2 } from "lucide-react"

export default function LatestResearch() {
  const [selectedJournal, setSelectedJournal] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [allArticles, setAllArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAllArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('https://brockersbackend.finnovationz.com/api/article/public/articles?limit=50&sortBy=date&sortOrder=desc')
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
          journalCode: article.journalcode,
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
          entryTime: article.recordinfo?.entryTime || article.date
        }))
        setAllArticles(transformed)
        setFilteredArticles(transformed) // Initialize filtered articles
      } else {
        setAllArticles([])
        setFilteredArticles([])
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
      setAllArticles([])
      setFilteredArticles([])
    } finally {
      setLoading(false)
    }
  }

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Frontend filtering function
  const filterArticles = () => {
    let filtered = [...allArticles]

    // Filter by search term (title and authors)
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(article => {
        const titleMatch = article.title && typeof article.title === 'string' 
          ? article.title.toLowerCase().includes(searchLower) 
          : false
        const authorMatch = article.authors?.some(author => {
          // Handle different author data types
          if (typeof author === 'string' && author.trim()) {
            return author.toLowerCase().includes(searchLower)
          } else if (typeof author === 'object' && author && author.name && typeof author.name === 'string') {
            return author.name.toLowerCase().includes(searchLower)
          } else if (typeof author === 'object' && author && typeof author === 'string') {
            return author.toLowerCase().includes(searchLower)
          }
          return false
        })
        return titleMatch || authorMatch
      })
    }

    // Filter by journal
    if (selectedJournal !== "all") {
      filtered = filtered.filter(article => article.journal === selectedJournal)
    }

    // Filter by article type
    if (selectedType !== "all") {
      filtered = filtered.filter(article => article.articletype === selectedType)
    }

    setFilteredArticles(filtered)
  }

  // Initial load: fetch all articles
  useEffect(() => {
    fetchAllArticles()
  }, [])

  // When filters/search change, apply frontend filtering
  useEffect(() => {
    filterArticles()
  }, [selectedJournal, selectedType, debouncedSearchTerm, allArticles])

  const handleReset = () => {
    setSelectedJournal("all")
    setSelectedType("all")
    setSearchTerm("")
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
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
              <div className="filter-group mb-4">
                <h4 className="filter-group-title font-semibold mb-2">Journal</h4>
                {[
                  { value: "all", label: "All Journals" },
                  { value: "AyushVeda Ayurveda", label: "AyushVeda Ayurveda" },
                  { value: "AyushVeda Yoga", label: "AyushVeda Yoga" },
                  { value: "AyushVeda Naturopathy", label: "AyushVeda Naturopathy" },
                  { value: "AyushVeda Homeopathy", label: "AyushVeda Homeopathy" },
                  { value: "AyushVeda Unani", label: "AyushVeda Unani" },
                  { value: "AyushVeda Siddha", label: "AyushVeda Siddha" },
                  { value: "AyushVeda Global Health", label: "AyushVeda Global Health" },
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
                    <label htmlFor={`journal-${option.value}`} className="cursor-pointer ml-2">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Article Type Filter */}
              <div className="filter-group mb-4">
                <h4 className="filter-group-title font-semibold mb-2">Article Type</h4>
                {[
                  { value: "all", label: "All Types" },
                  { value: "Original Research", label: "Original Research" },
                  { value: "Review Article", label: "Review Article" },
                  { value: "Commentary", label: "Commentary" },
                  { value: "Case Report", label: "Case Report" },
                  { value: "Letter to the Editor", label: "Letter to the Editor" },
                  { value: "Editorial", label: "Editorial" },
                  { value: "Clinical Trial", label: "Clinical Trial" },
                  { value: "Meta-Analysis", label: "Meta-Analysis" },
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
                    <label htmlFor={`type-${option.value}`} className="cursor-pointer ml-2">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm mt-6"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                <Loader2 size={32} className="mx-auto text-emerald-500 mb-4 animate-spin" />
                <p className="text-gray-600 font-medium">Loading latest research...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                <Search size={32} className="mx-auto text-red-400 mb-4" />
                <p className="text-red-600 font-medium">Error loading articles</p>
                <p className="text-gray-500 text-sm mt-2">{error}</p>
                <button
                  onClick={() => {
                    if (selectedJournal === "all" && selectedType === "all" && searchTerm === "") {
                      fetchAllArticles()
                    } else {
                      fetchFilteredArticles()
                    }
                  }}
                  className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-xl font-semibold transition-colors hover:bg-emerald-600"
                >
                  Try Again
                </button>
              </div>
            ) : filteredArticles?.filter(article => article.status === '1' || article.status === 1)?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                {filteredArticles?.filter(article => article.status === '1' || article.status === 1)?.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                <Search size={32} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">No articles found</p>
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
