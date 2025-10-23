import { NextResponse } from 'next/server'

// Mock data for demonstration - replace with actual database queries
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

// GET /api/article/public/articles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const title = searchParams.get('title')
    const journal = searchParams.get('journal')
    const articleType = searchParams.get('articleType')
    const keywords = searchParams.getAll('keywords')
    const badgeType = searchParams.get('badgeType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const journalCode = searchParams.get('journalCode')
    
    // Filter articles (only published ones with status = 1)
    let filteredArticles = mockArticles.filter(article => article.status === 1)
    
    // Apply filters
    if (title) {
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(title.toLowerCase())
      )
    }
    
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
    
    if (keywords.length > 0) {
      filteredArticles = filteredArticles.filter(article =>
        keywords.some(keyword =>
          article.keywords.some(articleKeyword =>
            articleKeyword.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      )
    }
    
    if (badgeType) {
      filteredArticles = filteredArticles.filter(article =>
        article.badgetype === badgeType
      )
    }
    
    if (startDate) {
      filteredArticles = filteredArticles.filter(article =>
        article.date >= startDate
      )
    }
    
    if (endDate) {
      filteredArticles = filteredArticles.filter(article =>
        article.date <= endDate
      )
    }
    
    if (journalCode) {
      filteredArticles = filteredArticles.filter(article =>
        article.journalcode === journalCode
      )
    }
    
    // Sort articles
    filteredArticles.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      // Handle date sorting
      if (sortBy === 'date') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
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
        }
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching published articles:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch published articles',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// POST /api/article/public/articles (for submitting new articles)
export async function POST(request) {
  try {
    const articleData = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'journalid', 'articletypeid', 'keywords', 'excerpt', 'badgetypeid', 'date', 'journalcodeid', 'authors']
    const missingFields = requiredFields.filter(field => !articleData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          missingFields 
        },
        { status: 400 }
      )
    }
    
    // Generate unique ID
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const articleId = `id_${timestamp}_${randomStr}`
    
    // Create new article
    const newArticle = {
      _id: articleId,
      ...articleData,
      status: 1, // Mark as published
      recordinfo: {
        entryBy: articleData.recordinfo?.entryBy || "1760636856216",
        entryTime: new Date().toISOString(),
        updateBy: articleData.recordinfo?.updateBy || "1760636856216",
        updateTime: new Date().toISOString()
      }
    }
    
    // In a real application, save to database here
    // For now, we'll just return the created article
    
    const response = {
      success: true,
      data: {
        article: newArticle,
        message: 'Article submitted successfully'
      }
    }
    
    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error('Error submitting article:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit article',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
