"use client"

import { useState, useRef, use, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, User, BookOpen, Share2, Download, Heart, MessageCircle, Tag } from "lucide-react"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function ArticlePage({ params }) {
    const resolvedParams = use(params)
    const [isLiked, setIsLiked] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [relatedArticles, setRelatedArticles] = useState([])
    const articleRef = useRef(null)

    useEffect(() => {
        if (resolvedParams.id) {
            fetchArticle(resolvedParams.id)
        }
    }, [resolvedParams.id])

    useEffect(() => {
        if (article) {
            fetchRelatedArticles()
        }
    }, [article])

    const fetchArticle = async (id) => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch(`https://brockersbackend.finnovationz.com/api/article/public/articles/${id}`)
            const data = await response.json()
            
            if (data.success && data.data) {
                setArticle(data.data)
            } else {
                setError(data.error || "Article not found")
            }
        } catch (err) {
            setError("Failed to load article")
            console.error("Error fetching article:", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchRelatedArticles = async () => {
        try {
            const response = await fetch("https://brockersbackend.finnovationz.com/api/article/public/articles")
            const data = await response.json()
            
            if (data.success && data.data?.articles) {
                // Filter out current article and find related ones
                const filteredArticles = data.data.articles
                    .filter(art => art._id !== article._id)
                    .filter(art => {
                        // Match by articleType, journal, or keywords
                        const hasMatchingType = art.articleType === article.articleType
                        const hasMatchingJournal = art.journal === article.journal
                        const hasMatchingKeywords = article.keywords?.some(keyword => 
                            art.keywords?.some(artKeyword => 
                                artKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
                                keyword.toLowerCase().includes(artKeyword.toLowerCase())
                            )
                        )
                        return hasMatchingType || hasMatchingJournal || hasMatchingKeywords
                    })
                    .slice(0, 3) // Get top 3 related articles
                    .map(art => ({
                        id: art._id,
                        title: art.title?.trim(),
                        excerpt: art.excerpt?.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 100) + "...",
                        image: art.image,
                        journal: art.journal?.trim(),
                        date: new Date(art.date).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                    }))
                
                setRelatedArticles(filteredArticles)
            }
        } catch (error) {
            console.error("Error fetching related articles:", error)
        }
    }

    const handleDownloadPDF = async () => {
        if (isGeneratingPDF || !articleRef.current) return

        setIsGeneratingPDF(true)

        try {
            // Create a canvas from the article content
            const canvas = await html2canvas(articleRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                height: articleRef.current.scrollHeight,
                width: articleRef.current.scrollWidth
            })

            const imgData = canvas.toDataURL('image/png')
            
            // Create PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            
            // Calculate image dimensions to fit page
            const imgWidth = pageWidth - 20 // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            
            let heightLeft = imgHeight
            let position = 10 // 10mm top margin

            // Add image to PDF, handle multiple pages if needed
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
            heightLeft -= (pageHeight - 20) // Subtract page height minus margins

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 10
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
                heightLeft -= (pageHeight - 20)
            }

            // Download the PDF
            const fileName = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
            pdf.save(fileName)

        } catch (error) {
            console.error('PDF generation failed:', error)
            alert('Failed to generate PDF. Please try again.')
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    // Format date helper
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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading article...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The article you're looking for doesn't exist or has been removed."}</p>
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30">
            {/* PDF Generation Overlay */}
            {isGeneratingPDF && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <h3 className="text-xl font-semibold text-gray-900">Generating PDF...</h3>
                        <p className="text-sm text-gray-600 text-center">Please wait while we prepare your document</p>
                    </div>
                </div>
            )}
            
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back to Home</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-full transition-all duration-300 ${isLiked
                                    ? "bg-red-100 text-red-500"
                                    : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                                    }`}
                            >
                                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                            </button>

                            <button
                                onClick={() => setShowShare(!showShare)}
                                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-300"
                            >
                                <Share2 size={20} />
                            </button>

                            <button
                                onClick={handleDownloadPDF}
                                disabled={isGeneratingPDF}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={16} />
                                {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div ref={articleRef} className="lg:col-span-3">
                        <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                            {/* Article Header */}
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                                        Research Article
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                    {article.title}
                                </h1>

                                <p className="text-xl text-white/90 leading-relaxed mb-6">
                                    {article.articleType} • {article.journal}
                                </p>

                                {/* Article Meta */}
                                <div className="flex flex-wrap gap-6 text-white/80">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={18} />
                                        <span className="font-medium">{article.journal}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} />
                                        <span>{formatDate(article.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tag size={18} />
                                        <span>{article.badgeType}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="p-8">
                                {/* Article Image */}
                                {article.image && (
                                <div className="mb-8">
                                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-64 md:h-80 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-sm font-medium opacity-90">{article.journalCode}</p>
                                        </div>
                                    </div>
                                </div>
                                )}

                                {/* Keywords */}
                                {article.keywords && article.keywords.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Tag size={20} className="text-emerald-600" />
                                        Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {article.keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                )}

                                {/* Main Content */}
                                <div
                                    className="prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: article.excerpt }}
                                />

                                {/* Authors */}
                                {article.authors && article.authors.length > 0 && (
                                <div className="mt-12 bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                                            <User className="text-white" size={20} />
                                        </div>
                                        Authors
                                    </h3>
                                    <div className="space-y-4">
                                        {article.authors.map((author, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{author.name}</h4>
                                                    <p className="text-gray-600">{author.affiliation}</p>
                                                    <p className="text-emerald-600 text-sm">{author.email}</p>
                                                    {author.isCorresponding && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                                                            Corresponding Author
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                )}

                                {/* Article Stats */}
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                                        <div className="text-2xl font-bold text-emerald-600">{article.journalCode}</div>
                                        <div className="text-sm text-gray-600">Journal Code</div>
                                    </div>
                                    <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-100">
                                        <div className="text-2xl font-bold text-teal-600">{article.badgeType}</div>
                                        <div className="text-sm text-gray-600">Badge Type</div>
                                    </div>
                                    <div className="bg-cyan-50 rounded-xl p-4 text-center border border-cyan-100">
                                        <div className="text-2xl font-bold text-cyan-600">{article.articleType}</div>
                                        <div className="text-sm text-gray-600">Article Type</div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Article Info */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Article Info</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-500">ID:</span>
                                        <span className="ml-2 font-mono text-gray-700">{article._id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Status:</span>
                                        <span className="ml-2 text-green-600 font-medium">Published</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Created:</span>
                                        <span className="ml-2 text-gray-700">{formatDate(article.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Related Articles */}
                            {relatedArticles.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
                                <div className="space-y-4">
                                    {relatedArticles.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={`/article/${related.id}`}
                                            className="block group"
                                        >
                                            <div className="p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                                                <div className="flex gap-3">
                                                    {related.image && (
                                                        <img
                                                            src={related.image}
                                                            alt={related.title}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                                            {related.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">{related.journal}</p>
                                                        <p className="text-xs text-gray-400">{related.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            )}

                            {/* Share Options */}
                            {showShare && (
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Share Article</h3>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => {
                                                const url = encodeURIComponent(window.location.href)
                                                const text = encodeURIComponent(article.title)
                                                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
                                            }}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                                        >
                                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">T</span>
                                            </div>
                                            <span className="text-sm font-medium">Share on Twitter</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const url = encodeURIComponent(window.location.href)
                                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
                                            }}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
                                        >
                                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">f</span>
                                            </div>
                                            <span className="text-sm font-medium">Share on Facebook</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const url = encodeURIComponent(window.location.href)
                                                const title = encodeURIComponent(article.title)
                                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank')
                                            }}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-700 hover:bg-blue-50 transition-all duration-300"
                                        >
                                            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">in</span>
                                            </div>
                                            <span className="text-sm font-medium">Share on LinkedIn</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}