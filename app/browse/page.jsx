"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleCard from "@/components/article-card"
import { Grid, List } from "lucide-react"
import { getLatestResearchData } from "../../lib/research-utils"

export default function BrowsePage() {
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [articles, setArticles] = useState([])

  const categories = [
    { id: "all", name: "All Content", count: 2847 },
    { id: "research", name: "Research", count: 1203 },
    { id: "news", name: "News", count: 456 },
    { id: "comment", name: "Comment", count: 234 },
    { id: "review", name: "Review", count: 189 },
    { id: "editorial", name: "Editorial", count: 145 },
  ]

  const journals = [
    { id: "lancet", name: "The Lancet", count: 892 },
    { id: "oncology", name: "Lancet Oncology", count: 567 },
    { id: "psychiatry", name: "Lancet Psychiatry", count: 423 },
    { id: "neurology", name: "Lancet Neurology", count: 389 },
    { id: "eclinical", name: "eClinicalMedicine", count: 234 },
    { id: "child", name: "Lancet Child & Adolescent Health", count: 198 },
  ]

  // Load research data on component mount
  useEffect(() => {
    const researchData = getLatestResearchData()
    setArticles(researchData)
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-lancet-dark mb-2">Browse Content</h1>
            <p className="text-gray-600">Explore thousands of articles, research papers, and expert commentary</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-lancet-dark mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/browse?category=${cat.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-lancet-gray transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-lancet-blue font-medium">{cat.name}</span>
                      <span className="text-xs bg-lancet-gray group-hover:bg-lancet-blue group-hover:text-white text-gray-600 px-2 py-1 rounded">
                        {cat.count}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Journals */}
              <div>
                <h3 className="text-lg font-bold text-lancet-dark mb-4">Journals</h3>
                <div className="space-y-2">
                  {journals.map((journal) => (
                    <a
                      key={journal.id}
                      href={`/browse?journal=${journal.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-lancet-gray transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-lancet-blue font-medium text-sm">
                        {journal.name}
                      </span>
                      <span className="text-xs bg-lancet-gray group-hover:bg-lancet-blue group-hover:text-white text-gray-600 px-2 py-1 rounded">
                        {journal.count}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-lancet-border">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{articles.length}</span> articles
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-lancet-border rounded-lg text-sm focus:outline-none focus:border-lancet-blue focus:ring-2 focus:ring-lancet-blue/10"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="trending">Trending</option>
                    <option value="oldest">Oldest First</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex gap-2 border border-lancet-border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded transition-colors ${
                        viewMode === "grid" ? "bg-lancet-blue text-white" : "text-gray-600 hover:text-lancet-blue"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded transition-colors ${
                        viewMode === "list" ? "bg-lancet-blue text-white" : "text-gray-600 hover:text-lancet-blue"
                      }`}
                      aria-label="List view"
                    >
                      <List size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Articles */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <a
                      key={article.id}
                      href={article.link}
                      className="flex gap-4 p-4 rounded-lg border border-lancet-border hover:shadow-md hover:border-lancet-blue transition-all group"
                    >
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 rounded text-xs font-bold text-white bg-lancet-blue">
                            {article.badge}
                          </span>
                        </div>
                        <h3 className="font-bold text-lancet-dark group-hover:text-lancet-blue transition-colors line-clamp-2 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1 mb-2">{article.excerpt}</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>{article.journal}</span>
                          <span>{article.authors}</span>
                          <span>{article.date}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === 1 ? "bg-lancet-blue text-white" : "border border-lancet-border hover:bg-lancet-gray"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
