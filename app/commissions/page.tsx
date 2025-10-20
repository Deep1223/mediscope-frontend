"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ArticleCard from "@/components/article-card"

export default function CommissionsPage() {
  const commissionArticles = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Commission Report: Expert Analysis on Healthcare Topic ${i + 1}`,
    excerpt: `Comprehensive commission report with expert recommendations and policy insights on important health issues.`,
    image: `/placeholder.svg?height=200&width=300&query=commission report ${i}`,
    badge: "COMMISSION",
    badgeType: "comment" as const,
    journal: ["The Lancet", "Lancet Oncology", "eClinicalMedicine"][i % 3],
    authors: "Commission Members",
    date: new Date(Date.now() - i * 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    link: `/article/${i + 1}`,
  }))

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-lancet-dark mb-2">All Commissions</h1>
            <p className="text-gray-600">
              Expert commissions providing comprehensive analysis and recommendations on health policy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
