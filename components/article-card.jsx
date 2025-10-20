"use client"

import Link from "next/link"
import { Calendar, User, BookOpen, ArrowRight } from "lucide-react"

export default function ArticleCard({
  id,
  title,
  excerpt,
  image,
  badge,
  badgeType,
  journal,
  authors,
  date,
  link = "#",
}) {
  const badgeColors = {
    research: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg",
    comment: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",
    news: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg",
    review: "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg",
    "open-access": "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg",
  }

  return (
    <Link href={link || `/article/${id}`}>
      <div className="group h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col border border-gray-100">
        {/* Image Container with Modern Design */}
        <div className="relative overflow-hidden h-56 bg-gradient-to-br from-emerald-50 to-teal-50">
          <img
            src={image || "/placeholder.svg?height=200&width=300&query=medical research"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Modern Badge Design */}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-block px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm ${badgeColors[badgeType]}`}
            >
              {badge}
            </span>
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

            {/* Content Container with Modern Spacing */}
            <div className="p-8 flex flex-col flex-grow">
              {/* Title with Modern Typography */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6 line-clamp-3 group-hover:text-emerald-600 transition-colors duration-300 leading-tight">
                {title}
              </h3>

              {/* Excerpt with Better Typography */}
              <p className="text-gray-600 mb-8 line-clamp-3 flex-grow leading-relaxed text-lg">{excerpt}</p>

          {/* Modern Metadata Design */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BookOpen size={16} className="text-emerald-600" />
              </div>
              <span className="font-semibold text-gray-800">{journal}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <div className="p-2 bg-amber-100 rounded-lg">
                <User size={16} className="text-amber-600" />
              </div>
              <span className="text-gray-700">{authors}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <span className="text-gray-700">{date}</span>
            </div>
          </div>

              {/* Modern CTA Button */}
              <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-600">Read Article</span>
              <div className="p-2 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors duration-300">
                <ArrowRight size={16} className="text-emerald-600 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
