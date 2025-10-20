"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleCard from "@/components/article-card"

export default function NewsPage() {
  const newsArticles = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Breaking News: Important Medical Development ${i + 1}`,
    excerpt: `Latest news from the medical and healthcare world with updates on research, policy, and clinical practice.`,
    image: `/placeholder.svg?height=200&width=300&query=medical news ${i}`,
    badge: "NEWS",
    badgeType: "news" as const,
    journal: ["The Lancet", "Lancet Oncology", "eClinicalMedicine"][i % 3],
    authors: "News Team",
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    link: `/article/${i + 1}`,
  }))

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-lancet-dark mb-2">Latest News</h1>
            <p className="text-gray-600">
              Stay updated with the latest news and developments in medical research and healthcare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
