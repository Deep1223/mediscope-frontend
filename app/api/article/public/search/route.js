import { NextResponse } from 'next/server'

// Mock data - same as in the main articles route
const mockArticles = [
  {
    _id: "id_1703123456789_abc123",
    title: "Advanced Research in Ayurvedic Medicine",
    journal: "AyushVeda Ayurveda",
    journalid: 1,
    articletype: "Original Research",
    articletypeid: 1,
    keywords: ["OPEN ACCESS", "RESEARCH", "AYURVEDA"],
    excerpt: "<p>This study explores the efficacy of traditional Ayurvedic treatments in modern healthcare settings.</p>",
    badgetype: "Research",
    badgetypeid: 1,
    date: "2024-01-15",
    journalcode: "Ayurveda",
    journalcodeid: 7,
    status: 1,
    authors: [
      {
        name: "Dr. Rajesh Kumar",
        email: "rajesh@example.com",
        affiliation: "Ayurvedic Research Institute"
      }
    ],
    recordinfo: {
      entryBy: "1760636856216",
      entryTime: "2024-01-15T10:30:00.000Z",
      updateBy: "1760636856216",
      updateTime: "2024-01-15T10:30:00.000Z"
    }
  },
  {
    _id: "id_1703123456790_def456",
    title: "Yoga Therapy for Mental Health",
    journal: "AyushVeda Yoga",
    journalid: 2,
    articletype: "Review Article",
    articletypeid: 2,
    keywords: ["YOGA", "MENTAL HEALTH", "THERAPY"],
    excerpt: "<p>A comprehensive review of yoga-based interventions for mental health conditions.</p>",
    badgetype: "Open Access",
    badgetypeid: 2,
    date: "2024-01-20",
    journalcode: "Yoga",
    journalcodeid: 8,
    status: 1,
    authors: [
      {
        name: "Dr. Priya Sharma",
        email: "priya@example.com",
        affiliation: "Yoga Research Center"
      }
    ],
    recordinfo: {
      entryBy: "1760636856216",
      entryTime: "2024-01-20T14:15:00.000Z",
      updateBy: "1760636856216",
      updateTime: "2024-01-20T14:15:00.000Z"
    }
  },
  {
    _id: "id_1703123456791_ghi789",
    title: "Naturopathic Approaches to Chronic Disease",
    journal: "AyushVeda Naturopathy",
    journalid: 3,
    articletype: "Case Report",
    articletypeid: 4,
    keywords: ["NATUROPATHY", "CHRONIC DISEASE", "HEALING"],
    excerpt: "<p>Case studies demonstrating the effectiveness of naturopathic treatments for chronic conditions.</p>",
    badgetype: "Research",
    badgetypeid: 1,
    date: "2024-01-25",
    journalcode: "Naturopathy",
    journalcodeid: 9,
    status: 1,
    authors: [
      {
        name: "Dr. Michael Chen",
        email: "michael@example.com",
        affiliation: "Naturopathic Medical College"
      }
    ],
    recordinfo: {
      entryBy: "1760636856216",
      entryTime: "2024-01-25T09:45:00.000Z",
      updateBy: "1760636856216",
      updateTime: "2024-01-25T09:45:00.000Z"
    }
  }
]

// GET /api/article/public/search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const q = searchParams.get('q') // Search query
    const journal = searchParams.get('journal')
    const articleType = searchParams.get('articleType')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    
    // Filter articles (only published ones with status = 1)
    let filteredArticles = mockArticles.filter(article => article.status === 1)
    
    // Apply search query if provided
    if (q) {
      const searchTerm = q.toLowerCase()
      filteredArticles = filteredArticles.filter(article => {
        // Search in title, excerpt, and keywords
        const titleMatch = article.title.toLowerCase().includes(searchTerm)
        const excerptMatch = article.excerpt.toLowerCase().includes(searchTerm)
        const keywordMatch = article.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm)
        )
        const authorMatch = article.authors.some(author => 
          author.name.toLowerCase().includes(searchTerm) ||
          author.affiliation.toLowerCase().includes(searchTerm)
        )
        
        return titleMatch || excerptMatch || keywordMatch || authorMatch
      })
    }
    
    // Apply additional filters
    if (journal) {
      filteredArticles = filteredArticles.filter(article =>
        article.journal === journal
      )
    }
    
    if (articleType) {
      filteredArticles = filteredArticles.filter(article =>
        article.articletype === articleType
      )
    }
    
    // Sort by date (newest first)
    filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)
    
    // Calculate pagination info
    const totalArticles = filteredArticles.length
    const totalPages = Math.ceil(totalArticles / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    const response = {
      success: true,
      data: {
        articles: paginatedArticles,
        pagination: {
          currentPage: page,
          totalPages,
          totalArticles,
          hasNextPage,
          hasPrevPage,
          limit
        },
        searchQuery: q || null,
        filters: {
          journal: journal || null,
          articleType: articleType || null
        }
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error searching articles:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search articles',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
