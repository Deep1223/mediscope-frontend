import { NextResponse } from 'next/server'

// Base URL for the external API
const API_BASE_URL = 'https://brockersbackend.finnovationz.com'

// Function to fetch articles from external API
async function fetchArticlesFromAPI(params = {}) {
  try {
    const queryParams = new URLSearchParams()
    
    // Add pagination
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    // Add sorting
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
    
    // Add filters
    if (params.title) queryParams.append('title', params.title)
    if (params.journal) queryParams.append('journal', params.journal)
    if (params.articleType) queryParams.append('articleType', params.articleType)
    if (params.keywords && params.keywords.length > 0) {
      params.keywords.forEach(keyword => queryParams.append('keywords', keyword))
    }
    if (params.badgeType) queryParams.append('badgeType', params.badgeType)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.journalCode) queryParams.append('journalCode', params.journalCode)
    
    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/api/article/public/articles${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching articles from API:', error)
    throw error
  }
}

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
    
    // Prepare parameters for API call
    const apiParams = {
      page,
      limit,
      sortBy,
      sortOrder,
      title,
      journal,
      articleType,
      keywords: keywords.length > 0 ? keywords : undefined,
      badgeType,
      startDate,
      endDate,
      journalCode
    }
    
    // Fetch articles from external API
    const apiResponse = await fetchArticlesFromAPI(apiParams)
    
    // Filter articles to only show those with status = 1 (published)
    if (apiResponse.success && apiResponse.data && apiResponse.data.articles) {
      const publishedArticles = apiResponse.data.articles.filter(article => 
        article.status === 1 || article.status === "1"
      )
      
      // Transform articles to match expected format
      const transformedArticles = publishedArticles.map(article => ({
        _id: article._id,
        title: article.title,
        journal: article.journal,
        journalid: article.journalid,
        articletype: article.articleType || article.articletype,
        articletypeid: article.articletypeid,
        keywords: article.keywords || [],
        excerpt: article.excerpt,
        badgetype: article.badgeType || article.badgetype,
        badgetypeid: article.badgetypeid,
        date: article.date,
        journalcode: article.journalCode || article.journalcode,
        journalcodeid: article.journalcodeid,
        status: 1, // Ensure status is always 1 for published articles
        authors: article.authors || [],
        recordinfo: {
          entryBy: article.createdBy || "system",
          entryTime: article.createdAt || article.date,
          updateBy: article.lastModifiedBy || "system",
          updateTime: article.updatedAt || article.date
        },
        image: article.image
      }))
      
      // Update the response with filtered and transformed articles
      const response = {
        success: true,
        data: {
          articles: transformedArticles,
          pagination: {
            currentPage: apiResponse.data.pagination?.current || 1,
            totalPages: apiResponse.data.pagination?.pages || 1,
            totalArticles: transformedArticles.length,
            hasNextPage: (apiResponse.data.pagination?.current || 1) < (apiResponse.data.pagination?.pages || 1),
            hasPrevPage: (apiResponse.data.pagination?.current || 1) > 1,
            limit: apiResponse.data.pagination?.limit || limit
          }
        }
      }
      
      return NextResponse.json(response)
    } else {
      // If API response is not in expected format, return empty result
      return NextResponse.json({
        success: true,
        data: {
          articles: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalArticles: 0,
            hasNextPage: false,
            hasPrevPage: false,
            limit
          }
        }
      })
    }
    
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
    const formData = await request.formData()
    
    // Extract form data
    const articleData = {
      title: formData.get('title'),
      journal: formData.get('journal'),
      journalid: formData.get('journalid'),
      articleType: formData.get('articleType'),
      articletype: formData.get('articleType'),
      articletypeid: formData.get('articletypeid'),
      keywords: formData.get('keywords') ? JSON.parse(formData.get('keywords')) : [],
      excerpt: formData.get('excerpt'),
      badgeType: formData.get('badgeType'),
      badgetype: formData.get('badgeType'),
      badgetypeid: formData.get('badgetypeid'),
      date: formData.get('date'),
      journalCode: formData.get('journalCode'),
      journalcode: formData.get('journalCode'),
      journalcodeid: formData.get('journalcodeid'),
      authors: formData.get('authors') ? JSON.parse(formData.get('authors')) : [],
      status: formData.get('status') || 'Draft',
      image: formData.get('image'), // This will be the File object
      recordinfo: formData.get('recordinfo') ? JSON.parse(formData.get('recordinfo')) : null
    }
    
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
    
    // Handle image - can be either File object or URL string
    let imageData = null
    if (articleData.image && articleData.image instanceof File) {
      // Convert file to base64 for storage
      const bytes = await articleData.image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const mimeType = articleData.image.type
      
      imageData = {
        name: articleData.image.name,
        type: mimeType,
        size: articleData.image.size,
        base64: `data:${mimeType};base64,${base64}`
      }
    } else if (articleData.image && typeof articleData.image === 'string') {
      // If it's a URL string, store it directly
      imageData = articleData.image
    }
    
    // Create new article
    const newArticle = {
      _id: articleId,
      ...articleData,
      image: imageData || articleData.image, // Use processed image data or original
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
