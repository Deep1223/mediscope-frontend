"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleCard from "@/components/article-card"
import { ChevronRight } from "lucide-react"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const categoryData: Record<string, any> = {
    oncology: {
      name: "Oncology",
      description: "Latest research and developments in cancer treatment and prevention",
      color: "from-red-600 to-red-700",
      icon: "🔬",
    },
    cardiology: {
      name: "Cardiology",
      description: "Heart health, cardiovascular disease, and treatment advances",
      color: "from-red-500 to-pink-600",
      icon: "❤️",
    },
    neurology: {
      name: "Neurology",
      description: "Brain health, neurological disorders, and cognitive research",
      color: "from-purple-600 to-purple-700",
      icon: "🧠",
    },
    psychiatry: {
      name: "Psychiatry",
      description: "Mental health, psychological disorders, and behavioral research",
      color: "from-blue-600 to-blue-700",
      icon: "💭",
    },
    pediatrics: {
      name: "Pediatrics",
      description: "Child health, development, and pediatric medical research",
      color: "from-yellow-500 to-orange-600",
      icon: "👶",
    },
    infectious: {
      name: "Infectious Diseases",
      description: "Infectious disease research, vaccines, and epidemiology",
      color: "from-green-600 to-green-700",
      icon: "🦠",
    },
  }

  const category = categoryData[params.slug] || categoryData.oncology

  const articles = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `${category.name} Research Article ${i + 1}: Latest Findings`,
    excerpt: `Groundbreaking research in ${category.name.toLowerCase()} exploring new treatment approaches and clinical outcomes.`,
    image: `/placeholder.svg?height=200&width=300&query=${category.name}`,
    badge: ["RESEARCH", "NEWS", "COMMENT"][i % 3],
    badgeType: ["research", "news", "comment"][i % 3] as any,
    journal: ["The Lancet", "Lancet Oncology", "eClinicalMedicine"][i % 3],
    authors: `Research Team ${i + 1}`,
    date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    link: `/article/${i + 1}`,
  }))

  const articlesPerPage = 12
  const totalPages = Math.ceil(articles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const paginatedArticles = articles.slice(startIndex, startIndex + articlesPerPage)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className={`bg-gradient-to-r ${category.color} text-white py-12 md:py-16`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{category.icon}</span>
              <nav className="flex items-center gap-2 text-white/80">
                <a href="/browse" className="hover:text-white transition-colors">
                  Browse
                </a>
                <ChevronRight size={18} />
                <span>{category.name}</span>
              </nav>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{category.name}</h1>
            <p className="text-lg text-white/90 max-w-2xl">{category.description}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Total Articles", value: "2,847" },
              { label: "This Month", value: "234" },
              { label: "Expert Contributors", value: "1,203" },
            ].map((stat, i) => (
              <div key={i} className="bg-lancet-gray rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-lancet-blue mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-lancet-dark mb-8">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-lancet-blue text-white"
                      : "border border-lancet-border hover:bg-lancet-gray"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {/* Related Categories */}
          <div className="mt-16 pt-12 border-t border-lancet-border">
            <h2 className="text-2xl font-bold text-lancet-dark mb-8">Related Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categoryData)
                .filter(([key]) => key !== params.slug)
                .slice(0, 3)
                .map(([key, cat]) => (
                  <a
                    key={key}
                    href={`/category/${key}`}
                    className={`bg-gradient-to-br ${cat.color} text-white rounded-lg p-6 hover:shadow-lg transition-all group`}
                  >
                    <div className="text-3xl mb-3">{cat.icon}</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:underline">{cat.name}</h3>
                    <p className="text-white/80 text-sm">{cat.description}</p>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
