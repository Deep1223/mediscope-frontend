"use client"

import Link from "next/link"
import { Calendar, User, Tag, BookOpen, FileText, Award, Code } from "lucide-react"

export default function ArticleCard({ article }) {
  if (!article) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const stripHtml = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').trim()
  }

  const truncateText = (text, maxLength = 150) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Article Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <BookOpen size={14} />
                <span>{article.journal}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={14} />
                <span>{article.articletype}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
              <Award size={12} />
              {article.badgetype}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              <Code size={12} />
              {article.journalcode}
            </span>
          </div>
        </div>

        {/* Excerpt */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {truncateText(stripHtml(article.excerpt))}
          </p>
        </div>

        {/* Keywords */}
        {article.keywords && article.keywords.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Keywords:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.keywords.slice(0, 5).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
              {article.keywords.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{article.keywords.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Article Footer */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{article.authors?.length || 0} author{article.authors?.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <Link
            href={`/article/${article._id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Read More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Authors */}
        {article.authors && article.authors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Authors:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.authors.slice(0, 3).map((author, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <span className="font-medium">{author.name}</span>
                  {author.affiliation && (
                    <span className="text-gray-500"> - {author.affiliation}</span>
                  )}
                </div>
              ))}
              {article.authors.length > 3 && (
                <span className="text-sm text-gray-500">
                  and {article.authors.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}