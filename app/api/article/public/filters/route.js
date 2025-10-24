import { NextResponse } from 'next/server'

// Base URL for the external API
const API_BASE_URL = 'https://brockersbackend.finnovationz.com'

// Function to fetch articles from external API with filters
async function fetchFilteredArticlesFromAPI(params = {}) {
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
    console.error('Error fetching filtered articles from API:', error)
    throw error
  }
}

// GET /api/article/public/filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Check if this is a request for filtered articles or just filter options
    const hasFilters = searchParams.get('title') || 
                      searchParams.get('journal') || 
                      searchParams.get('articleType') ||
                      searchParams.get('keywords') ||
                      searchParams.get('badgeType') ||
                      searchParams.get('journalCode')
    
    if (hasFilters) {
      // Return filtered articles
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
      
      // Fetch filtered articles from external API
      const apiResponse = await fetchFilteredArticlesFromAPI(apiParams)
      
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
            filteredResults: transformedArticles,
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
            filteredResults: [],
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
    } else {
      // Return filter options only
      const filterOptions = {
        journals: [
          "AyushVeda Ayurveda",
          "AyushVeda Yoga", 
          "AyushVeda Naturopathy",
          "AyushVeda Homeopathy",
          "AyushVeda Unani",
          "AyushVeda Siddha",
          "AyushVeda Global Health"
        ],
        articleTypes: [
          "Original Research",
          "Review Article",
          "Commentary",
          "Case Report",
          "Letter to the Editor",
          "Editorial",
          "Clinical Trial",
          "Meta-Analysis"
        ],
        journalCodes: [
          "Technology",
          "Cardiology",
          "Medicine",
          "Pediatrics",
          "Oncology",
          "Psychiatry",
          "Ayurveda",
          "Yoga",
          "Naturopathy",
          "Homeopathy",
          "Unani",
          "Siddha",
          "Global Health"
        ],
        badgeTypes: [
          "Research",
        ]
      }
      
      const response = {
        success: true,
        data: filterOptions
      }
      
      return NextResponse.json(response)
    }
    
  } catch (error) {
    console.error('Error in filters API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        message: error.message 
      },
      { status: 500 }
    )
  }
}
