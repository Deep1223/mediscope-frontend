"use client"

import ArticleCard from "./article-card"

export default function LatestNews() {
  const newsItems = [
    {
      id: 1,
      title: "MediScope Global Health Initiative Launches in Africa",
      excerpt: "A comprehensive platform promoting clinical excellence and health policy advancement across African nations",
      image: "/african-healthcare-medical.jpg",
      badge: "NEW INITIATIVE",
      badgeType: "research",
      journal: "MediScope Global Health",
      authors: "Editorial Team",
      date: "Jan 2025",
      link: "/article/1",
    },
    {
      id: 2,
      title: "Climate Change and Public Health: A Global Health Priority",
      excerpt: "Urgent action needed to address climate change impacts on global public health and healthcare systems",
      image: "/climate-change-environmental-health.jpg",
      badge: "COMMENT",
      badgeType: "comment",
      journal: "MediScope Medicine",
      authors: "Environmental Health Research Group",
      date: "Jan 2025",
      link: "/article/2",
    },
    {
      id: 3,
      title: "Advancing Healthcare Equity Through Sustainable Development",
      excerpt: "Innovative approaches to achieving universal health coverage and sustainable healthcare delivery",
      image: "/sustainable-development-goals-health.jpg",
      badge: "COMMENT",
      badgeType: "comment",
      journal: "MediScope Medicine",
      authors: "Global Health Policy Team",
      date: "Jan 2025",
      link: "/article/3",
    },
    {
      id: 4,
      title: "AI-Powered Clinical Decision Support Systems Revolutionize Healthcare",
      excerpt: "Artificial intelligence integration transforms clinical workflows and improves patient outcomes worldwide",
      image: "/artificial-intelligence-healthcare-nhs.jpg",
      badge: "NEWS",
      badgeType: "news",
      journal: "MediScope Technology",
      authors: "AI Research Division",
      date: "Jan 2025",
      link: "/article/4",
    },
  ]

    return (
      <section className="py-24 md:py-40 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30">
        <div className="container mx-auto px-4">
          {/* Modern Section Header */}
          <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Latest Updates</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Latest News & Commentary
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Stay updated with the latest research, news, and expert commentary from MediScope Publications
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newsItems.map((item) => (
            <ArticleCard key={item.id} {...item} />
          ))}
        </div>

          {/* Modern View All Link */}
          <div className="mt-20 text-center">
          <a
            href="/news"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-lg"
          >
            View All News & Commentary
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm">→</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
