"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleCard from "@/components/article-card"

export default function SeriesPage() {
  const seriesArticles = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    title: `Series: In-Depth Exploration of Medical Topic ${i + 1}`,
    excerpt: `Part of a comprehensive series exploring important medical topics and clinical research developments.`,
    image: `/placeholder.svg?height=200&width=300&query=medical series ${i}`,
    badge: "SERIES",
    badgeType: "research" as const,
    journal: ["The Lancet", "Lancet Oncology", "eClinicalMedicine"][i % 3],
    authors: "Series Editor",
    date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    link: `/article/${i + 1}`,
  }))

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-lancet-dark mb-2">All Series</h1>
            <p className="text-gray-600">Explore comprehensive series on important medical and health topics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seriesArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
