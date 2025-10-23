"use client"

import { useState } from "react"
import ArticleCard from "./article-card"
import { BookOpen, Users } from "lucide-react"

export default function SeriesCommissions() {
  const [activeTab, setActiveTab] = useState("all")

  const items = [
    {
      id: 1,
      title: "Digital Health Transformation in Global Healthcare Systems",
      excerpt: "A comprehensive series on digital health innovations and their impact on healthcare delivery worldwide",
      image: "/mental-health-europe.jpg",
      badge: "SERIES",
      badgeType: "research",
      journal: "Published: January 15, 2025",
      authors: "Digital Health Research Group",
      date: "Technology",
      link: "/series/1",
      type: "series",
    },
    {
      id: 2,
      title: "Precision Medicine in Respiratory Care 2025",
      excerpt: "Latest advances in personalized respiratory medicine and treatment optimization",
      image: "/asthma-treatment.jpg",
      badge: "SERIES",
      badgeType: "research",
      journal: "Published: January 10, 2025",
      authors: "Respiratory Medicine Institute",
      date: "Clinical",
      link: "/series/2",
      type: "series",
    },
    {
      id: 3,
      title: "AyushVeda Commission on Sustainable AYUSH Healthcare Systems",
      excerpt: "Comprehensive recommendations for building resilient and sustainable healthcare infrastructure",
      image: "/sustainable-food.jpg",
      badge: "COMMISSION",
      badgeType: "comment",
      journal: "Published: January 12, 2025",
      authors: "Healthcare Sustainability Panel",
      date: "Global Health",
      link: "/commission/1",
      type: "commissions",
    },
    {
      id: 4,
      title: "Strengthening Primary Healthcare Across Developing Nations",
      excerpt: "Building robust primary healthcare systems in underserved regions worldwide",
      image: "/primary-healthcare.jpg",
      badge: "COMMISSION",
      badgeType: "comment",
      journal: "Published: January 8, 2025",
      authors: "Global Health Policy Commission",
      date: "Global Health",
      link: "/commission/2",
      type: "commissions",
    },
    {
      id: 5,
      title: "Metabolic Health and Cardiovascular Prevention",
      excerpt: "Integrated approaches to preventing metabolic disorders and cardiovascular complications",
      image: "/cardiometabolic-health.jpg",
      badge: "SERIES",
      badgeType: "research",
      journal: "Published: January 5, 2025",
      authors: "Metabolic Health Research Center",
      date: "Clinical",
      link: "/series/3",
      type: "series",
    },
    {
      id: 6,
      title: "AyushVeda Commission on Traditional Medicine Stewardship",
      excerpt: "Global strategies to combat antimicrobial resistance through technology and policy innovation",
      image: "/antibiotic-research.jpg",
      badge: "COMMISSION",
      badgeType: "comment",
      journal: "Published: January 3, 2025",
      authors: "Antimicrobial Resistance Task Force",
      date: "Global Health",
      link: "/commission/3",
      type: "commissions",
    },
  ]

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true
    return item.type === activeTab
  })

    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50">
        <div className="container mx-auto px-4">
          {/* Modern Section Header */}
          <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Expert Insights</span>
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
          </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Series & Commissions
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Explore in-depth series and expert commissions on important health topics
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex flex-row gap-1">
          {[
            { value: "all", label: "All", icon: null },
            { value: "series", label: "Series", icon: BookOpen },
            { value: "commissions", label: "Commissions", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-300 rounded-xl ${
                  activeTab === tab.value
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {Icon && <Icon size={18} />}
                {tab.label}
              </button>
            )
          })}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {filteredItems.map((item) => (
                <ArticleCard key={item.id} {...item} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/series" className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <BookOpen size={20} />
                View All Series
              </a>
              <a
                href="/commissions"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <Users size={20} />
                View All Commissions
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No items found</p>
          </div>
        )}
      </div>
    </section>
  )
}
